import template from "./control-action-item-tmpl.html";

export default function miControlActionItem($rootScope, $compile, $sessionStorage, deleteModalSvc) {
    function link(scope, element, _attr) {
        const linkFn = $compile(template);
        const content = linkFn(scope);
        element.append(content);

        var actionConfig = scope.action.getInfo();

        scope.expanded = true;
        scope.actionName = actionConfig.name;

        scope.svgIconStyle = {
            display: 'inline-block'
        };

        scope.editAction = function () {
            scope.$emit("miae:editaction", {
                action: scope.action,
            });
        };

        scope.toggleConditional = function (e) {
            e.stopPropagation();
            scope.expanded = !scope.expanded;
            element.toggleClass("closed", !scope.expanded);
        };

        scope.copyAction = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $sessionStorage["miae:copyaction"] = angular.copy(scope.action);
            $rootScope.$broadcast("miae:hasPaste", { trigger: true });
        };

        scope.pasteAction = function (evt, setId) {
            evt.stopPropagation();
            evt.preventDefault();

            var useSetId = (setId !== null) ? setId : scope.actionSetId,
                loopIndex = (setId !== null) ? 0 : scope.loopIndex + 1;

            $rootScope.$broadcast("miae:pasteaction", {
                position: {
                    idx: loopIndex,
                    actionSetId: useSetId
                }
            });
        };

        var getActionResultsUsedInAppRoutine = function () {

            var routineList = [];

            if (!scope.editor.appRoutineVersion || !scope.editor.appRoutineVersion.liveVersion) {
                return routineList;
            }

            // In case of published app routines, we can only delete actionresult if it is not an 
            // output value or if it is, it should have been set at least once 
            var outputValues = scope.editor.appRoutineVersion.draftVersion.OutputValues;
            if (typeof scope.action.getActionResultSet === "function") {
                const actionResults = scope.action.getActionResultSet();
                const usedInAppRoutine = [];
                actionResults.forEach(result => {
                    Object.entries(outputValues).forEach(([_key, value]) => {
                        if (result.name === value.Value) {
                            usedInAppRoutine.push(value.Value);
                        }
                    });
                });
                if (usedInAppRoutine.length > 0) {
                    const items = usedInAppRoutine.reduce((acc, item) => {
                        acc[item] = (acc[item] || 0) + 1;
                        return acc;
                    }, {});
                    Object.entries(items).forEach(([key, _value]) => {
                        const matched = scope.$parent.editor.filterUsedActionSetByName(key);
                        if (matched.length === 1) {
                            routineList.push(key);
                        }
                    });
                }
            }
            return routineList;
        };

        scope.deleteAction = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (scope.$parent.isAppRoutineEditor || (scope.editor && scope.editor.isAppRoutineEditor)) {

                var usedInAppRoutine = getActionResultsUsedInAppRoutine();
                if (usedInAppRoutine.length > 0) {
                    $rootScope.$broadcast("mimodal:open", {
                        title: "Delete Action?",
                        message: "<p>We noticed that " + "'" + usedInAppRoutine.join("','") + "'" + " is being used in app routine output values.  You cannot change an action result name once it is used in the output values of a published App Routine</p>",
                        onClose: scope.cancelChanges,
                        buttons: [
                            {
                                label: "OK",
                                class: "mi-button blue",
                                click: scope.cancelChanges
                            }
                        ]
                    });

                    return;
                };
            };

            var consumptions = scope.action.hasConsumption(),
                message = (consumptions) ?
                    "We've found the following action results are being used elsewhere within your action set: <strong>" + consumptions.join(", ") + "</strong>. <br><br>Do you still want to delete this action?" :
                    "<br>Are you sure you want to delete this action?";

            deleteModalSvc.showModal({
                title: "Delete Action?",
                message: message,
                cancelText: "Cancel",
                cancelCallback: function () {
                },
                confirmText: "Delete Action",
                confirmCallback: function () {
                    scope.confirmActionDelete();
                }
            });
        };

        scope.confirmActionDelete = function () {
            scope.editor.deleteAction(scope.actionSetId, scope.loopIndex);
            if (typeof scope.action.getActionResultSet === "function") {
                scope.editor.cleanUpActionResults(scope.action.getActionResultSet());
            }
            $rootScope.$broadcast("miae:newaction");
        };

        scope.toggleDisabled = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            scope.action.Disabled = !scope.action.Disabled;
            scope.toggleDisabledClass();
        };

        scope.toggleDisabledClass = function () {
            element.toggleClass("mi-ae-disabled", scope.action.Disabled);
        };
        scope.toggleDisabledClass();

        scope.addActionBelow = function (evt, setId) {
            evt.stopPropagation();
            evt.preventDefault();

            var useSetId = (setId !== null) ? setId : scope.actionSetId,
                loopIndex = (setId !== null) ? 0 : scope.loopIndex + 1;

            scope.addNewAction(loopIndex, useSetId);
        };

        scope.insertAction = function (actionSetId, idx) {
            scope.addNewAction(idx, actionSetId);
        };

        scope.addNewAction = function (idx, actionSetId) {
            $rootScope.$broadcast("miae:newaction", {
                position: {
                    idx: idx,
                    actionSetId: actionSetId
                }
            });
        };

        scope.isALoop = function () {
            return ([1, 26, 29, 38].indexOf(scope.action.ActionId) > -1);
        };

        scope.isActionSelected = function (thisAction) {
            return (thisAction === scope.selectedAction);
        }

        scope.isIncompatible = function (thisAction) {
            return (thisAction.ValidationMessages && thisAction.ValidationMessages.some(function (validation) {
                return (validation.Message === 138);
            }));
        }

        scope.isUsingControl = function (thisAction) {
            if (typeof thisAction.isUsingControl === 'function') {
                var actionSets = thisAction.ActionId === 30 ? scope.editor.listAllActionSets(scope.editor.selectedControl.actionSetId) : [];

                return thisAction.isUsingControl(scope.referencedControlId, actionSets);
            }

            return false;
        };
    };

    return {
        restrict: "E",
        scope: {
            action: "=",
            actionSetId: "=",
            loopIndex: "=",
            editor: "=",
            sortableConfig: "=",
            selectedAction: "=",
            currentPosition: "=",
            v4: "=",
            readonly: "=",
            referencedControl: "=",
            referencedControlId: "=",

        },
        link: link
    };
};

miControlActionItem.$inject = ["$rootScope", "$compile", "$sessionStorage", "deleteModalSvc"];
