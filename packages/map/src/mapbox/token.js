// Mapbox access token redacted before publishing m-next to a public GitHub repo.
// The original token (in m-one source) was domain-restricted to Method's
// trusted origins, but it was still a credential and GitHub's push protection
// correctly rejected it. When cleaning up @m-next/map, source the token from
// an environment variable or runtime config layer.
export const MapboxAccessToken = (typeof process !== 'undefined' && process.env && process.env.MAPBOX_TOKEN) || '';
export default MapboxAccessToken;
