/**
 * CareSync Simulated Hospital Baseline Dataset (Frontend Fallback).
 *
 * Ensures the web application renders a complete, interactive, zero-crash
 * demonstration on Vercel even when a standalone Python server is not attached.
 */

import { HospitalOperationalSnapshot } from '../types';

export const BASELINE_SNAPSHOT: HospitalOperationalSnapshot = {
  facility_name: 'Metro General Hospital (Simulated)',
  timestamp: new Date().toISOString(),
  data_classification: 'SIMULATED',
  total_capacity_beds: 279,
  total_occupied_beds: 247,
  overall_occupancy_rate_percent: 88.5,
  total_pending_discharges: 26,
  emergency_boarded_patients: 14,
  departments: [
    {
      department: 'Emergency Department',
      total_beds: 45,
      occupied_beds: 42,
      pending_discharge_beds: 3,
      occupancy_rate_percent: 93.3,
      status: 'critical',
    },
    {
      department: 'Intensive Care Unit',
      total_beds: 24,
      occupied_beds: 23,
      pending_discharge_beds: 2,
      occupancy_rate_percent: 95.8,
      status: 'critical',
    },
    {
      department: 'General Medicine',
      total_beds: 120,
      occupied_beds: 112,
      pending_discharge_beds: 12,
      occupancy_rate_percent: 93.3,
      status: 'critical',
    },
    {
      department: 'Surgical Ward',
      total_beds: 60,
      occupied_beds: 52,
      pending_discharge_beds: 5,
      occupancy_rate_percent: 86.7,
      status: 'warning',
    },
    {
      department: 'Pediatrics',
      total_beds: 30,
      occupied_beds: 18,
      pending_discharge_beds: 4,
      occupancy_rate_percent: 60.0,
      status: 'normal',
    },
  ],
  diagnostic_backlogs: [
    {
      modality: 'CT Scan',
      pending_scans: 19,
      average_wait_minutes: 185.0,
      in_service_machines: 2,
      total_machines: 3,
      status: 'critical',
    },
    {
      modality: 'MRI',
      pending_scans: 7,
      average_wait_minutes: 65.0,
      in_service_machines: 2,
      total_machines: 2,
      status: 'normal',
    },
    {
      modality: 'Ultrasound',
      pending_scans: 11,
      average_wait_minutes: 42.0,
      in_service_machines: 3,
      total_machines: 3,
      status: 'normal',
    },
    {
      modality: 'X-Ray',
      pending_scans: 8,
      average_wait_minutes: 22.0,
      in_service_machines: 4,
      total_machines: 4,
      status: 'normal',
    },
  ],
  pending_discharges: [
    {
      patient_identifier: 'SIM-PT-401',
      ward: 'General Medicine',
      cleared_for_hours: 5.5,
      hold_reason: 'Pharmacy Medication Reconciliation',
    },
    {
      patient_identifier: 'SIM-PT-402',
      ward: 'General Medicine',
      cleared_for_hours: 4.8,
      hold_reason: 'Transport Arrangement',
    },
    {
      patient_identifier: 'SIM-PT-403',
      ward: 'General Medicine',
      cleared_for_hours: 6.2,
      hold_reason: 'SNF/Rehab Bed Awaiting',
    },
    {
      patient_identifier: 'SIM-PT-404',
      ward: 'General Medicine',
      cleared_for_hours: 4.1,
      hold_reason: 'Pharmacy Medication Reconciliation',
    },
    {
      patient_identifier: 'SIM-PT-405',
      ward: 'General Medicine',
      cleared_for_hours: 3.9,
      hold_reason: 'Transport Arrangement',
    },
    {
      patient_identifier: 'SIM-PT-406',
      ward: 'Intensive Care Unit',
      cleared_for_hours: 7.0,
      hold_reason: 'SNF/Rehab Bed Awaiting',
    },
    {
      patient_identifier: 'SIM-PT-407',
      ward: 'Surgical Ward',
      cleared_for_hours: 4.5,
      hold_reason: 'Paperwork Processing',
    },
  ],
  staffing_indicators: [
    {
      department: 'Emergency Department',
      active_nurses: 11,
      target_nurses: 14,
      patient_to_nurse_ratio: 3.8,
      target_ratio: 3.0,
      status: 'strained',
    },
    {
      department: 'Intensive Care Unit',
      active_nurses: 11,
      target_nurses: 12,
      patient_to_nurse_ratio: 2.1,
      target_ratio: 2.0,
      status: 'strained',
    },
    {
      department: 'General Medicine',
      active_nurses: 18,
      target_nurses: 28,
      patient_to_nurse_ratio: 6.2,
      target_ratio: 4.0,
      status: 'critical_shortage',
    },
    {
      department: 'Surgical Ward',
      active_nurses: 12,
      target_nurses: 15,
      patient_to_nurse_ratio: 4.3,
      target_ratio: 4.0,
      status: 'strained',
    },
    {
      department: 'Pediatrics',
      active_nurses: 6,
      target_nurses: 6,
      patient_to_nurse_ratio: 3.0,
      target_ratio: 3.0,
      status: 'adequate',
    },
  ],
  active_bottlenecks: [
    {
      id: 'BN-BED-EMERGENCY_DEPARTMENT',
      department_or_unit: 'Emergency Department',
      severity: 'critical',
      metric_name: 'Bed Occupancy Rate',
      observed_value: '93.3% (42/45 beds)',
      benchmark_threshold: '< 90.0%',
      description: 'Critical capacity in Emergency Department: 42 of 45 beds occupied (93.3%).',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-BED-INTENSIVE_CARE_UNIT',
      department_or_unit: 'Intensive Care Unit',
      severity: 'critical',
      metric_name: 'Bed Occupancy Rate',
      observed_value: '95.8% (23/24 beds)',
      benchmark_threshold: '< 90.0%',
      description: 'Critical capacity in Intensive Care Unit: 23 of 24 beds occupied (95.8%).',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-BED-GENERAL_MEDICINE',
      department_or_unit: 'General Medicine',
      severity: 'critical',
      metric_name: 'Bed Occupancy Rate',
      observed_value: '93.3% (112/120 beds)',
      benchmark_threshold: '< 90.0%',
      description: 'Critical capacity in General Medicine: 112 of 120 beds occupied (93.3%).',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-BED-SURGICAL_WARD',
      department_or_unit: 'Surgical Ward',
      severity: 'medium',
      metric_name: 'Bed Occupancy Rate',
      observed_value: '86.7% (52/60 beds)',
      benchmark_threshold: '< 85.0%',
      description: 'Elevated bed occupancy in Surgical Ward at 86.7%.',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-ED-BOARDING',
      department_or_unit: 'Emergency Department',
      severity: 'critical',
      metric_name: 'Admitted Inpatient Boarding',
      observed_value: '14 patients boarding',
      benchmark_threshold: '< 8 patients',
      description: '14 admitted patients currently boarding in Emergency Department awaiting inpatient bed placement.',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-DIAG-CT_SCAN',
      department_or_unit: 'Diagnostics - CT Scan',
      severity: 'high',
      metric_name: 'Average Scan Wait Time',
      observed_value: '185.0 min (19 queued, 2/3 active)',
      benchmark_threshold: '< 90.0 min',
      description: 'CT Scan queue delayed: 19 orders pending with 185.0 min avg wait. Machine availability: 2 of 3 operational.',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-DISCHARGE-LAG',
      department_or_unit: 'Inpatient Wards',
      severity: 'high',
      metric_name: 'Discharge Execution Lag',
      observed_value: '6 patients delayed > 4.0h',
      benchmark_threshold: '< 4.0 hours post-clearance',
      description: '6 medically cleared patients delayed beyond 4 hours blocking inpatient bed release.',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-STAFF-EMERGENCY_DEPARTMENT',
      department_or_unit: 'Emergency Department',
      severity: 'high',
      metric_name: 'Nurse Staffing Ratio',
      observed_value: '3.8:1 (Target: 3.0:1)',
      benchmark_threshold: '<= 3.0:1',
      description: 'Staffing ratio strained in Emergency Department at 3.8 patients per nurse (target 3.0:1).',
      detected_at: new Date().toISOString(),
    },
    {
      id: 'BN-STAFF-GENERAL_MEDICINE',
      department_or_unit: 'General Medicine',
      severity: 'high',
      metric_name: 'Nurse Staffing Ratio',
      observed_value: '6.2:1 (Target: 4.0:1)',
      benchmark_threshold: '<= 4.0:1',
      description: 'Staffing ratio strained in General Medicine at 6.2 patients per nurse (target 4.0:1).',
      detected_at: new Date().toISOString(),
    },
  ],
};

