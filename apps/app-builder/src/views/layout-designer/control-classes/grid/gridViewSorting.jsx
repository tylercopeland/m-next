export const createGridViewSorting = (data = { filterField: null, filterOrder: 'asc' }) => ({
  filterField: data.filterField || null,
  filterOrder: data.filterOrder || 'asc',
});

export default createGridViewSorting;
