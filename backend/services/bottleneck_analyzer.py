"""CareSync Bottleneck Analyzer Service.

Provides deterministic mathematical calculations for hospital operational metrics
and evaluates rule-based operational thresholds to detect bottlenecks.
All logic in this module is 100% deterministic (no AI/LLM involvement).
"""

from data.simulated_hospital import SIMULATED_HOSPITAL_DATA
from schemas.hospital import (
    BottleneckAlert,
    DepartmentMetrics,
    DepartmentName,
    DiagnosticBacklog,
    HospitalOperationalSnapshot,
    ModalityName,
    PendingDischargeDetail,
    StaffingIndicator,
)

# Deterministic threshold benchmarks
BENCHMARKS = {
    "bed_occupancy_critical_pct": 90.0,
    "bed_occupancy_warning_pct": 85.0,
    "er_boarding_critical_count": 8,
    "diagnostic_wait_critical_minutes": 90.0,
    "discharge_delay_critical_hours": 4.0,
    "staffing_ratio_strained_factor": 1.25,
}


def get_operational_snapshot() -> HospitalOperationalSnapshot:
    """Calculates deterministic operational metrics and identifies verified bottlenecks."""
    dept_raw = SIMULATED_HOSPITAL_DATA["departments"]
    diag_raw = SIMULATED_HOSPITAL_DATA["diagnostics"]
    disc_raw = SIMULATED_HOSPITAL_DATA["pending_discharges"]
    staff_raw = SIMULATED_HOSPITAL_DATA["staffing"]

    # 1. Department metrics calculation
    dept_metrics: list[DepartmentMetrics] = []
    total_capacity = 0
    total_occupied = 0
    total_pending_discharge = 0
    er_boarding = 0

    bottlenecks: list[BottleneckAlert] = []

    for d in dept_raw:
        total = d["total_beds"]
        occupied = d["occupied_beds"]
        pending = d["pending_discharge_beds"]
        boarded = d.get("boarded_inpatients", 0)

        total_capacity += total
        total_occupied += occupied
        total_pending_discharge += pending

        if d["department"] == "Emergency Department":
            er_boarding = boarded

        occ_pct = round((occupied / total) * 100.0, 1)

        if occ_pct >= BENCHMARKS["bed_occupancy_critical_pct"]:
            status = "critical"
            bottlenecks.append(
                BottleneckAlert(
                    id=f"BN-BED-{d['department'].replace(' ', '_').upper()}",
                    department_or_unit=d["department"],
                    severity="critical",
                    metric_name="Bed Occupancy Rate",
                    observed_value=f"{occ_pct}% ({occupied}/{total} beds)",
                    benchmark_threshold=f"< {BENCHMARKS['bed_occupancy_critical_pct']}%",
                    description=f"Critical capacity in {d['department']}: {occupied} of {total} beds occupied ({occ_pct}%).",
                )
            )
        elif occ_pct >= BENCHMARKS["bed_occupancy_warning_pct"]:
            status = "warning"
            bottlenecks.append(
                BottleneckAlert(
                    id=f"BN-BED-{d['department'].replace(' ', '_').upper()}",
                    department_or_unit=d["department"],
                    severity="medium",
                    metric_name="Bed Occupancy Rate",
                    observed_value=f"{occ_pct}% ({occupied}/{total} beds)",
                    benchmark_threshold=f"< {BENCHMARKS['bed_occupancy_warning_pct']}%",
                    description=f"Elevated bed occupancy in {d['department']} at {occ_pct}%.",
                )
            )
        else:
            status = "normal"

        dept_metrics.append(
            DepartmentMetrics(
                department=DepartmentName(d["department"]),
                total_beds=total,
                occupied_beds=occupied,
                pending_discharge_beds=pending,
                occupancy_rate_percent=occ_pct,
                status=status,
            )
        )

    # 2. ER Boarding Bottleneck check
    if er_boarding >= BENCHMARKS["er_boarding_critical_count"]:
        bottlenecks.append(
            BottleneckAlert(
                id="BN-ED-BOARDING",
                department_or_unit="Emergency Department",
                severity="critical",
                metric_name="Admitted Inpatient Boarding",
                observed_value=f"{er_boarding} patients boarding",
                benchmark_threshold=f"< {BENCHMARKS['er_boarding_critical_count']} patients",
                description=(
                    f"{er_boarding} admitted patients currently boarding in Emergency Department "
                    "awaiting inpatient bed placement."
                ),
            )
        )

    # 3. Diagnostic backlogs
    diag_metrics: list[DiagnosticBacklog] = []
    for diag in diag_raw:
        wait = diag["average_wait_minutes"]
        in_service = diag["in_service_machines"]
        total_m = diag["total_machines"]
        pending_scans = diag["pending_scans"]

        if wait >= BENCHMARKS["diagnostic_wait_critical_minutes"] or in_service < total_m:
            diag_status = "critical" if wait >= BENCHMARKS["diagnostic_wait_critical_minutes"] else "elevated"
            bottlenecks.append(
                BottleneckAlert(
                    id=f"BN-DIAG-{diag['modality'].replace(' ', '_').upper()}",
                    department_or_unit=f"Diagnostics - {diag['modality']}",
                    severity="high" if diag_status == "critical" else "medium",
                    metric_name="Average Scan Wait Time",
                    observed_value=f"{wait} min ({pending_scans} queued, {in_service}/{total_m} active)",
                    benchmark_threshold=f"< {BENCHMARKS['diagnostic_wait_critical_minutes']} min",
                    description=(
                        f"{diag['modality']} queue delayed: {pending_scans} orders pending with {wait} min avg wait. "
                        f"Machine availability: {in_service} of {total_m} operational."
                    ),
                )
            )
        else:
            diag_status = "normal"

        diag_metrics.append(
            DiagnosticBacklog(
                modality=ModalityName(diag["modality"]),
                pending_scans=pending_scans,
                average_wait_minutes=wait,
                in_service_machines=in_service,
                total_machines=total_m,
                status=diag_status,
            )
        )

    # 4. Discharge delay bottleneck check
    discharge_details: list[PendingDischargeDetail] = []
    delayed_discharge_count = 0
    reasons_count: dict[str, int] = {}

    for disc in disc_raw:
        hours = disc["cleared_for_hours"]
        reason = disc["hold_reason"]
        if hours >= BENCHMARKS["discharge_delay_critical_hours"]:
            delayed_discharge_count += 1
            reasons_count[reason] = reasons_count.get(reason, 0) + 1

        discharge_details.append(
            PendingDischargeDetail(
                patient_identifier=disc["patient_identifier"],
                ward=DepartmentName(disc["ward"]),
                cleared_for_hours=hours,
                hold_reason=reason,
            )
        )

    if delayed_discharge_count > 0:
        top_reasons = ", ".join([f"{count} due to {r}" for r, count in reasons_count.items()])
        bottlenecks.append(
            BottleneckAlert(
                id="BN-DISCHARGE-LAG",
                department_or_unit="Inpatient Wards",
                severity="high",
                metric_name="Discharge Execution Lag",
                observed_value=f"{delayed_discharge_count} patients delayed > {BENCHMARKS['discharge_delay_critical_hours']}h",
                benchmark_threshold=f"< {BENCHMARKS['discharge_delay_critical_hours']} hours post-clearance",
                description=(
                    f"{delayed_discharge_count} medically cleared patients delayed beyond 4 hours "
                    f"blocking inpatient bed release ({top_reasons})."
                ),
            )
        )

    # 5. Staffing indicators & ratios
    staff_metrics: list[StaffingIndicator] = []
    for s in staff_raw:
        active = s["active_nurses"]
        target_n = s["target_nurses"]
        ratio = s["patient_to_nurse_ratio"]
        target_r = s["target_ratio"]

        if ratio >= target_r * BENCHMARKS["staffing_ratio_strained_factor"]:
            staff_status = "critical_shortage"
            bottlenecks.append(
                BottleneckAlert(
                    id=f"BN-STAFF-{s['department'].replace(' ', '_').upper()}",
                    department_or_unit=s["department"],
                    severity="high",
                    metric_name="Nurse Staffing Ratio",
                    observed_value=f"{ratio}:1 (Target: {target_r}:1)",
                    benchmark_threshold=f"<= {target_r}:1",
                    description=(
                        f"Staffing ratio strained in {s['department']} at {ratio} patients per nurse "
                        f"(target {target_r}:1). {active} active vs {target_n} scheduled."
                    ),
                )
            )
        elif active < target_n:
            staff_status = "strained"
        else:
            staff_status = "adequate"

        staff_metrics.append(
            StaffingIndicator(
                department=DepartmentName(s["department"]),
                active_nurses=active,
                target_nurses=target_n,
                patient_to_nurse_ratio=ratio,
                target_ratio=target_r,
                status=staff_status,
            )
        )

    overall_occ = round((total_occupied / total_capacity) * 100.0, 1)

    return HospitalOperationalSnapshot(
        total_capacity_beds=total_capacity,
        total_occupied_beds=total_occupied,
        overall_occupancy_rate_percent=overall_occ,
        total_pending_discharges=total_pending_discharge,
        emergency_boarded_patients=er_boarding,
        departments=dept_metrics,
        diagnostic_backlogs=diag_metrics,
        pending_discharges=discharge_details,
        staffing_indicators=staff_metrics,
        active_bottlenecks=bottlenecks,
    )
