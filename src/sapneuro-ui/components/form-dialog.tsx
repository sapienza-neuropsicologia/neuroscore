import type {
  AppFieldExtendedReactFormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn
} from '@tanstack/react-form'
import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import type { FieldComponents, FormComponents } from './form-components'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'

export type DialogFormProps = {
  title: string
  description?: string
  submit: string
  cancel?: string
  reset?: string
  className?: string
}

export function DialogFormComponent<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta
>({
  form: formApi,
  item,
  setItem,
  title,
  description,
  submit,
  cancel,
  reset,
  className,
  children
}: PropsWithChildren<
  DialogFormProps & {
    form: AppFieldExtendedReactFormApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta,
      FieldComponents,
      FormComponents
    >
    item?: TFormData
    setItem: Dispatch<SetStateAction<TFormData | undefined>>
  }
>) {
  useEffect(() => {
    formApi.reset(item)
  }, [item, formApi])

  const openCallback = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) setItem(undefined)
    },
    [setItem]
  )

  return (
    <Dialog open={item !== undefined} onOpenChange={openCallback}>
      <formApi.AppForm>
        <DialogContent className={className}>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              await formApi.handleSubmit()
              formApi.reset()
              setItem(undefined)
            }}
            onReset={(e) => {
              e.preventDefault()
              e.stopPropagation()
              formApi.reset()
            }}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <div className="no-scrollbar max-h-[50vh] overflow-y-auto my-4">
              {children}
            </div>
            <DialogFooter>
              {cancel && (
                <DialogClose asChild>
                  <Button variant="outline">{cancel}</Button>
                </DialogClose>
              )}
              {reset && <formApi.ResetButton label={reset} variant="outline" />}
              <formApi.SubmitButton label={submit} />
            </DialogFooter>
          </form>
        </DialogContent>
      </formApi.AppForm>
    </Dialog>
  )
}

export function useDialogForm<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta
>(
  form: AppFieldExtendedReactFormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta,
    FieldComponents,
    FormComponents
  >
) {
  const [item, setItem] = useState<TFormData>()

  const openDialog = useCallback((item?: TFormData) => {
    setItem(item ?? ({} as TFormData))
  }, [])

  const DialogForm = useCallback(
    (props: PropsWithChildren<DialogFormProps>) => {
      return (
        <DialogFormComponent
          form={form}
          item={item}
          setItem={setItem}
          {...props}
        />
      )
    },
    [form, item]
  )

  return { DialogForm, openDialog }
}
