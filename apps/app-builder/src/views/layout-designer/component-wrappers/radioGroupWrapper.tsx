import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import type { RootState } from '../../../types/screenLayoutTypes';

const RadioGroup = React.lazy(() => import('@m-next/radio-button'));

interface RadioGroupWrapperProps {
  id: string;
}

interface ControlType {
  id: string;
  position?: string;
  layout?: string;
  radiobuttons?: string[];
  defaultValue?: string;
  caption?: string;
  hideCaption?: boolean;
  disabled?: boolean;
  widthType?: string;
  rowItemWidth?: string;
  width?: number;
  height?: number;
  checked?: boolean;
  [key: string]: unknown;
}

const RadioGroupWrapper: React.FC<RadioGroupWrapperProps> = ({ id }) => {
  const control = useSelector((state) => selectControls(state as RootState)[id]) as ControlType | undefined;
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(undefined);

  useEffect(() => {
    const defaultOption = control?.radiobuttons?.includes(control?.defaultValue ?? '')
      ? control.defaultValue
      : control?.radiobuttons?.[0];
    setSelectedValue(defaultOption);
  }, [control?.defaultValue, control?.radiobuttons]);

  if (!control) {
    return null;
  }

  const handleChange = (_e: React.ChangeEvent<HTMLInputElement>, value: string | number) => {
    setSelectedValue(value);
  };

  const isHorizontal = (control.position || control.layout)?.toLowerCase() === 'horizontal';

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Suspense fallback={<LoadingSkeleton count={1} height={40} />}>
        <RadioGroup
          id={control.id}
          name={control.id}
          selectedValue={selectedValue}
          options={control.radiobuttons?.map((item: string) => ({ label: item, value: item })) ?? []}
          caption={control.caption}
          hideCaption={control.hideCaption}
          disabled={control.disabled}
          direction={isHorizontal ? 'row' : 'column'}
          widthType={control.widthType}
          width={control.rowItemWidth}
          onChange={handleChange}
        />
      </Suspense>
    </div>
  );
};

export default RadioGroupWrapper; 