'use client'

import { useNavigate } from '@tanstack/react-router'
import type { CellContext, ColumnDef, Table } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { type Patient, type Saved, usePatientList } from '#/model'
import {
  columnHeader,
  DataTable,
  Loading,
  TooltipButton,
  useDataTable
} from '#/sapneuro-ui/components'
import { formatDate } from '#/utils'
import { PatientDeleteButton, useDeletePatientDialog } from './DeletePatient'
import { useEditPatientForm } from './PatientEditor'

export const columns: ColumnDef<Saved<Patient>>[] = [
  {
    accessorKey: 'surname',
    header: columnHeader('Cognome'),
    filterFn: 'fuzzy'
  },
  {
    accessorKey: 'name',
    header: columnHeader('Nome'),
    filterFn: 'fuzzy'
  },
  {
    accessorKey: 'birthDate',
    header: columnHeader('Data di nascita'),
    cell: (info) => formatDate(info.getValue<Date>()),
    sortingFn: 'datetime'
  },
  {
    accessorKey: 'sex',
    header: columnHeader('Sesso')
  },
  {
    accessorKey: 'literacy',
    header: columnHeader('Scolarità')
  },
  {
    id: 'actions',
    cell: ({ table, row }: CellContext<Saved<Patient>, Saved<Patient>>) => (
      <>
        <TooltipButton
          tooltip="Modifica dati anagrafici"
          side="left"
          onClick={(e) => {
            e.stopPropagation()
            const openEditPatientDialog = (table.options.meta as any)
              .openEditPatientDialog
            openEditPatientDialog(row.original)
          }}
          variant="ghost"
          className="pl-0!"
        >
          <Pencil />
        </TooltipButton>
        <PatientDeleteButton
          patient={row.original}
          openDeletePatientDialog={
            (table.options.meta as any).openDeletePatientDialog
          }
          className="pr-0!"
        />
      </>
    )
  }
]

const noData: Saved<Patient>[] = []

export function usePatientTable() {
  const { data: patients, isLoading } = usePatientList()
  const table = useDataTable({
    columns,
    data: patients ?? noData
  })
  return { table, isLoading }
}

export function PatientTable({
  table,
  isLoading
}: {
  table: Table<Saved<Patient>>
  isLoading: boolean
}) {
  const { EditPatientDialog, openEditPatientDialog } = useEditPatientForm()
  const { DeletePatientDialog, openDeletePatientDialog } =
    useDeletePatientDialog()
  table.options.meta = { openEditPatientDialog, openDeletePatientDialog }

  const navigate = useNavigate()
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <EditPatientDialog />
      <DeletePatientDialog />
      <DataTable
        table={table}
        onClick={(patient) =>
          navigate({
            to: '/patients/$patientId',
            params: { patientId: patient.id }
          })
        }
        placeholder="Non ci sono ancora pazienti"
        className="px-0.5 py-0"
      />
    </>
  )
}
