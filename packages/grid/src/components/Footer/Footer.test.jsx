/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from './Footer';

describe('Footer Component', () => {
  const defaultProps = {
    id: 'test-footer',
    totalRows: 10,
    columns: [
      { name: 'col1', visible: true, hasColumnTotal: true, columnAlign: 'left', editable: false },
      { name: 'col2', visible: true, hasColumnTotal: false, columnAlign: 'right', editable: true },
    ],
    isMobile: false,
    selectable: false,
    pageSize: 5,
    pageNumber: 1,
    columnTotals: [100, 200],
    displayPreferences: {},
    canDelete: false,
    noSearchResults: false,
  };

  it('should render without crashing', () => {
    const { container } = render(
      <table>
        <Footer {...defaultProps} />
      </table>,
    );
    expect(container).toBeInTheDocument();
  });

  it('should not render if showTotals is false', () => {
    const props = { ...defaultProps, columns: [{ name: 'col1', visible: true, hasColumnTotal: false }] };
    const { container } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(container.firstChild.firstChild).toBeNull();
  });

  it('should not render if isMobile is true', () => {
    const props = { ...defaultProps, isMobile: true };
    const { container } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(container.firstChild.firstChild).toBeNull();
  });

  it('should not render if noSearchResults is true', () => {
    const props = { ...defaultProps, noSearchResults: true };
    const { container } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(container.firstChild.firstChild).toBeNull();
  });

  it('should render page total if totalRows > pageSize', () => {
    const props = { ...defaultProps, totalRows: 15 };
    const { getByText } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(getByText('Page Total')).toBeInTheDocument();
  });

  it('should render page total if pageNumber > 1', () => {
    const props = { ...defaultProps, pageNumber: 2 };
    const { getByText } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(getByText('Page Total')).toBeInTheDocument();
  });

  it('should render selectable column if selectable is true', () => {
    const props = { ...defaultProps, selectable: true };
    const { container } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(container.querySelector('td')).toBeInTheDocument();
  });

  it('should render delete column if canDelete is true', () => {
    const props = { ...defaultProps, canDelete: true };
    const { container } = render(
      <table>
        <Footer {...props} />
      </table>,
    );
    expect(container.querySelector('td:last-child')).toBeInTheDocument();
  });
});
