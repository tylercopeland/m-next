import React, { useMemo , useState} from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from '@m-next/styles';
import { createTheme } from '@mui/material';
import { FieldTypeIds, complexValueTypes } from '@m-next/types';
import Grid from '@m-next/grid';
import Chart from '@m-next/chart';
import { Grid as FluidGrid, useTheme } from '@mui/material';
import { colors } from '@m-next/styles';
import { IconMeasurementBlock } from '../../measurement-block/src';
import ResponsiveCanvas from './ResponsiveCanvas';

const tagsList = [
  {
    colour: '#A9D9BF',
    name: 'Add Tag 12',
  },
  {
    colour: '#84F3FF',
    name: 'apr13',
  },
  {
    colour: '#BACAD0',
    name: 'Bind',
  },
  {
    colour: '#B3E5FF',
    name: 'bunny',
  },
  {
    colour: '#FFCDAB',
    name: 'cake',
  },
  {
    colour: '#91A2FF',
    name: 'Contact Edit',
  },
  {
    colour: '#B3E5FF',
    name: 'duck',
  },
  {
    colour: '#91A2FF',
    name: 'Invoices',
  },
  {
    colour: '#FFEA80',
    name: 'kkkkk',
  },
  {
    colour: '#B3E5FF',
    name: 'Memo 123',
  },
  {
    colour: '#FFACA1',
    name: 'Nelson',
  },
  {
    colour: '#FFABB5',
    name: 'New 12 Tag',
  },
  {
    colour: '#B3E5FF',
    name: 'new tag',
  },
  {
    colour: '#B3E5FF',
    name: 'New Tag Feb12',
  },
  {
    colour: '#B3E5FF',
    name: 'new test',
  },
  {
    colour: '#B3E5FF',
    name: 'sdfhsd',
  },
  {
    colour: '#B3E5FF',
    name: 'sdfsd',
  },
  {
    colour: '#B3E5FF',
    name: 'Shoe',
  },
  {
    colour: '#B3E5FF',
    name: 'Test Test',
  },
  {
    colour: '#B3E5FF',
    name: 'Test Test2',
  },
  {
    colour: '#FFCDAB',
    name: 'UATedit',
  },
];

const grid1Data = [
  {
    Name: {
      FullName: 'Alex',
      Email: 'alex@method.me',
      TagList: 'one,cake,bunny',
      Status: 'Hot Lead',
      Balance: 2000,
      __avatar__:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    },
  },
  {
    Name: {
      FullName: 'Mila',
      Email: 'milad@method.me',
      TagList: '',
      Status: 'Lead',
      Balance: 0,
      __avatar__: 'M-3.mci{{w=48}}',
    },
  },
  {
    Name: {
      FullName: 'Mike',
      Email: 'mike@method.me',
      TagList: 'one,Nelson',
      Status: 'Customer',
      Balance: 45000,
      __avatar__: 'M-5.mci{{w=48}}',
    },
  },
];

const grid1DataLead = [
  {
    Name: {
      FullName: 'Alex',
      Email: 'alex@method.me',
      TagList: 'one,cake,bunny',
      Status: 'Hot Lead',
      Balance: 2000,
      __avatar__:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    },
  },
  {
    Name: {
      FullName: 'Mila',
      Email: 'milad@method.me',
      TagList: '',
      Status: 'Lead',
      Balance: 0,
      __avatar__: 'M-3.mci{{w=48}}',
    },
  },
];

const grid1DataConverted = [
  {
    Name: {
      FullName: 'Mike',
      Email: 'mike@method.me',
      TagList: 'one,Nelson',
      Status: 'Customer',
      Balance: 45000,
      __avatar__: 'M-5.mci{{w=48}}',
    },
  },
];

const grid1DataSales = [
  {
    Name: {
      FullName: 'Mike',
      Email: 'mike@method.me',
      TagList: 'one,Nelson',
      Status: 'Customer',
      Balance: 45000,
      __avatar__: 'M-5.mci{{w=48}}',
    },
  },
  {
    Name: {
      FullName: 'Alex',
      Email: 'alex@method.me',
      TagList: 'one,cake,bunny',
      Status: 'Hot Lead',
      Balance: 2000,
      __avatar__:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    },
  },
];

const grid2Data = [
  {
    FullName: 'Alex',
    Email: 'alex@method.me',
    TagList: 'one,cake,bunny',
    Status: 'Hot Lead',
    Balance: 2000,
    Avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
  },
  {
    FullName: 'Mila',
    Email: 'milad@method.me',
    TagList: '',
    Status: 'Lead',
    Balance: 0,
    Avatar: 'M-3.mci{{w=48}}',
  },
  {
    FullName: 'Mike',
    Email: 'mike@method.me',
    TagList: 'one,Nelson',
    Status: 'Customer',
    Balance: 45000,
    __avatar__: 'M-5.mci{{w=48}}',
  },
];

