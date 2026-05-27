/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  mapToWidgetType,
  getControlTypeCode,
  getControlClass,
  getDefaultCaption,
  typeCodeToWidgetType,
  shouldRenderItem,
} from './widgetTypeMapping';
import { WIDGETS } from '@m-next/runtime-interface';

describe('widgetTypeMapping', () => {
  describe('mapToWidgetType', () => {
    it('maps uppercase type codes to WidgetType', () => {
      expect(mapToWidgetType('BTN')).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('TXT')).toBe(WIDGETS.TEXTBOX);
      expect(mapToWidgetType('LBL')).toBe(WIDGETS.LABEL);
      expect(mapToWidgetType('DRP')).toBe(WIDGETS.DROPDOWN);
      expect(mapToWidgetType('CHK')).toBe(WIDGETS.CHECKBOX);
      expect(mapToWidgetType('HTML')).toBe(WIDGETS.HTMLEDITOR);
      expect(mapToWidgetType('SEC')).toBe(WIDGETS.SECTION);
      expect(mapToWidgetType('GRD')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('CHT')).toBe(WIDGETS.CHART);
      expect(mapToWidgetType('RAD')).toBe(WIDGETS.RADIOBOX);
      expect(mapToWidgetType('DTP')).toBe(WIDGETS.DATETIMEPICKER);
      expect(mapToWidgetType('IMG')).toBe(WIDGETS.PICTURE);
      expect(mapToWidgetType('BGR')).toBe(WIDGETS.BUTTONGROUP);
      expect(mapToWidgetType('F-BLOCK')).toBe(WIDGETS.FIELD_BLOCK);
      expect(mapToWidgetType('TGL')).toBe(WIDGETS.TOGGLE);
      expect(mapToWidgetType('TAG')).toBe(WIDGETS.TAGLIST);
      expect(mapToWidgetType('DOC')).toBe(WIDGETS.DOCUMENTSWIDGET);
      expect(mapToWidgetType('SIG')).toBe(WIDGETS.SIGNATURE);
      expect(mapToWidgetType('REC')).toBe(WIDGETS.RECURRENCE);
      expect(mapToWidgetType('MAP')).toBe(WIDGETS.MAP);
      expect(mapToWidgetType('GAL')).toBe(WIDGETS.GALLERY);
      expect(mapToWidgetType('ADR')).toBe(WIDGETS.ADDRESSLOOKUP);
      expect(mapToWidgetType('TXA')).toBe(WIDGETS.TEXTAREA);
      expect(mapToWidgetType('CAL')).toBe(WIDGETS.CALENDAR);
      expect(mapToWidgetType('APR')).toBe(WIDGETS.APPRIBBON);
      expect(mapToWidgetType('BGI')).toBe(WIDGETS.BUTTONGROUPITEM);
      expect(mapToWidgetType('EDT')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('L-CON')).toBe(WIDGETS.LAYOUT_CONTAINER);
    });

    it('maps lowercase type codes to WidgetType', () => {
      expect(mapToWidgetType('btn')).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('txt')).toBe(WIDGETS.TEXTBOX);
      expect(mapToWidgetType('lbl')).toBe(WIDGETS.LABEL);
      expect(mapToWidgetType('sec')).toBe(WIDGETS.SECTION);
      expect(mapToWidgetType('drp')).toBe(WIDGETS.DROPDOWN);
      expect(mapToWidgetType('chk')).toBe(WIDGETS.CHECKBOX);
      expect(mapToWidgetType('grd')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('edt')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('cht')).toBe(WIDGETS.CHART);
      expect(mapToWidgetType('cal')).toBe(WIDGETS.CALENDAR);
      expect(mapToWidgetType('doc')).toBe(WIDGETS.DOCUMENTSWIDGET);
      expect(mapToWidgetType('l-con')).toBe(WIDGETS.LAYOUT_CONTAINER);
    });

    it('maps camelCase string names to WidgetType', () => {
      expect(mapToWidgetType('button')).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('textbox')).toBe(WIDGETS.TEXTBOX);
      expect(mapToWidgetType('label')).toBe(WIDGETS.LABEL);
      expect(mapToWidgetType('dropdown')).toBe(WIDGETS.DROPDOWN);
      expect(mapToWidgetType('checkbox')).toBe(WIDGETS.CHECKBOX);
      expect(mapToWidgetType('textarea')).toBe(WIDGETS.TEXTAREA);
      expect(mapToWidgetType('grid')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('section')).toBe(WIDGETS.SECTION);
      expect(mapToWidgetType('chart')).toBe(WIDGETS.CHART);
      expect(mapToWidgetType('calendar')).toBe(WIDGETS.CALENDAR);
      expect(mapToWidgetType('toggle')).toBe(WIDGETS.TOGGLE);
      expect(mapToWidgetType('dateTimePicker')).toBe(WIDGETS.DATETIMEPICKER);
      expect(mapToWidgetType('datetimepicker')).toBe(WIDGETS.DATETIMEPICKER);
      expect(mapToWidgetType('htmlEditor')).toBe(WIDGETS.HTMLEDITOR);
      expect(mapToWidgetType('htmleditor')).toBe(WIDGETS.HTMLEDITOR);
      expect(mapToWidgetType('addressLookup')).toBe(WIDGETS.ADDRESSLOOKUP);
      expect(mapToWidgetType('addresslookup')).toBe(WIDGETS.ADDRESSLOOKUP);
      expect(mapToWidgetType('radioButton')).toBe(WIDGETS.RADIOBOX);
      expect(mapToWidgetType('radiobutton')).toBe(WIDGETS.RADIOBOX);
      expect(mapToWidgetType('tagList')).toBe(WIDGETS.TAGLIST);
      expect(mapToWidgetType('taglist')).toBe(WIDGETS.TAGLIST);
      expect(mapToWidgetType('buttonGroup')).toBe(WIDGETS.BUTTONGROUP);
      expect(mapToWidgetType('buttongroup')).toBe(WIDGETS.BUTTONGROUP);
      expect(mapToWidgetType('fieldBlock')).toBe(WIDGETS.FIELD_BLOCK);
      expect(mapToWidgetType('fieldblock')).toBe(WIDGETS.FIELD_BLOCK);
      expect(mapToWidgetType('layoutContainer')).toBe(WIDGETS.LAYOUT_CONTAINER);
    });

    it('maps component palette display names to WidgetType', () => {
      expect(mapToWidgetType('Text input')).toBe(WIDGETS.TEXTBOX);
      expect(mapToWidgetType('Text area')).toBe(WIDGETS.TEXTAREA);
      expect(mapToWidgetType('Button')).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('Dropdown')).toBe(WIDGETS.DROPDOWN);
      expect(mapToWidgetType('Checkbox')).toBe(WIDGETS.CHECKBOX);
      expect(mapToWidgetType('Toggle')).toBe(WIDGETS.TOGGLE);
      expect(mapToWidgetType('Date time picker')).toBe(WIDGETS.DATETIMEPICKER);
      expect(mapToWidgetType('Label')).toBe(WIDGETS.LABEL);
      expect(mapToWidgetType('HTML editor')).toBe(WIDGETS.HTMLEDITOR);
      expect(mapToWidgetType('Tag list')).toBe(WIDGETS.TAGLIST);
      expect(mapToWidgetType('Signature')).toBe(WIDGETS.SIGNATURE);
      expect(mapToWidgetType('Image')).toBe(WIDGETS.PICTURE);
      expect(mapToWidgetType('Attachments')).toBe(WIDGETS.DOCUMENTSWIDGET);
      expect(mapToWidgetType('Radio group')).toBe(WIDGETS.RADIOBOX);
      expect(mapToWidgetType('Section')).toBe(WIDGETS.SECTION);
      expect(mapToWidgetType('Chart')).toBe(WIDGETS.CHART);
      expect(mapToWidgetType('Editable grid')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('Gallery')).toBe(WIDGETS.GALLERY);
      expect(mapToWidgetType('Address lookup')).toBe(WIDGETS.ADDRESSLOOKUP);
      expect(mapToWidgetType('Button menu')).toBe(WIDGETS.BUTTONGROUP);
      expect(mapToWidgetType('Field block')).toBe(WIDGETS.FIELD_BLOCK);
      expect(mapToWidgetType('App ribbon')).toBe(WIDGETS.APPRIBBON);
      expect(mapToWidgetType('Calendar')).toBe(WIDGETS.CALENDAR);
      expect(mapToWidgetType('Recurrence')).toBe(WIDGETS.RECURRENCE);
    });

    it('maps numeric string codes to WidgetType', () => {
      expect(mapToWidgetType('1')).toBe(WIDGETS.TEXTBOX);
      expect(mapToWidgetType('2')).toBe(WIDGETS.LABEL);
      expect(mapToWidgetType('3')).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('4')).toBe(WIDGETS.DROPDOWN);
      expect(mapToWidgetType('5')).toBe(WIDGETS.CHECKBOX);
      expect(mapToWidgetType('6')).toBe(WIDGETS.TEXTAREA);
      expect(mapToWidgetType('7')).toBe(WIDGETS.DATATABLE);
      expect(mapToWidgetType('8')).toBe(WIDGETS.SECTION);
      expect(mapToWidgetType('9')).toBe(WIDGETS.SECTION);
      expect(mapToWidgetType('10')).toBe(WIDGETS.CHART);
      expect(mapToWidgetType('11')).toBe(WIDGETS.CALENDAR);
      expect(mapToWidgetType('12')).toBe(WIDGETS.LAYOUT_CONTAINER);
    });

    it('respects typeOverride from control object', () => {
      const control = { typeOverride: 'HTM' };
      expect(mapToWidgetType('TXT', control)).toBe(WIDGETS.HTMLEDITOR);
    });

    it('uses base type when control has no typeOverride', () => {
      const control = {};
      expect(mapToWidgetType('BTN', control)).toBe(WIDGETS.BUTTON);
    });

    it('defaults to BUTTON for unrecognized types', () => {
      expect(mapToWidgetType('UNKNOWN')).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('foobar')).toBe(WIDGETS.BUTTON);
    });

    it('defaults to BUTTON for undefined/null type', () => {
      expect(mapToWidgetType(undefined)).toBe(WIDGETS.BUTTON);
      expect(mapToWidgetType('')).toBe(WIDGETS.BUTTON);
    });
  });

  describe('getControlTypeCode', () => {
    it('maps WidgetType to backend type code', () => {
      expect(getControlTypeCode(WIDGETS.BUTTON)).toBe('BTN');
      expect(getControlTypeCode(WIDGETS.TEXTBOX)).toBe('TXT');
      expect(getControlTypeCode(WIDGETS.LABEL)).toBe('LBL');
      expect(getControlTypeCode(WIDGETS.DROPDOWN)).toBe('DRP');
      expect(getControlTypeCode(WIDGETS.CHECKBOX)).toBe('CHK');
      expect(getControlTypeCode(WIDGETS.HTMLEDITOR)).toBe('HTM');
      expect(getControlTypeCode(WIDGETS.SECTION)).toBe('SEC');
      expect(getControlTypeCode(WIDGETS.DATATABLE)).toBe('EDT');
      expect(getControlTypeCode(WIDGETS.CHART)).toBe('CHT');
      expect(getControlTypeCode(WIDGETS.RADIOBOX)).toBe('RAD');
      expect(getControlTypeCode(WIDGETS.DATETIMEPICKER)).toBe('DTP');
      expect(getControlTypeCode(WIDGETS.PICTURE)).toBe('PIC');
      expect(getControlTypeCode(WIDGETS.BUTTONGROUP)).toBe('BGR');
      expect(getControlTypeCode(WIDGETS.FIELD_BLOCK)).toBe('F-BLOCK');
      expect(getControlTypeCode(WIDGETS.TOGGLE)).toBe('TGL');
      expect(getControlTypeCode(WIDGETS.TAGLIST)).toBe('TAG');
      expect(getControlTypeCode(WIDGETS.DOCUMENTSWIDGET)).toBe('DOC');
      expect(getControlTypeCode(WIDGETS.SIGNATURE)).toBe('SIG');
      expect(getControlTypeCode(WIDGETS.RECURRENCE)).toBe('REC');
      expect(getControlTypeCode(WIDGETS.MAP)).toBe('MAP');
      expect(getControlTypeCode(WIDGETS.GALLERY)).toBe('GAL');
      expect(getControlTypeCode(WIDGETS.ADDRESSLOOKUP)).toBe('ADR');
      expect(getControlTypeCode(WIDGETS.TEXTAREA)).toBe('TXA');
      expect(getControlTypeCode(WIDGETS.CALENDAR)).toBe('CAL');
      expect(getControlTypeCode(WIDGETS.APPRIBBON)).toBe('APR');
      expect(getControlTypeCode(WIDGETS.BUTTONGROUPITEM)).toBe('BGI');
      expect(getControlTypeCode(WIDGETS.LAYOUT_CONTAINER)).toBe('L-CON');
    });

    it('defaults to BTN for unknown widget types', () => {
      expect(getControlTypeCode('UNKNOWN' as any)).toBe('BTN');
    });
  });

  describe('getControlClass', () => {
    it('maps WidgetType to CSS class name', () => {
      expect(getControlClass(WIDGETS.BUTTON)).toBe('mi-button');
      expect(getControlClass(WIDGETS.TEXTBOX)).toBe('mi-input');
      expect(getControlClass(WIDGETS.LABEL)).toBe('mi-label');
      expect(getControlClass(WIDGETS.DROPDOWN)).toBe('mi-dropdown');
      expect(getControlClass(WIDGETS.DATATABLE)).toBe('mi-datatable');
      expect(getControlClass(WIDGETS.LAYOUT_CONTAINER)).toBe('mi-layout-container');
    });

    it('defaults to mi-button for unknown widget types', () => {
      expect(getControlClass('UNKNOWN' as any)).toBe('mi-button');
    });
  });

  describe('getDefaultCaption', () => {
    it('maps WidgetType to display name', () => {
      expect(getDefaultCaption(WIDGETS.BUTTON)).toBe('Button');
      expect(getDefaultCaption(WIDGETS.TEXTBOX)).toBe('Text input');
      expect(getDefaultCaption(WIDGETS.LABEL)).toBe('Label');
      expect(getDefaultCaption(WIDGETS.DROPDOWN)).toBe('Dropdown');
      expect(getDefaultCaption(WIDGETS.DATATABLE)).toBe('Editable grid');
      expect(getDefaultCaption(WIDGETS.LAYOUT_CONTAINER)).toBe('Container');
      expect(getDefaultCaption(WIDGETS.CALENDAR)).toBe('Calendar');
    });

    it('defaults to Button for unknown widget types', () => {
      expect(getDefaultCaption('UNKNOWN' as any)).toBe('Button');
    });
  });

  describe('typeCodeToWidgetType', () => {
    it('maps backend type codes back to WidgetType', () => {
      expect(typeCodeToWidgetType('BTN')).toBe(WIDGETS.BUTTON);
      expect(typeCodeToWidgetType('TXT')).toBe(WIDGETS.TEXTBOX);
      expect(typeCodeToWidgetType('LBL')).toBe(WIDGETS.LABEL);
      expect(typeCodeToWidgetType('EDT')).toBe(WIDGETS.DATATABLE);
      expect(typeCodeToWidgetType('DTP')).toBe(WIDGETS.DATETIMEPICKER);
      expect(typeCodeToWidgetType('L-CON')).toBe(WIDGETS.LAYOUT_CONTAINER);
    });

    it('returns the input as WidgetType for unrecognized codes', () => {
      expect(typeCodeToWidgetType('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('shouldRenderItem', () => {
    it('returns true for renderable types', () => {
      expect(shouldRenderItem('BTN')).toBe(true);
      expect(shouldRenderItem('TXT')).toBe(true);
      expect(shouldRenderItem('LBL')).toBe(true);
      expect(shouldRenderItem('L-CON')).toBe(true);
    });

    it('returns false for SECTION type', () => {
      expect(shouldRenderItem('SEC')).toBe(false);
      expect(shouldRenderItem('section')).toBe(false);
    });

    it('returns false for BUTTONGROUPITEM type', () => {
      expect(shouldRenderItem('BGI')).toBe(false);
    });

    it('respects typeOverride from control', () => {
      const control = { typeOverride: 'SEC' };
      expect(shouldRenderItem('BTN', control)).toBe(false);
    });
  });
});
