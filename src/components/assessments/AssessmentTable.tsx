'use client'

import { useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { type Assessment, type Saved, useAssessmentList } from '#/model'
import {
  columnHeader,
  DataTable,
  Loading,
  useDataTable
} from '#/sapneuro-ui/components'
import { formatDate } from '#/utils'
import {
  AssessmentDeleteButton,
  useDeleteAssesmentDialog
} from './DeleteAssessment'

export const columns: ColumnDef<Saved<Assessment>>[] = [
  {
    id: 'patient',
    accessorFn: (row) => `${row.patient.surname} ${row.patient.name}`,
    header: columnHeader('Paziente'),
    filterFn: 'fuzzy'
  },
  {
    accessorKey: 'patient.birthDate',
    header: columnHeader('Data di nascita'),
    cell: (info) => formatDate(info.getValue<Date>()),
    sortingFn: 'datetime'
  },
  {
    accessorKey: 'patient.sex',
    header: columnHeader('Sesso')
  },
  {
    accessorKey: 'patient.literacy',
    header: columnHeader('Scolarità')
  },
  {
    accessorKey: 'date',
    header: columnHeader('Data valutazione'),
    cell: (info) => formatDate(info.getValue<Date>()),
    sortingFn: 'datetime'
  },
  {
    id: 'actions',
    cell: ({ table, row }) => (
      <AssessmentDeleteButton
        assessment={row.original}
        openDeleteAssessmentDialog={
          (table.options.meta as any).openDeleteAssessmentDialog
        }
      />
    )
  }
]

const noData: Saved<Assessment>[] = []

export function useAssessmentTable() {
  const { assessments, isLoading } = useAssessmentList()
  const table = useDataTable({
    columns,
    data: assessments ?? noData
  })
  return { table, isLoading }
}

export function AssessmentTable({
  table,
  isLoading
}: ReturnType<typeof useAssessmentTable>) {
  const { DeleteAssessmentDialog, openDeleteAssessmentDialog } =
    useDeleteAssesmentDialog()
  table.options.meta = { openDeleteAssessmentDialog }

  const navigate = useNavigate()
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <DeleteAssessmentDialog />
      <DataTable
        table={table}
        onClick={(assessment) =>
          navigate({
            to: '/assessments/$assessmentId',
            params: { assessmentId: assessment.id }
          })
        }
        placeholder="Non ci sono ancora valutazioni"
        className="px-0.5 py-0"
      />
    </>
  )
}
