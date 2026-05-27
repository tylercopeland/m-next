import config from '../../app/config.json';

export default async ({ email, emailNotificationRef, companyAccount, IsOptOutOfMarketing }) => {
  const apiBaseUrl = config.apis.gateway;

  const encodedEmail = encodeURIComponent(email);
  const encodedCompanyAccount = encodeURIComponent(companyAccount);
  const encodedEmailNotificationRef = encodeURIComponent(emailNotificationRef);
  const encodedIsOptOutOfMarketing = encodeURIComponent(IsOptOutOfMarketing);

  const url = `${apiBaseUrl}email/subscription?email=${encodedEmail}&companyAccount=${encodedCompanyAccount}&emailNotificationRef=${encodedEmailNotificationRef}&IsOptOutOfMarketing=${encodedIsOptOutOfMarketing}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('An error occurred while unsubscribing');
  }
};