export const HOURLY_PATIENT_FLOW: PatientFlowPoint[] = [
  { timeLabel: '00:00', admissions: 3, discharges: 0, emergencyArrivals: 8, netChange: 3 },
  { timeLabel: '02:00', admissions: 2, discharges: 0, emergencyArrivals: 7, netChange: 2 },
  { timeLabel: '04:00', admissions: 1, discharges: 0, emergencyArrivals: 6, netChange: 1 },
  { timeLabel: '06:00', admissions: 4, discharges: 1, emergencyArrivals: 9, netChange: 3 },
  { timeLabel: '08:00', admissions: 12, discharges: 5, emergencyArrivals: 14, netChange: 7 },
  { timeLabel: '10:00', admissions: 19, discharges: 14, emergencyArrivals: 17, netChange: 5 },
  { timeLabel: '12:00', admissions: 24, discharges: 20, emergencyArrivals: 21, netChange: 4 },
  { timeLabel: '14:00', admissions: 22, discharges: 18, emergencyArrivals: 25, netChange: 4 },
  { timeLabel: '16:00', admissions: 18, discharges: 12, emergencyArrivals: 26, netChange: 6 },
  { timeLabel: '18:00', admissions: 15, discharges: 6, emergencyArrivals: 23, netChange: 9 },
  { timeLabel: '20:00', admissions: 10, discharges: 3, emergencyArrivals: 18, netChange: 7 },
  { timeLabel: '22:00', admissions: 6, discharges: 1, emergencyArrivals: 12, netChange: 5 },
];

