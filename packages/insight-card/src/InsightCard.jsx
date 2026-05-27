import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tooltip } from 'react-tooltip';
import SvgIcon from '@m-next/svg-icon';
import * as s from './InsightCard.styles';

/**
 * InsightCard - A reusable card component for displaying metrics and KPIs
 */
const InsightCard = ({
  title,
  value,
  linkText,
  onCardClick,
  iconName,
  showInfoIcon = false,
  infoTooltipContent,
  isLoading = false,
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <s.InsightCardContainer onClick={onCardClick ? handleCardClick : undefined} isClickable={!!onCardClick}>
      <s.InsightCardHeader>
        {iconName && <SvgIcon name={iconName} size={16} />}
        <s.InsightCardTitleContainer>
          <s.InsightCardTitle>{title}</s.InsightCardTitle>
          {showInfoIcon && (
            <>
              <s.InsightCardInfo
                data-tooltip-id={infoTooltipContent ? `insight-card-tooltip-${title}` : undefined}
                data-tooltip-content={infoTooltipContent}
              >
                <SvgIcon name='Info-Exclamation' size={12} />
              </s.InsightCardInfo>
              {infoTooltipContent && (
                <Tooltip
                  id={`insight-card-tooltip-${title}`}
                  place='bottom'
                  style={{
                    backgroundColor: '#0F1B31',
                    color: '#FFFFFF',
                    fontFamily: 'Source Sans Pro',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '16px',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    width: '200px',
                    zIndex: 1000,
                    fontFeatureSettings: "'liga' off, 'clig' off",
                  }}
                />
              )}
            </>
          )}
        </s.InsightCardTitleContainer>
      </s.InsightCardHeader>

      <s.InsightCardContentContainer>
        {isLoading ? (
          <>
            <Skeleton width={62} height={24} borderRadius={8} />
            <Skeleton width={102} height={16} borderRadius={8} />
          </>
        ) : (
          <>
            <s.InsightCardValue>{value}</s.InsightCardValue>

            {linkText && <s.InsightCardCTA>{linkText}</s.InsightCardCTA>}
          </>
        )}
      </s.InsightCardContentContainer>
    </s.InsightCardContainer>
  );
};

InsightCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  linkText: PropTypes.string,
  onCardClick: PropTypes.func,
  iconName: PropTypes.string,
  showInfoIcon: PropTypes.bool,
  infoTooltipContent: PropTypes.string,
  isLoading: PropTypes.bool,
};

InsightCard.defaultProps = {
  title: '',
  value: '',
  linkText: null,
  onCardClick: null,
  iconName: null,
  showInfoIcon: false,
  infoTooltipContent: null,
  isLoading: false,
};

export default InsightCard;
