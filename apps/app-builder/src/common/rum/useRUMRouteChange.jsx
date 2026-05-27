function useRUMRouteChange(viewName) {
  if (window.DD_RUM) window.DD_RUM.startView(viewName);
}

export default useRUMRouteChange;
