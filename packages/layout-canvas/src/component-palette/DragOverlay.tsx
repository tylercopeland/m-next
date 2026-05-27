import React, { useRef, useEffect } from 'react';
import SvgIcon, { SvgIconName } from '@m-next/svg-icon';
import { Header } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import { Z_UI } from '../constants/zIndex';

interface DraggedItem {
  /** Icon name to display */
  iconName: SvgIconName;
  /** Component name */
  name: string;
  /** Initial cursor position */
  x: number;
  y: number;
  /** Component type for identification */
  type: string;
}

interface DragOverlayProps {
  /** The currently dragged item (null when not dragging) */
  item: DraggedItem | null;
}

// Memoized static styles for better performance
const overlayBaseStyles: React.CSSProperties = {
  position: 'fixed',
  left: -120,
  top: -25,
  width: '240px',
  backgroundColor: colors.white,
  border: `1px solid ${colors['grey-light']}`,
  borderRadius: '8px',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  opacity: 0, // Start hidden
  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.15)',
  pointerEvents: 'none',
  zIndex: Z_UI.PALETTE_DRAG,
  willChange: 'transform',
  transition: 'opacity 0s',
  userSelect: 'none',
};

const iconContainerStyles: React.CSSProperties = {
  width: '32px',
  height: '32px',
  backgroundColor: colors['blue-lighter'],
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

/**
 * Custom drag overlay component that follows the cursor with a rotation effect.
 * Optimized for 60fps performance using transform-based positioning and RAF.
 *
 * @component
 * @example
 * <DragOverlay item={draggedItem} />
 */
export const DragOverlay: React.FC<DragOverlayProps> = ({ item }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!item || !overlayRef.current) return;

    const overlay = overlayRef.current;

    // Initialize position using GPU-accelerated transform (no centering)
    // Use translate3d for better GPU performance (visually identical)
    overlay.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(5deg)`;
    overlay.style.opacity = '0.5';

    const handleDrag = (e: DragEvent) => {
      // Ignore end drag coords
      if (e.clientX === 0 && e.clientY === 0) return;

      // Cancel previous frame request to batch updates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use RAF to sync with browser's 60fps refresh rate
      rafRef.current = requestAnimationFrame(() => {
        // Use translate3d for GPU acceleration (no centering, just cursor position)
        overlay.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) rotate(5deg)`;
      });
    };

    const handleDragEnd = () => {
      // Cancel any pending frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Hide immediately on drag end
      if (overlay) {
        overlay.style.opacity = '0';
      }
    };

    // Listen to both drag and dragover - dragover fires more consistently on some systems
    document.addEventListener('drag', handleDrag);
    document.addEventListener('dragover', handleDrag);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('drag', handleDrag);
      document.removeEventListener('dragover', handleDrag);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, [item]);

  // Don't render anything when not dragging
  if (!item) return null;

  return (
    <div ref={overlayRef} style={overlayBaseStyles}>
      {/* Icon container */}
      <div style={iconContainerStyles}>
        <SvgIcon name={item.iconName} size={16} color={colors.blue} />
      </div>

      {/* Component name */}
      <Header variant='h6' style={{ lineHeight: '16px', color: colors['grey-darker'] }} bold>
        {item.name}
      </Header>
    </div>
  );
};

export default DragOverlay;
