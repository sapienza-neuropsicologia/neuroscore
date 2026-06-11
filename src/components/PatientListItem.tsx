import { useNavigate } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  SquareArrowRight,
  Trash2
} from 'lucide-react'
import { useState } from 'react'
import {
  type Patient,
  type Saved,
  useCreateAssessment,
  useDeletePatient,
  usePatientAssessments
} from '#/model'
import { formatDate } from '#/utils'
import { AssessmentListItem } from './AssessmentListItem'
import { Button } from './Button'
import { Loader } from './Loader'

export function PatientListItem({ patient }: { patient: Saved<Patient> }) {
  const { isPending: isCreatePending, mutateAsync: createAssessment } =
    useCreateAssessment()
  const { isPending: isDeletePending, mutateAsync: deletePatient } =
    useDeletePatient()
  const [isOpen, setIsOpen] = useState(false)
  const { data: assessments, isLoading: assessmentsAreLoading } =
    usePatientAssessments(isOpen ? patient : undefined)
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border border-[#e8d8cc] bg-white px-4 py-3 transition hover:border-[#cba893]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-left transition hover:bg-[#fffaf6]"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span
            title={isOpen ? 'Comprimi valutazioni' : 'Espandi valutazioni'}
            aria-hidden="true"
            className="rounded-md p-1 text-[#6f5a4f] cursor-pointer"
          >
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
          <div>
            <div className="font-semibold text-[#2c1f1a]">
              {patient.surname} {patient.name}
            </div>
            <div className="text-xs text-[#6f5a4f]">
              nat{patient.sex === 'M' ? 'o' : 'a'} il{' '}
              {formatDate(patient.birthDate)}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <Button
            tooltip="Apri scheda paziente"
            onClick={() =>
              navigate({
                to: '/patients/$patientId',
                params: { patientId: patient.id }
              })
            }
            icon={SquareArrowRight}
            iconSize={18}
            border={false}
            disabled={isCreatePending || isDeletePending}
          />
          <Button
            tooltip="Nuova valutazione"
            onClick={() =>
              createAssessment(patient).then(({ id }) =>
                navigate({
                  to: '/assessments/$assessmentId',
                  params: { assessmentId: id }
                })
              )
            }
            icon={Plus}
            iconSize={18}
            border={false}
            disabled={isCreatePending || isDeletePending}
          />
          <Button
            tooltip="Elimina paziente"
            onClick={() => {
              if (
                window.confirm('Eliminare definitivamente questo paziente?')
              ) {
                deletePatient(patient)
              }
            }}
            icon={Trash2}
            iconSize={18}
            border={false}
            disabled={isCreatePending || isDeletePending}
          />
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 border-t border-[#f0e3da] pt-3">
          {assessmentsAreLoading ? (
            <Loader />
          ) : !assessments || assessments.length === 0 ? (
            <div className="rounded-lg border border-[#e8d8cc] bg-[#fffaf7] px-4 py-3 text-sm text-[#6f5a4f]">
              Nessuna valutazione disponibile
            </div>
          ) : (
            <div className="space-y-2">
              {assessments.map((assessment) => (
                <AssessmentListItem
                  key={assessment.id}
                  assessment={assessment}
                  title={`Valutazione del ${formatDate(assessment.date)}`}
                  subtitle=""
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
