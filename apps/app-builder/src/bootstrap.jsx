import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { registerLicense } from '@syncfusion/ej2-base';

// Add all Syncfusion CSS imports in consistent order BEFORE any component imports
import '@syncfusion/ej2-base/styles/tailwind.css';
import '@syncfusion/ej2-buttons/styles/tailwind.css';
import '@syncfusion/ej2-calendars/styles/tailwind.css';
import '@syncfusion/ej2-dropdowns/styles/tailwind.css';
import '@syncfusion/ej2-inputs/styles/tailwind.css';
import '@syncfusion/ej2-splitbuttons/styles/tailwind.css';
import '@syncfusion/ej2-lists/styles/tailwind.css';
import '@syncfusion/ej2-navigations/styles/tailwind.css';
import '@syncfusion/ej2-popups/styles/tailwind.css';
import '@syncfusion/ej2-react-dropdowns/styles/tailwind.css';
import '@syncfusion/ej2-react-layouts/styles/tailwind.css';
import '@syncfusion/ej2-react-schedule/styles/tailwind.css';

import App from './app/app';
import { store } from './app/store';
import config from './app/config.json';
import { getHostName } from './common/services/urlServce';

const getEnvironment = () => {
  const hostname = getHostName();

  if (hostname === 'methodlocal.com') {
    return 'local';
  }

  if (hostname === 'method.me') {
    return 'production';
  }
  return hostname.split('.')[0].replace('method', '');
};

const hostname = getHostName();

const isDDEnabled = hostname !== 'methodlocal.com';
const environment = getEnvironment();

if (isDDEnabled) {
  datadogRum.init({
    applicationId: config.datadog.applicationId,
    clientToken: config.datadog.clientToken,
    site: config.datadog.site,
    service: config.datadog.service,
    env: environment,
    version: config.datadog.version,
    sessionSampleRate: config.datadog.sampleRate,
    trackUserInteractions: config.datadog.trackInteractions,
    trackFrustrations: true,
    trackLongTasks: true,
    trackResources: true,
    trackSessionAcrossSubdomains: true,
    defaultPrivacyLevel: config.datadog.defaultPrivacyLevel,
    trackViewsManually: true,
    allowedTracingUrls: [/https:\/\/.*\.method\.me/, /https:\/\/.*\.methodwarehouse\.com/],
    enableExperimentalFeatures: ['clickmap'],
    sessionReplaySampleRate: config.datadog.sampleRate,
    startSessionReplayRecordingManually: true,
  });
  datadogRum.startSessionReplayRecording();

  datadogLogs.init({
    applicationId: config.datadog.applicationId,
    clientToken: config.datadog.clientToken,
    site: config.datadog.site,
    service: config.datadog.service,
    env: environment,
    version: config.datadog.version,
    sessionSampleRate: config.datadog.sampleRate,
    trackLongTasks: true,
    trackResources: true,
    trackSessionAcrossSubdomains: true,
    forwardErrorsToLogs: true,
    forwardConsoleLogs: ['error'],
  });
}

registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXdfeHVdQ2ZdWUx+W0Q=');

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);
