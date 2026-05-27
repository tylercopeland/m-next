import React, { useMemo } from 'react';
import { Text } from '@m-next/typeography';
import { ButtonGroupDataItem, ButtonGroupRow } from '@m-next/button-group';
import { BaseControl } from '@m-next/runtime-interface';
import { CurrentState } from '@m-next/types';
import * as s from '../../BlockEditor.styles';
import {
  selectIsV4Screen,
  selectControlResponsiveData,
  selectResolution,
  updateControlResponsiveData,
  RootState,
} from '../../../../../../common/services/screenLayoutSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getHiddenState, getDisabledState } from '@m-next/layout-canvas/src/utils/currentStateHelper';

const LoadState = {
  REGULAR: 1,
  HIDDEN: 2,
  DISABLED: 3,
} as const;

type LoadStateValue = (typeof LoadState)[keyof typeof LoadState];

interface DefaultStateSelectorProps<T extends BaseControl = BaseControl> {
  control: T;
  onChange: (updatedControl: T) => void;
  forceClassic?: boolean;
}

const DefaultStateSelector = <T extends BaseControl = BaseControl>({ control, onChange, forceClassic = false }: DefaultStateSelectorProps<T>) => {
  
  const dispatch = useDispatch();
  const isV4Screen = useSelector(selectIsV4Screen);
  const resolution = useSelector(selectResolution);
  
  // When forceClassic is true, always use classic (non-V4) behavior
  const effectiveV4 = isV4Screen && !forceClassic;
  
  // Only get responsive data for V4 screens when not forcing classic
  const responsiveData = useSelector((state: RootState) =>
    effectiveV4 ? selectControlResponsiveData(state, control.id) : null
  );

  const loadState: LoadStateValue = useMemo(() => {
    if (effectiveV4) {
      // For V4 screens (not forced classic), use the derived state function
      const isHidden = getHiddenState(control, responsiveData, resolution, 'designer');
      const isDisabled = getDisabledState(control, responsiveData, resolution, 'designer');
      if (isHidden) return LoadState.HIDDEN;
      if (isDisabled) return LoadState.DISABLED;
      return LoadState.REGULAR;
    } else {
      // For non-V4 screens or when forceClassic is true, use control values directly
      if (!control.visible) return LoadState.HIDDEN;
      if (control.disabled) return LoadState.DISABLED;
      return LoadState.REGULAR;
    }
  }, [control, responsiveData, resolution, effectiveV4]);

  const handleLoadStateChange = (item: ButtonGroupDataItem): void => {
    if (effectiveV4) {
      // For V4 screens (not forced classic), update the responsive data
      let currentState = CurrentState.REGULAR;
      if (item.value === LoadState.HIDDEN) {
        currentState = CurrentState.HIDDEN;
      } else if (item.value === LoadState.DISABLED) {
        currentState = CurrentState.DISABLED;
      }

      dispatch(updateControlResponsiveData({
        controlId: control.id,
        resolution,
        currentState,
      }));

      // Also update the control via onChange so the parent detects the change
      // This allows the Apply button to track the modification
      const updated = {
        ...control,
        visible: item.value !== LoadState.HIDDEN,
        disabled: item.value === LoadState.DISABLED,
      } as T;
      onChange(updated);
    } else {
      // For non-V4 screens or when forceClassic is true, update the control directly
      const updated = {
        ...control,
        visible: item.value !== LoadState.HIDDEN,
        disabled: item.value === LoadState.DISABLED,
      } as T;
      onChange(updated);
    }
  };

  const buttonData: ButtonGroupDataItem[] = [
    { value: LoadState.REGULAR, label: 'Regular' },
    { value: LoadState.HIDDEN, label: 'Hidden' },
    { value: LoadState.DISABLED, label: 'Disabled' },
  ];

  return (
    <s.LineWrapper>
      <Text
        tooltip='Sets the initial state of the component on page load.'
        tooltipId='editor-tooltip'
        tooltipHighlighting
      >
        Default state
      </Text>
      <ButtonGroupRow
        id='display-state'
        selected={loadState}
        data={buttonData}
        width={184}
        onClick={handleLoadStateChange}
      />
    </s.LineWrapper>
  );
};

export default DefaultStateSelector;
