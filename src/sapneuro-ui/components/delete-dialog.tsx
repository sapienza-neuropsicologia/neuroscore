import { Trash2Icon } from 'lucide-react'
import {
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type SetStateAction,
  useCallback,
  useState
} from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle
} from './ui/alert-dialog'

export type DeleteDialogProps<T> = {
  title: string
  description: string
  cancel: string
  confirm: string
  isPending: boolean
  onConfirm: (item: T) => Promise<any>
  afterDelete?: () => void
}

function DeleteDialogComponent<T>({
  item,
  setItem,
  isPending,
  onConfirm,
  title,
  description,
  cancel,
  confirm,
  afterDelete
}: DeleteDialogProps<T> & {
  item?: T
  setItem: Dispatch<SetStateAction<T | undefined>>
}) {
  const handleConfirmDelete = useCallback(
    async (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()
      if (!item) return
      await onConfirm(item)
      afterDelete?.()
      setItem(undefined)
    },
    [item, setItem, onConfirm, afterDelete]
  )

  return (
    <AlertDialog
      open={item !== undefined}
      onOpenChange={(isOpen) => {
        if (!isOpen) setItem(undefined)
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            {cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirmDelete}
          >
            {confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function useConfirmDelete<T>(props: DeleteDialogProps<T>) {
  const [item, setItem] = useState<T>()

  const openDialog = useCallback((item: T) => {
    setItem(item)
  }, [])

  const DeleteDialog = () => {
    return <DeleteDialogComponent item={item} setItem={setItem} {...props} />
  }

  return { DeleteDialog, openDialog }
}
