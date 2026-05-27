angular.module("method")
    .factory("ComponentModalSvc", mi.components.modal.ComponentModalSvc)

    .controller("ComponentModalCtrl", mi.components.modal.ComponentModalCtrl)
    .directive("miComponentModal", mi.components.modal.ComponentModalDir)
    .directive("miSorting", mi.components.modal.SortingDir)
    
    .controller("ComponentDropdownColumnCtrl", mi.components.modal.dropdowns.ComponentDropdownColumnCtrl)
    .controller("ComponentDropdownViewsCtrl", mi.components.modal.dropdowns.ComponentDropdownViewsCtrl)
    .controller("ComponentGridColumnCtrl", mi.components.modal.grids.ComponentGridColumnCtrl)
    .controller("ComponentGridViewsCtrl", mi.components.modal.grids.ComponentGridViewsCtrl)
    .controller("ComponentCalendarViewsCtrl", mi.components.modal.calendar.ComponentCalendarViewsCtrl)
    .controller("ComponentCalendarFieldsCtrl", mi.components.modal.calendar.ComponentCalendarFieldsCtrl)
    .controller("ComponentButtonMenuCtrl", mi.components.modal.buttonmenu.ComponentButtonMenuCtrl)
    .controller("ComponentValidationCtrl", mi.components.modal.validation.ComponentValidationCtrl)
    .controller("ComponentButtonMenuCtrl", mi.components.modal.buttonmenu.ComponentButtonMenuCtrl)
    .controller("ComponentDataTableCtrl", mi.components.modal.datatable.ComponentDataTableCtrl)
    .controller("ComponentGalleryViewsCtrl", mi.components.modal.gallery.ComponentGalleryViewsCtrl)
;
