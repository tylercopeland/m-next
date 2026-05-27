import template from "./tmpl.html";

export default function DateFunctionsModel(BaseModel, ResultToSetModel, ComplexValueModel, ControlModel) {
  function DateFunctionsModel(data) {
    this.Source = new ComplexValueModel({ ValueType: 11, Value: new Date() });
    this.UpdateControl = false;
    this.ControlToUpdate = null;
    this.ResultToSet = new ResultToSetModel();
    this.DateFunctionType = 13;
    this.Options = null;
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      if (data.ResultToSet !== null) {
        this.ResultToSet = new ResultToSetModel(data.ResultToSet);
      } else {
        this.ResultToSet = null;
      }
      this.Source = new ComplexValueModel(data.Source);
      this.ControlToUpdate = data.ControlToUpdate ? new ControlModel(data.ControlToUpdate) : data.ControlToUpdate;

      switch (this.DateFunctionType) {
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          this.Options.Amount = new ComplexValueModel(this.Options.Amount);
          break;
        case 14:
          this.Options.OtherDate = new ComplexValueModel(this.Options.OtherDate);
          break;
      }
    }
  }

  DateFunctionsModel.prototype = angular.copy(BaseModel.prototype);

  DateFunctionsModel.prototype.dateFunctionTypes = [
    { value: 13, label: 'Format Date' },
    { value: 0, label: 'Year' },
    { value: 1, label: 'Month' },
    { value: 2, label: 'Day' },
    { value: 3, label: 'Hour' },
    { value: 4, label: 'Minute' },
    { value: 11, label: 'Day of Week' },
    { value: 10, label: 'Day of Year' },
    { value: 22, label: 'First Day of Week' },
    { value: 23, label: 'Last Day of Week' },
    { value: 15, label: 'First Day of Month' },
    { value: 16, label: 'Last Day of Month' },
    { value: 18, label: 'First Day of Quarter' },
    { value: 19, label: 'Last Day of Quarter' },
    { value: 20, label: 'First Day of Year' },
    { value: 21, label: 'Last Day of Year' },
    { value: 12, label: 'Other Date for Day' },
    { value: 5, label: 'Add Years' },
    { value: 6, label: 'Add Months' },
    { value: 7, label: 'Add Days' },
    { value: 8, label: 'Add Hours' },
    { value: 9, label: 'Add Minutes' },
    { value: 14, label: 'Date Difference' },
    { value: 17, label: 'Convert to UTC' }
  ];

  function getDateFormats() {
    var d = new Date();

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var curDate = d.getDate();
    var curDay = d.getDay();
    var curMonth = d.getMonth();
    var curYear = d.getFullYear();

    var curHour = d.getHours() > 9 ? `${d.getHours()}` : `0${d.getHours()}`;
    var cur12Hour = d.getHours() % 12;
    cur12Hour = cur12Hour ? cur12Hour : 12; // the hour '0' should be '12'
    cur12Hour = cur12Hour > 9 ? `${cur12Hour}` : `0${cur12Hour}`;
    var curMinute = d.getMinutes() > 9 ? `${d.getMinutes()}` : `0${d.getMinutes()}`;
    var curSec = d.getSeconds() > 9 ? `${d.getSeconds()}` : `0${d.getSeconds()}`;

    var curApm = d.getHours() < 12 ? 'AM' : 'PM';

    var formatArr = [
      { value: 1, label: `d: ${curMonth + 1}/${curDate}/${curYear}` },
      { value: 2, label: `D: ${days[curDay]}, ${months[curMonth]} ${curDate}, ${curYear}` },
      { value: 3, label: `f: ${days[curDay]}, ${months[curMonth]} ${curDate}, ${curYear} ${cur12Hour}:${curMinute} ${curApm}` },
      { value: 4, label: `F: ${days[curDay]}, ${months[curMonth]} ${curDate}, ${curYear} ${cur12Hour}:${curMinute}:${curSec} ${curApm}` },
      { value: 5, label: `g: ${curMonth + 1}/${curDate}/${curYear} ${cur12Hour}:${curMinute} ${curApm}` },
      { value: 6, label: `G: ${curMonth + 1}/${curDate}/${curYear} ${cur12Hour}:${curMinute}:${curSec} ${curApm}` },
      { value: 7, label: `m: ${months[curMonth]} ${curDate}` },
      { value: 8, label: `o: ${curYear}-${curMonth + 1 > 9 ? curMonth + 1 : `0${curMonth + 1}`}-${curDate > 9 ? curDate : `0${curDate}`}T${curHour}:${curMinute}:${curSec}.0000000-00:00` },
      { value: 12, label: `s: ${curYear}-${curMonth + 1 > 9 ? curMonth + 1 : `0${curMonth + 1}`}-${curDate > 9 ? curDate : `0${curDate}`}T${curHour}:${curMinute}:${curSec}` },
      { value: 13, label: `t: ${cur12Hour}:${curMinute} ${curApm}` },
      { value: 14, label: `T: ${cur12Hour}:${curMinute}:${curSec} ${curApm}` },
      { value: 15, label: `u: ${curYear}-${curMonth + 1 > 9 ? curMonth + 1 : `0${curMonth + 1}`}-${curDate > 9 ? curDate : `0${curDate}`} ${curHour}:${curMinute}:${curSec}Z` },
      { value: 16, label: `U: ${days[curDay]}, ${months[curMonth]} ${curDate}, ${curYear} ${d.getHours() ? d.getHours() : 12}:${curMinute}:${curSec} ${curApm}` },
      { value: 17, label: `Y: ${months[curMonth]}, ${curYear}` }
    ];

    return formatArr;
  }

  DateFunctionsModel.prototype.formats = {
    month: [
      { value: 1, label: 'Short (e.g. Aug)' },
      { value: 2, label: 'Long (e.g. August)' },
      {
        value: 9,
        label: 'MM: The numeric representation of the month from 01 through 12'
      },
      {
        value: 0,
        label: 'M: The numeric representation of the month from 1 through 12'
      }
    ],
    day: [
      { value: 1, label: 'Short (e.g. Wed)' },
      { value: 2, label: 'Long (e.g. Wednesday)' },
      {
        value: 9,
        label: 'dd: The numeric representation of the day from 01 through 31'
      },
      {
        value: 0,
        label: 'd: The numeric representation of the day from 1 through 31'
      }
    ],
    format: getDateFormats()
  };

  DateFunctionsModel.prototype.weekDayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];
  DateFunctionsModel.prototype.dateFindOptions = [
    { value: 0, label: 'Before' },
    { value: 1, label: 'After' },
    { value: 2, label: 'On or Before' },
    { value: 3, label: 'On or After' }
  ];
  DateFunctionsModel.prototype.timeOptions = [
    { value: 0, label: 'Milliseconds' },
    { value: 1, label: 'Seconds' },
    { value: 2, label: 'Minutes' },
    { value: 3, label: 'Hours' },
    { value: 4, label: 'Days' },
    { value: 5, label: 'Weeks' },
    { value: 6, label: 'Months' },
    { value: 7, label: 'Years' },
    { value: 8, label: 'Ticks' },
  ];

  DateFunctionsModel.prototype.config = {
    id: 17,
    category: 'Function',
    name: 'Date Functions',
    description: {
      short: 'This action takes a date value you provide and extracts a portion of the date.',
      long:
        'This action takes a date value you provide and extracts a portion of the date, such as the month, or converts the date to a different format. The outcome is stored in an Action Result that can be used in subsequent actions.'
    },
    learnMore: [['Learn more', 'https://help.method.me/en/articles/2623605-date-function']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  DateFunctionsModel.prototype.getActionResultSet = function() {
    var array = [];
    if (this.ResultToSet != null && !this.ResultToSet.IsSharedResult) {
      array.push(this.ResultToSet.getValues());
    }

    return array;
  };

  DateFunctionsModel.prototype.getActionResultUsed = function() {
    var array = [];

    if (this.Source !== null && this.Source.getConsumedActionResult()) {
      array.push(this.Source.getValues());
    }

    switch (this.DateFunctionType) {
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        if (this.Options.Amount !== null && this.Options.Amount.getConsumedActionResult()) {
          array.push(this.Options.Amount.getValues());
        }
        break;
      case 14:
        if (this.Options.OtherDate !== null && this.Options.OtherDate.getConsumedActionResult()) {
          array.push(this.Options.OtherDate.getValues());
        }
        break;
    }

    return array;
  };

  DateFunctionsModel.prototype.isUsingControl = function(control) {
    if (this.Source !== null && this.Source.isUsingControl(control)) {
      return true;
    }
    if (this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
      return true;
    }
    var result = false;
    switch (this.DateFunctionType) {
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        if (this.Options.Amount !== null && this.Options.Amount.isUsingControl(control)) {
          result = true;
        }
        break;
      case 14:
        if (this.Options.OtherDate !== null && this.Options.OtherDate.isUsingControl(control)) {
          result = true;
        }
        break;
    }

    return result;
  };

  DateFunctionsModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.ResultToSet !== null && !this.ResultToSet.validate()) {
      self.InValid = true;
    }

    if (this.ControlToUpdate !== null && !this.ControlToUpdate.validate()) {
      this.InValid = true;
    }

    if (!this.Source.validate()) {
      self.InValid = true;
    }
    this.validateConsumptionPosition(this.Source);

    switch (this.DateFunctionType) {
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        if (!this.Options.Amount.validate()) {
          self.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.Amount);
        break;
      case 14:
        if (!this.Options.OtherDate.validate()) {
          self.InValid = true;
        }
        this.validateConsumptionPosition(this.Options.OtherDate);
        break;
    }
  };
  return DateFunctionsModel;
};

DateFunctionsModel.$inject = ['BaseModel', 'ResultToSetModel', 'ComplexValueModel', 'ControlModel'];