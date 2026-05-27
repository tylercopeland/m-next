/* eslint-disable @typescript-eslint/no-require-imports */ // WHOLE FILE
import jquery from 'jquery';
import substituteModulesRaw from './angular/react-wrapper-substitutes/substitutes.js';
import substituteConstants from './angular/react-wrapper-substitutes/method.$.mi.Constants.js';
import './styles/foundation.scss';
import './styles/actioneditor/actioneditor.scss';
import './angular/old-externals/select.css';

(window as any).$ = jquery;
(window as any).jQuery = jquery;

const angular = require('angular');
require('./angular/old-externals/ngStorage-0.3.6.js');
require('./angular/old-externals/sortable/sortable.js');
require('./angular/old-externals/sortable/sortable-v1.6.0.js');
require('./angular/old-externals/sortable/ng-sortable.js');
require('./angular/old-externals/angular-sanitize-1.5.8.js');
require('./angular/old-externals/angular-ui-router-0.2.15.js');
const Registrations = require('./angular/registrations.js').default;

declare global {
    interface JQueryStatic {
        mi?: {
            Constants?: Record<string, any>;
            [key: string]: any;
        };
    }
}

interface SubstituteModule {
    name: string;
    type: 'constant' | 'provider' | 'factory' | 'service' | 'value' | 'directive' | 'controller' | 'filter';
    value: any;
    inject?: string[];
}

const loadActionEditor = () => {
    /* activate debugging:
    const _debug = (str, _data) => {
        _debug(`currentScreenSvc: ${str}`, { _mode, ..._data });
    } //*/

    // suppress debugging:
    const _debug = (_a: string, _b?: any) => null; //*/

    _debug('did angular attach to window?', window.angular);
    // @ts-expect-error TS2339: Property 'element' does not exist on type 'Window & typeof globalThis'.
    _debug('did jquery attach to window?', angular.element === window.$);

    const substituteModules: SubstituteModule[] = substituteModulesRaw as SubstituteModule[];

    require('./angular/old-externals/jquery-ui-1.11.4.js');

    if (typeof angular.element.mi?.Constants !== "object") {
        _debug('Assigning subsitute Constants to angular.element.mi.Constants.');
        if (typeof angular.element.mi === 'undefined') angular.element.mi = {};
        angular.element.mi.Constants = substituteConstants;
    }

    require('./angular/old-externals/select.js');
    require('./angular/old-externals/foundation-apps-1.1.0.js');
    require('./angular/old-externals/foundation-apps-templates-1.1.0.js');
    require('./angular/old-externals/angular-ui-bootstrap-tpls.js');
    require('./angular/old-externals/bootstrap-transition.js');
    require('./angular/old-externals/bootstrap-collapse.js');
    require('./angular/old-externals/bootstrap-datetimepicker.js');
    require('./angular/old-components/mi-constants.js');
    require('./angular/old-components/mi-format.js');
    require('./angular/old-components/jquery.mi.base.js');
    require('./angular/old-components/jquery.mi.button.js');
    require('./angular/old-components/jquery.mi.newDialog.js');
    require('./angular/old-components/datepicker-dir.js');
    require('./angular/old-components/jquery.mi.datetimepicker.js');

    angular.module('method', ['foundation', 'ngStorage', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ng-sortable', 'ui.router']);

    // @ts-expect-error TS2339: Property 'element' does not exist on type 'Window & typeof globalThis'.
    const module: IModuleExtended = angular.module('method') as IModuleExtended;

    // Support React wrapper version:
    substituteModules.forEach(substitute => {
        try {
            switch (substitute.type) {
                // Some types of modules need to be checked for and registered at the "config" phase of the angular lifecycle.
                case 'constant':
                case 'provider':
                    module.config(['$provide', '$injector', ($provide: ng.auto.IProvideService, $injector: ng.auto.IInjectorService) => {
                        if (!$injector.has(substitute.name)) {
                            const provideMethod = substitute.type as keyof ng.auto.IProvideService;
                            $provide[provideMethod](substitute.name, substitute.value);
                            _debug(`Registered substitute "${substitute.type}", "${substitute.name}" using .config()`);
                        } else {
                            _debug(`Skipped registration of "${substitute.name}" as it already exists.`);
                        }
                    }]);
                    break;
                // While others we prefer to check for and register directly. (Because Reasons.)
                case 'factory':     // }
                case 'service':     // }
                case 'value':       // }
                case 'directive':   // }
                case 'controller':   // }
                case 'filter':      // }}}} These are all valid names of attachment methods on angular.module().
                default: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore Missing type definitions
                    const existing = module._invokeQueue.some(([_provider, method, args]) =>
                        method === substitute.type && args[0] === substitute.name
                    );
                    if (!existing) {
                        // ts-expect-error TS2349: TypeScript doesn't recognize this dynamic method call,
                        // but I promise you substitute.type contains valid method names (see above)
                        module[substitute.type](substitute.name, substitute.value);
                        _debug(`Registered substitute ${substitute.type}, "${substitute.name}"`);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error(`Error during registration of "${substitute.name}":`, error);
        }
    });

    Registrations();
    _debug('LOADED: M-ONE-built ACTION EDITOR - "REACT WRAPPER" VERSION');
}

export default loadActionEditor;