const grid2DataLeads = [
  {
    FullName: 'Alex',
    Email: 'alex@method.me',
    TagList: 'one,cake,bunny',
    Status: 'Hot Lead',
    Balance: 2000,
    Avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
  },
  {
    FullName: 'Mila',
    Email: 'milad@method.me',
    TagList: '',
    Status: 'Lead',
    Balance: 0,
    Avatar: 'M-3.mci{{w=48}}',
  },
];

const grid2DataConverted = [
  {
    FullName: 'Mike',
    Email: 'mike@method.me',
    TagList: 'one,Nelson',
    Status: 'Customer',
    Balance: 45000,
    __avatar__: 'M-5.mci{{w=48}}',
  },
];

const grid2DataSales = [
  {
    FullName: 'Mike',
    Email: 'mike@method.me',
    TagList: 'one,Nelson',
    Status: 'Customer',
    Balance: 45000,
    __avatar__: 'M-5.mci{{w=48}}',
  },
  {
    FullName: 'Alex',
    Email: 'alex@method.me',
    TagList: 'one,cake,bunny',
    Status: 'Hot Lead',
    Balance: 2000,
    Avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
  },
];

const propTypes = {
  isLoading: PropTypes.bool,
  metric1: PropTypes.bool,
  metric2: PropTypes.bool,
  metric3: PropTypes.bool,
  grid1: PropTypes.bool,
  grid2: PropTypes.bool,
  chart1: PropTypes.bool,

  metric1Size: PropTypes.number,
  metric2Size: PropTypes.number,
  metric3Size: PropTypes.number,
  grid1Size: PropTypes.number,
  grid2Size: PropTypes.number,
  chart1Size: PropTypes.number,
  isDarkMode: PropTypes.bool,
};
function ResponsiveCanvasWrapper({
  isLoading,
  metric1,
  metric2,
  metric3,
  grid1,
  grid2,
  chart1,
  metric1Size,
  metric2Size,
  metric3Size,
  grid1Size,
  grid2Size,
  chart1Size,
  isDarkMode,
}) {
  const theme = useMemo(() => createTheme(isDarkMode ? darkTheme : lightTheme), [isDarkMode]);
  const [grid1Filtered, setGrid1Filtered] = useState(grid1Data);
  const [grid2Filtered, setGrid2Filtered] = useState(grid2Data);
  const [filter, setFilter] = useState(null);
  const filterLeads = () => {
    if (filter === 'leads') {
      setFilter(null);
      setGrid1Filtered(grid1Data);
      setGrid2Filtered(grid2Data);
    } else {
      setFilter('leads');
      setGrid1Filtered(grid1DataLead);
      setGrid2Filtered(grid2DataLeads);
    }
  };

  const filterConverted = () => {
    if (filter === 'converted') {
      setFilter(null);
      setGrid1Filtered(grid1Data);
      setGrid2Filtered(grid2Data);
    } else {
      setFilter('converted');
      setGrid1Filtered(grid1DataConverted);
      setGrid2Filtered(grid2DataConverted);
    }
  };

  const filterSales = () => {
    if (filter === 'sales') {
      setFilter(null);
      setGrid1Filtered(grid1Data);
      setGrid2Filtered(grid2Data);
    } else {
      setFilter('sales');
      setGrid1Filtered(grid1DataSales);
      setGrid2Filtered(grid2DataSales);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <ResponsiveCanvas tagsList={tagsList} isLoading={isLoading}>
          {metric1 && (
            <FluidGrid item id='metric1' key='metric1' xs={metric1Size} sm={metric1Size / 2} md={metric1Size}>
              <IconMeasurementBlock
                icon={{
                  name: 'mi-icon-contacts',
                  size: 48,
                  color: colors.yellow,
                  position: 'left',
                }}
                subFooter={[{ valueType: complexValueTypes.Text, value: 'Month to date' }]}
                value={[{ valueType: complexValueTypes.Field, value: 'CalcEmails' }]}
                unit='New Leads'
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
                onClick={filterLeads}
              />
            </FluidGrid>
          )}
          {metric2 && (
            <FluidGrid item id='metric2' key='metric2' xs={metric2Size} sm={metric2Size / 2} md={metric2Size}>
              <IconMeasurementBlock
                title={[{ valueType: complexValueTypes.Text, value: 'Conversion rate' }]}
                icon={{
                  name: 'mi-icon-contacts',
                  size: 48,
                  color: colors.blue,
                  position: 'left',
                }}
                subFooter={[{ valueType: complexValueTypes.Text, value: 'Month to date' }]}
                value={[{ valueType: complexValueTypes.Field, value: 'CalcEmails' }]}
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
                onClick={filterConverted}
              />
            </FluidGrid>
          )}
          {metric3 && (
            <FluidGrid item id='metric3' key='metric3' xs={metric3Size} sm={metric3Size / 2} md={metric3Size}>
              <IconMeasurementBlock
                title={[{ valueType: complexValueTypes.Text, value: 'Sales' }]}
                icon={{
                  name: 'dollar-bill',
                  size: 48,
                  color: colors.green,
                  position: 'left',
                }}
                subFooter={[{ valueType: complexValueTypes.Text, value: 'Month to date' }]}
                value={[{ valueType: complexValueTypes.Field, value: 'CalcEmails' }]}
                unit='$'
                fields={[
                  {
                    name: 'CalcEmails',
                    caption: 'CalcEmails',
                    type: 'Money',
                    isVisible: false,
                    isRequired: false,
                  },
                ]}
                data={{
                  CalcEmails: 47000,
                }}
                onClick={filterSales}
              />
            </FluidGrid>
          )}
          {grid1 && (
            <FluidGrid item id='grid1' key='grid1' xs={grid1Size}>
              <Grid
                hideCaption={false}
                caption='Contacts'
                totalRecords={3}
                editable={false}
                pageSize={10}
                pageNumber={1}
                searchable
                data={grid1Filtered}
                showHeader={false}
                columns={[
                  {
                    primary: true,
                    name: 'Name',
                    editable: true,
                    fieldType: FieldTypeIds.CardColumn,
                    visible: true,
                    columnAlign: 'left',
                    width: 'sm',
                    caption: '',
                    formatType: {
                      type: 'structured',
                    },
                    cardColumnFields: {
                      tagsList,
                      hasAvatar: true,
                      fields: {
                        column1: {
                          line1: {
                            name: 'FullName',
                            caption: 'Full Name',
                            type: 'Text',
                            isVisible: true,
                            isRequired: true,
                            maxLength: 40,
                            styling: {
                              bold: true,
                              fontSize: 'large',
                            },
                          },
                          line2: {
                            name: 'Email',
                            caption: 'Email',
                            type: 'Email',
                            isVisible: true,
                            isRequired: false,
                            maxLength: 400,
                          },
                          line3: {
                            name: 'TagList',
                            caption: 'TagList',
                            type: 'Tags',
                            isVisible: true,
                            isRequired: false,
                          },
                        },
                        column2: {
                          line1: {
                            name: 'Status',
                            caption: 'Status',
                            type: 'Text',
                            displayAs: 'pill',
                            isVisible: true,
                            isRequired: false,
                            maxLength: 400,
                            conditionalFormatting: [{ value: 'Hot Lead', color: 'orange' }],
                          },
                          line2: {
                            name: 'Balance',
                            caption: 'Balance',
                            type: 'Money',
                            isVisible: true,
                            isRequired: false,
                          },
                        },
                      },
                    },
                  },
                ]}
              />
            </FluidGrid>
          )}
          {grid2 && (
            <FluidGrid item id='grid2' key='grid2' xs={grid2Size}>
              <Grid
                hideCaption={false}
                caption='Contacts'
                totalRecords={3}
                editable={false}
                pageSize={10}
                pageNumber={1}
                searchable
                data={grid2Filtered}
                reorderColumns
                columns={[
                  {
                    primary: true,
                    name: 'FullName',
                    caption: 'Full Name',
                    editable: true,
                    fieldType: FieldTypeIds.Text,
                    visible: true,
                    columnAlign: 'left',
                    width: 'sm',
                  },
                  {
                    primary: false,
                    name: 'Email',
                    caption: 'Email',
                    editable: true,
                    fieldType: FieldTypeIds.Text,
                    visible: true,
                    columnAlign: 'left',
                    width: 'sm',
                  },
                  {
                    primary: false,
                    name: 'TagList',
                    caption: 'TagList',
                    editable: true,
                    fieldType: FieldTypeIds.Text,
                    visible: true,
                    columnAlign: 'left',
                    width: 'sm',
                  },
                  {
                    primary: false,
                    name: 'Status',
                    caption: 'Status',
                    editable: true,
                    fieldType: FieldTypeIds.Text,
                    visible: true,
                    columnAlign: 'left',
                    width: 'sm',
                  },
                  {
                    primary: false,
                    name: 'Balance',
                    caption: 'Balance',
                    editable: true,
                    fieldType: FieldTypeIds.Money,
                    visible: true,
                    columnAlign: 'left',
                    width: 'sm',
                  },
                ]}
              />
            </FluidGrid>
          )}
        </ResponsiveCanvas>
      </div>
    </ThemeProvider>
  );
}

ResponsiveCanvasWrapper.propTypes = propTypes;
export default ResponsiveCanvasWrapper;
