// These will be substitute objects/shims for the angular modules to access when not running in legacy context.
import substituteConfigs from './method.substitute.configs.json';
import miDatePicker from '../old-components/datepicker-dir';
import ComponentModalSvc from '../old-components/componentModals/modal-svc';
import ComponentModalCtrl from '../old-components/componentModals/modal-ctrl';
import miComponentModal from '../old-components/componentModals/modal-dir';
import miSorting from '../old-components/componentModals/sorting-dir';
import ComponentDropdownColumnCtrl from '../old-components/componentModals/dropdowns/columns/ctrl';
import ComponentDropdownViewsCtrl from '../old-components/componentModals/dropdowns/views/ctrl';
import ComponentGridColumnCtrl from '../old-components/componentModals/grids/columns/ctrl'
import ComponentGridViewsCtrl from '../old-components/componentModals/grids/views/ctrl'
import ComponentCalendarViewsCtrl from '../old-components/componentModals/calendar/views/ctrl'
import ComponentCalendarFieldsCtrl from '../old-components/componentModals/calendar/fields/ctrl'
import ComponentButtonMenuCtrl from '../old-components/componentModals/buttonmenu/ctrl'
import ComponentValidationCtrl from '../old-components/componentModals/validation/ctrl'
import ComponentDataTableCtrl from '../old-components/componentModals/datatable/ctrl'
import ComponentGalleryViewsCtrl from '../old-components/componentModals/gallery/views/ctrl'

const substituteModules = [
    {
        name: 'configs',
        type: 'constant',
        value: substituteConfigs
    },
    {
        name: 'guidSvc',
        type: 'factory',
        value: () => {
            const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            const create = () => `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
            const valid = guid => /^\{?[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}\}?$/.test(guid);
            return { create, valid, empty: "00000000-0000-0000-0000-000000000000" };
        },
        inject: []
    },
    {
        name: 'miDatePicker',
        type: 'directive',
        value: miDatePicker
    },
    {
        name: 'ComponentModalSvc',
        type: 'factory',
        value: ComponentModalSvc
    },
    {
        name: 'ComponentModalCtrl',
        type: 'controller',
        value: ComponentModalCtrl
    },
    {
        name: 'miComponentModal',
        type: 'directive',
        value: miComponentModal
    },
    {
        name: 'miSorting',
        type: 'directive',
        value: miSorting
    },
    {
        name: 'ComponentDropdownColumnCtrl',
        type: 'controller',
        value: ComponentDropdownColumnCtrl
    },
    {
        name: 'ComponentDropdownViewsCtrl',
        type: 'controller',
        value: ComponentDropdownViewsCtrl
    },
    {
        name: 'ComponentGridColumnCtrl',
        type: 'controller',
        value: ComponentGridColumnCtrl
    },
    {
        name: 'ComponentGridViewsCtrl',
        type: 'controller',
        value: ComponentGridViewsCtrl
    },
    {
        name: 'ComponentCalendarViewsCtrl',
        type: 'controller',
        value: ComponentCalendarViewsCtrl
    },
    {
        name: 'ComponentCalendarFieldsCtrl',
        type: 'controller',
        value: ComponentCalendarFieldsCtrl
    },
    {
        name: 'ComponentButtonMenuCtrl',
        type: 'controller',
        value: ComponentButtonMenuCtrl
    },
    {
        name: 'ComponentValidationCtrl',
        type: 'controller',
        value: ComponentValidationCtrl
    },
    {
        name: 'ComponentDataTableCtrl',
        type: 'controller',
        value: ComponentDataTableCtrl
    },
    {
        name: 'ComponentGalleryViewsCtrl',
        type: 'controller',
        value: ComponentGalleryViewsCtrl
    },
];

export default substituteModules;