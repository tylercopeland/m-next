import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as s from './ShowSelectedRecords.styles';

const propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selectedRecordsCount: PropTypes.number,
};

function ShowSelectedRecords({ id, onClick, selectedRecordsCount }) {
  const [showSelected, setShowSelected] = useState(false);

  const handleOnClick = () => {
    if (onClick) {
      onClick(!showSelected);
    }
    setShowSelected(!showSelected);
  };

  const getSelectedText = () => {
    if (selectedRecordsCount > 1) {
      return 'View selected records';
    }

    return 'View selected record';
  };

  return (
    <s.Wrapper id={`${id}-SHOWSELECTED`}>
      {showSelected && (
        <s.Link id={`${id}-SHOWALL-LINK`} onClick={handleOnClick}>
          View all records
        </s.Link>
      )}
      {!showSelected && (
        <s.Link id={`${id}-SHOWSELECTED-LINK`} onClick={handleOnClick}>
          {getSelectedText()}
        </s.Link>
      )}
    </s.Wrapper>
  );
}

ShowSelectedRecords.propTypes = propTypes;

export default ShowSelectedRecords;
