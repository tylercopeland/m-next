export default function ResultToSetModel(guidSvc, ComplexValueModel) {
    function ResultToSetModel(data) {

        this.Source = null;
        this.ActionResultId = guidSvc.create();
        this.IsSharedResult = false;
        this.ActionResultName = null;
        this.AppRoutineOutputKey = null;
        this.ValidationMessages = [];
        angular.extend(this, data);

        if (data !== undefined && this.Source !== null && this.Source !== "") {
            this.Source = new ComplexValueModel(this.Source);
        }
    };

    ResultToSetModel.prototype.isShared = function () {
        return this.IsSharedResult;
    };

    ResultToSetModel.prototype.getValues = function () {
        return {
            id: this.ActionResultId,
            name: this.ActionResultName,
            model: this
        };
    };

    ResultToSetModel.prototype.addComplexValue = function (data) {
        var source = new ComplexValueModel(data);
        this.Source = source;
    };

    ResultToSetModel.prototype.validate = function () {
        if (this.ActionResultName === "" || this.ActionResultName === null) {
            this.ValidationMessages = [
                {
                    Property: "ActionResultName",
                    Message: 101
                }
            ];
        } else {
            this.ValidationMessages = [];
        }

        var validSource = (this.Source !== null) ? this.Source.validate() : true;

        return (this.ValidationMessages.length > 0 || !validSource) ? false : true;
    };

    ResultToSetModel.prototype.clear = function (arList) {
        if (arList === null || (arList.indexOf(this.ActionResultId) !== -1)) {
            this.ActionResultId = null;
            this.ActionResultId = guidSvc.create();
            this.ActionResultName = null;
            this.ValidationMessages = [];
        }
    };

    ResultToSetModel.prototype.updateName = function (name) {
        this.ActionResultName = name;
    };

    return ResultToSetModel;
};

ResultToSetModel.$inject = ["guidSvc", "ComplexValueModel"];