export const DAILY_PATIENT_FLOW: PatientFlowPoint[] = [
  { timeLabel: 'Mon', admissions: 48, discharges: 44, emergencyArrivals: 64, netChange: 4 },
  { timeLabel: 'Tue', admissions: 52, discharges: 49, emergencyArrivals: 71, netChange: 3 },
  { timeLabel: 'Wed', admissions: 55, discharges: 51, emergencyArrivals: 78, netChange: 4 },
  { timeLabel: 'Thu', admissions: 61, discharges: 53, emergencyArrivals: 84, netChange: 8 },
  { timeLabel: 'Fri', admissions: 58, discharges: 62, emergencyArrivals: 82, netChange: -4 },
  { timeLabel: 'Sat', admissions: 39, discharges: 34, emergencyArrivals: 75, netChange: 5 },
  { timeLabel: 'Sun', admissions: 35, discharges: 28, emergencyArrivals: 69, netChange: 7 },
];

export const DEFAULT_WAITING_TIMES: WaitingTimeItem[] = [
  {
    department: 'Emergency Dept',
    category: 'Emergency',
    waitMinutes: 58,
    targetMinutes: 45,
    status: 'warning',
    queuedCount: 22,
  },
  {
    department: 'Outpatient Clinic',
    category: 'Outpatient',
    waitMinutes: 34,
    targetMinutes: 40,
    status: 'normal',
    queuedCount: 14,
  },
  {
    department: 'CT Scan Modality',
    category: 'Diagnostic',
    waitMinutes: 185,
    targetMinutes: 90,
    status: 'critical',
    queuedCount: 19,
  },
  {
    department: 'MRI Suite',
    category: 'Diagnostic',
    waitMinutes: 65,
    targetMinutes: 60,
    status: 'warning',
    queuedCount: 7,
  },
  {
    department: 'Ultrasound',
    category: 'Diagnostic',
    waitMinutes: 42,
    targetMinutes: 45,
    status: 'normal',
    queuedCount: 11,
  },
  {
    department: 'Surgical Holding',
    category: 'Surgical',
    waitMinutes: 28,
    targetMinutes: 35,
    status: 'normal',
    queuedCount: 8,
  },
];

