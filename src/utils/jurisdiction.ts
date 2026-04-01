export type Jurisdiction = 'uk' | 'india'

export interface EthicsCommitteeInfo {
  name: string
  approvalRef: string
  validUntil: string
  contactEmail: string
  contactPhone?: string
}

export interface HospitalRegInfo {
  jurisdiction: Jurisdiction
  hospitalName: string
  ethicsCommittee: EthicsCommitteeInfo
}

const HOSPITAL_REG: Record<string, HospitalRegInfo> = {
  barts: {
    jurisdiction: 'uk',
    hospitalName: 'Barts Health NHS Trust',
    ethicsCommittee: {
      name: 'Barts Health NHS Trust Research Ethics Committee',
      approvalRef: 'IRAS 2025/001234',
      validUntil: '2027-01-31',
      contactEmail: 'research.ethics@bartshealth.nhs.uk',
    },
  },
  apollo: {
    jurisdiction: 'india',
    hospitalName: 'Apollo Hospitals',
    ethicsCommittee: {
      name: 'Apollo Hospitals Institutional Ethics Committee',
      approvalRef: 'AH-IEC/2025/056',
      validUntil: '2027-03-31',
      contactEmail: 'iec@apollohospitals.com',
      contactPhone: '+91 44 2829 3333',
    },
  },
}

export function getHospitalId(): string | null {
  try {
    return localStorage.getItem('selected_hospital')
  } catch {
    return null
  }
}

export function getJurisdiction(): Jurisdiction {
  const id = getHospitalId()
  if (id && HOSPITAL_REG[id]) return HOSPITAL_REG[id].jurisdiction
  return 'uk'
}

export function getHospitalRegInfo(): HospitalRegInfo | null {
  const id = getHospitalId()
  if (id && HOSPITAL_REG[id]) return HOSPITAL_REG[id]
  return null
}

export function getEthicsCommittee(): EthicsCommitteeInfo | null {
  return getHospitalRegInfo()?.ethicsCommittee ?? null
}

export function isIndiaJurisdiction(): boolean {
  return getJurisdiction() === 'india'
}
