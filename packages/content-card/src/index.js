import ContentCard from './ContentCard';

// Canonical name (audit-flagged rename: ContentCard → ActionCard).
// The package name `@m-next/content-card` and the default export stay for
// backwards compatibility.
export { ContentCard as ActionCard };
export { ContentCard };
export default ContentCard;
