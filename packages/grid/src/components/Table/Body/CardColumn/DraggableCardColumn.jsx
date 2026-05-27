import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from '@syncfusion/ej2-base';

import CardColumn from './CardColumn';
import './CardColumn.css';

const propTypes = {
  fieldControl: PropTypes.instanceOf(Object),
  format: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  primaryKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dragAndDrop: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  onClick: PropTypes.func,
};

function DraggableCardColumn({
  fieldControl = null,
  format = 'avatar-2-cols',
  id,
  isMobile = false,
  value = '',
  primaryKey,
  dragAndDrop,
  displayPreferences = null,
  onClick,
}) {
  const draggableRef = useRef(null);
  const droppableRef = useRef(null);

  const getDraggedElement = () => document.querySelectorAll('.e-drag-helper');

  const removedDraggedElements = () => getDraggedElement().forEach((_) => _.remove());

  const setDraggable = (drag, drop) =>
    new Draggable(draggableRef.current, {
      clone: true,

      dragStart: (e) => {
        // Create a clone of the dragged element
        const clone = draggableRef.current.cloneNode(true);
        const mock = getDraggedElement()[0];
        mock.innerHTML = '';
        mock.appendChild(clone);

        drag.onDragStart(e);
      },

      drag: (e) => {
        drag.onDrag(e);
      },

      dragStop: (e) => {
        if (!drop.element.contains(e.target)) {
          removedDraggedElements();
        }
        drag.onDragStop(e);
      },
    });

  const setDroppable = (drop) => {
    droppableRef.current = new Droppable(drop.element, {
      drop: (e) => {
        // Because of some limitations with SyncFusion Draggable api and as the parent changes when dragging the element
        // we have to extract row primary key using data attributes that we added to the card column in the JSX
        const rowPrimaryKey = e.droppedElement?.firstChild?.dataset?.primaryKey;
        removedDraggedElements();

        drop.onDrop(e, rowPrimaryKey);
      },
    });
  };

  useEffect(() => {
    if (draggableRef.current && !droppableRef.current) {
      const drag = dragAndDrop.draggable;
      const drop = dragAndDrop.droppable;

      setDraggable(drag, drop);
      setDroppable(drop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggableRef.current]);

  return (
    <div data-primary-key={primaryKey} ref={draggableRef}>
      <CardColumn
        fieldControl={fieldControl}
        format={format}
        id={id}
        isMobile={isMobile}
        value={value}
        displayPreferences={displayPreferences}
        onClick={onClick}
      />
    </div>
  );
}
DraggableCardColumn.propTypes = propTypes;

export default DraggableCardColumn;
