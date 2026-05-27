export const createGridViewColumn = (data = { field: null, visible: true, caption: '' }) => ({
  field: data.field || null,
  visible: data.visible === undefined ? true : data.visible,
  caption: data.caption || '',
});

export default createGridViewColumn;
