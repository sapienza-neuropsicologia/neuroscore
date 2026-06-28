/** biome-ignore-all lint/correctness/noChildrenProp: <ok> */

import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import z from 'zod'
import { type PatientCrudRecord, useSavePatient } from '#/model'
import { FieldGroup, useAppForm, useDialogForm } from '#/sapneuro-ui/components'

const surname = z.string().min(2, 'Il cognome deve avere almeno 2 caratteri.')
const name = z.string().min(2, 'Il nome deve avere almeno 2 caratteri.')
const birthDate = z.coerce.date().superRefine((date, ctx) => {
  const today = new Date()
  if (date > today) {
    ctx.addIssue({
      code: 'custom',
      message: 'La data di nascita non può essere successiva ad oggi.'
    })
  } else if (
    date < new Date(today.getFullYear() - 95, today.getMonth(), today.getDate())
  ) {
    ctx.addIssue({
      code: 'custom',
      message: "L'età massima consentita è 95 anni."
    })
  }
})

const sex = z.union([z.literal('M'), z.literal('F')])

const literacy = z
  .number()
  .int()
  .positive()
  .max(19, 'Il massimo numero di anni di scolarità accettato è 19.')

const schema = z.object({
  surname,
  name,
  birthDate,
  sex,
  literacy
})

type PatientEditorSchema = z.infer<typeof schema>

function usePatientDialogForm({
  title,
  reset,
  onSave
}: {
  title: string
  reset?: boolean
  onSave?: (patient: PatientCrudRecord) => void
}) {
  const { mutateAsync: savePatient } = useSavePatient()
  const form = useAppForm({
    defaultValues: {} as PatientEditorSchema,
    validators: {
      onChange: schema as any
    },
    onSubmit: async ({ value }) => {
      try {
        const patient = await savePatient({ ...value, age: 0, assessments: [] })
        onSave?.(patient)
      } catch (err) {
        console.log(err)
      }
    }
  })
  const { DialogForm, openDialog } = useDialogForm(form)

  const PatientDialogForm = useCallback(
    () => (
      <DialogForm
        title={title}
        description="Dati anagrafici del/la paziente"
        submit="Salva"
        cancel="Annulla"
        reset={reset ? 'Ripristina' : undefined}
        className="sm:max-w-[50vw]"
      >
        <FieldGroup>
          <form.AppField
            name="surname"
            children={(field) => (
              <field.TextField
                label="Cognome"
                placeholder="Inserisci il cognome"
                required={true}
              />
            )}
          />
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label="Nome"
                placeholder="Inserisci il nome"
                required={true}
              />
            )}
          />
          <form.AppField
            name="birthDate"
            children={(field) => (
              <field.DateField
                label="Data di nascita"
                placeholder="Seleziona data"
                required={true}
              />
            )}
          />
          <form.AppField
            name="sex"
            children={(field) => (
              <field.RadioGroup
                label="Sesso"
                options={[
                  { label: 'Maschio', value: 'M' },
                  { label: 'Femmina', value: 'F' }
                ]}
                required={true}
              />
            )}
          />
          <form.AppField
            name="literacy"
            children={(field) => (
              <field.NumberField
                label="Scolarità"
                description="Inserisci il numero di anni di scuola/università che hai completato (partendo dalla prima elementare)"
                placeholder="Anni"
                required={true}
              />
            )}
          />
        </FieldGroup>
      </DialogForm>
    ),
    [DialogForm, form, reset, title]
  )

  return {
    PatientDialogForm,
    openPatientDialog: openDialog
  }
}

export function useCreatePatientForm() {
  const navigate = useNavigate()
  const { PatientDialogForm, openPatientDialog } = usePatientDialogForm({
    title: 'Crea paziente',
    onSave: (patient) =>
      navigate({
        to: '/patients/$patientId',
        params: { patientId: patient.id }
      })
  })
  return {
    CreatePatientDialog: PatientDialogForm,
    openCreatePatientDialog: openPatientDialog
  }
}

export function useEditPatientForm() {
  const { PatientDialogForm, openPatientDialog } = usePatientDialogForm({
    title: 'Modifica paziente',
    reset: true
  })
  return {
    EditPatientDialog: PatientDialogForm,
    openEditPatientDialog: openPatientDialog
  }
}
