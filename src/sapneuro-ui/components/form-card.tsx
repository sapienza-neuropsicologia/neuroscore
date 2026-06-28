import type {
  AppFieldExtendedReactFormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn
} from '@tanstack/react-form'
import type { PropsWithChildren } from 'react'
import type { FieldComponents, FormComponents } from './form-components'
import type { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card'
import { Field } from './ui/field'

type ButtonVariant = Parameters<typeof Button>[0]['variant']

export function CardForm<
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
  title,
  description,
  children,
  submit,
  reset,
  submitVariant,
  resetVariant = 'outline'
}: PropsWithChildren<{
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
  dialog?: boolean
  title?: string
  description?: string
  submit?: string
  reset?: string
  submitVariant?: ButtonVariant
  resetVariant?: ButtonVariant
}>) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await formApi.handleSubmit()
      }}
      onReset={(e) => {
        e.preventDefault()
        formApi.reset()
      }}
    >
      <formApi.AppForm>
        <Card className="w-full">
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{children}</CardContent>
          <CardFooter>
            <Field orientation="horizontal" className="justify-end">
              {reset && (
                <formApi.ResetButton label={reset} variant={resetVariant} />
              )}
              {submit && (
                <formApi.SubmitButton label={submit} variant={submitVariant} />
              )}
            </Field>
          </CardFooter>
        </Card>
      </formApi.AppForm>
    </form>
  )
}
