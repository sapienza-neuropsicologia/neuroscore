import { rankItem } from '@tanstack/match-sorter-utils'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type HeaderContext,
  type Table as ReactTable,
  type SortingState,
  type TableMeta,
  useReactTable
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { cn } from '../utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  globalFilter,
  meta
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  globalFilter?: boolean
  meta?: TableMeta<TData>
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  return useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    globalFilterFn: globalFilter ? 'fuzzy' : undefined,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    },
    meta
  })
}

export function DataTable<TData>({
  table,
  onClick,
  caption,
  placeholder,
  className
}: {
  table: ReactTable<TData>
  onClick?: (row: TData) => void
  caption?: ReactNode
  placeholder?: string
  className?: string
}) {
  return (
    <Table containerClassName="h-full">
      {caption && <TableCaption> {caption}</TableCaption>}
      <TableHeader className="sticky top-0 z-20 bg-card">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className={className}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={
                onClick
                  ? (e) => {
                      e.preventDefault()
                      onClick(row.original)
                    }
                  : undefined
              }
              className={
                onClick
                  ? 'cursor-pointer hover:bg-muted/50 transition-colors select-none'
                  : ''
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={className}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
            >
              {placeholder}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export function columnHeader<TData, TValue>(
  title: string,
  className: string = ''
) {
  return ({ column }: HeaderContext<TData, TValue>) => {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>
    }

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          <span>{title}</span>
          {column.getIsSorted() === 'desc' ? (
            <ArrowDown />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      </div>
    )
  }
}

export function TableFilter<TData>({
  table,
  field,
  className,
  placeholder
}: {
  table: ReactTable<TData>
  field: string
  className?: string
  placeholder?: string
}) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(field)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(field)?.setFilterValue(event.target.value)
      }
      className={cn('max-w-sm', className)}
    />
  )
}
