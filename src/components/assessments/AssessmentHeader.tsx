import { Pencil, User } from 'lucide-react'
import type { Assessment, Patient, Saved } from '#/model'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  TooltipButton
} from '#/sapneuro-ui/components'
import { computePatientAge, formatDate } from '#/utils'

export function AssessmentHeader({
  assessment,
  openEditPatientDialog
}: {
  assessment: Assessment
  openEditPatientDialog?: (patient: Saved<Patient>) => void
}) {
  return (
    <Item variant="outline" className="mt-1 mb-3 py-1">
      <ItemMedia variant="icon">
        <User />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {`${assessment.patient.surname} ${assessment.patient.name} (nat${assessment.patient.sex === 'M' ? 'o' : 'a'} il ${formatDate(assessment.patient.birthDate)})`}
        </ItemTitle>
        <ItemDescription>
          {`Data valutazione: ${formatDate(assessment.date)}. Età: ${computePatientAge(assessment.patient.birthDate, assessment.date)} anni. Istruzione: ${assessment.patient.literacy} anni`}
        </ItemDescription>
      </ItemContent>
      {openEditPatientDialog && (
        <ItemActions>
          <TooltipButton
            onClick={() =>
              openEditPatientDialog(assessment.patient as Saved<Patient>)
            }
            tooltip="Modifica dati anagrafici del paziente"
            variant="ghost"
            side="left"
            className="pr-0!"
          >
            <Pencil />
          </TooltipButton>
        </ItemActions>
      )}
    </Item>
  )
}
