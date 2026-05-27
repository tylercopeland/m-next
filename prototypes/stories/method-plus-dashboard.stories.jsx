/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { colors } from '@m-next/styles';
import { FieldTypeIds } from '@m-next/types';
import Grid from '@m-next/grid2';
import Chart from '@m-next/chart';
import { IconMeasurementBlock } from '../measurement-block/src';

export default {
  title: 'm-one/Prototypes/method-plus/dashboard',
  argTypes: {},
  parameters: {
    jest: ['header.test.jsx'],
    cssresources: [
      {
        id: `Base Styles`,
        code: `<link rel="stylesheet" type="text/css" href=https://staging.methodwarehouse.com/app-builder/app.css"></link>`,
        picked: true,
      },
    ],
  },
};

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const data = [
  {
    name: 'Tokyo',
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
  },
  {
    name: 'New York',
    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
  },
  {
    name: 'London',
    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
  },
  {
    name: 'Berlin',
    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
  },
];

function Template(args) {
  return (
    <div {...args} style={{ overflow: 'scroll', height: 400 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <IconMeasurementBlock
              icon={{
                name: 'mi-icon-contacts',
                size: 48,
                color: colors.blue,
                position: 'left',
              }}
              subFooter={[{ valueType: 9, value: 'Month to date' }]}
              value={[{ valueType: 3, value: 'CalcEmails' }]}
              unit='Signups'
              fields={[
                {
                  name: 'CalcEmails',
                  caption: 'CalcEmails',
                  type: 'Integer',
                  isVisible: false,
                  isRequired: false,
                },
              ]}
              data={{
                CalcEmails: 123,
              }}
            />
            <IconMeasurementBlock
              title={[{ valueType: 9, value: 'Conversion rate' }]}
              icon={{
                name: 'mi-icon-contacts',
                size: 48,
                color: colors.blue,
                position: 'left',
              }}
              subFooter={[{ valueType: 9, value: 'Month to date' }]}
              value={[{ valueType: 3, value: 'CalcEmails' }]}
              unit='%'
              fields={[
                {
                  name: 'CalcEmails',
                  caption: 'CalcEmails',
                  type: 'Decimal',
                  isVisible: false,
                  isRequired: false,
                  displayOptions: {
                    decimalRounding: 2,
                  },
                },
              ]}
              data={{
                CalcEmails: 0.0512,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Chart
              caption='Sales'
              id='test'
              data={data}
              categories={categories}
              chartType='line'
              height={800}
              width='100%'
            />
          </div>
          <Grid
            hideCaption={false}
            caption='To do list'
            searchable={false}
            id='test'
            editable={false}
            pageSize={5}
            pageNumber={1}
            totalRecords={12}
            data={[
              { Name: 'First', Value: 1, Done: false },
              { Name: 'Second', Value: 2, Done: false },
              { Name: 'Third', Value: 3.5, Done: false },
              { Name: 'Fourth', Value: 4, Done: false },
              { Name: 'Fifth', Value: 5, Done: false },
              { Name: 'Sixth', Value: 6.5, Done: false },
              { Name: 'Seventh', Value: 7, Done: false },
              { Name: 'Eigth', Value: 8, Done: false },
              { Name: 'Nineth', Value: 9.5, Done: false },
              { Name: 'Tenth', Value: 10, Done: false },
              { Name: 'Eleventh', Value: 11, Done: false },
              { Name: 'Twelf', Value: 12.5, Done: false },
            ]}
            columns={[
              {
                primary: true,
                name: 'Name',
                editable: true,
                fieldType: FieldTypeIds.Text,
                visible: true,
                columnAlign: 'left',
                width: 'sm',
                caption: 'Task',
              },
              {
                primary: false,
                name: 'Done',
                editable: true,
                fieldType: FieldTypeIds.YesNo,
                visible: true,
                columnAlign: 'right',
                width: 'sm',
              },
            ]}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
          <IconMeasurementBlock
            backgroundColor={colors['green-lightest']}
            title={[{ valueType: 9, value: 'Email campaigns' }]}
            icon={{
              name: 'email',
              size: 48,
              color: colors.green,
              position: 'left',
            }}
            subFooter={[{ valueType: 9, value: 'Month to date' }]}
            value={[{ valueType: 3, value: 'CalcEmails' }]}
            unit='Emails'
            fields={[
              {
                name: 'CalcEmails',
                caption: 'CalcEmails',
                type: 'Integer',
                isVisible: false,
                isRequired: false,
              },
            ]}
            data={{
              CalcEmails: 47,
            }}
          />
          <Grid
            hideCaption={false}
            caption='Email campaigns'
            totalRecords={3}
            id='test-2'
            editable={false}
            pageSize={5}
            pageNumber={1}
            searchable={false}
            data={[
              { Name: 'Welcome Email', Value: '55.9%', Done: '12.0% ' },
              { Name: 'Free Hour', Value: '22.3%', Done: '5.9%' },
              { Name: 'Webinar Session #1', Value: '7.0%', Done: '0.1%' },
            ]}
            columns={[
              {
                primary: true,
                name: 'Name',
                editable: true,
                fieldType: FieldTypeIds.Text,
                visible: true,
                columnAlign: 'left',
                width: 'sm',
                caption: 'Campaign',
              },
              {
                primary: false,
                name: 'Value',
                editable: true,
                fieldType: FieldTypeIds.Text,
                visible: true,
                columnAlign: 'center',
                width: 'sm',
                caption: 'Open rate',
              },
              {
                primary: false,
                name: 'Done',
                editable: true,
                fieldType: FieldTypeIds.Text,
                visible: true,
                columnAlign: 'center',
                width: 'sm',
                caption: 'Click thru',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
export const Default = Template.bind({});
Default.args = {};
