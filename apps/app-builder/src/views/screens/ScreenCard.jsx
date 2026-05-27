import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Text } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import { IconMenuList, MenuItem } from '@m-next/menu';
import Container from '@m-next/container';
import Dialog from '@m-next/dialog';
import { DebouncedInput } from '@m-next/input';
import Button from '@m-next/button';
import { formatDuration, intervalToDuration } from 'date-fns';
import { useTheme } from '@mui/material';
import * as s from './Screen.styles';
import ListTemplate from './components/ListTemplate';
import AddTemplate from './components/AddTemplate';
import ViewTemplate from './components/ViewTemplate';

const propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  appId: PropTypes.string,
  type: PropTypes.string,
  targetVersion: PropTypes.string,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      versionId: PropTypes.string,
      versionState: PropTypes.string,
      lastModifiedDate: PropTypes.string,
    }),
  ),
  startScreen: PropTypes.bool,
};

const getVersion = (versions, targetVersion) => {
  if (versions && versions.length > 0) {
    let match = versions.filter((x) => x.versionState === 'TEST');
    if (match.length > 0) {
      return match[0];
    }

    match = versions.filter((x) => x.versionId === targetVersion);
    return match[0];
  }
};

function ScreenCard({ name, id, appId, type, versions, startScreen, targetVersion }) {
  const { content } = useTheme();
  const [showRename, setShowRename] = useState(false);
  const [screenName, setScreenName] = useState(name);

  const getVerionId = () => getVersion(versions, targetVersion).versionId;
  const getVersionState = () => getVersion(versions, targetVersion).versionState;

  const duration = useMemo(() => {
    const interval = intervalToDuration({
      start: new Date(getVersion(versions, targetVersion).lastModifiedDate),
      end: new Date(),
    });
    let format = ['hours'];
    if (interval.minutes === 0) return 'less than a minute ago';
    if (interval.hours === 0) format = ['minutes'];
    if (interval.days > 0) format = ['days'];
    if (interval.months > 0) format = ['months'];
    if (interval.years > 0) format = ['years'];
    const durationFormatted = formatDuration(interval, {
      format,
    });

    if (interval.months > 0 || interval.years > 0) return `over ${durationFormatted} ago`;
    return `${durationFormatted} ago`;
  }, [targetVersion, versions]);

  const handleNameChange = (e) => {
    setScreenName(e);
  };

  const handleSave = () => {};
  return (
    <Container
      id={`screen-card-${name}`}
      borderless
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 268,
        border: `2px solid ${content.border}`,
        borderRadius: 6,
        padding: '8px 16px 16px 16px',
      }}
    >
      <s.ScreenCardHeader>
        <SvgIcon size={12} name='screens' isRound backgroundColor={colors['blue-lighter']} color={content.secondary} />
        <Header
          variant='h2'
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 185 }}
        >
          {screenName}
        </Header>
        {getVersionState() === 'TEST' && <s.DraftIndicator />}
        <s.Spacer />
        {startScreen && (
          <SvgIcon isRound>
            <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} viewBox='0 0 20 20' fill='none'>
              <path
                d='m18.12 10.276-7.5-8.333c-.316-.352-.923-.352-1.239 0l-7.5 8.333a.832.832 0 0 0 .62 1.39h1.666V17.5a.833.833 0 0 0 .833.833h2.5a.833.833 0 0 0 .834-.833v-3.333h3.333V17.5a.833.833 0 0 0 .833.833H15a.833.833 0 0 0 .834-.833v-5.833H17.5a.83.83 0 0 0 .62-1.391Z'
                fill={content.primary}
              />
            </svg>
          </SvgIcon>
        )}
      </s.ScreenCardHeader>

      <s.ScreenCardContent>
        <Link
          style={{ textDecoration: 'none', outline: 'none', color: colors['grey-dark'] }}
          to={`/${appId}/layout/${id}/${getVerionId()}`}
        >
          {type !== 'ColumnTabs' && type !== 'Form' && type !== 'List' && (
            <div style={{ height: '100%', width: '100%', background: colors['grey-light'] }} />
          )}
          {type === 'List' && <ListTemplate />}
          {type === 'ColumnTabs' && <ViewTemplate />}
          {type === 'Form' && <AddTemplate />}
        </Link>
      </s.ScreenCardContent>
      <s.ScreenCardFooter>
        <SvgIcon size={12} name='calendar-rounded-corners-V4' color={content.primary} />
        <Text>Updated: {duration}</Text>
        <s.Spacer />

        {false && (
          <IconMenuList
            id={id}
            marginVertical={12}
            icon='navigation-show-more'
            iconBorder={false}
            horizontalAlign='right'
            relativeToParent
          >
            <MenuItem onClick={() => setShowRename(true)}>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Archive</MenuItem>
          </IconMenuList>
        )}
      </s.ScreenCardFooter>
      {showRename && (
        <Dialog title='Rename screen' isOpen={showRename} onClose={() => setShowRename(false)}>
          <s.DialogContent>
            <s.DialogInnerContent>
              <DebouncedInput
                id='rename'
                isV4Design
                label='Name'
                hideCaption={false}
                compactStyle
                value={screenName}
                onChange={handleNameChange}
                required
              />
            </s.DialogInnerContent>
            <s.DialogFooter>
              <Button id='rename-cancel' value='Cancel' buttonStyle='ghost' onClick={() => setShowRename(false)} />
              <Button id='rename-save' value='Save' disabled={screenName !== name} onClick={handleSave} />
            </s.DialogFooter>
          </s.DialogContent>
        </Dialog>
      )}
    </Container>
  );
}

ScreenCard.propTypes = propTypes;
export default ScreenCard;
