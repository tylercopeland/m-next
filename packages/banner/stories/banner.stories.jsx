import React from 'react';
import Banner from '../src';

export default {
  component: Banner,
  title: 'm-one/Banner',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xnh6ZMW6oZ1pwWgKzfROqJ/Version-Managment?node-id=11%3A4',
    },
  },
};

function Template(args) {
  return <Banner {...args} />;
}
export const MessageOnly = Template.bind({});
MessageOnly.args = {
  message:
    'You’re using a draft version of this screen. To publish this version to all users or revert back to the original version click Manage.',
};

export const OneAction = Template.bind({});
OneAction.args = {
  message: 'You’re using a draft version of this screen.',
  primaryButton: 'Learn More',
  hasClose: true,
  bannerStyle: 'trailing',
};

export const TwoActions = Template.bind({});
TwoActions.args = {
  message:
    'You’re using a draft version of this screen. To publish this version to all users or revert back to the original version click Manage.',
  primaryButton: 'Manage',
  secondaryButton: 'Make Live',
};

export const ChildElementAsMessage = Template.bind({});
ChildElementAsMessage.args = {
  primaryButton: 'click here',
  hasClose: true,
  bannerStyle: 'trailing',
  children: (
    <span>
      <strong>You’re using a draft version of this screen.</strong> To publish or revert back to the original version
    </span>
  ),
};

export const ChildElementAsMessageNoButton = Template.bind({});
ChildElementAsMessageNoButton.args = {
  hasClose: true,
  bannerStyle: 'trailing',
  children: (
    <span>
      <strong>You’re using a draft version of this screen.</strong> To publish or revert back to the original version{' '}
      <a href='www.google.com' style={{ color: '#0D71C8' }}>
        click here
      </a>
      .
    </span>
  ),
};

export const InformationalSeverityIconOneAction = Template.bind({});
InformationalSeverityIconOneAction.args = {
  primaryButton: 'Download template',
  hasClose: false,
  bannerStyle: 'full',
  icon: 'mi-icon-cloud-download-V4',
  children: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>
        <b>Template</b> - download our leads template to help organize your file before importing
      </p>
    </div>
  ),
};

export const ErrorSeverityOneAction = Template.bind({});
ErrorSeverityOneAction.args = {
  message: '2 records with conflicts. These issues must be addressed before moving forward.',
  primaryButton: 'Learn More',
  hasClose: false,
  bannerStyle: 'full',
  severity: 'error',
};

export const ErrorSeverityIconOneAction = Template.bind({});
ErrorSeverityIconOneAction.args = {
  message: '2 records with conflicts. These issues must be addressed before moving forward.',
  primaryButton: 'Learn More',
  hasClose: false,
  bannerStyle: 'full',
  severity: 'error',
  icon: 'warning-sign',
};

export const SuccessSeverityOneAction = Template.bind({});
SuccessSeverityOneAction.args = {
  message: '12 records are ready for import.',
  primaryButton: 'Learn More',
  hasClose: false,
  bannerStyle: 'full',
  severity: 'success',
};

export const SuccessSeverityIconOneAction = Template.bind({});
SuccessSeverityIconOneAction.args = {
  message: '12 records are ready for import.',
  primaryButton: 'Learn More',
  hasClose: false,
  bannerStyle: 'full',
  severity: 'success',
  icon: 'check-circle-1-v4',
};
