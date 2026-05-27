import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { RumComponentContext } from './RumContext';

/**
 * Context Provider to add a new component to the action breadcrumbs. Useful for class Components.
 */

const propTypes = {
  componentName: PropTypes.string,
  customAttributes: PropTypes.instanceOf(Object),
  children: PropTypes.instanceOf(Object),
};

export function RumComponentContextProvider({ componentName, customAttributes, children }) {
  const { customAttributes: parentCustomAttributes, componentBreadCrumbs: parentComponentBreadCrumbs } =
    useContext(RumComponentContext);
  const newContext = useMemo(
    () => ({
      component: componentName,
      customAttributes: {
        ...parentCustomAttributes,
        ...customAttributes,
      },
      componentBreadCrumbs: `${parentComponentBreadCrumbs}.${componentName}`,
    }),
    [componentName, parentComponentBreadCrumbs, parentCustomAttributes, customAttributes],
  );
  return <RumComponentContext.Provider value={newContext}>{children}</RumComponentContext.Provider>;
}

RumComponentContextProvider.propTypes = propTypes;

export function WithRumComponentContext(componentName, options, Component) {
  if (typeof Component === 'undefined') {
    return WithRumComponentContext(componentName, {}, options);
  }
  return function RumComponentWrapper(props) {
    return (
      <RumComponentContextProvider componentName={componentName} customAttributes={options.customAttributes}>
        <Component {...props} />
      </RumComponentContextProvider>
    );
  };
}
