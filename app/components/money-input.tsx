import React, { forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from '@/app/components/ui/input';

type CustomNumericFormatProps = NumericFormatProps<
  React.ComponentProps<typeof Input>
>;

export const MoneyInput = forwardRef<
  HTMLInputElement,
  CustomNumericFormatProps
>((props, ref) => {
  return (
    <NumericFormat
      {...props}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$"
      allowNegative={false}
      customInput={Input}
      getInputRef={ref}
    />
  );
});

MoneyInput.displayName = 'MoneyInput';
