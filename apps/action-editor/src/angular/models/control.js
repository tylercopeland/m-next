export default function ControlModel(ComplexValueModel) {
  function ControlModel(data) {
    this.ControlId = null;
    this.Property = null;
    this.Source = null;
    this.ValidationMessages = [];
    angular.extend(this, data);

    if (data !== undefined && this.Source !== null && this.Source !== "") {
      this.Source = new ComplexValueModel(this.Source);
    } else {
      this.Source = new ComplexValueModel();
    }
  };

  ControlModel.prototype.validate = function () {
    if (
      this.ControlId === null ||
      this.ControlId === undefined ||
      this.ControlId === "" ||
      this.ControlId === "00000000-0000-0000-0000-000000000000"
    ) {
      this.ValidationMessages = [
        {
          Property: "ControlId",
          Message: 100
        }
      ];
    } else {
      this.ValidationMessages = [];
    }

    var validSource = (this.Source !== null) ? this.Source.validate() : true;

    return (this.ValidationMessages.length > 0 || !validSource) ? false : true;
  };

  ControlModel.prototype.clear = function () {
    this.ControlId = null;
    this.Property = null;
    this.Source = null;
    this.ValidationMessages = [];
  };

  return ControlModel;
};

ControlModel.$inject = ["ComplexValueModel"];