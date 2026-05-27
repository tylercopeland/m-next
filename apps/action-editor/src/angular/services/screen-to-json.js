export default function screenToJsonSvc(currentScreenSvc) {

  var makeJson = function () {
    var html = currentScreenSvc.sanitizeHTMLLayout(currentScreenSvc.getOption('canvasRef').html()),
      el = $("<div />").html(html),
      json = [];

    window.screenDiv = el;
    var sections = angular.element(el).children();

    angular.forEach(sections, function (section) {
      json.push(createSection(section));
    });

    return angular.copy(json);
  };

  var createSection = function (section) {
    var mySection = {
      type: "SEC",
      id: angular.element(section).attr("id"),
      rows: []
    };

    var table = {}
    var surfaceTable = angular.element(section).find('> .mi-SectionBody > .tbl');
    var nestedTable = angular.element(section).find(" > * > .mi-SectionBody > .tbl");
    table = surfaceTable.add(nestedTable)
    var rows = angular.element(table).find(" > .tblrow");

    angular.forEach(rows, function (row) {
      var myRow = {
        columns: []
      }

      var columns = angular.element(row).find(" > .tblcell");
      angular.forEach(columns, function (column) {
        var myColumn = [];

        // Find all controls & sections in this cell
        var controls = angular.element(column).children();
        angular.forEach(controls, function (control) {
          var controlType = angular.element(control).attr("method_type"),
            myControl = null;

          if (controlType === "SEC") {
            myControl = createSection(control);
          } else {
            myControl = {
              id: angular.element(control).attr("id"),
              type: controlType
            };
          }

          myColumn.push(myControl);
        });

        myRow.columns.push(myColumn);
      });

      mySection.rows.push(myRow);
    });

    return mySection;
  };

  return {
    makeJson: makeJson
  };

};

screenToJsonSvc.$inject = ["currentScreenSvc"];