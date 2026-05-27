import template from "./tmpl.html";

export default function SaveAllModel(BaseModel) {
  function SaveAllModel(data) {
    this.ValidateControlsOnScreen = true;
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );
  }

  SaveAllModel.prototype = angular.copy(BaseModel.prototype);

  SaveAllModel.prototype.config = {
    id: 4,
    category: "Screen",
    name: "Save All",
    description: {
      short: "Saves all the values in all the sections on the screen.",
      long:
        "Saves all the values in all the sections on the screen, and if the screen is based on an accounting table, notifies Method PUSH™ to perform a real-time synchronization with your accounting software."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623335-save-all-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false,
    nestedProperties: []
  };

  SaveAllModel.prototype.validate = function() {};

  return SaveAllModel;
};

SaveAllModel.$inject = ["BaseModel"];