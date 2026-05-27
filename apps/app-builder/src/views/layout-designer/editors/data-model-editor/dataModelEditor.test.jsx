 
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataModelEditor from './dataModelEditor';
import projection from './dataModelEditor.test.json';
import fieldList from '../../../../../testing/data/fieldListContacts.json';
import data from '../../../../../testing/data/dataContacts.json';

expect.extend(matchers);

const setup = (node = 'AltEmail') => {
  const mockOnChange = jest.fn();

  const utils = render(
    <DataModelEditor
      id='test'
      controlName='FieldBlock'
      projection={projection}
      fieldList={fieldList}
      data={data}
      onChange={mockOnChange}
    />
  );
  const wrapperNode = utils.getByTestId(`data-model-wrapper-FieldBlock-${node}`);
  const wrapper = within(wrapperNode);
  const headerNode = utils.getByTestId(`data-model-header-FieldBlock-${node}`);
  const header = within(wrapperNode);
  const contentNode = utils.getByTestId(`data-model-content-FieldBlock-${node}`);
  const content = within(wrapperNode);
  return {
    mockOnChange,
    wrapper,
    wrapperNode,
    headerNode,
    header,
    contentNode,
    content,
    ...utils,
  };
};

describe('Data Model Editor', () => {
  beforeEach(() => {
    jest.mock('react-beautiful-dnd', () => ({
      Droppable: ({ children }) =>
        children(
          {
            draggableProps: {
              style: {},
            },
            innerRef: jest.fn(),
          },
          {}
        ),
      Draggable: ({ children }) =>
        children(
          {
            draggableProps: {
              style: {},
            },
            innerRef: jest.fn(),
          },
          {}
        ),
      DragDropContext: ({ children }) => children,
    }));
  });
   
  afterEach(() => (document.body.innerHTML = ``));
/*
  describe('Snapshots', () => {
    test('Defaults', async () => {
      const tree = render(<DataModelEditor />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Loading field list', async () => {
      const tree = render(<DataModelEditor fieldListLoading id='test' controlName='FieldBlock' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Error loading field list', async () => {
      const tree = render(<DataModelEditor fieldLoadingError='error' id='test' controlName='FieldBlock' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Projection and data', async () => {
      const tree = render(
        <DataModelEditor projection={projection} fieldList={fieldList} data={data} id='test' controlName='FieldBlock' />
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Dragging Line', async () => {
      const tree = render(
        <DataModelLine id={`FieldBlock-${fieldList[0].name}`} field={fieldList[0]} index={0} isDragging />
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
  */
  describe('Functional', () => {
    it('Render Projection', async () => {
      const { wrapper, headerNode, contentNode } = setup();
      expect(wrapper.getByText('Alt email')).toBeVisible();
      //  expect(contentNode).not.toBeVisible();

      fireEvent.click(headerNode);
      expect(contentNode).toBeVisible();
    });

    it('Render Linked field', async () => {
      const { wrapper, headerNode } = setup('CompanyName');
      expect(wrapper.getByText('Company name')).toBeVisible();
      fireEvent.click(headerNode);
      expect(wrapper.getByText('Linked(Text)')).toBeVisible();
      expect(wrapper.getByText('CompanyName(Entity.CompanyName)')).toBeVisible();
    });

    it('Updating the caption changes the header', async () => {
      const { mockOnChange, content } = setup();
      const captionInput = content.getByLabelText('Caption');
      userEvent.type(captionInput, 'Old Email');
      expect(mockOnChange.mock.calls).toHaveLength(9);
    });

    it('Fire Delete Event', async () => {
      const { content, mockOnChange } = setup();
      const removeButton = content.getByLabelText('delete icon');
      fireEvent.click(removeButton);
      expect(mockOnChange.mock.calls).toHaveLength(1);
    });

    it('No Change Callback doesn`t break', async () => {
      const utils = render(
        <DataModelEditor id='test' controlName='FieldBlock' projection={projection} fieldList={fieldList} data={data} />
      );
      const wrapperNode = utils.getByTestId('data-model-wrapper-FieldBlock-AltEmail');
      const content = within(wrapperNode);
      const removeButton = content.getByLabelText('delete icon');
      fireEvent.click(removeButton);
      expect(true).toBeTruthy();
    });

    it('Add item', async () => {
      const { getByText, mockOnChange } = setup();

      userEvent.click(document.getElementById('data-model-field-list-dropdown-list-input'));
      userEvent.type(document.getElementById('data-model-field-list-dropdown-list-input'), 'assign');

      userEvent.click(getByText('Assigned to'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const update = { ...projection };
      update.fields.push({
        name: 'AssignedTo',
        caption: 'Assigned to',
        type: 'Text',
        isVisible: true,
        isRequired: false,
        sourceModel: 'Entity',
        sourceField: 'UserName',
      });
      expect(mockOnChange).toHaveBeenCalledWith(update);
    });

    it('Add item to empty projection', async () => {
      const mockOnChange = jest.fn();

      const { getByText } = render(
        <DataModelEditor id='test' controlName='FieldBlock' fieldList={fieldList} data={data} onChange={mockOnChange} />
      );

      userEvent.click(document.getElementById('data-model-field-list-dropdown-list-input'));
      userEvent.type(document.getElementById('data-model-field-list-dropdown-list-input'), 'assign');

      userEvent.click(getByText('Assigned to'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const update = {
        id: 'test',
        fields: [
          {
            name: 'AssignedTo',
            caption: 'Assigned to',
            type: 'Text',
            isVisible: true,
            isRequired: false,
            sourceModel: 'Entity',
            sourceField: 'UserName',
          },
        ],
      };
      expect(mockOnChange).toHaveBeenCalledWith(update);
    });

    it('Updating the True Value and False Value', async () => {
      const { mockOnChange, content } = setup('IsOptOutOfMarketing');
      const trueInput = content.getByLabelText('True value');
      expect(trueInput).toHaveValue(projection.fields[5].displayOptions.trueValue);
      userEvent.type(trueInput, 'one');

      expect(mockOnChange).toHaveBeenCalledTimes(3);

      const falseInput = content.getByLabelText('False value');
      expect(falseInput).toHaveValue(projection.fields[5].displayOptions.falseValue);
      userEvent.type(falseInput, 'two');

      expect(mockOnChange).toHaveBeenCalledTimes(6);
    });

    it('Updating Decimal Rounding', async () => {
      const { mockOnChange, content } = setup('CPEPerYear');
      const trueInput = content.getByLabelText('Decimal rounding');
      expect(trueInput).toHaveValue(null);
      userEvent.type(trueInput, '4');

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('Updating DateTime fotmat', async () => {
      const { mockOnChange, content } = setup('BirthDate');
      userEvent.click(document.getElementById('data-model-date-format-FieldBlock-BirthDate-dropdown-list-input'));
      userEvent.type(
        document.getElementById('data-model-date-format-FieldBlock-BirthDate-dropdown-list-input'),
        'short'
      );
      userEvent.click(content.getByText('Short date'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('Field types flag enabled', async () => {
      const { getByText, mockOnChange } = setup('AltEmail', { fieldTypes: true });

      userEvent.click(document.getElementById('data-model-field-list-dropdown-list-input'));
      userEvent.type(document.getElementById('data-model-field-list-dropdown-list-input'), 'Created Date');

      userEvent.click(getByText('Entity created date'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const update = { ...projection };
      update.fields.push({
        name: 'EntityCreatedDate',
        caption: 'Entity created date',
        type: 'DateTime',
        isVisible: true,
        isRequired: false,
        sourceModel: 'Entity',
        sourceField: 'CreatedDate',
        displayOptions: {
          dateFormat: 1,
        },
      });
      expect(mockOnChange).toHaveBeenCalledWith(update);
    });
  });
});
