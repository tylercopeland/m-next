import template from "./tmpl.html";

export default function ShowRightPanelModel(BaseModel) {
  function ShowRightPanelModel(data) {
    this.Panel = "invite";
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );
  }

  ShowRightPanelModel.prototype = angular.copy(BaseModel.prototype);

  ShowRightPanelModel.prototype.config = {
    id: 36,
    category: "Screen",
    name: "Show Right Panel",
    description: {
      short:
        "Display content in the right panel to accomplish a task without navigating away from the current screen.",
      long:
        "The Show Right Panel action provides users an option to display the right panel within Method allowing easy access for:<ul><li>Quick Invite User to add additional Method users</li><li>Manage Tags to manage existing tags</li></ul>"
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2583738-show-right-panel"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  ShowRightPanelModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    if (this.Panel === "") {
      this.InValid = true;
      this.ValidationMessages.push({
        Property: "Panel",
        Message: 133
      });
    }
  };

  return ShowRightPanelModel;
};

ShowRightPanelModel.$inject = ["BaseModel"];