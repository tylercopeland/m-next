import { renderHook } from '@testing-library/react-hooks';
import { useDisplayContent } from './useDisplayContent';

jest.mock('../../../contexts/DesignerContext', () => ({
  useDesignerContext: jest.fn(() => null),
}));

describe('useDisplayContent', () => {
  test('shows "True" for mapped YesNo runtime value 1', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: 1,
          isBound: true,
          fieldType: 5,
          name: 'isActive',
        },
        true,
      ),
    );

    expect(result.current).toBe('True');
  });

  test('shows "False" for mapped YesNo runtime value 0', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: 0,
          isBound: true,
          fieldType: 5,
          name: 'isActive',
        },
        true,
      ),
    );

    expect(result.current).toBe('False');
  });

  test('shows "False" for boolean runtime value false instead of blank', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: false,
          isBound: true,
          name: 'isActive',
        },
        true,
      ),
    );

    expect(result.current).toBe('False');
  });

  test('shows "False" for mapped YesNo runtime complex-value object with value "false"', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: {
            valueType: 12,
            value: 'false',
          },
          isBound: true,
          fieldType: 5,
          name: 'isActive',
        },
        true,
      ),
    );

    expect(result.current).toBe('False');
  });

  // NCNG-582: Mapped labels with no active record return empty string
  test('returns empty string for bound label with null runtime value (no active record)', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: null,
          isBound: true,
          name: 'CompanyName',
        },
        true,
      ),
    );

    expect(result.current).toBe('');
  });

  test('returns empty string for bound label with undefined runtime value (no active record)', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: undefined,
          isBound: true,
          name: 'CompanyName',
        },
        true,
      ),
    );

    expect(result.current).toBe('');
  });

  test('returns empty string for bound label with empty string runtime value (no active record)', () => {
    const { result } = renderHook(() =>
      useDisplayContent(
        {
          value: '',
          isBound: true,
          name: 'CompanyName',
        },
        true,
      ),
    );

    expect(result.current).toBe('');
  });
});
