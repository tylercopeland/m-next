import React from 'react';
import PropTypes from 'prop-types';
import { widgets } from '@m-next/types';
import FieldBlockDesignerWrapper from '../component-wrappers/fieldBlockDesignerWrapper';

import SectionLayout from './sectionLayout';
import ChartDesignerWrapper from '../component-wrappers/chartDesignerWrapper';
import DropdownDesignerWrapper from '../component-wrappers/dropdownDesignerWrapper';
import GridDesignerWrapper from '../component-wrappers/gridDesignerWrapper';
import DesignerComponentWrapper from '../component-wrappers/designerComponentWrapper';
import GalleryDesignWrapper from '../component-wrappers/gallery/galleryDesignerWrapper';
import CheckboxDesignerWrapper from '../component-wrappers/checkboxDesignerWrapper';
import ToggleDesignerWrapper from '../component-wrappers/toggleDesignerWrapper';
import ButtonWrapper from '../component-wrappers/buttonWrapper';
import RecurrenceDesignerWrapper from '../component-wrappers/recurrenceDesignerWrapper';
import TagWidgetDesignerWrapper from '../component-wrappers/tagWidgetDesignerWrapper';
import MapDesignerWrapper from '../component-wrappers/mapDesignerWrapper';
import HtmlEditorDesignerWrapper from '../component-wrappers/htmlEditorDesignerWrapper';
import AddressLookupDesignerWrapper from '../component-wrappers/addressLookupDesignerWrapper';
import AttachmentsDesignerWrapper from '../component-wrappers/attachmentDesignerWrapper';
import SignatureDesignerWrapper from '../component-wrappers/signatureDesignerWrapper';
import DateTimePickerDesignerWrapper from '../component-wrappers/dateTimePickerDesignerWrapper';
import ButtonGroupWrapper from '../component-wrappers/buttonGroupWrapper';
import InputWrapper from '../component-wrappers/InputWrapper';
import TextDesignerWrapper from '../component-wrappers/textDesignerWrapper';
import ImageDesignerWrapper from '../component-wrappers/imageDesignerWrapper';
import RadioGroupWrapper from '../component-wrappers/radioGroupWrapper';
import { CalendarWrapperRedux as CalendarDesignerWrapper } from '@m-next/layout-canvas';

const propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object), PropTypes.instanceOf(Array)]),
  legacyClass: PropTypes.string,
  singleColumnDisplay: PropTypes.bool,
  useSingleColumnDisplay: PropTypes.bool,
  canvasWidth: PropTypes.number,
  onControlClick: PropTypes.func,
};

