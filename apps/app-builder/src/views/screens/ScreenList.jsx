import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '@m-next/button';
import Container from '@m-next/container';
import { Header } from '@m-next/typeography';
import { Tooltip } from 'react-tooltip';
import ScreenCard from './ScreenCard';
import { useGetAppScreensQuery } from '../../common/services/managementApi';
import { useGetAppQuery } from '../../common/services/appsApi';
import { selectAccountName } from '../../common/services/sessionSlice';
import { appLoaded, appStates, selectDefaultScreen, selectStatus } from '../../common/services/appSlice';
import * as s from './Screen.styles';

const propTypes = {};

function ScreenList() {
  const { appId } = useParams();
  const accountName = useSelector(selectAccountName);
  const startScreenId = useSelector(selectDefaultScreen);
  const appStatus = useSelector(selectStatus);
  const dispatch = useDispatch();

  const { data: app } = useGetAppQuery({ accountName, appId }, { skip: appStatus === appStates.uninitialized });

  const { data: screens } = useGetAppScreensQuery({ appId }, { skip: appStatus === appStates.uninitialized });

  useEffect(() => {
    if (app) {
      dispatch(appLoaded(app));
    }
  }, [app, dispatch]);

  return (
    <Container
      id='screen-list'
      style={{
        display: 'flex',
        margin: 16,
      }}
      isRound={false}
      borderless
      scrollable
    >
      <s.HeaderWrapper>
        <Header>Screens</Header>
        {false && <Button id='add-screen' icon={{ size: 16, name: 'plus' }} value='New' />}
      </s.HeaderWrapper>
      <Container
        id='screen-list-other'
        style={{
          flexDirection: 'row',
          display: 'flex',
          gap: '16px',
          backgroundColor: 'transparent',
          flexWrap: 'wrap',
          padding: 0,
          marginTop: 16,
        }}
        isRound={false}
        borderless
      >
        {screens &&
          screens.map((screen) => (
            <ScreenCard
              name={screen.name}
              id={screen.id}
              key={screen.id}
              type={screen.screenTemplate}
              appId={appId}
              versions={screen.versions}
              startScreen={screen.id === startScreenId}
            />
          ))}

        <Tooltip id='screen-tooltip' />
      </Container>
    </Container>
  );
}

ScreenList.propTypes = propTypes;
export default ScreenList;
