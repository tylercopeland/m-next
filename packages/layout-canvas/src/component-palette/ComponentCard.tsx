import React, { useState } from 'react';
import SvgIcon, { SvgIconName } from '@m-next/svg-icon';
import { TextLine } from '@m-next/typeography';
import { colors } from '@m-next/styles';

// Singleton drag ghost element - created once and reused for all drags
let dragGhostElement: HTMLDivElement | null = null;

const getDragGhost = (): HTMLDivElement => {
  if (!dragGhostElement) {
    dragGhostElement = document.createElement('div');
    dragGhostElement.style.position = 'absolute';
    dragGhostElement.style.top = '-9999px';
    dragGhostElement.style.width = '1px';
    dragGhostElement.style.height = '1px';
    dragGhostElement.style.opacity = '0';
    dragGhostElement.setAttribute('data-drag-ghost', 'true');
    document.body.appendChild(dragGhostElement);
  }
  return dragGhostElement;
};

interface ComponentCardProps {
  /** Icon name to display in the card */
  iconName: SvgIconName;
  /** Display name of the component */
  name: string;
  /** Description of the component */
  description: string;
  /** Click handler for the card */
  onClick?: () => void;
  /** Drag start handler for the card */
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  /** Drag end handler for the card */
  onDragEnd?: () => void;
  /** Whether the card is draggable */
  draggable?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Component type for special styling */
  componentType?: string;
}

// Style functions
const getCardContainerStyles = (isDraggable: boolean, isHovered: boolean, isActive: boolean) => ({
  position: 'relative' as const,
  width: '100%',
  backgroundColor: colors.white,
  border: `1px solid ${isHovered ? colors.blue : colors['grey-light']}`,
  borderRadius: '8px',
  padding: '8px',
  boxShadow: isHovered
    ? '0 8px 25px 0 rgba(13, 113, 200, 0.15), 0 4px 10px 0 rgba(0, 0, 0, 0.1)'
    : '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
  cursor: isDraggable ? (isActive ? 'grabbing' : 'grab') : 'pointer',
  transition: 'all 0.15s ease-in-out',
  userSelect: 'none' as const,
});

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'flex-start' as const,
  width: '100%',
  gap: '8px',
};

const getIconContainerStyles = () => ({
  width: '32px',
  height: '32px',
  backgroundColor: colors['blue-lighter'],
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexShrink: 0,
  transition: 'background-color 0.15s ease-in-out',
});

const labelContainerStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'flex-start' as const,
  justifyContent: 'center' as const,
  flex: 1,
  minWidth: 0, // Allows text to truncate properly
};

const ComponentCard: React.FC<ComponentCardProps> = ({
  iconName,
  name,
  description,
  onClick,
  onDragStart,
  onDragEnd,
  draggable = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    // Use singleton drag ghost for better performance (no DOM creation overhead)
    const dragGhost = getDragGhost();
    e.dataTransfer.setDragImage(dragGhost, 0, 0);

    // Call parent's drag start handler
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div
      onClick={onClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={draggable}
      className={className}
      role='button'
      tabIndex={0}
      style={getCardContainerStyles(draggable, isHovered, isActive)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div style={cardContentStyles}>
        <div style={getIconContainerStyles()}>
          <SvgIcon name={iconName} size={16} color={colors.blue} />
        </div>
        <div style={labelContainerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TextLine style={{ lineHeight: '16px', fontSize: '14px', fontWeight: 600 }}>{name}</TextLine>
          </div>
          <TextLine style={{ lineHeight: '16px' }} fontSize='small'>
            {description}
          </TextLine>
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;
