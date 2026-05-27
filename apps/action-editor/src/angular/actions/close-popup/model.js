import template from "./tmpl.html";

export default function ClosePopUpModel(BaseModel, ComplexValueModel) {
  function ClosePopUpModel(data) {
    this.ValidateAllControls = false;

    this.isReadOnly = false;
    this.ActiveRecordId = new ComplexValueModel({ ValueType: 10, Value: 0 });
    this.ModalStatus = null; 

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );
    if (data !== undefined) {
      this.ActiveRecordId = new ComplexValueModel(data.ActiveRecordId);
    }
  }

  ClosePopUpModel.prototype = angular.copy(BaseModel.prototype);

  ClosePopUpModel.prototype.config = {
    id: 54,
    ActionType: 54,
    category: "Pop-Ups",
    name: "Close Pop-Up",
    description: {
      short: "Close Pop-Up.",
      long: "This action returns the results and status, closes the Pop-Up and resumes the parent workflow."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/12149698-close-pop-up-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  ClosePopUpModel.prototype.getActionResultUsed = function () {
    let array = [];
    if (this.ActiveRecordId?.getConsumedActionResult()) {
      array.push(this.ActiveRecordId.getValues());
    }
    return array;
  };

  return ClosePopUpModel;
};

ClosePopUpModel.$inject = ["BaseModel", "ComplexValueModel"];
