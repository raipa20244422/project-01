import React from 'react'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'

import { Input } from './ui/input'

export interface CurrencyInputProps extends NumericFormatProps {}

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
        {...props}
      />
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'
