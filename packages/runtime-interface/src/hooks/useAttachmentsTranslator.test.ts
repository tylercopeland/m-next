import { renderHook } from '@testing-library/react-hooks';
import { useAttachmentsTranslation } from './useAttachmentsTranslator';
import { translateAttachmentsControl } from '../attachments-translator';
import type { AttachmentsTranslationResult } from '../types';
import { AttachmentsControl } from '../controls/attachmentsControl';

// Mock the translator function
jest.mock('../attachments-translator', () => ({
  translateAttachmentsControl: jest.fn(),
}));

const mockedTranslateAttachmentsControl = translateAttachmentsControl as jest.Mock;

describe('useAttachmentsTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call translateAttachmentsControl with the control', () => {
    const mockControl: AttachmentsControl = { id: 'test-control' } as AttachmentsControl;
    const mockOnClick = jest.fn();
    const mockResult: AttachmentsTranslationResult = {
      someProperty: 'value',
    } as unknown as AttachmentsTranslationResult;
    mockedTranslateAttachmentsControl.mockReturnValue(mockResult);

    const { result } = renderHook(() => useAttachmentsTranslation(mockControl, mockOnClick));

    expect(mockedTranslateAttachmentsControl).toHaveBeenCalledWith(mockControl);
    expect(result.current).toBe(mockResult);
  });

  it('should memoize the result when dependencies do not change', () => {
    const mockControl: AttachmentsControl = { id: 'test-control' } as AttachmentsControl;
    const mockOnClick = jest.fn();
    const mockResult: AttachmentsTranslationResult = {
      someProperty: 'value',
    } as unknown as AttachmentsTranslationResult;

    mockedTranslateAttachmentsControl.mockReturnValue(mockResult);

    const { rerender } = renderHook(({ control, onClick }) => useAttachmentsTranslation(control, onClick), {
      initialProps: { control: mockControl, onClick: mockOnClick },
    });

    rerender({ control: mockControl, onClick: mockOnClick });

    expect(mockedTranslateAttachmentsControl).toHaveBeenCalledTimes(1);
  });

  it('should recalculate when control changes', () => {
    const mockControl1: AttachmentsControl = { id: 'test-control-1' } as AttachmentsControl;
    const mockControl2: AttachmentsControl = { id: 'test-control-2' } as AttachmentsControl;
    const mockOnClick = jest.fn();

    const { rerender } = renderHook(({ control, onClick }) => useAttachmentsTranslation(control, onClick), {
      initialProps: { control: mockControl1, onClick: mockOnClick },
    });

    rerender({ control: mockControl2, onClick: mockOnClick });

    expect(mockedTranslateAttachmentsControl).toHaveBeenCalledTimes(2);
    expect(mockedTranslateAttachmentsControl).toHaveBeenNthCalledWith(1, mockControl1);
    expect(mockedTranslateAttachmentsControl).toHaveBeenNthCalledWith(2, mockControl2);
  });

  it('should recalculate when onClick changes', () => {
    const mockControl: AttachmentsControl = { id: 'test-control' } as AttachmentsControl;
    const mockOnClick1 = jest.fn();
    const mockOnClick2 = jest.fn();

    const { rerender } = renderHook(({ control, onClick }) => useAttachmentsTranslation(control, onClick), {
      initialProps: { control: mockControl, onClick: mockOnClick1 },
    });

    rerender({ control: mockControl, onClick: mockOnClick2 });

    // Note: onClick is in the dependency array but not used in the translator function
    expect(mockedTranslateAttachmentsControl).toHaveBeenCalledTimes(2);
  });
});
