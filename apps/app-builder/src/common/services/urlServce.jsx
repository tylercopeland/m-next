export const getHostName = () => {
  const { hostname } = window.location;

  const parts = hostname.split('.');

  if (parts.length > 2 && (parts[parts.length - 2].length <= 3 || parts[parts.length - 1].length <= 3)) {
    // Check if it's a known TLD like 'co.uk' or a short TLD
    return parts.slice(-2).join('.'); // For example, 'example.co.uk'
  }
  if (parts.length > 2) {
    // General case for subdomains, e.g., 'sub.example.com'
    return parts.slice(-2).join('.'); // Returns 'example.com'
  }
  // Case for naked domains, e.g., 'example.com'
  return hostname;
};

export const getGatewayUrl = () => {
  const host = getHostName();
  return host === 'methodlocal.com' ? `https://api.${host}/v2/` : `https://api.${host}/`;
};

export const getNodeCodeAssistantUrl = () => {
  const host = getHostName();
  return host === 'methodlocal.com' ? `http://localhost:3100` : `https://nca.${host}/`;
};

export const getDesignerUrl = () => {
  const host = getHostName();
  return `https://designer.${host}/`;
};
export const getRuntimeUrl = () => {
  const host = getHostName();
  return `https://runtime.${host}/`;
};
