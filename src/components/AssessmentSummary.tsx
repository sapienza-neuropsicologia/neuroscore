import type { PropsWithChildren } from 'react'
import type { Assessment, Patient } from '#/model'
import { computePatientAge, formatDate } from '#/utils'
import { SectionPill } from './SectionPill'

export function AssessmentSummary({
  title,
  patient,
  assessment,
  children
}: PropsWithChildren<{
  title?: string
  patient: Patient
  assessment?: Assessment
}>) {
  return (
    <>
      {title ? <SectionPill>{title}</SectionPill> : null}
      <div className="flex items-start justify-between mb-3 rounded-md border border-[#d9c4b3] bg-[#fffaf7] p-3 print:my-1 print:rounded-none print:border-0 print:bg-white print:px-0 print:py-1">
        <div>
          <div className="text-base font-semibold print:text-sm">
            {patient.surname} {patient.name}
          </div>
          <div className="mt-1 text-sm text-[#6f5a4f] print:text-xs print:text-black">
            Data di nascita: {formatDate(patient.birthDate)} · Sesso:{' '}
            {patient.sex} · Scolarità: {patient.schoolYears} anni ·
            {assessment
              ? `Data valutazione: ${formatDate(assessment.date)}· Età:
            ${computePatientAge(patient.birthDate, assessment.date)}
            anni`
              : `Età: ${computePatientAge(patient.birthDate)} anni`}
          </div>
        </div>
        {children && (
          <div className="flex shrink-0 items-center gap-0.5 self-center print:hidden">
            {children}
          </div>
        )}
      </div>
    </>
  )
}
