import { createAttachmentsControl } from './attachmentsControl';

// Mock Guid.create to return a predictable value
jest.mock('@m-next/utilities', () => ({
  Guid: {
    create: jest.fn().mockReturnValue('mocked-guid'),
  },
}));

describe('createAttachmentsControl', () => {
  it('should create a control with default values when no input is provided', () => {
    const control = createAttachmentsControl();

    expect(control).toEqual({
      id: 'mocked-guid',
      type: 'attachments',
      hideCaption: true,
      caption: '',
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
    });
  });

  it('should properly handle boolean properties', () => {
    // Test with explicit false values
    const withFalseValues = createAttachmentsControl({
      hideCaption: false,
      visible: false,
      disabled: false,
      isBound: false,
      enableEmailAttachment: false,
    });

    expect(withFalseValues.hideCaption).toBe(false);
    expect(withFalseValues.visible).toBe(false);
    expect(withFalseValues.disabled).toBe(false);
    expect(withFalseValues.isBound).toBe(false);
    expect(withFalseValues.enableEmailAttachment).toBe(false);

    // Test with explicit true values
    const withTrueValues = createAttachmentsControl({
      hideCaption: true,
      visible: true,
      disabled: true,
      isBound: true,
      enableEmailAttachment: true,
    });

    expect(withTrueValues.hideCaption).toBe(true);
    expect(withTrueValues.visible).toBe(true);
    expect(withTrueValues.disabled).toBe(true);
    expect(withTrueValues.isBound).toBe(true);
    expect(withTrueValues.enableEmailAttachment).toBe(true);
  });

  it('should always set the correct type for the control', () => {
    // With no type specified
    expect(createAttachmentsControl().type).toBe('attachments');

    // Even if a different type is provided, it should use that value
    // (This tests that the function respects the provided value)
    expect(createAttachmentsControl({ type: 'something-else' }).type).toBe('something-else');
  });
});
