import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { Header, Text } from '@m-next/typeography';
import Button from '@m-next/button';
import * as s from './Body.styles';

const propTypes = {
  id: PropTypes.string,
  onViewAll: PropTypes.func,
  searchValue: PropTypes.string,
  hasAdvancedSearch: PropTypes.bool,
};
function NoResults({ id, onViewAll, searchValue, hasAdvancedSearch }) {
  if (!hasAdvancedSearch && !searchValue) {
    return <s.NoResults colSpan='1000'>No Results Found</s.NoResults>;
  }

  return (
    <td colSpan='1000'>
      <s.NoResultsWrapper>
        <SvgIcon>
          <svg width={121} height={104} viewBox='0 0 121 104' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M50.658 15.333a3.53 3.53 0 0 1 4.088-2.862l37.963 6.694a3.53 3.53 0 0 1 2.862 4.088l-9.463 53.664a3.53 3.53 0 0 1-4.087 2.862l-37.963-6.694a3.53 3.53 0 0 1-2.862-4.087z'
              fill='#91A2FF'
            />
            <path
              d='m93.326 75.317-9.48-53.76a2.16 2.16 0 0 0-2.503-1.753l-34.139 6.02c-.63.11-1.18.495-1.498 1.05l-3.99 6.94a2.16 2.16 0 0 0-.255 1.453l8.413 47.712a2.16 2.16 0 0 0 2.504 1.753l39.195-6.911a2.16 2.16 0 0 0 1.753-2.504'
              fill='url(#a)'
            />
            <path
              d='m48.444 26.606 2.673 7.198a.986.986 0 0 1-.781 1.319l-7.212 1.057'
              stroke='#fff'
              strokeWidth={1.375}
              strokeLinecap='round'
            />
            <g filter='url(#b)'>
              <path
                d='M65.646 60.519c-5.904 4.8-10.445 8.2-6.367 13.215 5.7 11.52 20.764 2.743 26.669-2.057 5.904-4.8 1.538-18.055-2.54-23.071S71.55 55.718 65.646 60.519'
                fill='url(#c)'
                fillOpacity={0.3}
              />
            </g>
            <path
              d='M79.714 33.605 65.15 36.174a.986.986 0 0 0-.8 1.142l2.397 13.594a.986.986 0 0 0 1.143.8l14.565-2.569a.986.986 0 0 0 .8-1.142l-2.398-13.594a.986.986 0 0 0-1.142-.8Zm-30.801 8.437 11.894-2.098m-11.022 7.043 11.894-2.097m-11.097 6.62 11.895-2.097M51.995 59.52l31.8-5.607M52.867 64.466l31.8-5.607M53.664 68.987l31.8-5.607'
              stroke='#fff'
              strokeWidth={1.375}
              strokeLinecap='round'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M28.208 54.313a2.17 2.17 0 0 1 2.17-2.171h13.233a2.17 2.17 0 0 1 2.042 1.435l.963 2.674a.795.795 0 0 0 .748.526h26.243a2.17 2.17 0 0 1 2.17 2.121l.692 30.644a4.69 4.69 0 0 0 4.018-4.64v-3.708a.688.688 0 0 1 1.375 0v3.708a6.064 6.064 0 0 1-6.064 6.064H34.086a5.88 5.88 0 0 1-5.878-5.88zM75.095 89.59l-.693-30.66a.795.795 0 0 0-.795-.778H47.364a2.17 2.17 0 0 1-2.043-1.436l-.962-2.673a.8.8 0 0 0-.748-.526H30.378a.795.795 0 0 0-.795.796v30.774a4.503 4.503 0 0 0 4.503 4.503z'
              fill='#2A394A'
            />
            <path d='M40.968 87.605a8.252 8.252 0 1 1-16.504 0 8.252 8.252 0 0 1 16.504 0' fill='#3B4AED' />
            <g clipPath='url(#d)'>
              <path
                d='M33.508 87.666a.08.08 0 0 1-.025-.06.1.1 0 0 1 .025-.061l3.185-3.185a.516.516 0 0 0-.73-.729l-3.185 3.183a.086.086 0 0 1-.121 0l-3.185-3.183a.515.515 0 1 0-.73.73l3.185 3.184a.086.086 0 0 1 0 .121l-3.184 3.185a.517.517 0 0 0 .73.73l3.184-3.185a.08.08 0 0 1 .06-.026.1.1 0 0 1 .061.026l3.185 3.184a.516.516 0 1 0 .73-.729z'
                fill='#fff'
              />
            </g>
            <g clipPath='url(#e)' fillRule='evenodd' clipRule='evenodd' fill='#3B4AED'>
              <path d='M47.004 17.624c7.022 2.984 10.295 11.095 7.31 18.116-2.983 7.022-11.095 10.295-18.116 7.31-7.022-2.983-10.295-11.094-7.31-18.116 2.984-7.022 11.095-10.295 18.116-7.31m9.605 19.091c3.522-8.288-.341-17.863-8.63-21.386-8.288-3.522-17.863.341-21.386 8.63s.341 17.863 8.63 21.386 17.863-.341 21.386-8.63' />
              <path d='M31.835 40.106a1.246 1.246 0 0 0-1.763 0l-11.68 11.682a1.246 1.246 0 0 0 1.762 1.762l11.68-11.682a1.246 1.246 0 0 0 0-1.762' />
            </g>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M102.939 8.146c.26 0 .498.146.615.379l1.425 2.837 2.753 1.466a.687.687 0 0 1 0 1.214l-2.692 1.433-1.671 5.59a.688.688 0 0 1-1.331-.05l-1.225-5.554-2.667-1.42a.688.688 0 0 1 0-1.213l2.754-1.466 1.425-2.837a.69.69 0 0 1 .614-.38m0 2.22-.909 1.809a.7.7 0 0 1-.291.298l-1.806.962 1.806.96a.7.7 0 0 1 .348.46l.723 3.275.994-3.324a.7.7 0 0 1 .336-.41l1.806-.961-1.806-.962a.7.7 0 0 1-.292-.298zM15.973 31.396c.26 0 .498.146.615.38l1.073 2.143 2.074 1.107a.687.687 0 0 1 0 1.213l-2.013 1.075-1.267 4.25a.688.688 0 0 1-1.33-.05l-.928-4.214-1.986-1.06a.687.687 0 0 1 0-1.214l2.073-1.107 1.074-2.144a.69.69 0 0 1 .615-.38m0 2.223-.557 1.112a.7.7 0 0 1-.291.298l-1.13.604 1.13.603a.7.7 0 0 1 .348.459l.424 1.927.589-1.976a.7.7 0 0 1 .335-.41l1.13-.603-1.13-.604a.7.7 0 0 1-.291-.298z'
              fill='#2EC9E8'
            />
            <mask
              id='f'
              style={{
                maskType: 'alpha',
              }}
              maskUnits='userSpaceOnUse'
              x={27}
              y={16}
              width={29}
              height={29}
            >
              <circle cx={41.572} cy={30.337} r={13.83} fill='#D9D9D9' />
            </mask>
            <g mask='url(#f)'>
              <path
                d='M46.317 10.84a3.98 3.98 0 0 1 4.61-3.23l42.825 7.552a3.98 3.98 0 0 1 3.229 4.611L86.307 80.31a3.98 3.98 0 0 1-4.611 3.229L38.87 75.987a3.98 3.98 0 0 1-3.229-4.61z'
                fill='#91A2FF'
              />
              <path
                d='M94.449 78.505 83.755 17.86a2.44 2.44 0 0 0-2.824-1.977l-38.51 6.79a2.44 2.44 0 0 0-1.691 1.186l-4.501 7.828a2.44 2.44 0 0 0-.287 1.639l9.49 53.822a2.44 2.44 0 0 0 2.824 1.978l44.215-7.796a2.44 2.44 0 0 0 1.978-2.825'
                fill='url(#g)'
              />
              <path
                d='m43.819 23.557 3.015 8.119a1.112 1.112 0 0 1-.88 1.487l-8.137 1.193m6.531 6.612 13.418-2.366M45.33 46.547l13.42-2.367m-12.518 7.466L59.65 49.28'
                stroke='#fff'
                strokeWidth={1.375}
                strokeLinecap='round'
              />
            </g>
            <defs>
              <linearGradient id='a' x1={75.384} y1={67.387} x2={44.972} y2={60.855} gradientUnits='userSpaceOnUse'>
                <stop stopColor='#D6FEFF' />
                <stop offset={1} stopColor='#BFD2FC' />
              </linearGradient>
              <linearGradient id='g' x1={74.208} y1={69.559} x2={39.902} y2={62.191} gradientUnits='userSpaceOnUse'>
                <stop stopColor='#D6FEFF' />
                <stop offset={1} stopColor='#BFD2FC' />
              </linearGradient>
              <clipPath id='d'>
                <path fill='#fff' d='M28.59 83.48h8.252v8.252H28.59z' />
              </clipPath>
              <clipPath id='e'>
                <path fill='#fff' d='M57.92 14.028H18.035v39.885H57.92z' />
              </clipPath>
              <radialGradient
                id='c'
                cx={0}
                cy={0}
                r={1}
                gradientUnits='userSpaceOnUse'
                gradientTransform='matrix(41.77884 -29.594 17.36719 24.51785 68.031 69.563)'
              >
                <stop stopColor='#2EC9E8' />
                <stop offset={1} stopColor='#2EC9E8' stopOpacity={0} />
              </radialGradient>
              <filter
                id='b'
                x={53.102}
                y={42.797}
                width={40.34}
                height={41.237}
                filterUnits='userSpaceOnUse'
                colorInterpolationFilters='sRGB'
              >
                <feFlood floodOpacity={0} result='BackgroundImageFix' />
                <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                <feGaussianBlur stdDeviation={2.308} result='effect1_foregroundBlur_6351_43120' />
              </filter>
            </defs>
          </svg>
        </SvgIcon>
        <s.NoResultsInnerWrapper>
          <Header variant='h3' fontSize='xlarge'>
            No results found with the applied filters
          </Header>
          <Text>Try changing the filters or search terms to get the results you&apos;re looking for.</Text>
        </s.NoResultsInnerWrapper>
        <Button id={`${id}-view-all`} buttonStyle='primary' onClick={onViewAll} value='Clear filter and search' />
      </s.NoResultsWrapper>
    </td>
  );
}

NoResults.propTypes = propTypes;
export default NoResults;
