"""CareSync Simulated Hospital Dataset.

Clearly labeled, realistic synthetic data modeling hospital operational capacity,
emergency boarding, diagnostic throughput, and pending discharges.
All data is strictly simulated and synthetic.
"""

from typing import Any

SIMULATED_HOSPITAL_DATA: dict[str, Any] = {
    "metadata": {
        "facility_name": "Metro General Hospital",
        "data_type": "SIMULATED_OPERATIONAL_DATA",
        "notice": "All metrics and patient identifiers are synthetic simulations.",
    },
    "departments": [
        {
            "department": "Emergency Department",
            "total_beds": 45,
            "occupied_beds": 42,
            "pending_discharge_beds": 3,
            "boarded_inpatients": 14,  # Patients admitted awaiting inpatient beds
        },
        {
            "department": "Intensive Care Unit",
            "total_beds": 24,
            "occupied_beds": 23,
            "pending_discharge_beds": 2,
            "boarded_inpatients": 0,
        },
        {
            "department": "General Medicine",
            "total_beds": 120,
            "occupied_beds": 112,
            "pending_discharge_beds": 12,
            "boarded_inpatients": 0,
        },
        {
            "department": "Surgical Ward",
            "total_beds": 60,
            "occupied_beds": 52,
            "pending_discharge_beds": 5,
            "boarded_inpatients": 0,
        },
        {
            "department": "Pediatrics",
            "total_beds": 30,
            "occupied_beds": 18,
            "pending_discharge_beds": 4,
            "boarded_inpatients": 0,
        },
    ],
    "diagnostics": [
        {
            "modality": "CT Scan",
            "pending_scans": 19,
            "average_wait_minutes": 185.0,
            "in_service_machines": 2,
            "total_machines": 3,  # 1 unit out for unscheduled sensor recalibration
        },
        {
            "modality": "MRI",
            "pending_scans": 7,
            "average_wait_minutes": 65.0,
            "in_service_machines": 2,
            "total_machines": 2,
        },
        {
            "modality": "Ultrasound",
            "pending_scans": 11,
            "average_wait_minutes": 42.0,
            "in_service_machines": 3,
            "total_machines": 3,
        },
        {
            "modality": "X-Ray",
            "pending_scans": 8,
            "average_wait_minutes": 22.0,
            "in_service_machines": 4,
            "total_machines": 4,
        },
    ],
    "pending_discharges": [
        {
            "patient_identifier": "SIM-PT-401",
            "ward": "General Medicine",
            "cleared_for_hours": 5.5,
            "hold_reason": "Pharmacy Medication Reconciliation",
        },
        {
            "patient_identifier": "SIM-PT-402",
            "ward": "General Medicine",
            "cleared_for_hours": 4.8,
            "hold_reason": "Transport Arrangement",
        },
        {
            "patient_identifier": "SIM-PT-403",
            "ward": "General Medicine",
            "cleared_for_hours": 6.2,
            "hold_reason": "SNF/Rehab Bed Awaiting",
        },
        {
            "patient_identifier": "SIM-PT-404",
            "ward": "General Medicine",
            "cleared_for_hours": 4.1,
            "hold_reason": "Pharmacy Medication Reconciliation",
        },
        {
            "patient_identifier": "SIM-PT-405",
            "ward": "General Medicine",
            "cleared_for_hours": 3.9,
            "hold_reason": "Transport Arrangement",
        },
        {
            "patient_identifier": "SIM-PT-406",
            "ward": "Intensive Care Unit",
            "cleared_for_hours": 7.0,
            "hold_reason": "SNF/Rehab Bed Awaiting",  # Awaiting step-down bed
        },
        {
            "patient_identifier": "SIM-PT-407",
            "ward": "Surgical Ward",
            "cleared_for_hours": 4.5,
            "hold_reason": "Paperwork Processing",
        },
    ],
    "staffing": [
        {
            "department": "Emergency Department",
            "active_nurses": 11,
            "target_nurses": 14,
            "patient_to_nurse_ratio": 3.8,
            "target_ratio": 3.0,
        },
        {
            "department": "Intensive Care Unit",
            "active_nurses": 11,
            "target_nurses": 12,
            "patient_to_nurse_ratio": 2.1,
            "target_ratio": 2.0,
        },
        {
            "department": "General Medicine",
            "active_nurses": 18,
            "target_nurses": 28,
            "patient_to_nurse_ratio": 6.2,
            "target_ratio": 4.0,
        },
        {
            "department": "Surgical Ward",
            "active_nurses": 12,
            "target_nurses": 15,
            "patient_to_nurse_ratio": 4.3,
            "target_ratio": 4.0,
        },
        {
            "department": "Pediatrics",
            "active_nurses": 6,
            "target_nurses": 6,
            "patient_to_nurse_ratio": 3.0,
            "target_ratio": 3.0,
        },
    ],
}
