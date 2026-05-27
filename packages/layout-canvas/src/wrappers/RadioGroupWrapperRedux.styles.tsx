import styled from '@emotion/styled';

export const RadioGroupContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  overflow: visible;
  display: flex;
  flex-direction: column;

  /* Target direct child (Suspense wrapper) */
  & > div {
    width: 100%;
    height: auto;
  }

  /* Target the RadioGroupWrapper div */
  & div[role='radiogroup'] {
    max-width: 100%;
    height: auto;
  }

  /* Target the RadioGroupInnerWrapper */
  & div[role='radiogroup'] > div {
    max-width: 100%;
    height: auto;
    width: 100%;
  }

  /* Vertical mode: truncate text with ellipsis */
  &[data-orientation='vertical'] label {
    max-width: 100%;
  }

  &[data-orientation='vertical'] label > span:not(.radio-btn-indicator):not(.radio-btn-indicator-container *) {
    display: inline-block;
    max-width: calc(100% - 30px); /* Account for radio button indicator width */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  /* Horizontal mode: allow natural width, no truncation */
  &[data-orientation='horizontal'] label {
    max-width: none;
    flex-shrink: 0;
  }

  &[data-orientation='horizontal'] label > span:not(.radio-btn-indicator):not(.radio-btn-indicator-container *) {
    display: inline-block;
    white-space: nowrap;
    overflow: visible;
    vertical-align: middle;
  }
`;
