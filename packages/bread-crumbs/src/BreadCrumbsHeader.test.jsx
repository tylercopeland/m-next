/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { colors } from '@m-next/styles';
import BreadCrumbHeader from './BreadCrumbsHeader';

const mockCrumbs = [
  { id: '1', label: 'Home', onClick: jest.fn(), tooltip: 'Go to Home' },
  { id: '2', label: 'Dashboard', onClick: jest.fn(), tooltip: 'Go to Dashboard' },
];

const mockMenuItems = [
  { id: '1', label: 'Settings', onClick: jest.fn() },
  { id: '2', label: 'Profile', onClick: jest.fn() },
];

describe('BreadCrumbHeader', () => {
  it('renders breadcrumbs correctly', () => {
    render(<BreadCrumbHeader id='test' crumbs={mockCrumbs} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('calls onClick when breadcrumb is clicked', () => {
    render(<BreadCrumbHeader id='test' crumbs={mockCrumbs} />);
    fireEvent.click(screen.getByText('Home'));
    expect(mockCrumbs[0].onClick).toHaveBeenCalled();
  });

  it('renders menu items when showMenu is true', () => {
    render(<BreadCrumbHeader id='test' showMenu menuItems={mockMenuItems} />);
    act(() => {
      fireEvent.click(screen.getByTestId('test-menu-icon').children[0]);
    });
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('calls onClick when menu item is clicked', () => {
    render(<BreadCrumbHeader id='test' showMenu menuItems={mockMenuItems} />);
    act(() => {
      fireEvent.click(screen.getByTestId('test-menu-icon').children[0]);
    });
    fireEvent.click(screen.getByText('Settings'));
    expect(mockMenuItems[0].onClick).toHaveBeenCalled();
  });

  it('handles key press events correctly', () => {
    render(<BreadCrumbHeader id='test' showMenu menuItems={mockMenuItems} />);
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 40 }); // ArrowDown
    });
    expect(screen.getByText('Settings')).toHaveStyle(`background-color: ${colors['grey-lighter']}`);
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 40 }); // ArrowDown
    });
    expect(screen.getByText('Profile')).toHaveStyle(`background-color: ${colors['grey-lighter']}`);
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 40 }); // ArrowDown
    });
    expect(screen.getByText('Settings')).toHaveStyle(`background-color: ${colors['grey-lighter']}`);
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 38 }); // Arrowup
    });
    expect(screen.getByText('Profile')).toHaveStyle(`background-color: ${colors['grey-lighter']}`);
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 36 }); // home
    });
    expect(screen.getByText('Settings')).toHaveStyle(`background-color: ${colors['grey-lighter']}`);
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 35 }); // end
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 13 }); // enter
    });
    act(() => {
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 9 }); // tab
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 13 }); // enter
    });
    act(() => {
      expect(screen.getByText('Settings')).toHaveStyle(`background-color: ${colors['white']}`);
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 27 }); // escape
      fireEvent.keyUp(screen.getByTestId('test-menu-icon'), { keyCode: 11 }); // do nothing
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<BreadCrumbHeader id='test' crumbs={mockCrumbs} menuItems={mockMenuItems} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
