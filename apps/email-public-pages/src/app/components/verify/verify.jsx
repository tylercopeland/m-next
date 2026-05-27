import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '@m-next/button';
import styled from '@emotion/styled';
import LoadingSkeleton from '@m-next/loading-skeleton';
import * as s from './verify.styles';
import { verify, resend, sniperLink } from '../../../common/services/verificationApi';
import CheckIllustration from '../checkIllustration';
import FailureIcon from '../failureIcon';
import MethodLogo from '../methodLog';
import SuccessIcon from '../successIcon';

function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [wasAlreadyVerified, setWasAlreadyVerified] = useState(false);
  const [isResendAttempted, setIsResendAttempted] = useState(false);
  const [isResendSuccess, setIsResendSuccess] = useState(false);
  const CustomButton = styled(Button)(s.Button);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [inboxLink, setInboxLink] = useState(null);

  const handleError = (err) => {
    const message = err?.message?.length > 0 ? err.message : 'Unknown error.';
    if (message.length > 500) {
      setError(`${message.substring(0, 500)}...`);
    } else {
      setError(message);
    }
  };

  useEffect(() => {
    const handleVerify = async () => {
      try {
        const response = await verify({ token });
        if (!response.success) throw new Error(response.message);
        setEmail(response.email);
        setIsVerified(true);
        setWasAlreadyVerified(response.message === 'Already verified');
      } catch (err) {
        setIsVerified(false);
        handleError(err);
      }

      setIsLoading(false);
    };

    document.title = 'Verify Email';
    handleVerify();
  }, [token]);

  const handleResend = async () => {
    setIsResendAttempted(true);
    try {
      setIsLoading(true);
      const response = await resend({ token });
      const link = await sniperLink({ email: response.email });

      setEmail(response.email);
      setInboxLink(link);
      setIsResendSuccess(true);
    } catch (err) {
      setIsResendSuccess(false);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <s.InnerContentWrapper>
      <s.VerifyMainDiv>
        <MethodLogo />
        <s.VerifyWrapperDiv>
          {isLoading && (
            <>
              <s.VerifyContentDiv>
                <>
                  <LoadingSkeleton count={1} width='250.94px' height='33px' circle={false} duration={1.4} />
                  <LoadingSkeleton count={1} width='112px' height='78px' circle={false} duration={1.4} />
                  <LoadingSkeleton count={1} width='381px' height='69px' circle={false} duration={1.4} />
                </>
              </s.VerifyContentDiv>
              <LoadingSkeleton count={1} width='380px' height='48px' circle={false} duration={1.4} />
            </>
          )}

          {!isLoading && isVerified && !wasAlreadyVerified && (
            <>
              <s.VerifyContentDiv>
                <s.H1>You&apos;ve been verified!</s.H1>
                <CheckIllustration />

                <s.VerifyText>
                  Thank you for verifying your email address.
                  <br />
                  This will help us make sure that all of your data remains secure.
                </s.VerifyText>
              </s.VerifyContentDiv>

              <CustomButton
                buttonStyle='v4-primary'
                id='continue-btn'
                disabled={false}
                onClick={() => {
                  window.location.href = '/apps/Default.aspx';
                }}
                value='Continue to Method'
              />
            </>
          )}

          {!isLoading && isVerified && wasAlreadyVerified && (
            <>
              <s.VerifyContentDiv>
                <s.H1>You&apos;re already verified!</s.H1>
                <CheckIllustration />

                <s.VerifyText>
                  Great news! It looks like you&apos;ve already verified
                  <br />
                  this email. You&apos;re all set to go.
                </s.VerifyText>
              </s.VerifyContentDiv>

              <CustomButton
                buttonStyle='v4-primary'
                id='continue-btn'
                disabled={false}
                onClick={() => {
                  window.location.href = '/apps/Default.aspx';
                }}
                value='Continue to Method'
              />
            </>
          )}

          {!isLoading && !isVerified && (
            <>
              {!isResendAttempted && (
                <>
                  <s.VerifyContentDiv>
                    <s.H1>Verification unsuccessful</s.H1>

                    <s.StatusWrapper>
                      <s.StatusRow>
                        <FailureIcon size={24} />
                        <s.StatusColumn>
                          <s.H4>Unable to verify your email</s.H4>
                          <s.StatusText>
                            We couldn&apos;t verify {email ?? 'your email'} due to the following error &ndash;{' '}
                            <strong>{error ?? 'Unknown error.'}</strong>
                          </s.StatusText>
                        </s.StatusColumn>
                      </s.StatusRow>
                    </s.StatusWrapper>

                    <s.VerifyText>
                      Try to resend your verification email.
                      <br />
                      If the issue persists, please contact us for help.
                    </s.VerifyText>
                  </s.VerifyContentDiv>

                  <s.VerifyCTA>
                    <CustomButton
                      buttonStyle='v4-primary'
                      id='resend-btn'
                      disabled={false}
                      onClick={handleResend}
                      value='Resend verification email'
                    />
                    <CustomButton
                      buttonStyle='ghost'
                      id='contact-us-btn'
                      disabled={false}
                      onClick={() => {
                        window.open('https://www.method.me/contact-us/', '_blank');
                      }}
                      value='Contact us for help'
                    />
                  </s.VerifyCTA>
                </>
              )}

              {isResendAttempted && isResendSuccess && (
                <>
                  <s.VerifyContentDiv>
                    <s.H1>Verify your email address</s.H1>

                    <s.StatusWrapper isSuccess>
                      <s.StatusRow>
                        <SuccessIcon size={24} />
                        <s.StatusColumn>
                          <s.H4>Verification email has been sent</s.H4>
                          <s.StatusText isSuccess>
                            We have sent the verification email to {email ?? 'your inbox'}.
                          </s.StatusText>
                        </s.StatusColumn>
                      </s.StatusRow>
                    </s.StatusWrapper>

                    <s.VerifyText>
                      If you don&apos;t receive the link within 5 minutes,
                      <br />
                      please <strong>check your spam folder.</strong>
                      <br />
                      If the issue persists, please contact us for help.
                    </s.VerifyText>
                  </s.VerifyContentDiv>

                  <s.VerifyCTA>
                    {inboxLink && (
                      <CustomButton
                        buttonStyle='v4-primary'
                        id='resend-btn'
                        disabled={false}
                        onClick={() => {
                          window.open(inboxLink, '_blank');
                        }}
                        value='Take me to my inbox'
                      />
                    )}
                    <CustomButton
                      buttonStyle='ghost'
                      id='contact-us-btn'
                      disabled={false}
                      onClick={() => {
                        window.open('https://www.method.me/contact-us/', '_blank');
                      }}
                      value='Contact us for help'
                    />
                  </s.VerifyCTA>
                </>
              )}

              {isResendAttempted && !isResendSuccess && (
                <>
                  <s.VerifyContentDiv>
                    <s.H1>Verify your email address</s.H1>

                    <s.StatusWrapper isSuccess={false}>
                      <s.StatusRow>
                        <FailureIcon size={24} />
                        <s.StatusColumn>
                          <s.H4>Unable to resend verification email</s.H4>
                          <s.StatusText isSuccess={false}>
                            We couldn&apos;t resend the verification email due to the following error &ndash;{' '}
                            <strong>{error ?? 'Unknown error.'}</strong>
                          </s.StatusText>
                        </s.StatusColumn>
                      </s.StatusRow>
                    </s.StatusWrapper>

                    <s.VerifyText>
                      Try to resend the verification email.
                      <br />
                      If the issue persists, please contact us for help.
                    </s.VerifyText>
                  </s.VerifyContentDiv>

                  <s.VerifyCTA>
                    <CustomButton
                      buttonStyle='v4-primary'
                      id='resend-btn'
                      disabled={false}
                      onClick={handleResend}
                      value='Resend verification email'
                    />
                    <CustomButton
                      buttonStyle='ghost'
                      id='contact-us-btn'
                      disabled={false}
                      onClick={() => {
                        window.open('https://www.method.me/contact-us/', '_blank');
                      }}
                      value='Contact us for help'
                    />
                  </s.VerifyCTA>
                </>
              )}
            </>
          )}
        </s.VerifyWrapperDiv>
      </s.VerifyMainDiv>
    </s.InnerContentWrapper>
  );
}

export default Verify;