export const DEFAULT_RESOURCE_UTILIZATION: ResourceUtilizationItem[] = [
  {
    resource: 'ICU Acute Beds',
    category: 'Critical Care',
    totalCapacity: 24,
    inUse: 23,
    available: 1,
    utilizationPercent: 95.8,
    unit: 'beds',
    status: 'critical',
  },
  {
    resource: 'Operating Suites',
    category: 'Surgical',
    totalCapacity: 8,
    inUse: 7,
    available: 1,
    utilizationPercent: 87.5,
    unit: 'suites',
    status: 'warning',
  },
  {
    resource: 'CT Scanner Modality',
    category: 'Imaging',
    totalCapacity: 3,
    inUse: 2,
    available: 0,
    utilizationPercent: 92.0,
    unit: 'scanners (1 offline)',
    status: 'critical',
  },
  {
    resource: 'MRI System',
    category: 'Imaging',
    totalCapacity: 2,
    inUse: 1.4,
    available: 0.6,
    utilizationPercent: 70.0,
    unit: 'systems',
    status: 'normal',
  },
  {
    resource: 'Ultrasound Units',
    category: 'Imaging',
    totalCapacity: 3,
    inUse: 2,
    available: 1,
    utilizationPercent: 65.0,
    unit: 'units',
    status: 'normal',
  },
  {
    resource: 'Cardiac Cath Lab',
    category: 'Specialty Care',
    totalCapacity: 6,
    inUse: 5,
    available: 1,
    utilizationPercent: 83.3,
    unit: 'labs',
    status: 'warning',
  },
];

export const DEFAULT_ALERTS: OperationalAlertItem[] = [
  {
    id: 'ALT-1',
    severity: 'critical',
    title: 'ICU Approaching Maximum Capacity',
    department: 'Intensive Care Unit',
    message: '23 of 24 beds occupied (95.8%). Only 1 available bed remaining. Immediate risk of acute patient diversion.',
    metric: 'Occupancy Rate',
    observed: '95.8%',
    threshold: '< 90.0%',
    timestamp: '8 mins ago',
    actionLabel: 'Initiate ICU Stepdown Review',
    targetTab: 'beds',
  },
  {
    id: 'ALT-2',
    severity: 'critical',
    title: 'Admitted Patient Boarding in ED',
    department: 'Emergency Department',
    message: '14 admitted patients currently boarding in ED hallways/bays awaiting inpatient ward transfer.',
    metric: 'Boarded Inpatients',
    observed: '14 patients',
    threshold: '< 8 patients',
    timestamp: '14 mins ago',
    actionLabel: 'Expedite General Med Discharges',
    targetTab: 'beds',
  },
  {
    id: 'ALT-3',
    severity: 'critical',
    title: 'Severe Nurse Shortage in General Medicine',
    department: 'General Medicine',
    message: '18 active RNs vs 28 target. Patient-to-nurse ratio strained at 6.2:1 against 4.0:1 benchmark safety threshold.',
    metric: 'Patient-to-Nurse Ratio',
    observed: '6.2:1',
    threshold: '<= 4.0:1',
    timestamp: '22 mins ago',
    actionLabel: 'Call Float Pool Staff',
    targetTab: 'staffing',
  },
  {
    id: 'ALT-4',
    severity: 'critical',
    title: 'CT Scanner #3 Offline - Diagnostic Queue Delay',
    department: 'Diagnostics - CT Scan',
    message: 'CT Scanner #3 offline for tube calibration. Average queue wait has reached 185 min with 19 pending urgent scans.',
    metric: 'Average Wait Time',
    observed: '185.0 min (2/3 operational)',
    threshold: '< 90.0 min',
    timestamp: '35 mins ago',
    actionLabel: 'Fast-Track Biomedical Service',
    targetTab: 'diagnostics',
  },
  {
    id: 'ALT-5',
    severity: 'warning',
    title: 'Surgical Ward Elevated Census',
    department: 'Surgical Ward',
    message: '52 of 60 beds occupied (86.7%), approaching the 85.0% warning threshold prior to scheduled post-op admissions.',
    metric: 'Occupancy Rate',
    observed: '86.7%',
    threshold: '< 85.0%',
    timestamp: '42 mins ago',
    actionLabel: 'Review Discharge Readiness',
    targetTab: 'beds',
  },
  {
    id: 'ALT-6',
    severity: 'warning',
    title: 'Discharge Execution Lag in Inpatient Wards',
    department: 'Inpatient Units',
    message: '6 medically cleared patients delayed > 4 hours holding acute beds due to transportation and pharmacy reconciliation delays.',
    metric: 'Discharge Lag',
    observed: '6 patients > 4h',
    threshold: '< 4.0 hours',
    timestamp: '1 hour ago',
    actionLabel: 'Prioritize Discharge Lounge',
    targetTab: 'diagnostics',
  },
  {
    id: 'ALT-7',
    severity: 'warning',
    title: 'Emergency Department Triage Wait Spike',
    department: 'Emergency Department',
    message: 'Average ED waiting time climbed to 58 minutes (+13 min above benchmark target) following afternoon surge.',
    metric: 'Wait Time',
    observed: '58 min',
    threshold: '< 45 min',
    timestamp: '1.2 hours ago',
    actionLabel: 'Open Fast-Track Pod',
    targetTab: 'patient-flow',
  },
  {
    id: 'ALT-8',
    severity: 'info',
    title: 'Afternoon Shift Handover Underway',
    department: 'Nursing Operations',
    message: 'Shift handover briefing initiated across General Medicine, ICU, and Surgical units. Coverage check scheduled.',
    timestamp: '25 mins ago',
    actionLabel: 'View Staffing Roster',
    targetTab: 'staffing',
  },
  {
    id: 'ALT-9',
    severity: 'info',
    title: 'Automated Hospital Telemetry Synchronization',
    department: 'Operations Command',
    message: 'Daily electronic census and modality operational records synchronized. System operating in verified demo baseline.',
    timestamp: 'Just now',
    actionLabel: 'View Diagnostics',
    targetTab: 'overview',
  },
];

