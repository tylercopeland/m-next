import * as React from "react";
import { Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import SvgIcon, { type SvgIconName } from '@m-next/svg-icon';

import { colors } from '@m-next/styles';

// Import the types from our types file
import type { TextControl } from '@m-next/runtime-interface';
import type { RootState } from '../../../types/screenLayoutTypes';
import { selectControls } from '../../../common/services/screenLayoutSlice';

import { getValueFromComplexValue } from '../../../components/complex-value/complex-value-utils';
import { combineTextStyleClasses, mapTextSizeToPixels } from '../utils/textStyleUtils';


const Text = React.lazy(() => import('@m-next/text'));
/**
 * TextDesignerWrapper
 * Wrapper component for Text control in AppBuilder.
 * Provides a design-time representation of the Text component.
 *
 * @component
 * @param {object} props
 * @param {string} props.id - The control ID.
 * @returns {JSX.Element}
 */



function LabelLink(props: {
    mappedId: string, // MappedId for id
    value: string, // Value for text
    className?: string,
    href?: string, // Optional href for link
    target?: string, // Optional target for link
  }) 
{
  const { className, mappedId, value, ...otherProps } = props;

  const tabbableProps = {
    role: value ? 'link' : null,
    tabIndex: value ? 0 : -1,
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
      role="link"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: value ? value.toString() : '' }}
      {...otherProps}
    />
  );
}


function stripHtml(html: string): string {
  // Create a new div element
  const tempDivElement = document.createElement('div');
  let innerHtmlVal = '';
  // Set the HTML content with the providen
  tempDivElement.innerHTML = html;
  if (tempDivElement.childElementCount > 0) {
    for (let i = 0; i < tempDivElement.childElementCount; i++) {
      const element = tempDivElement.children[i];
      innerHtmlVal = `${innerHtmlVal} ${element?.innerHTML.trim() || ''}`;
    }
  }
  // Retrieve the text property of the element (cross-browser support)
  return innerHtmlVal || tempDivElement.textContent || tempDivElement.innerText || '';
}

  
const formatLink = (linkVal : string, hrefFormat : string, mappedId: string, isDisabled: boolean) => {
  const { userAgent } = window.navigator;
  const isNative = false;
  let handle = linkVal;
  let url = '#';

  switch (hrefFormat) {
    case 'Email':
      url =
        isNative && !userAgent.includes('MethodApp') && !userAgent.includes('Crosswalk')
          ? `javascript:window.postMessage('mailto:${linkVal}')`
          : `mailto:${linkVal}`;
      break;
    case 'WebAddress':
      url = linkVal ? (linkVal.trim().split(' ')[0] || '') : '';
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
        const parts = handle.split('.com/');
        handle = parts[1] || '';
      }
      url = `http://twitter.com/${handle || ''}`;
      break;
    case 'LinkedIn':
      if (handle !== null && handle.indexOf('/in/') > -1) {
        const parts = handle.split('/in/');
        handle = parts[1] || '';
      }
      url = `http://www.linkedin.com/in/${handle || ''}`;
      break;
    case 'FaceBook':
      if (handle !== null && handle.indexOf('.com/') > -1) {
        const parts = handle.split('.com/');
        handle = parts[1] || '';
      }
      url = `http://www.facebook.com/${handle || ''}`;
      break;
    case 'Skype':
      if (handle !== null && handle.indexOf('skype:') > -1) {
        const parts = handle.split('skype:');
        handle = parts[1] || '';
      }
      url = `skype:${handle || ''}?call`;
      break;
    default:
      url = '#';
  }
  
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
};

