import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SyncWidgetStatus } from './syncWidgetConstants';
import {
  SyncWidgetAdditionalInfoPopup,
  SyncWidgetAdditionalInfoShowMoreButton,
  SyncWidgetAdditionalInfoTitle,
  SyncWidgetChevron,
  SyncWidgetContainer,
  SyncWidgetContainerWrapper,
  SyncWidgetText,
} from './syncWidget.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  status: PropTypes.oneOf(Object.keys(SyncWidgetStatus).map(Number)).isRequired,
  message: PropTypes.string,
  fnSyncWidgetInteractionAnalytics: PropTypes.func,
  popupWidth: PropTypes.number,
  popupMaxWidth: PropTypes.string,
};

/**
 * SyncWidget — status pill with optional expandable details popup for sync
 * state messaging. Shows a colored badge with icon + label and, when a
 * message is provided, a chevron toggle that reveals a popup with the
 * full message (truncated to a preview, with a "View more" toggle).
 *
 * Refs are forwarded to the outer wrapper element.
 */
const SyncWidget = forwardRef(function SyncWidget(props, ref) {
  const {
    id: idProp,
    status,
    message,
    fnSyncWidgetInteractionAnalytics,
    popupWidth,
    popupMaxWidth,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-sync-widget-${++autoIdCounter}`;
  }
  const id = idProp || internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'sync-widget-forwardRef-prop',
      '@m-next/sync-widget: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const { text, color, icon, title } = SyncWidgetStatus[status] || {};
  const [isChevronCollapsed, setChevronCollapsed] = useState(false);
  const [isMessageExpanded, setMessageExpanded] = useState(false);
  const popupRef = useRef(null);
  const containerRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ top: 4 });

  // Chain modern ref + legacy forwardRef prop onto the rendered root element.
  const internalElRef = useRef(null);
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(internalElRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = internalElRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const setRef = (node) => {
    internalElRef.current = node;
  };

  // MAX_TRUNCATE_LENGTH is set to 1000 characters for the message
  // To ensure that the message is not too long for the popup
  const MAX_TRUNCATE_LENGTH = 1000;

  // message should be truncated if it exceeds the character limit
  const truncatedMessageContent =
    message?.length > MAX_TRUNCATE_LENGTH ? `${message.substring(0, MAX_TRUNCATE_LENGTH)}...` : message;

  const toggleMessage = () => {
    setPopupPosition({ top: 4 });
    setMessageExpanded(!isMessageExpanded);
  };

  // PREVIEW_LENGTH is set to 100 characters for the message
  const PREVIEW_LENGTH = 200;
  const showLessMessage =
    truncatedMessageContent?.length > PREVIEW_LENGTH
      ? `${truncatedMessageContent.substring(0, PREVIEW_LENGTH)}...`
      : truncatedMessageContent;

  // Function to update popup position
  const updatePopupPosition = useCallback(() => {
    const popup = popupRef.current;
    const container = containerRef.current;

    if (popup && container) {
      const popupRect = popup.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const isOverflowing = popupRect.bottom > window.innerHeight;

      // Adjust position based on overflow
      setPopupPosition({
        top: isOverflowing ? -(containerRect.height + popupRect.height + 4) : 4,
      });
    }
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      setChevronCollapsed(false); // Close the popup
    }
  }, []);

  useEffect(() => {
    if (isChevronCollapsed) {
      // Update popup position and add event listener for outside clicks
      updatePopupPosition();
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // Cleanup event listener and reset popup position
      document.removeEventListener('mousedown', handleClickOutside);
      setPopupPosition({ top: 4 });
    };
  }, [isMessageExpanded, isChevronCollapsed, updatePopupPosition, handleClickOutside]);

  return (
    <SyncWidgetContainerWrapper
      id={id}
      ref={setRef}
      className={`sync-widget ${text?.toLowerCase()}`}
      data-tooltip-id={message}
      {...rest}
    >
      <SyncWidgetContainer backgroundColor={color} ref={containerRef}>
        <span>{icon()}</span>
        <SyncWidgetText>{text}</SyncWidgetText>
        {message && (
          <SyncWidgetChevron
            className={isChevronCollapsed ? 'mi-icon-chevron-up' : 'mi-icon-chevron-down'}
            role='button'
            tabIndex={0}
            onClick={() => {
              setChevronCollapsed(!isChevronCollapsed);
              if (!isChevronCollapsed) {
                fnSyncWidgetInteractionAnalytics &&
                  fnSyncWidgetInteractionAnalytics('Clicked', {
                    buttonCaption: text,
                    buttonIcon: 'mi-icon-chevron',
                    controlType: 'Button',
                  });
              }
            }}
            aria-label={isChevronCollapsed ? 'Hide sync details' : 'Show sync details'}
          />
        )}
      </SyncWidgetContainer>
      {isChevronCollapsed && message ? (
        <SyncWidgetAdditionalInfoPopup
          ref={popupRef}
          topPosition={popupPosition.top}
          popupWidth={popupWidth}
          popupMaxWidth={popupMaxWidth}
        >
          {title && <SyncWidgetAdditionalInfoTitle>{title}</SyncWidgetAdditionalInfoTitle>}
          <div>
            <div dangerouslySetInnerHTML={{ __html: isMessageExpanded ? truncatedMessageContent : showLessMessage }} />
            {truncatedMessageContent?.length > PREVIEW_LENGTH && (
              <SyncWidgetAdditionalInfoShowMoreButton onClick={toggleMessage}>
                {isMessageExpanded ? 'View less' : 'View more'}
              </SyncWidgetAdditionalInfoShowMoreButton>
            )}
          </div>
        </SyncWidgetAdditionalInfoPopup>
      ) : null}
    </SyncWidgetContainerWrapper>
  );
});

SyncWidget.displayName = 'SyncWidget';
SyncWidget.propTypes = propTypes;

export default SyncWidget;
