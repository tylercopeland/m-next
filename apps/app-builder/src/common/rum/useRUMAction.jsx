import { useContext } from 'react';
import { RumComponentContext } from './RumContext';

/**
 * Utility to track actions in RUM with the component chain/breadcrumbs from <RumComponentContextProvider> automatically added
 *
 * add a "purpose" to the custom attributes to group the actions
 *
 *
 * @param purpose: explains the use case for the action, allows to split performance and user-tracking actions for example
 */
export const useRumAction = (purpose = 'unknown') => {
  const componentContext = useContext(RumComponentContext);
  const RumGlobal = window.DD_RUM;

  if (!RumGlobal) {
    return () => {};
  }

  return (name, customAttributes) => {
    RumGlobal.addAction(name, {
      purpose,
      ...componentContext.customAttributes,
      ...customAttributes,
      react: {
        breadcrumbs: componentContext.componentBreadCrumbs,
        component: componentContext.component,
        ...customAttributes?.react,
      },
    });
  };
};

export default useRumAction;
