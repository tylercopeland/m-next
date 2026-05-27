import config from '../../app/config.json';

export const verify = async ({ token }) => {
  const apiBaseUrl = config.apis.gateway;

  const url = `${apiBaseUrl}email/emailverification/verify`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(token),
  });

  if (response.ok) {
    const responseJson = await response.json();
    return responseJson;
  }

  const responseJson = await response.json();
  throw new Error(responseJson.message);
};

export const resend = async ({ token }) => {
  const apiBaseUrl = config.apis.gateway;

  const url = `${apiBaseUrl}email/emailverification/resend`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(token),
  });

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }

  throw new Error(responseJson.message);
};

export const sniperLink = async ({ email }) => {
  const apiBaseUrl = config.apis.gateway;

  const url = `${apiBaseUrl}email/emailverification/sniperLink`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });

  if (response.status === 204) return null;

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }
  throw new Error(responseJson.message);
};
