import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

function EmptyFilterIcon({ height = 80, width = 112 }) {
  return (
    <svg
      width={width}
      height={height}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <g clipPath='url(#clip0_5077_223273)'>
        <path opacity={0.25} d='M96 0H56V40H96V0Z' fill='url(#pattern0)' />
        <path
          d='M48 72C65.6731 72 80 57.6731 80 40C80 22.3269 65.6731 8 48 8C30.3269 8 16 22.3269 16 40C16 57.6731 30.3269 72 48 72Z'
          fill='#E6F1FA'
        />
        <g clipPath='url(#clip1_5077_223273)'>
          <g clipPath='url(#clip2_5077_223273)'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M40 75.25C40 74.2835 40.7835 73.5 41.75 73.5H94.25C95.2165 73.5 96 74.2835 96 75.25C96 76.2165 95.2165 77 94.25 77H41.75C40.7835 77 40 76.2165 40 75.25Z'
              fill='#022266'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M44.5251 60.5251C45.1815 59.8687 46.0717 59.5 47 59.5H54C54.9283 59.5 55.8185 59.8687 56.4749 60.5251C57.1313 61.1815 57.5 62.0717 57.5 63V75.25C57.5 76.2165 56.7165 77 55.75 77H45.25C44.2835 77 43.5 76.2165 43.5 75.25V63C43.5 62.0717 43.8687 61.1815 44.5251 60.5251ZM54 63H47V73.5H54V63Z'
              fill='#022266'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M62.0251 43.0251C62.6815 42.3688 63.5717 42 64.5 42H71.5C72.4283 42 73.3185 42.3688 73.9749 43.0251C74.6312 43.6815 75 44.5717 75 45.5V75.25C75 76.2165 74.2165 77 73.25 77H62.75C61.7835 77 61 76.2165 61 75.25V45.5C61 44.5717 61.3688 43.6815 62.0251 43.0251ZM71.5 45.5L64.5 45.5L64.5 73.5H71.5V45.5Z'
              fill='#022266'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M79.5251 53.5251C80.1815 52.8688 81.0717 52.5 82 52.5H89C89.9283 52.5 90.8185 52.8688 91.4749 53.5251C92.1313 54.1815 92.5 55.0717 92.5 56V75.25C92.5 76.2165 91.7165 77 90.75 77H80.25C79.2835 77 78.5 76.2165 78.5 75.25V56C78.5 55.0717 78.8687 54.1815 79.5251 53.5251ZM89 56L82 56V73.5H89L89 56Z'
              fill='#022266'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M45.25 43.75C44.2835 43.75 43.5 44.5335 43.5 45.5C43.5 46.4665 44.2835 47.25 45.25 47.25C46.2165 47.25 47 46.4665 47 45.5C47 44.5335 46.2165 43.75 45.25 43.75ZM40 45.5C40 42.6005 42.3505 40.25 45.25 40.25C48.1495 40.25 50.5 42.6005 50.5 45.5C50.5 48.3995 48.1495 50.75 45.25 50.75C42.3505 50.75 40 48.3995 40 45.5Z'
              fill='#0D71C8'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M61 24.5C60.0335 24.5 59.25 25.2835 59.25 26.25C59.25 27.2165 60.0335 28 61 28C61.9665 28 62.75 27.2165 62.75 26.25C62.75 25.2835 61.9665 24.5 61 24.5ZM55.75 26.25C55.75 23.3505 58.1005 21 61 21C63.8995 21 66.25 23.3505 66.25 26.25C66.25 29.1495 63.8995 31.5 61 31.5C58.1005 31.5 55.75 29.1495 55.75 26.25Z'
              fill='#0D71C8'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M90.75 33.25C89.7835 33.25 89 34.0335 89 35C89 35.9665 89.7835 36.75 90.75 36.75C91.7165 36.75 92.5 35.9665 92.5 35C92.5 34.0335 91.7165 33.25 90.75 33.25ZM85.5 35C85.5 32.1005 87.8505 29.75 90.75 29.75C93.6495 29.75 96 32.1005 96 35C96 37.8995 93.6495 40.25 90.75 40.25C87.8505 40.25 85.5 37.8995 85.5 35Z'
              fill='#0D71C8'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M59.8917 27.6046C60.6397 28.2166 60.75 29.3191 60.138 30.0672L48.8213 43.8992C48.2093 44.6472 47.1067 44.7575 46.3587 44.1455C45.6107 43.5335 45.5004 42.4309 46.1124 41.6829L57.4291 27.8509C58.0411 27.1029 59.1436 26.9926 59.8917 27.6046Z'
              fill='#0D71C8'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M62.6785 26.7431C62.9511 25.8158 63.9239 25.2852 64.8511 25.5579L87.8858 32.3315C88.813 32.6042 89.3436 33.5769 89.071 34.5042C88.7983 35.4314 87.8256 35.962 86.8984 35.6894L63.8637 28.9157C62.9364 28.643 62.4058 27.6703 62.6785 26.7431Z'
              fill='#0D71C8'
            />
          </g>
        </g>
      </g>
      <defs>
        <pattern id='pattern0' patternContentUnits='objectBoundingBox' width={0.24} height={0.24}>
          <use xlinkHref='#image0_5077_223273' transform='scale(0.005)' />
        </pattern>
        <clipPath id='clip0_5077_223273'>
          <rect width={112} height={80} fill='white' />
        </clipPath>
        <clipPath id='clip1_5077_223273'>
          <rect width={56} height={56} fill='white' transform='translate(40 21)' />
        </clipPath>
        <clipPath id='clip2_5077_223273'>
          <rect width={56} height={56} fill='white' transform='translate(40 21)' />
        </clipPath>
        <image
          id='image0_5077_223273'
          width={48}
          height={48}
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAAAwUlEQVRoBe2XQQ6AIAwEifFXPl//pXCoIR4ICD1sMyQEFVjbKQVNidIkcOTeUt3K5qaMMASWECAHlmBERJgAOSAcPExfQoAcWIIREWECV7b9FLY/3dn4Ut2K/A8NDritjU7hMBH4npij92WnsYStW+NYP7Prencafd87Xj4CRsirNdpe+kk+AjjgtjY6heUjsHc6+ndY+ZijQGCCwHtiTmg0p8oncdM7OgMQIAcCBBEXpgiQA1P4mByAADkQIIhtFx6JtxlMUx/tlQAAAABJRU5ErkJggg=='
        />
      </defs>
    </svg>
  );
}

EmptyFilterIcon.propTypes = propTypes;
export default EmptyFilterIcon;
