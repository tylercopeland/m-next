/* eslint-disable react/no-danger */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as s from './ShowHideContent.styles';

function ShowHideContent({ id, content, limit }) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMore(!showMore);
  };

  const label = showMore ? 'Show less' : 'Show more';
  const formattedContent = useMemo(() => {
    if (!content) return '';
    if (!showMore) {
      if (content.length > limit) {
        const text = content.substr(0, limit);
        return `${text.replace(/(?:\r\n|\r|\n)/g, '<br/>')}... `;
      }
    }

    return content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  }, [content, limit, showMore]);

  if (content === null || content === undefined || content.length < limit) {
    return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  }

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
      <s.Link id={`${id}-show-more-toggle`} onClick={toggleShowMore} tabIndex={0}>
        {label}
      </s.Link>
    </>
  );
}

ShowHideContent.defaultProps = {
  content: null,
  limit: 250,
};
ShowHideContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  limit: PropTypes.number,
};

export default ShowHideContent;
