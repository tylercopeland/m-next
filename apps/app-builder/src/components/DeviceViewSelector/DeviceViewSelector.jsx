import React from 'react';
import { Tooltip } from 'react-tooltip';
import SvgIcon from '@m-next/svg-icon';
import { Z_POPUP } from '@m-next/layout-canvas';
import * as s from './DeviceViewSelector.styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectResolution, setResolution } from '../../common/services/screenLayoutSlice';

const DEVICE_TYPES = [
  {
    id: 'desktop',
    name: 'Desktop',
    viewport: '1200 px',
    icon: <SvgIcon name='device-desktop' size={18} />,
  },
  {
    id: 'tablet',
    name: 'Tablet',
    viewport: '768 px',
    icon: <SvgIcon name='device-tablet' size={18} />,
  },
  {
    id: 'mobile',
    name: 'Mobile',
    viewport: '375 px',
    icon: <SvgIcon name='device-mobile' size={18} />,
  },
];

function DeviceViewSelector() {
  const dispatch = useDispatch();
  const resolution = useSelector(selectResolution);

  const handleDeviceClick = (deviceId) => {
    dispatch(setResolution(deviceId));
  };

  return (
    <>
      <s.Container>
        {DEVICE_TYPES.map((device) => (
          <s.DeviceButtonWrapper key={device.id}>
            <s.DeviceButton
              selected={resolution === device.id}
              onClick={() => handleDeviceClick(device.id)}
              aria-label={`Switch to ${device.name} view`}
              role='button'
              tabIndex={0}
              data-tooltip-id='device-selector-tooltip'
              data-tooltip-content={`${device.name} view (${device.viewport})`}
              data-tooltip-place='bottom'
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDeviceClick(device.id);
                }
              }}
            >
              <s.IconWrapper selected={resolution === device.id}>{device.icon}</s.IconWrapper>
            </s.DeviceButton>
          </s.DeviceButtonWrapper>
        ))}
      </s.Container>
      <Tooltip
        id='device-selector-tooltip'
        style={{
          backgroundColor: '#0F1B31',
          color: '#FFFFFF',
          fontSize: '12px',
          fontFamily: 'Source Sans Pro, sans-serif',
          fontWeight: 600,
          lineHeight: '16px',
          padding: '4px 8px',
          borderRadius: '2px',
          zIndex: Z_POPUP.POPOVER,
        }}
      />
    </>
  );
}

DeviceViewSelector.propTypes = {};
DeviceViewSelector.defaultProps = {};
export default DeviceViewSelector;
