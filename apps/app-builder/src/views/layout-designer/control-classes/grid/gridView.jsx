import { Guid } from '@m-next/utilities';

export const migrateGridView = (gridView, index) => {
  const newGridView = { ...gridView };
  let migrated = false;

  if (newGridView.isVisible === undefined || newGridView.isVisible === null) {
    newGridView.isVisible = true;
    migrated = true;
  }

  if (newGridView.filtering === undefined || newGridView.filtering === null) {
    newGridView.filtering = []; 
    migrated = true;
  }
  
  if (!newGridView.name) {
    newGridView.name = `View ${index + 1}`;
    migrated = true;
  }

  return migrated ? newGridView : null;
};

export const createGridView = (
  data = {
    id: null,
    name: '',
    caption: '',
    columns: [],
    sorting: [],
    filtering: [],
    enableDynamicDates: false,
    visible: true,
  },
) => ({
  id: data.id || Guid.create(),
  name: data.name || '',
  caption: data.caption || '',
  columns: data.columns || [],
  sorting: data.sorting || [],
  filtering: data.filtering || [],
  enableDynamicDates: data.enableDynamicDates === undefined ? false : data.enableDynamicDates,
  visible: data.isVisible === undefined ? true : data.isVisible,
});

export default createGridView;
