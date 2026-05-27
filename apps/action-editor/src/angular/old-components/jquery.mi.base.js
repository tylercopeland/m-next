(function ($) {

    $.widget("mi.Base", {

        options: {
            //used by all widgets
            name: '',
            caption: '',
            regularCaption: true,
            hideCaption: false,
            id: $.mi.Guid.newGuid(),
            Type: '',
            visible: true,
            disabled: false,
            isBound: false,
            isOutputOnly: false, //linked fields and Record ID
            defaultValue: "",
            classes: "",
            TypeOverride: '',
            widthType: 'auto', //fixed or full
            width: '',
            formatType: '',
            formatRounding: '',
            formatSeparator: '',

            //runtime
            isRendered: true,
            isEventEnabled: true,
            isSettingMultiple: false,
            isShared: false,
            isInCallback: false
        },

        properties: {
            events: [
                //{ name: "Change", func: "onChange" },
            ],
            styles: []
        },

        _create: function () {
            if (this.options.regularCaption === true && this.options.hideCaption == false) {
                this.label = $("<label class='mi-caption' for='" + this.options.name + this.options.id + "' >" + this.options.caption + "</label>");
                this.element.prepend(this.label);
            }
            if (this.options.value === "" && this.options.defaultValue !== "") {
                this.options.value = this.options.defaultValue;
            }
        },

        // base _refresh method:
        _refresh: function () {
            if (this.options.isRendered) {
                //parse
                var lblClasses = "", ctlClasses = "";
                var arrClasses = this.options.classes.split(" ");
                for (var x = 0; x < arrClasses.length; x++) {
                    if (arrClasses[x].indexOf("mi-caption") > -1 || arrClasses[x].indexOf("mi-text") > -1)
                        lblClasses += arrClasses[x] + " ";
                    else
                        ctlClasses += arrClasses[x] + " ";
                }                
                this.control.addClass(ctlClasses);
                if (this.label)
                    this.label.addClass(lblClasses);
                //Width
                this.setWidth(this.options.widthType, this.options.width);
                

                //Visible, disabled
                (this.options.visible === true) ? this.element.removeClass("controlHide") : this.element.addClass("controlHide");
                try {
                    if (!(this.element.hasClass('controlHide'))) {
                            (this.options.visible === true) ? this.element.classList.remove("controlHide") : this.element.classList.add("controlHide");
                    }
                } catch(e) {/*do nothing*/}
                this.control[this.options.disabled ? "attr" : "removeAttr"]("disabled", true);
            }
        },

        /**
         * Determine if we are on a mobile device or desktop
         */
        _checkIfMobile: function() {
            var isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            var isTabletorSmaller = $.mi.Constants.ui.isTabletPortraitOrSmaller();
            return (isMobileUserAgent && isTabletorSmaller) ? true : false;
        },

        /**
        * Determines if we are on the react native app.
        */
        _checkIfNative: function(appType) {
            return appType === mi.constants.applicationType.MobileNative;
        },

        /**
         * Validation Setup
         */
        _validationSetup: function() {
            // Check if there is a required validation
            if(this.options.validationRules && this.options.validationRules.length > 0) {
                var self = this;
                this.options.validationRules.forEach(function(obj) {
                    if(obj.rule === 0) {
                        var text = self.element.find(".mi-caption").text();
                        self.element.find(".mi-caption").html( text + "<span style='color: red'>*</span>" );
                    }
                });
            }

            // Validation errors
            this.error = $("<span/>").addClass('has-validation-error').appendTo(this.element);
            this.error.hide();            
        },

        setWidth: function(widthType, width) {
            //TODO: Move this code at the control level. The base widget shouldn't have knowledge of its type
            if (widthType == "full") {
                    this.element.addClass("mi-control-width-full");
                    this.control.addClass("mi-control-width-full");
            } else if (widthType == "auto" && (this.options.Type == "TXT" || this.options.Type == "DTP" || this.options.Type == "TXA") && this.options.TypeOverride == "") {
                if (this.options.Type == "DTP") {
                    this.control.css("max-width", "100%");
                    this.inputcontrol.css("max-width", "100%");
                } else {
                    this.control.css("max-width", "100%");
                }
            } else if (widthType == "fixed" && width != "") {
                this.element.width(this.options.width);
                this.control.css("width", "100%");
            }
        },

        sanitizeValueForNumberInput: function (value) {
            var numberPattern = /\d+/g;
            var firstNum = '';
            var nums = [];
            var secNum = '';

            if (value && typeof(value) === 'string') {
                value = parseFloat(value.replace(/[^0-9-.]/g, ''));
            } else if (!value) {
                value = '';
            }
            return value;
        },

        formatValue: function (val, type, typeRounding, typeSeparator) {
            //if not supplied use from widget
            if (type == null) {
                type = this.options.formatType;
                typeRounding = this.options.formatRounding;
                typeSeparator = this.options.formatSeparator;
            }

            if (val && $.trim(val) != "" && type != null && type != '') {
                if (type == "Number") {

                    
                    if ($.mi.Format._types[1].validator(val)) {
                        var opt = {};
                        if (typeRounding && typeRounding != "")
                            opt.roundToDecimalPlace = typeRounding;
                        if (typeSeparator && typeSeparator != "")
                            opt.useThousandsSeparator = (typeSeparator == "Yes") ? true: false;
                        return $.mi.Format._types[1].formatter(val, opt);
                    } else {
                        var $that = this;
                        $("<div>").newDialog({
                            title: "Number Format Failed",
                            message: "The Control " + this.options.name + ", failed formatting the value '" + val + "' to a number.",
                            mode: "alert",
                            onOk: function (event) {
                                if ($that.options.prevValue != null)
                                    $that.setValue( $that.unFormatValue( $that.options.prevValue ) );
                            }
                        });
                        return false;
                    }
                }
                else {
                    if ($.mi.Format._types[0].validator(val)) {
                        return $.mi.Format._types[0].formatter(val, type);
                    } else {
                        var $that = this;
                        $("<div>").newDialog({
                            title: "DateTime Format Failed",
                            message: "The Control " + this.options.name + ", failed formatting the value '" + val.toString() + "' to a " + type + ".",
                            mode: "alert",
                            onOk: function (event) {
                                if ($that.options.prevValue != null)
                                    $that.setValue( $that.options.prevValue );
                            }
                        });
                        return false;
                    }
                }
            }
            return val;
        },

        formatMoney: function(value, decimalPlaces, decimalSeparator, thousandsSeparator){
            var decimalPlaces = isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? 2 : decimalPlaces, 
                decimalSeparator = decimalSeparator == undefined ? "." : decimalSeparator, 
                thousandsSeparator = thousandsSeparator == undefined ? "," : thousandsSeparator, 
                s = value < 0 ? "-" : "", 
                i = String(parseInt(value = Math.abs(Number(value) || 0).toFixed(decimalPlaces))), 
                j = (j = i.length) > 3 ? j % 3 : 0;

            return s + (j ? i.substr(0, j) + thousandsSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandsSeparator) + (decimalPlaces ? decimalSeparator + Math.abs(value - i).toFixed(decimalPlaces).slice(2) : "");
        },

        unFormatValue: function (val){
            if (val && $.trim(val) != "" && this.options.formatType != '') {
                if (this.options.formatType == "Number") {
                    return $.mi.Format._types[1].formatter(val, { unformat: true });
                }
                else {
                    //datetime store separately
                }
            }
            return val;
        },

        setFocus: function (select) {
            var ctl = this.control;
            setTimeout(function () {  
                ctl.focus(); 
                if(select) {
                    ctl.select();
                }
            }, 2);
        },

        setValidation: function(message) {
            if(this.options.validationRules && this.control && this.error) {
                if(message === "" || message === undefined || message === null) {
                    this.control.removeClass('has-error');
                    this.error.hide();
                } else {
                    this.control.addClass('has-error');
                    this.error.text(message).show();
                }
            }
        },

        getRuntimeOptions: function () {
            return {
                id: this.options.id,
                name: this.options.name,
                Type: this.options.Type,
                isShared: this.options.isShared,
                isOutputOnly: this.options.isOutputOnly,
                isBound: this.options.isBound
            };
        },

        _setOption: function (key, value) {
            this._super(key, value);
            if (!this.options.isSettingMultiple) {
                this._refresh();
            }

        },

        _setOptions: function (options) {
            this.options.isSettingMultiple = true;
            for (var key in options) {
                this._setOption(key, options[key]);
            }
            this.options.isSettingMultiple = false;
            this._refresh();
        },

        _destroy: function () {
            this.element.empty();
        }
    });

}(jQuery));