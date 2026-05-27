import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '@m-next/button';
import { Text } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { useTheme } from '@mui/material';
import { IconMenuList, MenuItem } from '@m-next/menu';
import { Tooltip } from 'react-tooltip';

import * as s from './SubHeader.styles';
import { useGetAppScreensQuery } from '../../common/services/managementApi';

const propTypes = {
  resolution: PropTypes.string,
  onResolutionChange: PropTypes.func,
};

function SubHeader({ resolution, onResolutionChange }) {
  const { appId, screenId } = useParams();
  const { content } = useTheme();
  const [open, setOpen] = useState(false);

  const { data: screens } = useGetAppScreensQuery({ appId });

  const selectedScreen = useMemo(() => {
    if (screens) {
      const matches = screens.filter((x) => x.id === screenId);
      return matches[0].name;
    }
    return null;
  }, [screenId, screens]);

  const getVersion = (screen) => {
    if (screen.versions && screen.versions.length > 0) {
      let match = screen.versions.filter((x) => x.versionState === 'TEST');
      if (match.length > 0) {
        return match[0];
      }

      match = screen.versions.filter((x) => x.versionId === screen.targetVersion);
      return match[0];
    }
  };

  const getVerionId = (screen) => getVersion(screen).versionId;
  const getVersionState = (screen) => getVersion(screen).versionState;

  return (
    <s.Wrapper>
      <Tooltip id='sub-header-tooltip' />
      <s.ScreenSelectWrapper>
        <Link
          style={{ textDecoration: 'none', outline: 'none', color: content.primary, cursor: 'pointer' }}
          to={`/${appId}/screens`}
        >
          <SvgIcon
            size={16}
            name='screens'
            tooltip='View all'
            tooltipId='sub-header-tooltip'
            color='#98A8B4'
            hoverColor={content.primary}
          />
        </Link>
        <s.Divider />
        <Text style={{ margin: '0px 8px' }} onClick={() =>setOpen(!open)} bold>
          {selectedScreen}
        </Text>
        <IconMenuList id='sceen-list' relativeToParent open={open} onToggle={setOpen}>
          {screens &&
            screens.map((screen) => (
              <Link
                to={`/${appId}/layout/${screen.id}/${getVerionId(screen)}`}
                key={screen.id}
                style={{ textDecoration: 'none', outline: 'none' }}
              >
                <MenuItem
                  id={screen.id}
                  key={screen.id}
                  selected={screen.id === screenId}
                  onClick={() => setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
                >
                  {screen.name}
                  {getVersionState(screen) === 'TEST' && <s.DraftIndicator />}
                </MenuItem>
              </Link>
            ))}
        </IconMenuList>
      </s.ScreenSelectWrapper>
      <s.Spacer>
        <s.ResolutionWrapper>
          <SvgIcon size={26} onClick={() => onResolutionChange('desktop')}>
            <svg xmlns='http://www.w3.org/2000/svg' width={27} height={26} viewBox='0 0 27 26' fill='none'>
              <path
                d='M21.158 3.295H6.061A3.235 3.235 0 0 0 2.826 6.53v8.627a3.235 3.235 0 0 0 3.235 3.235h6.47v2.157H8.218a1.078 1.078 0 1 0 0 2.156h10.784a1.078 1.078 0 1 0 0-2.156h-4.314v-2.157h6.47a3.235 3.235 0 0 0 3.235-3.235V6.53a3.235 3.235 0 0 0-3.235-3.235Zm1.079 11.862a1.078 1.078 0 0 1-1.079 1.078H6.061a1.078 1.078 0 0 1-1.078-1.078V6.53A1.078 1.078 0 0 1 6.06 5.45h15.097a1.078 1.078 0 0 1 1.079 1.079v8.627Z'
                fill={resolution === 'desktop' ? content.secondary : content.disabled}
              />
            </svg>
          </SvgIcon>
          <SvgIcon size={26} onClick={() => onResolutionChange('tablet')}>
            <svg xmlns='http://www.w3.org/2000/svg' width={26} height={26} viewBox='0 0 26 26' fill='none'>
              <path
                d='M10.83 15.087a1.044 1.044 0 0 0 0 2.087h4.174a1.043 1.043 0 1 0 0-2.087H10.83ZM5.612 4.651a3.13 3.13 0 0 0-3.13 3.131v10.436a3.13 3.13 0 0 0 3.13 3.13h14.61a3.13 3.13 0 0 0 3.131-3.13V7.782a3.13 3.13 0 0 0-3.13-3.13H5.612ZM4.57 7.782A1.044 1.044 0 0 1 5.612 6.74h14.61a1.044 1.044 0 0 1 1.044 1.043v10.436a1.043 1.043 0 0 1-1.044 1.044H5.612a1.044 1.044 0 0 1-1.043-1.044V7.782Z'
                fill={resolution === 'tablet' ? content.secondary : content.disabled}
              />
            </svg>
          </SvgIcon>

          <SvgIcon size={26} onClick={() => onResolutionChange('mobile')}>
            <svg xmlns='http://www.w3.org/2000/svg' width={26} height={26} viewBox='0 0 26 26' fill='none'>
              <path
                d='M17.504 2.042H8.112A2.348 2.348 0 0 0 5.764 4.39v17.22a2.348 2.348 0 0 0 2.348 2.348h9.392a2.348 2.348 0 0 0 2.348-2.349V4.39a2.348 2.348 0 0 0-2.348-2.348ZM7.329 6.738h10.958v12.523H7.329V6.738Zm.783-3.13h9.392a.783.783 0 0 1 .783.782v.783H7.329V4.39a.783.783 0 0 1 .783-.782Zm9.392 18.784H8.112a.783.783 0 0 1-.783-.783v-.782h10.958v.782a.783.783 0 0 1-.783.783Z'
                fill={resolution === 'mobile' ? content.secondary : content.disabled}
              />
            </svg>
          </SvgIcon>
        </s.ResolutionWrapper>
      </s.Spacer>
      <Button
        id='add-component'
        buttonStyle='link'
        isV4Design
        value='Add component'
        icon={{ name: 'circle-plus', size: 16 }}
      />
    </s.Wrapper>
  );
}

SubHeader.propTypes = propTypes;

export default SubHeader;