function ColumnLayout({
  canvasWidth,
  content,
  legacyClass,
  legacyDataHeight,
  legacyDataWidth,
  singleColumnDisplay,
  useSingleColumnDisplay,
  onControlClick,
}) {
  const renderCell = (item, idx) => {
    const type = item.typeOverride || item.type;

    if (item.type === widgets.LAYOUT_SECTION || item.type === widgets.SECTION) {
      return (
        <SectionLayout
          key={idx}
          id={item.id}
          content={item.content}
          legacyClass={item.legacyClass}
          legacyChildClass={item.legacyChildClass}
          legacyDataWidth={item.legacyDataWidth}
          singleColumnDisplay={singleColumnDisplay}
          useSingleColumnDisplay={useSingleColumnDisplay}
          canvasWidth={canvasWidth}
          onControlClick={onControlClick}
        />
      );
    }
    switch (type) {
      case widgets.FIELD_BLOCK:
        return (
          <DesignerComponentWrapper key={item.id} id={item.id} onControlClick={onControlClick} width={canvasWidth - 10}>
            <FieldBlockDesignerWrapper id={item.id} />
          </DesignerComponentWrapper>
        );
      case widgets.CHART:
        return (
          <ChartDesignerWrapper
            key={item.id}
            id={item.id}
            onControlClick={onControlClick}
            containerWidth={canvasWidth - 10}
          />
        );
      case widgets.DATATABLE:
        return (
          <DesignerComponentWrapper
            key={item.id}
            id={item.id}
            onControlClick={onControlClick}
            width={canvasWidth}
            ignoreProperties
          >
            <GridDesignerWrapper id={item.id} />
          </DesignerComponentWrapper>
        );
      case widgets.CHECKBOX:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width='fit-content'
              ignoreProperties
            >
              <CheckboxDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.TOGGLE:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width='fit-content'
              ignoreProperties
            >
              <ToggleDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.DROPDOWN:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width='auto'
              ignoreProperties
            >
              <DropdownDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.BUTTON:
        return  (
          <DesignerComponentWrapper key={item.id} id={item.id} onControlClick={onControlClick} ignoreProperties>
            <ButtonWrapper key={item.id} item={item} id={item.id} onControlClick={onControlClick} />
          </DesignerComponentWrapper>
        ) ;
      case widgets.BUTTONGROUP:
        return  (
          <DesignerComponentWrapper key={item.id} id={item.id} onControlClick={onControlClick} ignoreProperties>
            <ButtonGroupWrapper key={item.id} id={item.id} onControlClick={onControlClick} />
          </DesignerComponentWrapper>
        )
      case widgets.RECURRENCE:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width='auto'
              ignoreProperties
            >
              <RecurrenceDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.GALLERY:
        return (
          <DesignerComponentWrapper
            key={item.id}
            id={item.id}
            onControlClick={onControlClick}
            width={canvasWidth}
            ignoreProperties
          >
            <GalleryDesignWrapper id={item.id} onControlClick={onControlClick} />
          </DesignerComponentWrapper>
        );
      case widgets.TAGLIST:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width={canvasWidth}
              ignoreProperties
            >
              <TagWidgetDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.MAP:
        return (
          <DesignerComponentWrapper
            key={item.id}
            id={item.id}
            onControlClick={onControlClick}
            width={canvasWidth}
            ignoreProperties
            display='inline-block'
          >
            <MapDesignerWrapper id={item.id} />
          </DesignerComponentWrapper>
        );
      case widgets.HTMLEDITOR:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width={canvasWidth}
              ignoreProperties
            >
              <HtmlEditorDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.ADDRESSLOOKUP:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width={canvasWidth}
              ignoreProperties
            >
              <AddressLookupDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.DOCUMENTSWIDGET:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width={canvasWidth}
              ignoreProperties
            >
              <AttachmentsDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.DATETIMEPICKER:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width='auto'
              ignoreProperties
            >
              <DateTimePickerDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.SIGNATURE:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width={canvasWidth}
              ignoreProperties
            >
              <SignatureDesignerWrapper id={item.id} onControlClick={onControlClick}/>
            </DesignerComponentWrapper>
          )

      case widgets.TEXTBOX:
      case widgets.TEXTAREA:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              ignoreProperties
              width='auto'
            >
              <InputWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.LABEL:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              ignoreProperties
              width='auto'
              display='block'
            >
              <TextDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.PICTURE:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              ignoreProperties
              width='auto'
            >
              <ImageDesignerWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.RADIOBOX:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width='auto'
              ignoreProperties
              verticalAlign='top'
            >
              <RadioGroupWrapper id={item.id} />
            </DesignerComponentWrapper>
          );
      case widgets.CALENDAR:
          return (
            <DesignerComponentWrapper
              key={item.id}
              id={item.id}
              onControlClick={onControlClick}
              width={canvasWidth}
              ignoreProperties
              verticalAlign='top'
            >
              <CalendarDesignerWrapper id={item.id} canvasWidth={canvasWidth - 12} />
            </DesignerComponentWrapper>
          );
      default:
        return <span key={item.id}>{/* {type} */}</span>;
    }
  };

  const render = () => {
    let columnStyle = {
      width: legacyDataWidth || null,
      height: legacyDataHeight || null,
      display: 'table-cell',
      verticalAlign: 'top',
      alignContent: 'flex-start',
    };

    if (singleColumnDisplay && useSingleColumnDisplay) {
      columnStyle = {
        width: '100%',
        display: 'block',
      };
    }

    if (legacyClass.includes('mi-cell-padding-top')) {
      columnStyle.paddingTop = '1em !important';
    }
    if (legacyClass.includes('mi-cell-padding-right')) {
      columnStyle.paddingRight = '1em !important';
    }
    if (legacyClass.includes('mi-cell-padding-bottom')) {
      columnStyle.paddingBottom = '1em !important';
    }
    if (legacyClass.includes('mi-cell-padding-left')) {
      columnStyle.paddingLeft = '1em !important';
    }

    if (legacyClass.includes('mi-cell-padding-top-2x')) {
      columnStyle.paddingTop = '2em !important';
    }
    if (legacyClass.includes('mi-cell-padding-right-2x')) {
      columnStyle.paddingRight = '2em !important';
    }
    if (legacyClass.includes('mi-cell-padding-bottom-2x')) {
      columnStyle.paddingBottom = '2em !important';
    }
    if (legacyClass.includes('mi-cell-padding-left-2x')) {
      columnStyle.paddingLeft = '2em !important';
    }

    if (legacyClass.includes('mi-cell-padding-regular')) {
      columnStyle.paddingTop = '0 !important';
    }
    if (legacyClass.includes('mi-cell-padding-regular')) {
      columnStyle.paddingRight = '0 !important';
    }
    if (legacyClass.includes('mi-cell-padding-regular')) {
      columnStyle.paddingBottom = '0 !important';
    }
    if (legacyClass.includes('mi-cell-padding-regular')) {
      columnStyle.paddingLeft = '0 !important';
    }

    if (legacyClass.includes('cell-center')) {
      columnStyle.verticalAlign = 'middle';
    }
    if (legacyClass.includes('cell-bottom')) {
      columnStyle.verticalAlign = 'bottom';
    }
    if (legacyClass.includes('cell-top')) {
      columnStyle.verticalAlign = 'top';
    }

    if (
      legacyClass.includes('cell-center') ||
      legacyClass.includes('cell-bottom-center') ||
      legacyClass.includes('cell-top-center')
    ) {
      columnStyle.justifyContent = 'center';
      columnStyle.textAlign = 'center';
    }
    if (
      legacyClass.includes('cell-pull-left') ||
      legacyClass.includes('cell-bottom-pull-left') ||
      legacyClass.includes('cell-top-pull-left')
    ) {
      columnStyle.justifyContent = 'flex-start';
      columnStyle.textAlign = 'left';
    }
    if (
      legacyClass.includes('cell-pull-right') ||
      legacyClass.includes('cell-bottom-pull-right') ||
      legacyClass.includes('cell-top-pull-right')
    ) {
      columnStyle.justifyContent = 'flex-end';
      columnStyle.textAlign = 'right';
    }

    return (
      <div className={legacyClass} style={columnStyle} canvas_width={canvasWidth} layout_type='column'>
        {content.map(renderCell)}
      </div>
    );
  };

  return render();
}

ColumnLayout.propTypes = propTypes;

export default ColumnLayout;
