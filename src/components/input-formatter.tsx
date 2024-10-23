import React, { cloneElement, forwardRef, ReactElement, useState } from 'react'

interface InputFormatterProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maskFunction: (value: string) => string
  inputComponent: ReactElement
}

export const InputFormatter = forwardRef<HTMLInputElement, InputFormatterProps>(
  ({ maskFunction, inputComponent, onChange, ...props }, ref) => {
    const [value, setValue] = useState<string>('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      const maskedValue = maskFunction(rawValue)
      setValue(maskedValue)
      if (onChange) {
        onChange({ ...event, target: { ...event.target, value: maskedValue } })
      }
    }

    const clonedInput = cloneElement(inputComponent, {
      ...props,
      ref,
      value,
      onChange: handleChange,
    })

    return clonedInput
  },
)

InputFormatter.displayName = 'InputFormatter'
