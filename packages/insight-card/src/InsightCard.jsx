import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tooltip } from 'react-tooltip';
import SvgIcon from '@m-next/svg-icon';
import * as s from './InsightCard.styles';
import { fontWeight, iconSize } from '@m-next/tokens';

// Resolve delta direction. If caller provided `direction`, honor it. Otherwise
// inspect numeric `value` sign — works for `12`, `-3`, `'12'`, `'-3.5%'`, etc.
const resolveDirection = (delta) => {
  if (!delta) return null;
  if (delta.direction) return delta.direction;
  const numeric = typeof delta.value === 'number'
    ? delta.value
    : parseFloat(String(delta.value).replace(/[^0-9.\-]/g, ''));
  if (Number.isNaN(numeric) || numeric === 0) return 'neutral';
  return numeric > 0 ? 'up' : 'down';
};

const DIRECTION_GLYPH = { up: '↑', down: '↓', neutral: '—' };

/**
 * InsightCard - A reusable card component for displaying metrics and KPIs.
 *
 * Optional `delta` slot renders a trend line below the value (audit-finding-2):
 *
 *   <InsightCard title="Total spent" value="$24,650"
 *                delta={{ value: '12%', label: 'from last month' }} />
 *   <InsightCard title="Open invoices" value="8"
 *                delta={{ value: -3, label: 'fewer than last week' }} />
 *
 * `delta.direction` ('up' | 'down' | 'neutral') is optional — when omitted, it
 * is inferred from the sign of `delta.value`. Up = green, down = red,
 * neutral = grey.
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
  delta = null,
  className,
  style,
  ...rest
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  const direction = resolveDirection(delta);

  return (
    <s.InsightCardContainer
      className={className}
      style={style}
      onClick={onCardClick ? handleCardClick : undefined}
      isClickable={!!onCardClick}
      {...rest}
    >
      <s.InsightCardHeader>
        {iconName && <SvgIcon name={iconName} size={iconSize.sm} />}
        <s.InsightCardTitleContainer>
          <s.InsightCardTitle>{title}</s.InsightCardTitle>
          {showInfoIcon && (
            <>
              <s.InsightCardInfo
                data-tooltip-id={infoTooltipContent ? `insight-card-tooltip-${title}` : undefined}
                data-tooltip-content={infoTooltipContent}
              >
                <SvgIcon name='Info-Exclamation' size={iconSize.xs} />
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
                    fontWeight: fontWeight.semibold,
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

            {delta && direction && (
              <s.InsightCardDelta direction={direction}>
                <span aria-hidden='true'>{DIRECTION_GLYPH[direction]}</span>
                <span>{delta.value}</span>
                {delta.label && <span>{delta.label}</span>}
              </s.InsightCardDelta>
            )}

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
  /**
   * Optional trend indicator rendered below the value. Direction defaults to
   * sign of numeric `value` when omitted. Up = green, down = red, neutral = grey.
   */
  delta: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string,
    direction: PropTypes.oneOf(['up', 'down', 'neutral']),
  }),
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
  delta: null,
};

export default InsightCard;
