import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { lightTheme } from '@m-next/styles';
import { managementApi } from '../src/common/services/managementApi';
import { nocodeAssistantApi } from '../src/common/services/nocodeAssistantApi';
import Header from '../src/views/header';
import '../src/app/app.css';

// Create a mock Redux store for Storybook
const mockStore = configureStore({
  reducer: {
    session: (
      state = { featureFlags: {}, tokenRTC: '', accountName: '', tokenV2: '', nocodeAssistantSessionId: null },
    ) => state,
    app: (state = { hasSpecDoc: false }) => state,
    screenLayout: (state = { baseModel: null }) => state,
    [managementApi.reducerPath]: managementApi.reducer,
    [nocodeAssistantApi.reducerPath]: nocodeAssistantApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(managementApi.middleware).concat(nocodeAssistantApi.middleware),
});

setupListeners(mockStore.dispatch);

export default {
  component: Header,
  title: 'app-builder/header',
  argTypes: {},
  parameters: {
    jest: ['header.test.jsx'],
    design: {
      type: 'figma',
    },
  },
};
const theme = createTheme(lightTheme);

function Template(args) {
  return (
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <Header {...args} />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}
export const Default = Template.bind({});
Default.args = {
  id: 'test ',
  appName: 'Contacts',
  screenName: 'View Contacts',
  versionNumber: 27,
  accountingPackage: 'All',
  isDeveloper: true,
  publishStatus: 'Draft',
  hasLayoutChanges: false,
  showAppInfo: true,
};