function TextDesignerWrapper({ id }: { id: string }) {
  // Get control data from Redux store
  // Using the RootState type from our declaration file
  const control = useSelector((state: RootState) => 
    selectControls(state)?.[id]
  ) as TextControl | undefined;
  const controlList = useSelector(selectControls);
  
  // Determine if the control is disabled based on defaultState
  const isDisabled = useMemo(() => control?.defaultState === 'Disabled', [control?.defaultState]);
  
  // Determine the content to display, prioritizing defaultValue if it exists
  const displayContent = useMemo(() => {
    if (!control) return '&nbsp;';
    // If there's a defaultValue that's a complex value object
    const newValue = getValueFromComplexValue(control.defaultValue, controlList);

    // Add newline processing to match runtime behavior
    if (newValue && typeof newValue === 'string') {
      return newValue.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }

    // Ensure we always return a string (null and "" should both resolve to "")
    return newValue ?? '&nbsp;';
  }, [control, controlList]);

  // Combine existing classes with translated style properties
  const combinedClasses = useMemo(() => {
    if (!control) return '';
    return combineTextStyleClasses(control.classes || '', {
      textAlignment: control.styles?.textAlignment,
      fontWeight: control.styles?.fontWeight,
      fontColor: control.styles?.fontColor,
    });
  }, [control]);

  // Early return if control doesn't exist - after all hooks
  if (!control) {
    return (
      <div style={{
        width: '100%', 
        boxSizing: 'border-box',
        padding: '8px',
        border: '1px dashed #ccc',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        color: '#666',
        textAlign: 'center',
        fontSize: '12px'
      }}>
        Text Control (ID: {id}) - Control not found
      </div>
    );
  }

  return (
    <div style={{width: '100%', boxSizing: 'border-box'}}>
      <Suspense fallback={<div style={{ height: 40, background: "#eee" }}>Loading Text Panel...</div>}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          opacity: isDisabled ? 0.5 : 1,
          pointerEvents: isDisabled ? 'none' : 'auto'
        }}>
          <Text
            id={id}
            as={control.displayTag || 'div'}
            fontColor={control.styles?.fontColor ? undefined : (control.color ? colors[control.color] || control.color : undefined)}
            fontWeight={control.styles?.fontWeight ? undefined : (control.classes && control.classes.includes('bold') ? 'bold' : 'normal')}
            fontSize={mapTextSizeToPixels(control.styles?.fontSize)}
            lineHeight={control.lineHeight}
            wordBreak={control.wordBreak}
            whiteSpace={control.whiteSpace}
            overflow={control.overflow}
            center={control.center}
            mt={control.marginTop}
            mb={control.marginBottom}
            ml={control.marginLeft}
            mr={control.marginRight}
            iconAlign={control.icon ? control.iconAlign : undefined}
            inlineStyling={{ float: 'none', width: '100%' }}
            style={{
              ...control.style,
              pointerEvents: isDisabled ? 'none' : 'auto',
            }}
            className={`mi-label ${combinedClasses}
                        ${
                          (control.onClick || control.hrefFormat) && (isDisabled)
                            ? 'mi-label-inProgress'
                            : ''
                        } ${control.widthType === 'full' ? 'mi-control-width-full' : ''}`}
          >
          {control.icon && control.iconAlign !== 'Right' && (
            <div style={{ display: 'inline-block', alignItems: 'center', marginRight: '8px' }}>
              <SvgIcon 
                name={(control.icon ?? 'setup') as SvgIconName} 
                size={16} 
                color={control.styles?.fontColor ? undefined : (control.color ? colors[control.color] || control.color : colors.darkGrey)}
              />
            </div>
          )}
          {control.hrefFormat ? formatLink(displayContent, control.hrefFormat, id, control.disabled) : (
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: displayContent || '&nbsp;' }} />
          )}
          {control.icon && control.iconAlign === 'Right' && (
            <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '8px' }}>
              <SvgIcon 
                name={(control.icon ?? 'setup') as SvgIconName} 
                size={16} 
                color={control.styles?.fontColor ? undefined : (control.color ? colors[control.color] || control.color : colors.darkGrey)}
              />
            </div>
          )}
          </Text>
        </div>
      </Suspense>
    </div>
  );
}

export default TextDesignerWrapper;
