'use client'

import React from 'react'
import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format'

import { Input } from './ui/input'

export interface CurrencyInputProps
  extends Omit<NumericFormatProps, 'onValueChange'> {
  onValueChange?: (value: number) => void
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      thousandSeparator = '.',
      decimalSeparator = ',',
      decimalScale = 2,
      fixedDecimalScale = true,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    return (
      <NumericFormat
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        customInput={Input}
        getInputRef={ref}
        onValueChange={(values: NumberFormatValues) => {
          if (onValueChange) {
            onValueChange(Number(values.floatValue))
          }
        }}
        {...props}
      />
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'
