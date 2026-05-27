import template from "./tmpl.html";

export default function MergeEntitiesModel(BaseModel, ComplexValueModel) {
    function MergeEntitiesModel(data) {
        this.FromRecordID = new ComplexValueModel({ ValueType: 10, Value: 0 });
        this.ToRecordID = new ComplexValueModel({ ValueType: 10, Value: 0 });
        this.MergeType = 0;
        this.isReadOnly = false;

        angular.extend(this, new BaseModel(this.config.id, this.config.name), data);

        if (data !== undefined) {
            
            this.FromRecordID = new ComplexValueModel(data.FromRecordID);
            this.ToRecordID = new ComplexValueModel(data.ToRecordID);
            this.MergeType = data.MergeType
        }
    };

    MergeEntitiesModel.prototype = angular.copy(BaseModel.prototype);

    MergeEntitiesModel.prototype.config = {
        id: 45,
        category: "Advanced",
        name: "Merge Entities/Contacts",
        description: {
            short: "Merges entities or contacts.",
            long: "Depending on the option chosen, this action can <br/> 1) <b>Merge</b> an Entity from one to another which will move information across all apps from the 'From RecordID' to the 'To RecordID' and then delete 'From RecordID' entity.<br/> 2) <b>Merge</b> a Contact from one to another which will move all contact information from the 'From RecordID' to the 'To RecordID' and then delete 'From RecordID' contact.<br/> 3) <b>Swap Contact Type</b> From Primary Contact to Alternate Contact or Alternate Contact to Primary Contact.",
        },
        learnMore: [
            ["Learn More", "https://help.method.me/en/"]
        ],
        template: template,
        active: true,
        hasNested: false, // Only needed if this model contains a nested action set
        nestedProperties: [] // List the property names that contain a nested action set
    };

    MergeEntitiesModel.prototype.blankSubModel = {
        Field: "",
        Source: null,
        ValidationMessages: []
    };

    MergeEntitiesModel.prototype.getActionResultUsed = function () {
        var array = [];

        angular.forEach(this.Fields, function (obj) {
            if (obj.Source !== null && obj.Source.getConsumedActionResult()) {
                array.push(obj.Source.getValues());
            }
        });

        return array;
    };
    
    MergeEntitiesModel.prototype.isUsingControl = function(control) {
        if (this.FromRecordID !== null && this.FromRecordID.isUsingControl(control)) {
            return true;
        }
        if (this.ToRecordID !== null && this.ToRecordID.isUsingControl(control)) {
            return true;
            }
        if (this.ControlToUpdate !== undefined && this.ControlToUpdate !== null && this.ControlToUpdate.ControlId === control) {
            return true;
        }
        return false;
        };

    MergeEntitiesModel.prototype.validate = function () {
        this.InValid = false;
        this.ValidationMessages = [];
    };

    return MergeEntitiesModel;
};

MergeEntitiesModel.$inject = ["BaseModel", "ComplexValueModel"];