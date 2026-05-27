export default function renameModalSvc() {
  var showModal = function (config) {
    var renameWarning = angular.element('<div/>');
    renameWarning.newDialog({
      modal: true,
      title: config.title,
      message: config.message,
      width: 450,
      height: 220,
      buttons: [
        {
          text: config.cancelLabel,
          classes: 'blank',
          click: function () {
            renameWarning.newDialog('close');
            if (config.cancelCallback && typeof config.cancelCallback === 'function') {
              config.cancelCallback();
            }
          },
        },
        {
          text: config.renameHereLabel,
          classes: 'ghost',
          click: function () {
            renameWarning.newDialog('close');
            if (config.renameHereCallback && typeof config.renameHereCallback === 'function') {
              config.renameHereCallback();
            }
          },
        },
        {
          text: config.renameAllLabel,
          classes: 'blue',
          click: function () {
            renameWarning.newDialog('close');
            if (config.renameAllCallback && typeof config.renameAllCallback === 'function') {
              config.renameAllCallback();
            }
          },
        },
      ],
    });
  };

  return {
    showModal: showModal,
  };
}
