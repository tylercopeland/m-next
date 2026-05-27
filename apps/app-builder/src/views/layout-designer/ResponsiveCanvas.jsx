import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Container from '@m-next/container';
import { colors, } from '@m-next/styles';
import { TextLine } from '@m-next/typeography';
import { Grid as FluidGrid, ThemeProvider, useTheme } from '@mui/material';
import ResponsiveEntry from './components/ResponsiveEntry';
import { selectCanvasClickDisabled } from '../../common/services/screenLayoutSlice';

// types
const propTypes = {
  isLoading: PropTypes.bool,
  appRibbonType: PropTypes.number,
  layout: PropTypes.shape({
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.number,
        controlId: PropTypes.string,
        type: PropTypes.string,
      }),
    ),
  }),
  onControlClick: PropTypes.func,
  resolution: PropTypes.oneOf(['desktop', 'tablet', 'mobile']),
  containerHeight: PropTypes.number,
};

const getWidth = (resolution) => {
  if (resolution === 'tablet') {
    return 868;
  }
  if (resolution === 'mobile') {
    return 368;
  }

  return null;
};

function ResponsiveCanvas({ isLoading, layout, appRibbonType, onControlClick, resolution, containerHeight }) {
  const canvasClickDisabled = useSelector(selectCanvasClickDisabled);
  const theme = useTheme();
  const { content, background } = theme;
  
  const columns = useMemo(() => {
    if (resolution === 'tablet') return { xs: 4, sm: 8, md: 8 };
    if (resolution === 'mobile') return { xs: 4, sm: 4, md: 4 };
    return { xs: 4, sm: 8, md: 12 };
  }, [resolution]);

  const width = useMemo(() => {
    if (resolution === 'tablet') return 900;
    if (resolution === 'mobile') return 400;
    return '100%';
  }, [resolution]);

  const handleOnClick = () => {
    if (onControlClick && !canvasClickDisabled) onControlClick(null);
  };

  const renderLoading = () => (
    <Container
      id='layout-designer'
      isRound
      scrollable
      borderless
      style={{
        background: background.page,
        alignItems: 'center',
        padding: 0,
      }}
    >
      <Container id='layout-designer-inner' width={width} onClick={handleOnClick}>
        <LoadingSkeleton count={1} width='99%' height='100%' circle={false} duration={1.4} />
      </Container>
    </Container>
  );

  const renderNormal = () => (
    <Container
      id='layout-designer'
      isRound
      scrollable
      borderless
      height={containerHeight}
      style={{
        background: background.page,
        alignItems: 'center',
        padding: 0,
        height: containerHeight,
      }}
    >
      <Container id='layout-designer-inner' width={width} onClick={handleOnClick}>
        <FluidGrid container spacing={2} columns={columns}>
          {layout.entries.map((entry) => (
            <ResponsiveEntry
              key={entry.controlId}
              layout={entry}
              onControlClick={onControlClick}
              width={getWidth(resolution, entry.size)}
            />
          ))}
        </FluidGrid>
      </Container>
    </Container>
  );

  const renderNarrow = () => (
    <Container
      id='layout-designer'
      isRound
      borderless
      height={containerHeight}
      style={{
        background: background.page,
        alignItems: 'center',
        padding: 0,
        height: containerHeight,
      }}
    >
      <Container
        id='layout-designer-inner-wrapper'
        width={width}
        borderless
        style={{
          flexDirection: resolution === 'mobile' ? 'column' : 'row',
          height: resolution !== 'mobile' ? containerHeight : null,
        }}
        height={resolution !== 'mobile' ? containerHeight : null}
      >
        <Container
          id='layout-designer-inner'
          isRound
          borderless
          scrollable
          style={{
            width: 440,
            height: containerHeight - 32,
          }}
          width={440}
          height={containerHeight - 32}
        >
          <FluidGrid container spacing={2} columns={{ xs: 4, sm: 4, md: 4 }}>
            {layout.entries.map((entry) => (
              <ResponsiveEntry
                key={entry.controlId}
                layout={entry}
                onControlClick={onControlClick}
                width={getWidth(resolution, entry.size)}
              />
            ))}
          </FluidGrid>
          {resolution === 'mobile' && (
            <Container
              borderless
              style={{
                background: colors['blue-lighter'],
                width: '100%',
                height: '100%',
                border: `2px solid ${content.border}`,
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
            >
              <TextLine>Tab Panel</TextLine>
            </Container>
          )}
          <div style={{ height: 32 }} />
        </Container>
        {resolution !== 'mobile' && (
          <Container
            borderless
            style={{
              background: colors['blue-lighter'],
              width: '100%',
              height: '100%',
              border: `2px solid ${content.border}`,
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <TextLine>Tab Panel</TextLine>
          </Container>
        )}
      </Container>
    </Container>
  );
  /*
  const renderNarrow = () => (
    <Container
      id='layout-designer'
      isRound
      borderless
      style={{
        background: background.page,
        alignItems: 'center',
        padding: 0,
      }}
    >
      <FluidGrid container spacing={2} columns={columns}>
        <FluidGrid item md={4}>
          <Container
            id='layout-designer-inner'
            borderless
            width={width}
            onClick={handleOnClick}
            scrollable
            height={containerHeight}
            style={{ height: containerHeight }}
          >
            <FluidGrid container spacing={2} columns={{ xs: 4, sm: 4, md: 4 }}>
              {layout.entries.map((entry) => (
                <ResponsiveEntry
                  key={entry.controlId}
                  layout={entry}
                  onControlClick={onControlClick}
                  width={getWidth(resolution, entry.size)}
                />
              ))}
            </FluidGrid>
            <div style={{ height: 32 }} />
          </Container>
        </FluidGrid>
        <FluidGrid item md={8}>
          <Container
            borderless
            style={{
              background: colors['blue-lighter'],
              width: '100%',
              height: '100%',
              border: `2px solid ${content.border}`,
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <TextLine>Tab Panel</TextLine>
          </Container>
        </FluidGrid>
      </FluidGrid>
    </Container>
  );
*/
  return (
    <ThemeProvider theme={theme}>
      {isLoading && renderLoading()}
      {!isLoading && appRibbonType !== 2 && renderNormal()}
      {!isLoading && appRibbonType === 2 && renderNarrow()}
    </ThemeProvider>
  );
}

ResponsiveCanvas.propTypes = propTypes;
export default ResponsiveCanvas;
