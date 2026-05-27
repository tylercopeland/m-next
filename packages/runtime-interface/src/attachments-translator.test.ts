import {
  AttachmentsControlTranslator,
  translateAttachmentsControl,
  AttachmentsEventHandlers,
} from './attachments-translator';
import type { AttachmentsControl } from './controls/attachmentsControl';

// Helper to create a mock AttachmentsControl
const createMockControl = (overrides: Partial<AttachmentsControl> = {}): AttachmentsControl => ({
  id: 'test-id',
  type: 'attachments',
  hideCaption: false,
  caption: 'Test Caption',
  classes: '',
  name: 'attachments',
  widthType: 'auto',
  width: null,
  height: null,
  visible: true,
  disabled: false,
  isBound: false,
  defaultValue: null,
  enableEmailAttachment: false,
  isWorking: false,
  ...overrides,
});

describe('AttachmentsControlTranslator', () => {
  const translator = new AttachmentsControlTranslator();

  it('should map base and attachments properties correctly', () => {
    const control = createMockControl();
    const result = translator.translateControl(control);
    expect(result.widgetProps).toMatchObject({
      id: control.id,
      widthType: control.widthType,
      width: undefined,
      caption: control.caption,
      visible: true,
      disabled: false,
      enableEmailAttachment: false,
    });
    expect(result.v4Styling).toEqual({});
  });

  it('should default caption to "Attachments" if not provided and hideCaption is false', () => {
    const control = createMockControl({ caption: undefined, hideCaption: false });
    const result = translator.translateControl(control);
    expect(result.widgetProps.caption).toBe('Attachments');
  });

  it('should set visible to true by default, false if specified', () => {
    expect(translator.translateControl(createMockControl({ visible: undefined })).widgetProps.visible).toBe(true);
    expect(translator.translateControl(createMockControl({ visible: false })).widgetProps.visible).toBe(false);
  });

  it('should set disabled and enableEmailAttachment to false by default, true if specified', () => {
    expect(translator.translateControl(createMockControl({ disabled: undefined })).widgetProps.disabled).toBe(false);
    expect(translator.translateControl(createMockControl({ disabled: true })).widgetProps.disabled).toBe(true);
    expect(
      translator.translateControl(createMockControl({ enableEmailAttachment: undefined })).widgetProps
        .enableEmailAttachment,
    ).toBe(false);
    expect(
      translator.translateControl(createMockControl({ enableEmailAttachment: true })).widgetProps.enableEmailAttachment,
    ).toBe(true);
  });

  it('should assign event handlers if provided', () => {
    const handlers: AttachmentsEventHandlers = {
      onAttachmentUpload: jest.fn(),
      onAttachmentDelete: jest.fn(),
      onAttachmentClick: jest.fn(),
      onToggleEmailAttachment: jest.fn(),
    };
    const control = createMockControl();
    const result = translator.translateControl(control, handlers);
    expect(result.widgetProps.onAttachmentUpload).toBe(handlers.onAttachmentUpload);
    expect(result.widgetProps.onAttachmentDelete).toBe(handlers.onAttachmentDelete);
    expect(result.widgetProps.onAttachmentClick).toBe(handlers.onAttachmentClick);
    expect(result.widgetProps.onToggleEmailAttachment).toBe(handlers.onToggleEmailAttachment);
  });
});

describe('translateAttachmentsControl (singleton)', () => {
  it('should delegate to the singleton translator and return correct result', () => {
    const control = createMockControl({ caption: 'Singleton Test' });
    const handlers: AttachmentsEventHandlers = {
      onAttachmentUpload: jest.fn(),
    };
    const result = translateAttachmentsControl(control, handlers);
    expect(result.widgetProps.caption).toBe('Singleton Test');
    expect(result.widgetProps.onAttachmentUpload).toBe(handlers.onAttachmentUpload);
  });
});
