import React, { useEffect } from 'react';
import Button from '@m-next/button';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { datadogLogs } from '@datadog/browser-logs';
import * as s from './unsubscribe.styles';
import unsubscribeLanguage from '../../constants';
import unsubscribe from '../../../common/services/unsubscribeApi';

function formatString(template, values) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key) =>
    typeof values[key] !== 'undefined' ? values[key] : placeholder,
  );
}

const toastOptions = {
  position: 'top-center',
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  className: 'toast-message',
};

const toastSuccessOptions = {
  ...toastOptions,
  className: 'toast-message',
};

function Unsubscribe() {
  const [subcriptionStatus, setSubcriptionStatus] = React.useState('subscribed');
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email');
  const companyFriendlyName = searchParams.get('companyFriendlyName');
  const emailNotificationRef = searchParams.get('ref');
  const companyAccount = window.location.origin.split('.')[0].split('//').pop();

  const redirect = (action) => {
    switch (action) {
      case 'unsubscribe':
        setSubcriptionStatus('unsubscribed');
        break;
      case 'resubscribe':
        setSubcriptionStatus('resubscribed');
        break;
      default:
        break;
    }
  };

  const handleUnsubscribe = async (successMessage, action) => {
    try {
      await unsubscribe({
        email,
        emailNotificationRef,
        companyAccount,
        IsOptOutOfMarketing: action === 'unsubscribe' || action === 'spam',
      });

      toast.success(<div className='success-content'>{successMessage}</div>, toastSuccessOptions);
      redirect(action);
    } catch (error) {
      toast.error('An error occurred. Please try again later.', toastOptions);
    }
  };

  const handleSpam = () => {
    handleUnsubscribe('This email has reported as spam. Thank you.', 'spam');
    datadogLogs.logger.info('User reported email as spam', {
      email,
      companyAccount,
      companyFriendlyName,
      emailNotificationRef,
    });
  };

  useEffect(() => {
    const message = document.getElementById('subscription-message');
    const { paragraph } = unsubscribeLanguage[subcriptionStatus];
    message.innerHTML = formatString(paragraph, { email, companyFriendlyName });
  }, [subcriptionStatus, email, companyFriendlyName]);

  useEffect(() => {
    document.title = 'Unsubscribe';
  }, []);

  return (
    <s.InnerContentWrapper>
      <s.MessageDiv>
        <s.H1>{unsubscribeLanguage[subcriptionStatus].heading}</s.H1>
        <s.p id='subscription-message' />
        {subcriptionStatus !== 'resubscribed' && (
          <>
            <Button
              style={{ margin: '10px 10px 10px 10px' }}
              id='unsubscribe-btn'
              disabled={false}
              value={unsubscribeLanguage[subcriptionStatus].button}
              onClick={() =>
                handleUnsubscribe(
                  unsubscribeLanguage[subcriptionStatus].successMessage,
                  unsubscribeLanguage[subcriptionStatus].action,
                )
              }
            />
            <s.Divider />
            <s.p>
              Think these emails are spam?{' '}
              <a onClick={handleSpam} href={window.location.href}>
                Let us know
              </a>
            </s.p>
          </>
        )}
      </s.MessageDiv>
    </s.InnerContentWrapper>
  );
}

export default Unsubscribe;
