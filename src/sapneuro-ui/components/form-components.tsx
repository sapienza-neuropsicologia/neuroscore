import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Checkbox } from './ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from './ui/field'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

const {
  fieldContext,
  useFieldContext: useFieldContextOrig,
  formContext,
  useFormContext: useFormContextOrig
} = createFormHookContexts()
export const useFieldContext = useFieldContextOrig
export const useFormContext = useFormContextOrig

export type InputFieldProps = {
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
}

const InputField = <T extends string | number>({
  label,
  placeholder,
  description,
  required = false,
  type,
  getValue
}: InputFieldProps & {
  type: T extends string ? 'string' : 'number'
  getValue: (target: HTMLInputElement) => T
}) => {
  const field = useFieldContext<T>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type={type === 'number' ? 'number' : 'text'}
        required={required}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(getValue(e.target))}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

const TextField = (props: InputFieldProps) => (
  <InputField type="string" getValue={(e) => e.value} {...props} />
)

const NumberField = (props: InputFieldProps) => (
  <InputField type="number" getValue={(e) => e.valueAsNumber} {...props} />
)

export type RadioGroupProps = {
  label?: string
  description?: string
  options: {
    label?: string
    value: string
    title?: string
    description?: string
  }[]
  required?: boolean
}

export const RadioGroupFieldset = ({
  label,
  description,
  options,
  required
}: RadioGroupProps) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet className="w-full max-w-xs">
      {label && <FieldLegend variant="label">{label}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        required={required}
      >
        {options.map(({ label, value, title, description }) => {
          const id = `${field.name}${value}`
          return title || description ? (
            <FieldLabel key={value} htmlFor={id} className="font-normal">
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                  {title && <FieldTitle>{title}</FieldTitle>}
                  {description && (
                    <FieldDescription>{description}</FieldDescription>
                  )}
                </FieldContent>
                <RadioGroupItem
                  value={value}
                  id={id}
                  aria-invalid={isInvalid}
                />
              </Field>
            </FieldLabel>
          ) : (
            <Field
              key={value}
              orientation="horizontal"
              data-invalid={isInvalid}
            >
              <RadioGroupItem value={value} id={id} aria-invalid={isInvalid} />
              {label && <FieldTitle>{label}</FieldTitle>}
            </Field>
          )
        })}
      </RadioGroup>
    </FieldSet>
  )
}

const CheckboxField = ({ label }: { label: string }) => {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        aria-invalid={isInvalid}
      />
      <FieldLabel htmlFor={field.name} className="font-normal">
        {label}
      </FieldLabel>
    </Field>
  )
}

const DateField = ({
  label,
  placeholder,
  description,
  required = false
}: InputFieldProps) => {
  const field = useFieldContext<Date>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const [open, setOpen] = useState(false)

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={field.name}
            className="justify-start font-normal"
          >
            {field.state.value
              ? field.state.value.toLocaleDateString()
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            defaultMonth={field.state.value}
            captionLayout="dropdown"
            onSelect={(localDate?: Date) => {
              if (localDate) {
                const year = localDate.getFullYear()
                const month = localDate.getMonth()
                const day = localDate.getDate()
                const utcDate = new Date(Date.UTC(year, month, day))
                field.handleChange(utcDate)
              }
              setOpen(false)
            }}
            required={required}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

type ButtonVariant = Parameters<typeof Button>[0]['variant']

const ResetButton = ({
  label,
  variant
}: {
  label: string
  variant?: ButtonVariant
}) => {
  const form = useFormContext()
  return (
    <Button
      type="reset"
      variant={variant}
      onClick={(event) => {
        event.preventDefault()
        form.reset()
      }}
    >
      {label}
    </Button>
  )
}

const SubmitButton = ({
  label,
  variant
}: {
  label: string
  variant?: ButtonVariant
}) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state}>
      {(state) => {
        return (
          <Button
            type="submit"
            variant={variant}
            disabled={
              state.isPristine || !state.canSubmit || state.isSubmitting
            }
          >
            {label}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}

const fieldComponents = {
  TextField,
  NumberField,
  DateField,
  RadioGroup: RadioGroupFieldset,
  Checkbox: CheckboxField
}

const formComponents = {
  SubmitButton,
  ResetButton
}

export type FieldComponents = typeof fieldComponents
export type FormComponents = typeof formComponents

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents,
  formComponents,
  fieldContext,
  formContext
})
