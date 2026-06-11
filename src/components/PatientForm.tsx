import { CornerDownLeft, RotateCcw, Save } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import type { Saved } from '#/model'
import { type Patient, useSavePatient } from '#/model'
import { computePatientAge } from '#/utils'
import { Card } from './Card'
import { Field } from './Field'

export function PatientForm({
  patient,
  title,
  onSave,
  onCancel,
  isLoading = false
}: {
  patient?: Patient
  title: string
  onSave: (patient: Saved<Patient>) => void
  onCancel: () => void
  isLoading?: boolean
}) {
  const { isPending, mutateAsync: savePatient } = useSavePatient()
  const [name, setName] = useState(() => patient?.name ?? '')
  const [surname, setSurname] = useState(() => patient?.surname ?? '')
  const [birthDate, setBirthDate] = useState(
    () => patient?.birthDate.toISOString().split('T')[0] ?? ''
  )
  const [sex, setSex] = useState(() => patient?.sex.toString() ?? '')
  const [schoolYears, setSchoolYears] = useState(
    patient?.schoolYears.toString() ?? ''
  )

  const canSave = useMemo(
    () =>
      !isLoading &&
      !isPending &&
      !!name.trim() &&
      !!surname.trim() &&
      !!birthDate &&
      (sex === 'M' || sex === 'F') &&
      !!schoolYears &&
      Number.isFinite(Number(schoolYears)) &&
      Number(schoolYears) >= 0,
    [isLoading, isPending, name, surname, birthDate, sex, schoolYears]
  )

  const handleFormReset = useCallback(() => {
    setName(patient?.name ?? '')
    setSurname(patient?.surname ?? '')
    setBirthDate(patient?.birthDate.toISOString().split('T')[0] ?? '')
    setSex(patient?.sex.toString() ?? '')
    setSchoolYears(patient?.schoolYears.toString() ?? '')
  }, [patient])

  const handleFormSave = useCallback(async () => {
    const bd = new Date(birthDate)
    const patientData = {
      id: patient?.id,
      name: name.trim(),
      surname: surname.trim(),
      birthDate: bd,
      sex: sex as 'M' | 'F',
      age: computePatientAge(bd),
      schoolYears: Number(schoolYears),
      assessments: []
    }
    const { id } = await savePatient(patientData)
    onSave({ ...patientData, id })
  }, [
    name,
    surname,
    birthDate,
    sex,
    schoolYears,
    onSave,
    savePatient,
    patient?.id
  ])

  return (
    <Card
      title={title}
      subtitle="Inserisci i dati del paziente"
      hideHeaderInPrint
      actions={[
        {
          icon: CornerDownLeft,
          label: 'Annulla',
          tooltip: 'Torna indietro senza salvare',
          onClick: onCancel
        },
        {
          icon: RotateCcw,
          label: 'Azzera',
          tooltip: 'Azzera il modulo',
          onClick: handleFormReset
        },
        {
          icon: Save,
          label: 'Salva',
          tooltip: 'Salva i dati del paziente',
          onClick: handleFormSave,
          disabled: !canSave
        }
      ]}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Nome" for="name">
          <input
            className="field"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Cognome" for="surname">
          <input
            className="field"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label="Data di nascita" for="birthdate">
          <input
            className="field"
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Field>
        <Field label="Sesso" for="sex">
          <select
            className="field"
            id="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="">-</option>
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
          </select>
        </Field>
        <Field label="Scolarità (anni)" for="schoolYears">
          <input
            className="field"
            type="number"
            id="schoolYears"
            min={0}
            max={19}
            step={1}
            value={schoolYears}
            onChange={(e) => setSchoolYears(e.target.value)}
          />
        </Field>
      </div>
    </Card>
  )
}
