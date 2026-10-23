"""CareSync Deterministic Scenario Simulator Service.

Allows hospital leadership to evaluate hypothetical operational adjustments
(e.g., adding floating nurses, restoring imaging equipment, expediting discharges)
and see the immediate impact on deterministic bottlenecks and bed availability.
"""

import copy
from data.simulated_hospital import SIMULATED_HOSPITAL_DATA
from schemas.hospital import (
    BottleneckAlert,
    DepartmentMetrics,
    DepartmentName,
    DiagnosticBacklog,
    ModalityName,
    StaffingIndicator,
)
from schemas.simulation import (
    MetricComparison,
    SimulationScenarioRequest,
    SimulationScenarioResult,
)
from services.bottleneck_analyzer import BENCHMARKS, get_operational_snapshot


def run_scenario_simulation(scenario: SimulationScenarioRequest) -> SimulationScenarioResult:
    # 1. Baseline state
    baseline = get_operational_snapshot()
    baseline_bottleneck_ids = {b.id for b in baseline.active_bottlenecks}

    # 2. Deepcopy raw data to simulate changes safely
    data = copy.deepcopy(SIMULATED_HOSPITAL_DATA)

    # Apply ICU stepdown transfers
    if scenario.stepdown_transfers_count > 0:
        for d in data["departments"]:
            if d["department"] == "Intensive Care Unit":
                d["occupied_beds"] = max(0, d["occupied_beds"] - scenario.stepdown_transfers_count)

    # Apply expedited discharges (primarily General Med)
    if scenario.expedited_discharges_count > 0:
        for d in data["departments"]:
            if d["department"] == "General Medicine":
                d["occupied_beds"] = max(0, d["occupied_beds"] - scenario.expedited_discharges_count)
                d["pending_discharge_beds"] = max(0, d["pending_discharge_beds"] - scenario.expedited_discharges_count)
        # Also relieve ED boarding as beds open up
        ed_relief = min(scenario.expedited_discharges_count, data["departments"][0].get("boarded_inpatients", 0))
        data["departments"][0]["boarded_inpatients"] = max(0, data["departments"][0].get("boarded_inpatients", 0) - ed_relief)

    # Apply CT Scanner restoration
    if scenario.restore_ct_scanner:
        for diag in data["diagnostics"]:
            if diag["modality"] == "CT Scan":
                diag["in_service_machines"] = 3
                # With 3 machines, wait time drops proportionally (approx 45 min)
                diag["average_wait_minutes"] = 45.0
                diag["pending_scans"] = max(4, diag["pending_scans"] - 10)

    # Apply staffing additions
    if scenario.additional_general_med_nurses > 0:
        for s in data["staffing"]:
            if s["department"] == "General Medicine":
                s["active_nurses"] += scenario.additional_general_med_nurses
                # Recalculate ratio: occupied beds / active nurses
                gen_med_occupied = next(d["occupied_beds"] for d in data["departments"] if d["department"] == "General Medicine")
                s["patient_to_nurse_ratio"] = round(gen_med_occupied / s["active_nurses"], 1)

    if scenario.additional_ed_nurses > 0:
        for s in data["staffing"]:
            if s["department"] == "Emergency Department":
                s["active_nurses"] += scenario.additional_ed_nurses
                ed_occupied = next(d["occupied_beds"] for d in data["departments"] if d["department"] == "Emergency Department")
                s["patient_to_nurse_ratio"] = round(ed_occupied / s["active_nurses"], 1)

    # 3. Deterministically evaluate simulated bottlenecks
    simulated_bottlenecks: list[BottleneckAlert] = []
    sim_departments: list[DepartmentMetrics] = []
    sim_diagnostics: list[DiagnosticBacklog] = []
    sim_staffing: list[StaffingIndicator] = []

    # Recalculate departments
    for d in data["departments"]:
        total = d["total_beds"]
        occupied = d["occupied_beds"]
        pending = d["pending_discharge_beds"]
        occ_pct = round((occupied / total) * 100.0, 1)

        if occ_pct >= BENCHMARKS["bed_occupancy_critical_pct"]:
            status = "critical"
            simulated_bottlenecks.append(
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
            simulated_bottlenecks.append(
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

        sim_departments.append(
            DepartmentMetrics(
                department=DepartmentName(d["department"]),
                total_beds=total,
                occupied_beds=occupied,
                pending_discharge_beds=pending,
                occupancy_rate_percent=occ_pct,
                status=status,
            )
        )

    # Boarding
    er_boarded = data["departments"][0].get("boarded_inpatients", 0)
    if er_boarded >= BENCHMARKS["er_boarding_critical_count"]:
        simulated_bottlenecks.append(
            BottleneckAlert(
                id="BN-ED-BOARDING",
                department_or_unit="Emergency Department",
                severity="critical",
                metric_name="Admitted Inpatient Boarding",
                observed_value=f"{er_boarded} patients boarding",
                benchmark_threshold=f"< {BENCHMARKS['er_boarding_critical_count']} patients",
                description=f"{er_boarded} patients boarding in Emergency Department awaiting beds.",
            )
        )

    # Diagnostics
    for diag in data["diagnostics"]:
        wait = diag["average_wait_minutes"]
        in_service = diag["in_service_machines"]
        total_m = diag["total_machines"]
        pending_scans = diag["pending_scans"]

        if wait >= BENCHMARKS["diagnostic_wait_critical_minutes"] or in_service < total_m:
            diag_status = "critical" if wait >= BENCHMARKS["diagnostic_wait_critical_minutes"] else "elevated"
            simulated_bottlenecks.append(
                BottleneckAlert(
                    id=f"BN-DIAG-{diag['modality'].replace(' ', '_').upper()}",
                    department_or_unit=f"Diagnostics - {diag['modality']}",
                    severity="high" if diag_status == "critical" else "medium",
                    metric_name="Average Scan Wait Time",
                    observed_value=f"{wait} min ({pending_scans} queued, {in_service}/{total_m} active)",
                    benchmark_threshold=f"< {BENCHMARKS['diagnostic_wait_critical_minutes']} min",
                    description=f"{diag['modality']} queue: {pending_scans} pending with {wait} min avg wait.",
                )
            )
        else:
            diag_status = "normal"

        sim_diagnostics.append(
            DiagnosticBacklog(
                modality=ModalityName(diag["modality"]),
                pending_scans=pending_scans,
                average_wait_minutes=wait,
                in_service_machines=in_service,
                total_machines=total_m,
                status=diag_status,
            )
        )

    # Staffing
    for s in data["staffing"]:
        active = s["active_nurses"]
        target_n = s["target_nurses"]
        ratio = s["patient_to_nurse_ratio"]
        target_r = s["target_ratio"]

        if ratio >= target_r * BENCHMARKS["staffing_ratio_strained_factor"]:
            staff_status = "critical_shortage"
            simulated_bottlenecks.append(
                BottleneckAlert(
                    id=f"BN-STAFF-{s['department'].replace(' ', '_').upper()}",
                    department_or_unit=s["department"],
                    severity="high",
                    metric_name="Nurse Staffing Ratio",
                    observed_value=f"{ratio}:1 (Target: {target_r}:1)",
                    benchmark_threshold=f"<= {target_r}:1",
                    description=f"Staffing strained in {s['department']} at {ratio}:1 ratio.",
                )
            )
        elif active < target_n:
            staff_status = "strained"
        else:
            staff_status = "adequate"

        sim_staffing.append(
            StaffingIndicator(
                department=DepartmentName(s["department"]),
                active_nurses=active,
                target_nurses=target_n,
                patient_to_nurse_ratio=ratio,
                target_ratio=target_r,
                status=staff_status,
            )
        )

    # Comparisons
    simulated_bottleneck_ids = {b.id for b in simulated_bottlenecks}
    resolved = list(baseline_bottleneck_ids - simulated_bottleneck_ids)

    # Build metric comparisons
    # 1. CT wait
    baseline_ct = next(d for d in baseline.diagnostic_backlogs if d.modality.value == "CT Scan")
    sim_ct = next(d for d in sim_diagnostics if d.modality.value == "CT Scan")
    ct_diff = sim_ct.average_wait_minutes - baseline_ct.average_wait_minutes
    ct_dir = "improved" if ct_diff < 0 else "unchanged"

    # 2. Gen Med Staffing
    baseline_gm_staff = next(s for s in baseline.staffing_indicators if s.department.value == "General Medicine")
    sim_gm_staff = next(s for s in sim_staffing if s.department.value == "General Medicine")
    staff_diff = sim_gm_staff.patient_to_nurse_ratio - baseline_gm_staff.patient_to_nurse_ratio
    staff_dir = "improved" if staff_diff < 0 else "unchanged"

    # 3. ICU Bed occupancy
    baseline_icu = next(d for d in baseline.departments if d.department.value == "Intensive Care Unit")
    sim_icu = next(d for d in sim_departments if d.department.value == "Intensive Care Unit")
    icu_diff = sim_icu.occupancy_rate_percent - baseline_icu.occupancy_rate_percent
    icu_dir = "improved" if icu_diff < 0 else "unchanged"

    comparisons = [
        MetricComparison(
            metric_name="CT Scanner Wait Time",
            unit="minutes",
            baseline_value=f"{baseline_ct.average_wait_minutes}m",
            simulated_value=f"{sim_ct.average_wait_minutes}m",
            change_direction=ct_dir,
            change_label=f"{ct_diff:+.0f} min" if ct_diff != 0 else "0 min",
        ),
        MetricComparison(
            metric_name="Gen Med Nurse Ratio",
            unit="ratio",
            baseline_value=f"{baseline_gm_staff.patient_to_nurse_ratio}:1",
            simulated_value=f"{sim_gm_staff.patient_to_nurse_ratio}:1",
            change_direction=staff_dir,
            change_label=f"{staff_diff:+.1f} pts/RN" if staff_diff != 0 else "0 pts/RN",
        ),
        MetricComparison(
            metric_name="ICU Occupancy Rate",
            unit="percent",
            baseline_value=f"{baseline_icu.occupancy_rate_percent}%",
            simulated_value=f"{sim_icu.occupancy_rate_percent}%",
            change_direction=icu_dir,
            change_label=f"{icu_diff:+.1f}%" if icu_diff != 0 else "0%",
        ),
        MetricComparison(
            metric_name="Active Bottlenecks",
            unit="count",
            baseline_value=len(baseline.active_bottlenecks),
            simulated_value=len(simulated_bottlenecks),
            change_direction="improved" if len(simulated_bottlenecks) < len(baseline.active_bottlenecks) else "unchanged",
            change_label=f"{len(simulated_bottlenecks) - len(baseline.active_bottlenecks):+d} bottlenecks",
        ),
    ]

    desc_parts = []
    if scenario.restore_ct_scanner:
        desc_parts.append("CT Scanner restored to service")
    if scenario.additional_general_med_nurses > 0:
        desc_parts.append(f"+{scenario.additional_general_med_nurses} Gen Med RNs")
    if scenario.expedited_discharges_count > 0:
        desc_parts.append(f"{scenario.expedited_discharges_count} discharges expedited")
    if scenario.stepdown_transfers_count > 0:
        desc_parts.append(f"{scenario.stepdown_transfers_count} ICU step-down transfers")
    scenario_str = ", ".join(desc_parts) if desc_parts else "Baseline parameters (no adjustments applied)"

    return SimulationScenarioResult(
        scenario_description=scenario_str,
        baseline_bottleneck_count=len(baseline.active_bottlenecks),
        simulated_bottleneck_count=len(simulated_bottlenecks),
        resolved_bottleneck_ids=resolved,
        remaining_bottlenecks=simulated_bottlenecks,
        key_metric_comparisons=comparisons,
        departments=sim_departments,
        diagnostics=sim_diagnostics,
        staffing=sim_staffing,
    )
