/**
 * Link formatting utilities for TextWrapper
 */

import React from 'react';
import { stripHtml } from './utils';

interface LabelLinkProps {
  mappedId: string;
  value: string;
  className?: string;
  href?: string;
  target?: string;
}

export function LabelLink({ className, mappedId, value, ...otherProps }: LabelLinkProps) {
  const tabbableProps = {
    // tabIndex -1: the parent container in TextWrapperRedux handles Tab focus
    // and keyboard navigation, so the inner anchor should not be independently tabbable.
    // This prevents the browser from scrolling the anchor into view on focus,
    // which was hiding the icon in small labels.
    tabIndex: -1,
  };

  return (
    <a
      className={className}
      id={`${mappedId}-Label-Link`}
      {...tabbableProps}
      style={{
        outline: 'none',
        width: 'auto',
        lineHeight: 'inherit',
        wordBreak: 'break-word',
      }}
      role='link'
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: value ? value.toString() : '' }}
      {...otherProps}
    />
  );
}

interface FormatLinkParams {
  linkVal: string;
  hrefFormat: string;
  mappedId: string;
  isDisabled: boolean;
}

export function formatLink({ linkVal, hrefFormat, mappedId, isDisabled }: FormatLinkParams): React.ReactElement {
  const { userAgent } = window.navigator;
  const isNative = false;
  let handle = linkVal;
  let url = '#';

  // Determine URL based on hrefFormat
  switch (hrefFormat) {
    case 'Email':
      url =
        isNative && !userAgent.includes('MethodApp') && !userAgent.includes('Crosswalk')
          ? `javascript:window.postMessage('mailto:${linkVal}')`
          : `mailto:${linkVal}`;
      break;
    case 'WebAddress':
      url = linkVal ? linkVal.trim().split(' ')[0] || '' : '';
      url = url && url.indexOf('http') >= 0 ? url : `http://${url}`;
      break;
    case 'Telephone':
      url = linkVal !== '' && linkVal !== null ? linkVal.replace(/\D/g, '') : '';
      url =
        isNative && !userAgent.includes('MethodApp') && !userAgent.includes('Crosswalk')
          ? `javascript:window.postMessage('tel:${url}')`
          : `tel:${url}`;
      break;
    case 'GoogleMaps':
      if (linkVal && linkVal.trim().length) {
        let address = stripHtml(linkVal);
        const asHtml = stripHtml(linkVal).replace(/[.,]/gi, '');
        if (asHtml.length > 0) {
          address = '';
          for (let i = 0; i < asHtml.length; i++) {
            address += asHtml[i];
          }
          address = address.trim();
        }
        url = `http://maps.google.com/?q=${address.replace(/\n|\s+/gi, ' ')}`;
      }
      break;
    case 'Twitter':
      if (handle !== null && handle.indexOf('.com/') > -1) {
        const splitResult = handle.split('.com/');
        handle = splitResult[1] || handle;
      }
      url = `http://twitter.com/${handle}`;
      break;
    case 'LinkedIn':
      if (handle !== null && handle.indexOf('/in/') > -1) {
        const splitResult = handle.split('/in/');
        handle = splitResult[1] || handle;
      }
      url = `http://www.linkedin.com/in/${handle}`;
      break;
    case 'FaceBook':
      if (handle !== null && handle.indexOf('.com/') > -1) {
        const splitResult = handle.split('.com/');
        handle = splitResult[1] || handle;
      }
      url = `http://www.facebook.com/${handle}`;
      break;
    case 'Skype':
      if (handle !== null && handle.indexOf('skype:') > -1) {
        const splitResult = handle.split('skype:');
        handle = splitResult[1] || handle;
      }
      url = `skype:${handle}?call`;
      break;
    default:
      url = '#';
  }

  // Return appropriate Link component based on hrefFormat
  switch (hrefFormat) {
    case null:
    case undefined:
    case '':
      return <LabelLink mappedId={mappedId} value={linkVal} className='portal-branding-text-label-link' />;
    case 'Email':
    case 'Telephone':
    case 'Skype':
      return <LabelLink mappedId={mappedId} href={!isDisabled ? url : '#'} value={linkVal} />;
    default:
      if (isNative) {
        return (
          <LabelLink
            mappedId={mappedId}
            href={!isDisabled ? `javascript:window.open('${url}')` : '#'}
            value={linkVal}
          />
        );
      }
      return <LabelLink mappedId={mappedId} href={!isDisabled ? url : '#'} target='_blank' value={linkVal} />;
  }
}