import {
  BedDepartmentBreakdown,
  OperationalAlertItem,
  PatientFlowPoint,
  ResourceUtilizationItem,
  StaffAvailabilityItem,
  WaitingTimeItem,
} from '../types';

/**
 * Derives comprehensive chart metrics from the active hospital snapshot.
 * Ensures charts reflect live backend state dynamically while providing rich fallbacks.
 */
export function deriveDashboardData(snapshot: HospitalOperationalSnapshot) {
  // 1. Bed breakdown across departments
  const bedBreakdown: BedDepartmentBreakdown[] = snapshot.departments.map((dept) => {
    const isCritical = dept.status === 'critical';
    const isWarning = dept.status === 'warning';
    const threshold = dept.department === 'Surgical Ward' ? 85 : 90;

    // Allocate 1-2 beds for terminal cleaning/maintenance if not critical
    const unavailable = dept.department === 'General Medicine' ? 2 :
                        dept.department === 'Surgical Ward' ? 2 :
                        dept.department === 'Pediatrics' ? 1 : 0;
    const available = Math.max(0, dept.total_beds - dept.occupied_beds - unavailable);

    return {
      department: dept.department,
      total: dept.total_beds,
      occupied: dept.occupied_beds,
      available,
      unavailable,
      occupancyPercent: dept.occupancy_rate_percent,
      threshold,
      status: isCritical ? 'critical' : isWarning ? 'warning' : 'normal',
    };
  });

  // 2. Waiting times derived from diagnostic backlogs and ED boarding
  const waitingTimes: WaitingTimeItem[] = [
    {
      department: 'Emergency Dept',
      category: 'Emergency',
      waitMinutes: snapshot.emergency_boarded_patients > 10 ? 58 : 38,
      targetMinutes: 45,
      status: snapshot.emergency_boarded_patients > 10 ? 'warning' : 'normal',
      queuedCount: snapshot.emergency_boarded_patients + 8,
    },
    {
      department: 'Outpatient Care',
      category: 'Outpatient',
      waitMinutes: 34,
      targetMinutes: 40,
      status: 'normal',
      queuedCount: 14,
    },
    ...snapshot.diagnostic_backlogs.map((diag) => {
      let target = 90;
      if (diag.modality === 'MRI') target = 60;
      if (diag.modality === 'Ultrasound') target = 45;
      if (diag.modality === 'X-Ray') target = 30;

      const isCritical = diag.average_wait_minutes >= target * 1.5;
      const isWarning = diag.average_wait_minutes > target;

      return {
        department: `${diag.modality} Modality`,
        category: 'Diagnostic' as const,
        waitMinutes: Math.round(diag.average_wait_minutes),
        targetMinutes: target,
        status: isCritical ? 'critical' as const : isWarning ? 'warning' as const : 'normal' as const,
        queuedCount: diag.pending_scans,
      };
    }),
  ];

  // 3. Staff availability derived from staffing indicators
  const staffAvailability: StaffAvailabilityItem[] = snapshot.staffing_indicators.map((s) => {
    const coverage = Math.round((s.active_nurses / s.target_nurses) * 100);
    return {
      department: s.department,
      availableStaff: s.active_nurses,
      requiredStaff: s.target_nurses,
      coveragePercent: coverage,
      patientToStaffRatio: s.patient_to_nurse_ratio,
      targetRatio: s.target_ratio,
      status: s.status,
    };
  });

  // 4. Resource utilization derived from bed and diagnostics data
  const ctScan = snapshot.diagnostic_backlogs.find((d) => d.modality === 'CT Scan');
  const icu = snapshot.departments.find((d) => d.department === 'Intensive Care Unit');

  const resourceUtilization: ResourceUtilizationItem[] = [
    {
      resource: 'ICU Acute Beds',
      category: 'Critical Care',
      totalCapacity: icu ? icu.total_beds : 24,
      inUse: icu ? icu.occupied_beds : 23,
      available: icu ? icu.total_beds - icu.occupied_beds : 1,
      utilizationPercent: icu ? icu.occupancy_rate_percent : 95.8,
      unit: 'beds',
      status: icu && icu.occupancy_rate_percent >= 90 ? 'critical' : 'normal',
    },
    {
      resource: 'Operating Suites (OR)',
      category: 'Surgical',
      totalCapacity: 8,
      inUse: 7,
      available: 1,
      utilizationPercent: 87.5,
      unit: 'suites',
      status: 'warning',
    },
    {
      resource: 'CT Scanner Modality',
      category: 'Imaging',
      totalCapacity: ctScan ? ctScan.total_machines : 3,
      inUse: ctScan ? ctScan.in_service_machines : 2,
      available: ctScan ? ctScan.total_machines - ctScan.in_service_machines : 1,
      utilizationPercent: ctScan && ctScan.in_service_machines < ctScan.total_machines ? 92.0 : 68.0,
      unit: ctScan && ctScan.in_service_machines < ctScan.total_machines ? 'active (1 offline)' : 'scanners',
      status: ctScan && ctScan.status === 'critical' ? 'critical' : 'normal',
    },
    {
      resource: 'MRI System',
      category: 'Imaging',
      totalCapacity: 2,
      inUse: 1.4,
      available: 0.6,
      utilizationPercent: 70.0,
      unit: 'systems',
      status: 'normal',
    },
    {
      resource: 'Ultrasound Units',
      category: 'Imaging',
      totalCapacity: 3,
      inUse: 2,
      available: 1,
      utilizationPercent: 65.0,
      unit: 'units',
      status: 'normal',
    },
    {
      resource: 'Cardiac Cath Lab',
      category: 'Specialty Care',
      totalCapacity: 6,
      inUse: 5,
      available: 1,
      utilizationPercent: 83.3,
      unit: 'labs',
      status: 'warning',
    },
  ];

  // 5. Total available and unavailable beds
  const totalOccupied = snapshot.total_occupied_beds;
  const totalCapacity = snapshot.total_capacity_beds;
  const totalUnavailable = bedBreakdown.reduce((acc, curr) => acc + curr.unavailable, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalOccupied - totalUnavailable);

  // 6. Total active nurses
  const totalActiveRNs = snapshot.staffing_indicators.reduce((acc, curr) => acc + curr.active_nurses, 0);
  const totalTargetRNs = snapshot.staffing_indicators.reduce((acc, curr) => acc + curr.target_nurses, 0);
  const overallStaffCoverage = Math.round((totalActiveRNs / totalTargetRNs) * 100);

  // 7. Composite wait time
  const edWait = waitingTimes.find((w) => w.department === 'Emergency Dept')?.waitMinutes || 58;

  return {
    kpis: {
      totalPatients: totalOccupied + snapshot.emergency_boarded_patients,
      totalCapacity,
      totalOccupied,
      totalAvailable,
      totalUnavailable,
      occupancyRate: snapshot.overall_occupancy_rate_percent,
      averageWaitMinutes: edWait,
      staffAvailabilityPercent: overallStaffCoverage,
      totalActiveRNs,
      totalTargetRNs,
      activeAlertsCount: snapshot.active_bottlenecks.length,
      criticalAlertsCount: snapshot.active_bottlenecks.filter((b) => b.severity === 'critical').length,
    },
    bedBreakdown,
    waitingTimes,
    staffAvailability,
    resourceUtilization,
    alerts: DEFAULT_ALERTS,
    hourlyFlow: HOURLY_PATIENT_FLOW,
    dailyFlow: DAILY_PATIENT_FLOW,
  };
}
