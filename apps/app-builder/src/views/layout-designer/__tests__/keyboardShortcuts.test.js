/**
 * Keyboard Shortcuts Logic Tests
 *
 * Tests for the keyboard shortcut behavior logic:
 * - Delete/Backspace only works when canvas was clicked
 * - CTRL+C/V/D only work when canvas was clicked
 * - Shortcuts blocked when typing in input fields
 */

describe('Keyboard Shortcuts - Canvas Click Tracking Logic', () => {
  let canvasClickedRef;
  let mockHandleKeyDown;
  let mockDeleteHandler;
  let mockCopyHandler;
  let mockPasteHandler;
  let mockDuplicateHandler;

  beforeEach(() => {
    // Simulate the ref that tracks canvas clicks
    canvasClickedRef = { current: false };

    mockDeleteHandler = jest.fn();
    mockCopyHandler = jest.fn();
    mockPasteHandler = jest.fn();
    mockDuplicateHandler = jest.fn();

    // Simplified version of the handleKeyDown logic from layoutDesigner.jsx
    mockHandleKeyDown = (e, options = {}) => {
      const {
        layoutV4 = { content: [{ id: 'test' }] },
        selectedControlId = 'test-control',
        controls = { 'test-control': { id: 'test-control', type: 'BTN' } },
        clipboard = null,
        isV4Screen = true,
      } = options;

      // Early exit if not V4 screen
      if (!isV4Screen) {
        return;
      }

      // Early exit if no layout content or canvas not clicked
      if (!layoutV4?.content || !canvasClickedRef.current) {
        return;
      }

      // Check if user is typing in an input field outside canvas
      const activeElement = document.activeElement;
      const isTextInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.isContentEditable;
      const isTypingOutsideCanvas = isTextInput && !activeElement?.closest('#designer-canvas');

      if (isTypingOutsideCanvas) {
        return;
      }

      // Handle Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedControlId) {
        mockDeleteHandler(selectedControlId);
        e.preventDefault();
        return;
      }

      // Handle Ctrl/Cmd shortcuts
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (!isCmdOrCtrl) return;

      const hasTextSelection = window.getSelection()?.toString().length > 0;
      if (hasTextSelection) {
        return;
      }

      if ((e.key === 'c' || e.key === 'C') && selectedControlId && controls[selectedControlId]) {
        mockCopyHandler(selectedControlId);
        e.preventDefault();
      }

      if ((e.key === 'v' || e.key === 'V') && clipboard) {
        mockPasteHandler(clipboard);
        e.preventDefault();
      }

      if ((e.key === 'd' || e.key === 'D') && selectedControlId) {
        mockDuplicateHandler(selectedControlId);
        e.preventDefault();
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Canvas Click Tracking', () => {
    it('should set canvasClickedRef to true when canvas element is clicked', () => {
      // Simulate the mousedown handler logic
      const handleMouseDown = (e) => {
        const isInCanvas = e.target.closest('#designer-canvas');
        canvasClickedRef.current = !!isInCanvas;
      };

      // Create a mock canvas element
      const canvas = document.createElement('div');
      canvas.id = 'designer-canvas';
      document.body.appendChild(canvas);

      // Simulate click on canvas
      const mockEvent = { target: canvas };
      handleMouseDown(mockEvent);

      expect(canvasClickedRef.current).toBe(true);

      // Cleanup
      document.body.removeChild(canvas);
    });

    it('should set canvasClickedRef to false when clicking outside canvas', () => {
      const handleMouseDown = (e) => {
        const isInCanvas = e.target.closest('#designer-canvas');
        canvasClickedRef.current = !!isInCanvas;
      };

      // Set to true first
      canvasClickedRef.current = true;

      // Simulate click outside canvas
      const outsideElement = document.createElement('div');
      outsideElement.id = 'right-panel';
      document.body.appendChild(outsideElement);

      const mockEvent = { target: outsideElement };
      handleMouseDown(mockEvent);

      expect(canvasClickedRef.current).toBe(false);

      // Cleanup
      document.body.removeChild(outsideElement);
    });
  });

  describe('Delete/Backspace Shortcut', () => {
    it('should call delete handler when Delete is pressed and canvas was clicked', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDeleteHandler).toHaveBeenCalledWith('test-control');
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should call delete handler when Backspace is pressed and canvas was clicked', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'Backspace',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDeleteHandler).toHaveBeenCalledWith('test-control');
    });

    it('should NOT call delete handler when canvas was not clicked', () => {
      canvasClickedRef.current = false;

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDeleteHandler).not.toHaveBeenCalled();
    });

    it('should NOT call delete handler when no control is selected', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { selectedControlId: null });

      expect(mockDeleteHandler).not.toHaveBeenCalled();
    });

    it('should NOT call delete handler when typing in input outside canvas', () => {
      canvasClickedRef.current = true;

      // Create an input element outside the canvas
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDeleteHandler).not.toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(input);
    });

    it('should NOT call delete handler on non-V4 screens', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { isV4Screen: false });

      expect(mockDeleteHandler).not.toHaveBeenCalled();
    });

    it('should NOT call delete handler when layoutV4 has no content', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { layoutV4: null });

      expect(mockDeleteHandler).not.toHaveBeenCalled();
    });
  });

  describe('CTRL+C (Copy) Shortcut', () => {
    it('should call copy handler when CTRL+C is pressed and canvas was clicked', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'c',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockCopyHandler).toHaveBeenCalledWith('test-control');
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should call copy handler when CMD+C is pressed (Mac)', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'c',
        metaKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockCopyHandler).toHaveBeenCalledWith('test-control');
    });

    it('should NOT call copy handler when canvas was not clicked', () => {
      canvasClickedRef.current = false;

      const mockEvent = {
        key: 'c',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockCopyHandler).not.toHaveBeenCalled();
    });

    it('should NOT call copy handler when text is selected', () => {
      canvasClickedRef.current = true;

      // Mock text selection
      const originalGetSelection = window.getSelection;
      window.getSelection = jest.fn(() => ({
        toString: () => 'selected text',
      }));

      const mockEvent = {
        key: 'c',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockCopyHandler).not.toHaveBeenCalled();

      // Restore
      window.getSelection = originalGetSelection;
    });
  });

  describe('CTRL+V (Paste) Shortcut', () => {
    it('should call paste handler when CTRL+V is pressed with clipboard and canvas was clicked', () => {
      canvasClickedRef.current = true;

      const clipboard = { controlId: 'copied-control', controlSnapshot: { id: 'copied-control' } };
      const mockEvent = {
        key: 'v',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { clipboard });

      expect(mockPasteHandler).toHaveBeenCalledWith(clipboard);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should NOT call paste handler when clipboard is empty', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'v',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { clipboard: null });

      expect(mockPasteHandler).not.toHaveBeenCalled();
    });

    it('should NOT call paste handler when canvas was not clicked', () => {
      canvasClickedRef.current = false;

      const clipboard = { controlId: 'copied-control' };
      const mockEvent = {
        key: 'v',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { clipboard });

      expect(mockPasteHandler).not.toHaveBeenCalled();
    });
  });

  describe('CTRL+D (Duplicate) Shortcut', () => {
    it('should call duplicate handler when CTRL+D is pressed and canvas was clicked', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'd',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDuplicateHandler).toHaveBeenCalledWith('test-control');
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should NOT call duplicate handler when canvas was not clicked', () => {
      canvasClickedRef.current = false;

      const mockEvent = {
        key: 'd',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDuplicateHandler).not.toHaveBeenCalled();
    });

    it('should NOT call duplicate handler when no control is selected', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'd',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, { selectedControlId: null });

      expect(mockDuplicateHandler).not.toHaveBeenCalled();
    });
  });

  describe('Input Field Handling', () => {
    it('should allow shortcuts when in input field INSIDE canvas', () => {
      canvasClickedRef.current = true;

      // Create canvas with input inside
      const canvas = document.createElement('div');
      canvas.id = 'designer-canvas';
      const input = document.createElement('input');
      canvas.appendChild(input);
      document.body.appendChild(canvas);
      input.focus();

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      // Since input is inside canvas, isTypingOutsideCanvas = false
      // and delete should be called
      mockHandleKeyDown(mockEvent);

      expect(mockDeleteHandler).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(canvas);
    });

    it('should block shortcuts when in textarea outside canvas', () => {
      canvasClickedRef.current = true;

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();

      const mockEvent = {
        key: 'Delete',
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockDeleteHandler).not.toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(textarea);
    });

    // Note: contentEditable handling is covered by the isTypingOutsideCanvas check
    // which uses activeElement?.isContentEditable. This is difficult to test in jsdom
    // but the behavior is verified through input and textarea tests above.
  });

  describe('Edge Cases', () => {
    it('should handle uppercase key presses (CTRL+C vs CTRL+c)', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'C', // uppercase
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockCopyHandler).toHaveBeenCalled();
    });

    it('should not trigger shortcuts without CTRL/CMD modifier', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'c',
        ctrlKey: false,
        metaKey: false,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent);

      expect(mockCopyHandler).not.toHaveBeenCalled();
    });

    it('should handle missing control in controls object gracefully', () => {
      canvasClickedRef.current = true;

      const mockEvent = {
        key: 'c',
        ctrlKey: true,
        preventDefault: jest.fn(),
      };

      mockHandleKeyDown(mockEvent, {
        selectedControlId: 'non-existent',
        controls: {},
      });

      expect(mockCopyHandler).not.toHaveBeenCalled();
    });
  });
});
