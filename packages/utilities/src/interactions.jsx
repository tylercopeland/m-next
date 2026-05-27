export const keyTypes = {
  Tab: 'Tab',
  Enter: 'Enter',
  SpaceBar: 'Space',
  Space: ' ',
  Escape: 'Escape',
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowLeft: 'ArrowLeft',
  Home: 'Home',
  End: 'End',
};

export const handleEnterKey = (cb) => (e) => {
  if ((e.charCode || e.keyCode) === 13) {
    if (cb) cb(e);
  }
};

export const preventPropagation = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

export const handleActionKey = (callback, handleSpaceKey = true, stopEvent = false) =>
  function (e) {
    const { key } = e;

    if (key === keyTypes.Enter) {
      if (callback) callback(e);
      if (stopEvent) preventPropagation(e);
    } else if (handleSpaceKey && (key === keyTypes.Space || key === keyTypes.SpaceBar)) {
      if (callback) callback(e);
      if (stopEvent) preventPropagation(e);
    }
    return null;
  };
