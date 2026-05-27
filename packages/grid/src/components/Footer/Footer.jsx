import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as s from './Footer.styles';
import { formatCellValue } from '../../utilities';
import Column from '../../ColumnPropType';

const propTypes = {
  id: PropTypes.string,
  totalRows: PropTypes.number,
  columns: PropTypes.arrayOf(Column),
  isMobile: PropTypes.bool,
  selectable: PropTypes.bool,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  columnTotals: PropTypes.arrayOf(PropTypes.number),
  displayPreferences: PropTypes.instanceOf(Object),
  canDelete: PropTypes.bool,
  noSearchResults: PropTypes.bool,
  variant: PropTypes.string,
};
function Footer({
  id,
  columns,
  isMobile,
  selectable,
  totalRows,
  pageSize,
  pageNumber,
  columnTotals,
  displayPreferences,
  canDelete,
  noSearchResults,
  variant = 'default',
}) {
  const [totalLabelIndex, setTotalLabelIndex] = useState();
  const [showTotals, setShowTotals] = useState(false);

  useEffect(() => {
    let shouldShowTotals = false;
    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].hasColumnTotal) {
          shouldShowTotals = true;
        }
      }
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].visible && !columns[i].hasColumnTotal) {
          setTotalLabelIndex(i);
          break;
        }
      }
      setShowTotals(shouldShowTotals);
    }
  }, [columns]);

  if (!showTotals || isMobile || noSearchResults) {
    return null;
  }
  return (
    <tfoot>
      <tr id={`${id}-COLUMN-TOTAL-ROW`}>
        {selectable && <s.TD visible />}

        {columns.map((col, idx) => {
          // For modern variant, don't render hidden columns at all (like the header does)
          // This prevents :first-of-type CSS selectors from targeting the wrong element
          if (variant === 'modern' && !col.visible) return null;

          const columnKey = `${idx}-${col.name}`;
          if (idx === totalLabelIndex) {
            let title = 'Total';
            if (totalRows > pageSize) title = 'Page Total';
            if (pageNumber > 1) title = 'Page Total';
            return (
              <s.TD key={columnKey} id={`${id}-COLUMN-TOTAL-ROW-${idx}`} visible title={title} alt={title}>
                {title}
              </s.TD>
            );
          }

          return (
            <s.TD
              key={columnKey}
              id={`${id}-COLUMN-TOTAL-ROW-${idx}`}
              filled={col.hasColumnTotal}
              align={col.columnAlign}
              visible={col.visible}
              isEditableColumn={col.editable}
              data-column={col.name}
            >
              {col.hasColumnTotal ? formatCellValue(col, columnTotals[idx], false, displayPreferences) : null}
            </s.TD>
          );
        })}

        {canDelete && <s.TD visible />}
      </tr>
    </tfoot>
  );
}

Footer.propTypes = propTypes;
export default Footer;
