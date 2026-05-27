import template from "./tmpl.html";

export default function AddAttachmentModel(BaseModel, ComplexValueModel, $filter) {
  function AddAttachmentModel(data) {
    this.ViewNameFriendly = null;
    this.RecordId = new ComplexValueModel({ ValueType: 10 });
    this.Url = new ComplexValueModel({ ValueType: 9 });
    this.AttachToEmail = new ComplexValueModel({ ValueType: 12, Value: false });
    this.isReadOnly = false;

    angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

    if (data !== undefined) {
      this.RecordId = new ComplexValueModel(data.RecordId);
      this.Url = new ComplexValueModel(data.Url);
      if (data.AttachToEmail === null || data.AttachToEmail === undefined) {
        this.AttachToEmail = new ComplexValueModel({ ValueType: 12, Value: false });
      } else {
        this.AttachToEmail = new ComplexValueModel(data.AttachToEmail);
      }
    }
  }

  AddAttachmentModel.prototype = angular.copy(BaseModel.prototype);

  AddAttachmentModel.prototype.config = {
    id: 39,
    category: 'Attachments',
    name: 'Add Attachment To Record ID',
    description: {
      short: 'Add an attachment to an existing Record ID.',
      long: 'Add an attachment to an existing Record ID.'
    },
    learnMore: [['Learn More', 'https://help.method.me/en/articles/2577015-add-attachment-to-record-id-action']],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  AddAttachmentModel.prototype.validateViewNameFriendly = function() {
    var found = $filter('filter')(this.ValidationMessages, {
      Property: 'ViewNameFriendly'
    });

    if ((this.ViewNameFriendly === null || this.ViewNameFriendly === undefined || this.ViewNameFriendly === '') && found.length === 0) {
      this.ValidationMessages.push({
        Property: 'ViewNameFriendly',
        Message: 104
      });
    }

    if ((this.ViewNameFriendly !== null || this.ViewNameFriendly !== undefined || this.ViewNameFriendly !== '') && found.length > 0) {
      var index = this.ValidationMessages.indexOf(found[0]);
      this.ValidationMessages.splice(index, 1);
    }

    this.InValid = this.ValidationMessages.length > 0 ? true : this.InValid;
  };

  AddAttachmentModel.prototype.validate = function() {
    this.InValid = false;
    this.ValidationMessages = [];

    this.validateViewNameFriendly();

    if (this.Url.ValueType === 9 && this.Url.Value === '') {
      this.ValidationMessages.push({
        Property: 'Url',
        Message: 135
      });
      this.InValid = true;
    }
  };

  AddAttachmentModel.prototype.isUsingControl = function(control) {
    if (this.RecordId !== null && this.RecordId.isUsingControl(control)) {
      return true;
    }
    if (this.Url !== null && this.Url.isUsingControl(control)) {
      return true;
    }
    if (this.AttachToEmail !== null && this.AttachToEmail.isUsingControl(control)) {
      return true;
    }
    return false;
  };

  return AddAttachmentModel;
};

AddAttachmentModel.$inject = ["BaseModel", "ComplexValueModel", "$filter"];
