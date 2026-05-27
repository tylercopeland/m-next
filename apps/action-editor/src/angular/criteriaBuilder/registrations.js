import aeCriteriaBuilderModel from "./builder-dir.js";
import aeCriteriaBuilderSvc from "./criteria-svc.js";
import miaeCriteriaBuilder from "./model.js";
import miaeCriteriaRow from "./row-dir.js";
import miaeCriteriaStatement from "./statement-dir.js";

const registrations = () => {
    angular.module("method")
        .factory("aeCriteriaBuilderModel", aeCriteriaBuilderModel)
        .factory("aeCriteriaBuilderSvc", aeCriteriaBuilderSvc)
        
        .directive("miaeCriteriaBuilder", miaeCriteriaBuilder)
        .directive("miaeCriteriaStatement", miaeCriteriaStatement)
        .directive("miaeCriteriaRow", miaeCriteriaRow)
    ;
}

export default registrations;