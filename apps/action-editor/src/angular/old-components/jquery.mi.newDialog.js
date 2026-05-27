(function ($) {

    $.widget("mi.newDialog", {
        options: {
            title: '',
            titleBarId: '',
            buttonPaneId: '',
            autoOpen: true,
            closeOnEscape: true,
            mode: '',  //alert, confirm, wizard
            classes: '',
            modal: true,
            width: 300,
            height:'auto',
            minWidth: 150,
            minHeight: 50,
            maxWidth: null,
            maxHeight: null,
            okText: "",
            cancelText: "",
            buttons: [],
            message:'',
            draggable: true,
            resizable:true,
            opacity:null,
            onOpen: null,
            onClose: null,
            onFocus: null,
            onBeforeClose:null,
            onOk:null,
            onCancel: null            
        },

        properties: {
            events: [
                { name: "On Open", func: "onOpen" },
                { name: "On Close", func: "onClose" },
                { name: "Focus", func: "onFocus" },
                { name: "Before Close", func: "onBeforeClose" },
                { name: "On Ok", func: "onOk" },
                { name: "On Cancel", func: "onCancel" }
            ]
        },

        templates: {
            card: '<div class="mi-modal">' +
                    '<div class="mi-modal-background"></div>' +
                    '<div class="mi-modal-card">' +
                        '<header class="mi-modal-card-head">' +
                            '<p class="mi-modal-card-title"></p>' +
                        '</header>' +
                        '<section class="mi-modal-card-body"></section>' +
                        '<footer class="mi-modal-card-foot"></footer>' +
                    '</div>' +
                '</div>'
        },

        _init: function () {
            if (this.options.autoOpen) {
                this.open();
            }
        },

        _create: function () {            
            switch (this.options.mode) {
                case "alert": this._renderAlert(); break;
                case "confirm": this._renderConfirm(); break;
                case "wizard": this._renderWizard(); break;
                default: this._renderDialog();
            }
            this.control.addClass(this.options.classes);
            // this.control.hide();
            this._isOpen = false;
            this._createButtonPane();
            this._on(this.control, {
                keydown: function (event) {
                    var key = event.keyCode || event.charCode;
                    if (key == 27) {
                        event.preventDefault();
                        this.close();
                        return;
                    }
                }
            });
            if (typeof (this.options.onAfterCreate) == 'function') {                
                this.options.onAfterCreate.call(this);
            }
        },

        _addContent: function (id) {
            this.element.empty();
            var msgbody = $("<p>").attr("id", id);
            if (typeof (this.options.message) === "object")
                msgbody.append(this.options.message);
            else
                msgbody.html(this.options.message);

            return msgbody;
        },

        _renderDialog: function () {
            var container = this.element;
            // console.log('container', container);

            this.options.mode = "regular";
            this.dialogCounter = $(".mi-modal").length;
            this.control = $(this.templates.card);
            this.control.css({zIndex: (2 * this.dialogCounter) + 9700});
            
            //Header
            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;

            if( this.options.modal ) {
                this.control.find(".mi-modal-card-title").attr("id", this.options.titleBarId);
                this.control.find(".mi-modal-card-title").text(this.options.title);

                this.closeButton = this.control.find(".mi-icon-remove");
                this._off(this.closeButton, "click");
                this._on(this.closeButton, { 
                    click: function (event) {
                        event.preventDefault();
                        this.close();
                    }
                });
            }

            //include message if available
            if (this.options.message) {
                this.control.find(".mi-modal-card-body").append(this._addContent("dialogBody"));
            } else {
                this.control.find(".mi-modal-card-body").append(container);
            }
            
            //Body
            // this.control.append(container.removeAttr("title").addClass("modal-body mi-widget-content"));
            $("body").append(this.control);
        },

        _renderWizard: function () {
            var container = this.element;
            //include message if available
            this.dialogCounter = $(".mi-modal").length;
            this.control = $(this.templates.card);

            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;

            if( this.options.modal ) {
                this.control.find(".mi-modal-card-title").attr("id", this.options.titleBarId);
                this.control.find(".mi-modal-card-title").text(this.options.title);

                this.closeButton = this.control.find(".mi-icon-remove");
                this._off(this.closeButton, "click");
                this._on(this.closeButton, { 
                    click: function (event) {
                        event.preventDefault();
                        this.close();
                    }
                });
            }

            //include message if available
            if (this.options.message) {
                this.control.find(".mi-modal-card-body").append(this._addContent("wizardBody"));
            }
            
            //Body
            $("body").append(this.control);
        },

        _renderAlert: function () {
            // var container = this._addContent('alertBody');
            this.dialogCounter = $(".mi-modal").length;
            this.control = $(this.templates.card);
            this.control.css("z-index", (2 * this.dialogCounter) + 9700);
            
            //Header
            this.control.find(".mi-modal-card-title").text(this.options.title);

            if (this.options.message) {
                this.control.find(".mi-modal-card-body").append(this._addContent("alertBody"));
            }

            this.control.find(".mi-icon-remove").hide();

            //Body
            $("body").append(this.control);
        },
        
        _renderConfirm: function () {
            this.dialogCounter = $(".mi-modal").length;
            this.control = $(this.templates.card);
            this.control.css("z-index", (2 * this.dialogCounter) + 9700);            

            //Header
            this.control.find(".mi-modal-card-title").text(this.options.title);

            //Body
            // this.control.append(container.removeAttr("title").addClass("modal-body mi-widget-content"));
            this.control.find(".mi-modal-card-body").append(this._addContent("confirmBody"));

            this.control.find(".mi-icon-remove").hide();

            //Body
            $("body").append(this.control);
        },

        _createButtonPane: function () {
            
            this.miButtonPane = $("<div/>").addClass("modal-footer").attr("id", this.options.buttonPaneId);
            this.miButtonSet = $("<div/>").addClass("mi-dialog-buttonset").appendTo(this.miButtonPane);
            var that = this;
            switch(this.options.mode) {
                case "alert":
                    this.options.autoOpen = true;
                    this.options.width = 380;
                    this.options.height = 'auto';
                    this.options.modal = true;
                    this.options.onClose = this.options.onFocus = this.options.onOpen = null;
                    var okText = this.options.okText || "OK";
                    this.options.buttons = [{
                        text: okText,
                        id: "miAlert_ok",
                        click: function (event) {
                            event.stopPropagation();
                            if (that._trigger("onOk", event) !== false) {
                                that.close();
                            }
                        },
                        classes: "blue"
                    }];
                    this._on(this.control, {
                        keydown: function (event) {
                            var key = event.keyCode || event.charCode;
                            if (key == 13) {
                                event.preventDefault();
                                if (that._trigger("onOk", event) !== false) {
                                    that.close();
                                }
                            }
                        }
                    });
                    break;
                case "confirm":
                    this.options.autoOpen = true;
                    this.options.width = 380;
                    this.options.height = 'auto';
                    this.options.modal = true;
                    this.options.onFocus = null;
                    var okText = this.options.okText || "OK";
                    var cancelText = this.options.cancelText || "Cancel";
                    this.options.buttons = [{
                        text: cancelText,
                        id: "miConfirm_cancel",
                        click: function (event) {
                            event.stopPropagation();
                            if (that._trigger("onCancel", event) !== false) {
                                that.close();
                            }
                        },
                        classes: "ghost"
                    },
                        {
                        text: okText,
                        id: "miConfirm_ok",
                        click: function (event) {
                            event.stopPropagation();
                            if (that._trigger("onOk", event) !== null) {
                                that.close();
                            }
                        },
                        classes:"blue"
                        }];
                    this._on(this.control, {
                        keydown: function (event) {
                            var key = event.keyCode || event.charCode;
                            if (key == 13) {
                                event.preventDefault();

                                if (that._trigger("onOk", event) !== false) {
                                    that.close();
                                }
                            }
                        }
                    });
                    break;
            }
            this._createButtons();
        },

        _createButtons: function () {
            var that = this,
                buttons = this.options.buttons;

            this.miButtonPane.remove();
            this.miButtonSet.empty();

            if ($.isEmptyObject(buttons) || ($.isArray(buttons) && !buttons.length)) {
                return;
            }

            buttons.forEach(function(button) {
                var buttonOptions = {
                    caption: button.text,
                    classes: button.classes,
                    onClick: $.proxy(button.click, that)
                };
                $("<span>").attr("id", (button.id) ? button.id : '')
                    .Button(buttonOptions)
                    .appendTo(that.miButtonSet);
            });
            this.control.find(".mi-modal-card-foot").append(this.miButtonPane);
        },

        open: function () {
            var that = this;
            if (this._isOpen) {
                return;
            }
            this._isOpen = true;
            // this._setSizeAndPosition();
            // this._createOverlay();
            // this._show(this.control, this.options.show, function () {
            this._trigger("onFocus");
            // });
            this._trigger("onOpen");
            this.control.focus();
            this.control.addClass("is-active");
        },
        
       _setSizeAndPosition: function () {
            var nonContentHeight, minContentHeight, maxContentHeight,
			options = this.options;

            // reset content sizing
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                maxHeight: "none",
                height: 0
            });

            if (options.minWidth > options.width) {
                options.width = options.minWidth;
            }

            // reset wrapper sizing; determine the height of all the non-content elements
            nonContentHeight = this.control.css({
                height: "auto",
                width: options.width
            }).outerHeight();

            minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
            maxContentHeight = typeof options.maxHeight === "number" ? Math.max(0, options.maxHeight - nonContentHeight) : "none";

            if (options.height === "auto") {
                this.element.css({
                    minHeight: minContentHeight,
                    maxHeight: maxContentHeight,
                    height: "auto"
                });
            } else {
                this.element.height(Math.max(0, options.height - nonContentHeight));
            }

           //centering dialog
           var leftCoord = (this.options.mode == "alert" || this.options.mode == "confirm" || this.options.mode == "wizard") ? 2.5 : 4;// return later
           if (this.options.position && typeof this.options.position[0] === "number" && typeof this.options.position[1] === "number") {
                this.control.css("left", this.options.position[0]);
                this.control.css("top", this.options.position[1]);
           } else {
               var windowHeight = $(window).height();
               var windowWidth = $(window).width();
               var dialogHeight = $(this.control).outerHeight();
               var dialogWidth = $(this.control).outerWidth();
               var scrollTop = $(window).scrollTop();
               var scrollLeft = $(window).scrollLeft();
               this.control.css("top", Math.max(0, (windowHeight - dialogHeight) / 2 + scrollTop));
               this.control.css("left", Math.max(0, (windowWidth - dialogWidth) / 2 + scrollLeft));
           }
        },

        _createOverlay: function () {
            if (!this.options.modal) {
                return;
            }
            this.overlay = $("<div class='modal-overlay'></div>");
            this.overlay.css("z-index", 2 * this.dialogCounter + 9699);
            this.overlay.addClass("visible");
            this.overlay.width($(document).width());
            this.overlay.height($(document).height());
            $("body").append(this.overlay);
        },

        close: function () {
            if (this.options.mode == "regular" && (!this._isOpen || this._trigger("onBeforeClose") === false)) {
                return;
            }
            var that = this;
            this._isOpen = false;
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }

            this._hide(this.control, this.options.hide, function () {
                that._trigger("onClose");
            });

            if (this.options.mode == "alert" || this.options.mode == "confirm" || this.options.mode == "regular") {
                this.control.remove();
            }
            this.dialogCounter = $(".mi-dialog").length;
            $(".mi-dialog").eq(this.dialogCounter - 1).focus();
            this.control.removeClass("is-active");
        },
        
        _destroy: function () {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            this.element
                .removeClass("mi-dialog-content mi-widget-content")
                .detach();

            this.control.remove();
        },

        maskDialog: function(mask) {
            if (mask) {
                var so1 = $("<div class='saveoverlay'>");
                so1.addClass("saveoverlay-on");
                this.control.append(so1);
            }
            else {
                this.control.find(".saveoverlay").remove();
            }
        },

        mask: function() {
            this.maskDialog(true);
        },

        unMask: function () {
            this.maskDialog(false);
        },

        isOpen: function () {
            return this._isOpen;
        },

        _makeDraggable: function () {
            this.control.draggable({
                handle: ".mi-dialog-titlebar",
                containment: "document"
            });
        },
        
        _makeResizable: function () {
            this.control.resizable({
                containment: "document",
                alsoResize: this.element,
                maxWidth: this.options.maxWidth,
                maxHeight: this.options.maxHeight,
                minWidth: this.options.minWidth,
                minHeight: this.options.minHeight,
                handles: "n,e,s,w,se,sw,ne,nw"
            });
        },
        
        disable: $.noop,
        enable: $.noop
    });

}(jQuery));

