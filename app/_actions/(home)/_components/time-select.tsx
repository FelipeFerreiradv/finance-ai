'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

const MONTHLY_OPTION = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const month = searchParams.get('month');
  const handleMonthChange = (month: string) => {
    push(`/dashboard?month=${month}`);
  };
  return (
    <>
      <Select
        onValueChange={(value) => handleMonthChange(value)}
        defaultValue={month ?? ''}
      >
        <SelectTrigger className="w-[180px] max-lg:w-[130px]">
          <SelectValue placeholder="Months" />
        </SelectTrigger>
        <SelectContent>
          {MONTHLY_OPTION.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default TimeSelect;
