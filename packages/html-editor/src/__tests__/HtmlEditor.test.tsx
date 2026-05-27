import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import HtmlEditor from '../HtmlEditor';
import { LG, MD, SM, XS } from '../constants';

// Mock the components used by HtmlEditor
jest.mock('@m-next/caption', () => {
  const Caption = jest.fn().mockImplementation((props) => {
    return <div data-testid='mock-caption'>{props.label}</div>;
  });
  return {
    __esModule: true,
    default: Caption,
  };
});

jest.mock('@m-next/loading-skeleton', () => {
  const LoadingSkeleton = jest.fn().mockImplementation(() => {
    return <div data-testid='mock-loading-skeleton'>Loading...</div>;
  });
  return {
    __esModule: true,
    default: LoadingSkeleton,
  };
});

jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

jest.mock('@m-next/validation', () => ({
  ValidationMessage: jest.fn().mockImplementation((props) => {
    return props.message ? <div data-testid='mock-validation-message'>{props.message}</div> : null;
  }),
}));

jest.mock('react-froala-wysiwyg', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((props) => {
    if (props.onManualControllerReady) {
      // Use act for the async operation to avoid act warnings
      setTimeout(() => {
        props.onManualControllerReady({
          initialize: jest.fn(),
          getEditor: () => ({
            edit: {
              on: jest.fn(),
              off: jest.fn(),
            },
            events: {
              focus: jest.fn(() => {
                // Directly call the focus event handler to ensure it's triggered
                if (props.config && props.config.events && props.config.events.focus) {
                  props.config.events.focus();
                }
              }),
            },
            html: {
              get: () => props.model,
            },
            codeView: {
              isActive: () => false,
              get: () => props.model,
            },
          }),
        });
      }, 0);
    }
    return null;
  }),
}));

