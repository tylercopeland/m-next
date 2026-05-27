export default function miDatePicker ($timeout) {
    function link(scope, element, _attr) {   

        $timeout(function() {

            if(!scope.dateFormat) {
                scope.dateFormat = "YYYY-MM-DD HH:mm:ss";
            }

            scope.options.onChange = function() {
                console.debug('this.value', this.value);
                scope.selectedDate = (this.value !== "") ? this.value.format(scope.dateFormat) : "";
                scope.$apply();
            }

            element.DateTimePicker(scope.options);
          
            // Wait for DateTimePicker to render and then compile inserted content
            $timeout(function() {
                let insertedContent = element.find('.mi-ae-datepicker'); // Target dynamically added content
                $compile(insertedContent)(scope);
            });
        });
    };

    return {
        restrict: "E",
        replace: true,
        template: "<div class='mi-ae-datepicker' />",
        scope: {
            options: "=",
            dateFormat: "=",
            selectedDate: "="
        },            
        link: link
    };
};

miDatePicker.$inject = ["$timeout"];