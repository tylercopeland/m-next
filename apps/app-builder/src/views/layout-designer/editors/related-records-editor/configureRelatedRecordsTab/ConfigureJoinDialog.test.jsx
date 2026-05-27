 
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import { Provider } from 'react-redux';

import ConfigureJoinDialog from './ConfigureJoinDialog';
import fieldListContacts from '../../../../../../testing/data/fieldListContacts.json';
import fieldListActivities from '../../../../../../testing/data/fieldListActivities.json';
import { store } from '../../../../../app/store';

fetchMock.enableMocks();

describe('ConfigureJoinDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDismiss = jest.fn();
  const defaultProps = {
    onClose: mockOnClose,
    onUpdate: mockOnUpdate,
    onDismiss: mockOnDismiss,
    fromApp: 'PrimaryApp',
    toApp: 'RelatedApp',
    fromField: 'Entity_RecordID',
    toField: 'Entity_RecordID',
    fromView: 'Contacts',
    toView: 'Activities',
    fromFieldList: fieldListContacts,
    toFieldList: fieldListActivities,
    displayPreferences: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Data: [], IsSuccess: true, Status: 0 }),
      }),
    );
  });

  it('renders correctly with the provided props', () => {
    render(
      <Provider store={store}>
        <ConfigureJoinDialog {...defaultProps} />
      </Provider>,
    );

    expect(screen.getByText('Which related information you would like to add?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Edit the fields for which you would like to create the relation between (i.e. Invoices linked to a Contact).',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Primary App')).toBeInTheDocument();
    expect(screen.getByText('Related App')).toBeInTheDocument();
    expect(screen.getByText('Field list from PrimaryApp')).toBeInTheDocument();
    expect(screen.getByText('Field list from RelatedApp')).toBeInTheDocument();
  });

  it('Update disable when no changes', () => {
    render(
      <Provider store={store}>
        <ConfigureJoinDialog {...defaultProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Update'));

    expect(mockOnUpdate).toHaveBeenCalledTimes(0);
  });

  it('calls onClose when the dialog close button is clicked', () => {
    render(
      <Provider store={store}>
        <ConfigureJoinDialog {...defaultProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('img', { name: /close-v4 icon/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
