const validateChart = (control) => {
  const validation = {
    isValid: true,
    tableName: null,
    columns: [null, null],
  };

  if (!control || !control.model) {
    validation.isValid = false;
    validation.tableName = 'Data source is required.';
    return validation;
  }

  if (!control.model.viewName) {
    validation.isValid = false;
    validation.tableName = 'Data source is required.';
    return validation;
  }

  if (!control.model.columns) {
    validation.isValid = false;
    validation.columns[0] = 'X axis is required.';
    validation.columns[1] = 'Y axis is required.';
    return validation;
  }

  if (control.model.columns.length < 1 ||  !control.model.columns[0].name) {
    validation.isValid = false;
    validation.columns[0] = 'X axis is required.';
  }

  if (control.model.columns.length < 2 || !control.model.columns[1].name) {
    validation.isValid = false;
    validation.columns[1] = 'Y axis is required.';
  }

  return validation;
};

export default validateChart;
