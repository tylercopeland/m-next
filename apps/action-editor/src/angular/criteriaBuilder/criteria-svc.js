export default function aeCriteriaBuilderSvc() {

  var openClose = [
    { value: 0, label: "Open" },
    { value: 1, label: "Close" }
  ];

  var andOr = [
    { value: 2, label: "And" },
    { value: 3, label: "Or" }
  ];

  var anyAll = [
    { value: 2, label: "All" },
    { value: 3, label: "Any" }
  ];

  var comparisonOptions = [
    { value: 4, label: "Is Equal" },
    { value: 5, label: "Is Not Equal" },
    { value: 6, label: "Greater Than" },
    { value: 7, label: "Greater or Equal To" },
    { value: 8, label: "Less Than" },
    { value: 9, label: "Less or Equal To" },
    { value: 10, label: "Is Empty" },
    { value: 11, label: "Is Not Empty" },
    { value: 12, label: "Contains" },
    { value: 13, label: "Does Not Contain" },
    { value: 14, label: "Starts With" },
    { value: 19, label: "Does Not Start With" },
    { value: 15, label: "Ends With" },
    // { value: 16, label: "Like" },
    { value: 17, label: "In List" },
    { value: 18, label: "Not In List" },
    { value: 20, label: "Is True" },
    { value: 21, label: "Is False" }
  ];


  var mongoComparisonOptions = [
    { value: 4, label: "Is Equal" },
    { value: 5, label: "Is Not Equal" },
    { value: 6, label: "Greater Than" },
    { value: 7, label: "Greater or Equal To" },
    { value: 8, label: "Less Than" },
    { value: 9, label: "Less or Equal To" },
    { value: 10, label: "Is Empty" },
    { value: 11, label: "Is Not Empty" },
    { value: 12, label: "Contains" },
    { value: 13, label: "Does Not Contain" },
    { value: 14, label: "Starts With" },
    { value: 19, label: "Does Not Start With" },
    { value: 15, label: "Ends With" },
    { value: 17, label: "In List" },
    { value: 18, label: "Not In List" },
  ];

  var operators = [
    { value: 4, label: " = " },
    { value: 5, label: " != " },
    { value: 6, label: " > " },
    { value: 7, label: " >= " },
    { value: 8, label: " < " },
    { value: 9, label: " <= " },
    { value: 10, label: " Is Empty " },
    { value: 11, label: " Is Not Empty " },
    { value: 12, label: " Contains " },
    { value: 13, label: " Does Not Contain " },
    { value: 14, label: " Starts With " },
    { value: 19, label: " Does Not Start With " },
    { value: 15, label: " Ends With " },
    // { value: 16, label: " Like " },
    { value: 17, label: " In List " },
    { value: 18, label: " Not In List " },
    { value: 20, label: " Is True " },
    { value: 21, label: " Is False " }
  ];

  var dateOptions = [
    { value: 0, label: "Date And Time" },
    { value: 1, label: "Date" },
    { value: 2, label: "Date Of Month" },
    { value: 3, label: "Month" },
    { value: 4, label: "Year" },
    { value: 5, label: "Day Of Week" }
  ];

  return {
    defaultJoiner: 2,
    openClose: openClose,
    andOr: andOr,
    anyAll: anyAll,
    comparisonOptions: comparisonOptions,
    mongoComparisonOptions: mongoComparisonOptions,
    operators: operators,
    dateOptions: dateOptions
  };

};

aeCriteriaBuilderSvc.$inject = [];