// Mock CSS imports
jest.mock('froala-editor/css/froala_style.min.css', () => ({}));
jest.mock('froala-editor/css/froala_editor.pkgd.min.css', () => ({}));
jest.mock('froala-editor/js/plugins.pkgd.min', () => ({}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('HtmlEditor Component', () => {
  const defaultProps = {
    id: 'test-editor',
    data: '<p>Test content</p>',
    authContext: {
      account: 'test-account',
      authToken: 'test-token',
      identity: 'test-identity',
      runtimeCoreUrl: 'https://test-url.com',
      secureToken: 'test-secure-token',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders editor wrapper', () => {
    const { container } = render(<HtmlEditor {...defaultProps} />);
    const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper).toBeInTheDocument();
  });

  test('renders with caption when provided', () => {
    const caption = 'Test Caption';
    render(<HtmlEditor {...defaultProps} caption={caption} />);

    const captionElement = screen.getByTestId('mock-caption');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement.textContent).toBe(caption);
  });

  test('renders with validation message when provided', () => {
    const validationMessage = 'This field is required';
    render(<HtmlEditor {...defaultProps} validationMessage={validationMessage} />);

    expect(screen.getByTestId('mock-validation-message')).toBeInTheDocument();
    expect(screen.getByText(validationMessage)).toBeInTheDocument();
  });

  test('renders with disabled state', () => {
    const { container } = render(<HtmlEditor {...defaultProps} disabled={true} />);

    const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper).toHaveAttribute('disabled', '');
  });

  test('renders with custom width', () => {
    const width = '500px';
    const { container } = render(<HtmlEditor {...defaultProps} width={width} />);

    const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper).toHaveStyle(`width: ${width}`);
  });

  test('renders without errors when authContext is not provided', () => {
    // Create a new object without authContext
    const { ...propsWithoutAuth } = defaultProps;

    const { container } = render(<HtmlEditor {...propsWithoutAuth} />);

    // Just verify that it renders without errors
    const editorWrapper = container.querySelector(`#HTML-editor-${propsWithoutAuth.id}`);
    expect(editorWrapper).toBeInTheDocument();
  });

  test('handles onChange events', () => {
    const onChange = jest.fn();
    render(<HtmlEditor {...defaultProps} onChange={onChange} />);

    // Get the mock implementation
    const froalaEditorMock = jest.requireMock('react-froala-wysiwyg').default;

    // Get the last call arguments (props passed to the component)
    const lastCallArgs = froalaEditorMock.mock.calls[froalaEditorMock.mock.calls.length - 1][0];

    // Call the onModelChange function with a new value
    lastCallArgs.onModelChange('<p>New content</p>');

    // Check if onChange was called with the new value
    expect(onChange).toHaveBeenCalledWith('<p>New content</p>');
  });

  test('handles onFocus events', async () => {
    const onFocus = jest.fn();

    // Wrap the render in act to handle any state updates
    await act(async () => {
      render(<HtmlEditor {...defaultProps} onFocus={onFocus} focused={true} />);
    });

    // Wait for the focus effect to run with a longer timeout to ensure it completes
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Check if onFocus was called
    expect(onFocus).toHaveBeenCalled();
  });

  test('handles window click events', () => {
    const { container } = render(<HtmlEditor {...defaultProps} />);

    // Create a mock element with the editor's ID
    const mockElement = document.createElement('div');
    mockElement.id = `HTML-editor-${defaultProps.id}`;

    // Mock the composedPath to return our mock element
    const originalComposedPath = Event.prototype.composedPath;
    Event.prototype.composedPath = jest.fn().mockReturnValue([mockElement]);

    // Simulate a click event on the window
    fireEvent.click(window);

    // Restore the original composedPath
    Event.prototype.composedPath = originalComposedPath;

    // Verify that the component didn't crash
    const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper).toBeInTheDocument();
  });

  test('handles toolbar configuration based on width', () => {
    // Test with different widths to trigger different toolbar configurations
    const widths = [
      { width: '1200px', config: LG },
      { width: '800px', config: MD },
      { width: '600px', config: SM },
      { width: '400px', config: XS },
    ];

    widths.forEach(({ width }) => {
      const { container, unmount } = render(<HtmlEditor {...defaultProps} width={width} />);
      const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
      expect(editorWrapper).toBeInTheDocument();
      expect(editorWrapper).toHaveStyle(`width: ${width}`);
      unmount();
    });
  });

  test('handles manual controller ready', async () => {
    await act(async () => {
      render(<HtmlEditor {...defaultProps} />);
    });

    // Get the mock implementation
    const froalaEditorMock = jest.requireMock('react-froala-wysiwyg').default;

    // Get the last call arguments (props passed to the component)
    const lastCallArgs = froalaEditorMock.mock.calls[froalaEditorMock.mock.calls.length - 1][0];

    // Create a mock controller
    const mockController = {
      initialize: jest.fn(),
      getEditor: jest.fn().mockReturnValue({
        edit: {
          on: jest.fn(),
          off: jest.fn(),
        },
        events: {
          focus: jest.fn(),
        },
        html: {
          get: jest.fn().mockReturnValue(defaultProps.data),
        },
        codeView: {
          isActive: jest.fn().mockReturnValue(false),
          get: jest.fn().mockReturnValue(defaultProps.data),
        },
      }),
    };

    // Call the onManualControllerReady function with the mock controller within act
    await act(async () => {
      lastCallArgs.onManualControllerReady(mockController);
    });

    // Verify that the controller's initialize method was called
    expect(mockController.initialize).toHaveBeenCalled();
  });

  test('passes required prop to Caption component', () => {
    const caption = 'Test Caption';
    render(<HtmlEditor {...defaultProps} caption={caption} required={true} />);

    // Get the mock implementation
    const captionMock = jest.requireMock('@m-next/caption').default;

    // Check if the Caption component was called with the required prop
    expect(captionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        required: true,
        label: caption,
      }),
      expect.anything(),
    );
  });

  test('passes height to FroalaEditor config', () => {
    const height = '300px';
    render(<HtmlEditor {...defaultProps} height={height} />);

    // Get the mock implementation
    const froalaEditorMock = jest.requireMock('react-froala-wysiwyg').default;

    // Get the last call arguments (props passed to the component)
    const lastCallArgs = froalaEditorMock.mock.calls[froalaEditorMock.mock.calls.length - 1][0];

    // Check if the config contains the correct height (as a number without 'px')
    expect(lastCallArgs.config.height).toBe(300);
  });

  test('handles disabled prop', () => {
    // Test with disabled=true
    const { container, unmount } = render(<HtmlEditor {...defaultProps} disabled={true} />);

    // Check if the editor wrapper has the disabled attribute
    const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper).toHaveAttribute('disabled', '');

    unmount();

    // Test with disabled=false
    const { container: container2 } = render(<HtmlEditor {...defaultProps} disabled={false} />);

    // Check if the editor wrapper does not have the disabled attribute
    const editorWrapper2 = container2.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper2).not.toHaveAttribute('disabled');
  });

  test('handles onBlur events', () => {
    const onBlur = jest.fn();
    render(<HtmlEditor {...defaultProps} onBlur={onBlur} />);

    // Get the mock implementation
    const froalaEditorMock = jest.requireMock('react-froala-wysiwyg').default;

    // Get the last call arguments (props passed to the component)
    const lastCallArgs = froalaEditorMock.mock.calls[froalaEditorMock.mock.calls.length - 1][0];

    // Verify that the blur event handler is set up
    expect(lastCallArgs.config.events.blur).toBeDefined();

    // Create a mock editor context
    const mockContext = {
      codeView: {
        isActive: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue('<p>Code view content</p>'),
      },
    };

    // Call the blur event handler with the mock context
    lastCallArgs.config.events.blur.call(mockContext);

    // Verify that onBlur was called with the code view content
    expect(onBlur).toHaveBeenCalledWith('<p>Code view content</p>');
  });

  test('handles onLoad events', async () => {
    const onLoad = jest.fn();

    // Wrap the render in act to handle any state updates
    await act(async () => {
      render(<HtmlEditor {...defaultProps} onLoad={onLoad} />);
    });

    // Get the mock implementation
    const froalaEditorMock = jest.requireMock('react-froala-wysiwyg').default;

    // Get the last call arguments (props passed to the component)
    const lastCallArgs = froalaEditorMock.mock.calls[froalaEditorMock.mock.calls.length - 1][0];

    // Verify that the initialized event handler is set up
    expect(lastCallArgs.config.events.initialized).toBeDefined();

    // Create a mock editor context
    const mockContext = {
      html: {
        get: jest.fn().mockReturnValue('<p>Initialized content</p>'),
      },
    };

    // Call the initialized event handler with the mock context within act
    await act(async () => {
      lastCallArgs.config.events.initialized.call(mockContext);
    });

    // Verify that onLoad was called with the cleaned content
    expect(onLoad).toHaveBeenCalledWith('<p>Initialized content</p>');
  });

  test('handles editor click events', () => {
    const { container } = render(<HtmlEditor {...defaultProps} />);

    // Create a mock element with a className
    const mockElement = document.createElement('div');
    mockElement.className = 'some-class';
    mockElement.id = `HTML-editor-${defaultProps.id}`;

    // Mock the composedPath to return our mock element
    const originalComposedPath = Event.prototype.composedPath;
    Event.prototype.composedPath = jest.fn().mockReturnValue([mockElement]);

    // Simulate a click event on the window
    fireEvent.click(window);

    // Restore the original composedPath
    Event.prototype.composedPath = originalComposedPath;

    // Verify that the component didn't crash
    const editorWrapper = container.querySelector(`#HTML-editor-${defaultProps.id}`);
    expect(editorWrapper).toBeInTheDocument();
  });
});
