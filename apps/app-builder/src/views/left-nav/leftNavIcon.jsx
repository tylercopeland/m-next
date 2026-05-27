import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './leftNav.styles';

const propTypes = {
  id: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.bool,
};

function LeftNavIcon({ id, link, icon, label, selected }) {
  return (
    <s.NavLinkWrapper id={id} tabIndex={0} selected={selected}>
      <Link style={{ textDecoration: 'none', outline: 'none' }} to={link}>
        <s.NavLink selected={selected}>
          <s.NavLinkButton selected={selected}>
            <SvgIcon
              name={icon}
              size={16}
              color={selected ? lightTheme.content.secondary : lightTheme.content.primary}
            />
          </s.NavLinkButton>
          <s.NavLinkLabel selected={selected}> {label}</s.NavLinkLabel>
        </s.NavLink>
      </Link>
    </s.NavLinkWrapper>
  );
}

LeftNavIcon.propTypes = propTypes;
export default LeftNavIcon;