function ParseError(errorResponse) {
    
    var title = 'Error Response';
    var description = '';
    var error = {};
    
    var response = $.parseJSON(errorResponse);

    var atom;
    if (response) {
        if(response.Data) {
            atom = response.Data;
        } else {
            try {
                atom = $.parseJSON(response.Message);
            } catch(ex) {
                atom = {
                    title: 'Error',
                    description: response.Message,
                    probableCause: '',
                    recommendedAction: 'Please try again or contact Method Staff for support'
                };
            }
        }
    } else {
        atom = {
            title: 'Error',
            description: '',
            probableCause: '',
            recommendedAction: 'Please try again or contact Method Staff for support'
        };
    }

    title = atom.title;
    description = atom.description + "<br/>" + atom.probableCause + "<br/>" + atom.recommendedAction;

    //var messageResponse = "";
    //try {
    //    messageResponse = $.parseJSON(errorResponse);
    //    try {
    //        var exceptionAtom = $.parseJSON(messageResponse.Message);

    //        title = exceptionAtom.title;
    //        description = exceptionAtom.description;
    //        probableCause = exceptionAtom.probableCause;
    //        recommendedAction = exceptionAtom.recommendedAction;

    //        description = description + "<br/>" + probableCause + "<br/>" + recommendedAction;
    //    } catch (e) {
    //        description = messageResponse.Message;
    //    }
    //} catch (e) {
    //    description = errorResponse;
    //}

    return { title: title, description: description };
}