import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import App from './app/app';
import config from './app/config.json';

if (config.datadog.enabled) {
  datadogRum.init({
    applicationId: config.datadog.applicationId,
    clientToken: config.datadog.clientToken,
    site: config.datadog.site,
    service: config.datadog.service,
    env: config.datadog.env,
    version: config.datadog.version,
    sampleRate: config.datadog.sampleRate,
    trackInteractions: config.datadog.trackInteractions,
    defaultPrivacyLevel: config.datadog.defaultPrivacyLevel,
    trackViewsManually: true,
  });
  datadogRum.startSessionReplayRecording();

  datadogLogs.init({
    applicationId: config.datadog.applicationId,
    clientToken: config.datadog.clientToken,
    site: config.datadog.site,
    service: config.datadog.service,
    env: config.datadog.env,
    version: config.datadog.version,
    sampleRate: config.datadog.sampleRate,
    forwardErrorsToLogs: true,
    forwardConsoleLogs: 'error',
  });
}

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root'),
);
