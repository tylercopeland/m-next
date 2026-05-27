export default function deleteModalSvc() {

  var showModal = function (config) {
    var deleteWarning = angular.element("<div/>");
    deleteWarning.newDialog({
      modal: true,
      title: config.title,
      message: config.message,
      width: 450,
      height: 220,
      buttons: [
        {
          text: config.cancelText,
          classes: 'ghost',
          click: function () {
            deleteWarning.newDialog("close");
            if (config.cancelCallback && (typeof config.cancelCallback === "function")) {
              config.cancelCallback();
            }
          }
        },
        {
          text: config.confirmText,
          classes: "blue",
          click: function () {
            deleteWarning.newDialog("close");
            if (config.confirmCallback && (typeof config.confirmCallback === "function")) {
              config.confirmCallback();
            }
          }
        }
      ]
    });
  };

  return {
    showModal: showModal
  };
};