import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Select } from '../common/Select';

interface PeriodSelectorProps {
  monthsBack: number;
  onChange: (months: number) => void;
}

export const PeriodSelector = ({ monthsBack, onChange }: PeriodSelectorProps) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      onChange(value);
    }
  }, [onChange]);

  return (
    <Select
      label="Periode"
      options={[
        { value: '3', label: '3 Bulan' },
        { value: '6', label: '6 Bulan' },
        { value: '12', label: '12 Bulan' },
      ]}
      value={String(monthsBack)}
      onChange={handleChange}
    />
  );
};
