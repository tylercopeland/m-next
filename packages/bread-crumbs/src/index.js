import BreadCrumbsHeader from './BreadCrumbsHeader';

// Audit-flagged rename. Package keeps its legacy name (`@m-next/bread-crumbs`) and the
// existing `BreadCrumbsHeader` default export is unchanged for backwards compatibility.
// `Breadcrumbs` is the canonical named export going forward.
export const Breadcrumbs = BreadCrumbsHeader;
export { BreadCrumbsHeader };
export default BreadCrumbsHeader;
