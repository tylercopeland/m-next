import moment from 'moment';
(function ($) {

    $.widget("mi.DateTimePicker", $.mi.Base, {

        isMobile: false,
        widgetSet: false,

        options: {
            name: 'datetimepicker',
            Type: 'DTP',
            inputType: "Date",  //Date, DateTime, Time for picker
            defaultValue: "today", //today is acceptable
            placeholder: "",
            ignoreDefault: false,

            //actions
            onChange: null,
            onFocus: null,
            onBlur: null,
            onGridFocus: null,

            //runtime
            value: "",  //moment or emptystring
            prevValue: null, //prev moment

        },

        properties: {
            events: [
                { name: "Change", func: "onChange" },
                { name: "Focus", func: "onFocus" },
                { name: "Lose Focus", func: "onBlur" }
            ]
        },

        _create: function () {
            this.element.empty();
            this._super();
            var self = this;

            this.isMobile = (typeof mi !== "undefined" && mi.utilities?.device?.isDevice("phone")) || false;
            
            //if there is no format, set a default
            if(this.options.formatType == ""){
                this.options.formatType = "Short Date and Time";
                // if(this.inputType == "Date")
                //     this.options.formatType = "Short Date";
                // else if (this.inputType == "Time")
                //     this.options.formatType = "Time";
                // else
                //     this.options.formatType = "Short Date and Time";
            }

            switch ( this.options.formatType ) {
                case "Short Date":
                    this.options.dtFormat = $.mi.Format._types[0].options['shortDateFormat'];
                    this.options.inputType = "Date";
                    break;
                case "Time":
                    this.options.dtFormat = $.mi.Format._types[0].options['timeFormat'];
                    this.options.inputType = "Time";
                    break;
                case "Short Date and Time":
                    this.options.dtFormat = $.mi.Format._types[0].options['shortDateFormat'] + " " + $.mi.Format._types[0].options['timeFormat'];
                    this.options.inputType = "DateTime";
                    break;
                case "Long Date":
                    this.options.dtFormat = $.mi.Format._types[0].options['longDateFormat'];
                    this.options.inputType = "Date";
                    break;
                case "Long Date and Time":
                    this.options.dtFormat = $.mi.Format._types[0].options['longDateFormat'] + " " + $.mi.Format._types[0].options['timeFormat'];
                    this.options.inputType = "DateTime";
                    break;
                case "Hour":
                    this.options.dtFormat = $.mi.Format._types[0].options['hourFormat'];
                    this.options.inputType = "Time";
                    break;
                case "Day":
                    this.options.dtFormat = $.mi.Format._types[0].options['dayFormat'];
                    this.options.inputType = "Date";
                    break;
                case "Day of Week":
                    this.options.dtFormat = $.mi.Format._types[0].options['dayOfWeekFormat'];
                    this.options.inputType = "Date";
                    break;
                case "Month":
                    this.options.dtFormat = $.mi.Format._types[0].options['monthFormat'];
                    this.options.inputType = "Date";
                    break;
                case "Month and Year":
                    this.options.dtFormat = $.mi.Format._types[0].options['monthAndYearFormat'];
                    this.options.inputType = "Date";
                    break;
                case "Year":
                    this.options.dtFormat = $.mi.Format._types[0].options['yearFormat'];
                    this.options.inputType = "Date";
                    break;
                default:
                    this.options.dtFormat = $.mi.Format._types[0].options['shortDateFormat'] + " " + $.mi.Format._types[0].options['timeFormat'];
                    this.options.inputType = "DateTime";
                    break;
            };

            // Determine input type based on mobile/non-mobile
            var inputType = ( this.isMobile ) ? this.options.inputType : 'text';
            inputType = ( this.isMobile && inputType === "DateTime" ) ? 'DateTime-local' : inputType;
            
            this.control = $("<div class='mi-datetimepicker'>");
            var placeholder = (this.options.placeholder != '') ? "placeholder='" + this.options.placeholder + "'" : "";

            // Display for non-mobile devices
            if( !this.isMobile ) {
                this.inputcontrol = $("<input type='" + inputType + "' id='" + this.options.name + this.options.id + "' " + placeholder + " >");
                this.buttonGroup = $('<div class="buttonGroup">');
                this.control.append($("<div class='mi-dt-" + this.options.inputType + "'>").append(this.inputcontrol)).append(this.buttonGroup).appendTo(this.element);

                $("body").on("dtp:hidePicker", function(event, picker) {
                    var dtPicker = $(self.control).data("DateTimePicker");
                    if(dtPicker && picker !== dtPicker.widget) {
                        dtPicker.hide();
                    }
                });
            // display for mobile devices
            } else {
                // userAgent Detection
                var userAgent = navigator.userAgent || navigator.vendor || window.opera,
                    style = "margin-left: -9999px; position: absolute";

                if( userAgent.match( /Android/i ) ) {
                    style = "position: absolute; z-index: 2; opacity: 0";
                }

                this.inputLabel = $("<div class='mi-dt-" + this.options.inputType + "'>");

                this.displayControl = $("<input type='"+inputType+"' id='MobileInput-" + this.options.name + this.options.id + "' style='" + style + "'>");
                this.inputcontrol = $("<input type='text' id='" + this.options.name + this.options.id + "' " + placeholder + " readonly='readonly' disabled='disabled'>");
                this.buttonGroup = $('<div class="buttonGroup">');
                this.control.append(this.inputLabel.append(this.displayControl).append(this.inputcontrol)).append(this.buttonGroup).appendTo(this.element);
            }

            if (!this.isMobile && this.options.inputType.indexOf("Time") > -1) {
                this.timePicker = $("<button class='mi-button datepickerbutton'>")
                    .html(`<i style="position:relative;left: -6px;top: -.5px;" class="mi-icon">
                  <svg-icon                  
                    name="'timer'"
                    ng-attr-style="svgIconStyle"
                    color="'#545F67'"
                    size="15">
                  </svg-icon>
                </i>`)
                    .appendTo(this.buttonGroup);

                // if( this.isMobile ) {
                //     this.timePicker
                //     .on("click",function(){
                //         self.displayControl.focus();
                //     })
                //     .on("touchend",function(){
                //         self.displayControl.focus();
                //     });
                // }
            }
            if (!this.isMobile && this.options.inputType.indexOf("Date") > -1) {
                this.datePicker = $("<button class='mi-button datepickerbutton'>")
                    .html(`<i style="position:relative;left: -6px;top: -.5px;" class="mi-icon">
                  <svg-icon
                    name="'calendar'"
                    ng-attr-style="svgIconStyle"
                    color="'#545F67'"
                    size="15">
                  </svg-icon>
                </i>`)
                    .appendTo(this.buttonGroup);

                // if( this.isMobile ) {
                //     this.datePicker
                //     .on("click",function(){
                //         self.displayControl.focus();
                //     })
                //     .on("touchend",function(){
                //         self.displayControl.focus();
                //     });
                // }
            }

            
            // Setup Date & Time picker on non-mobile devices only
            if( !this.isMobile ) {
                var showTime = (this.options.inputType === "Time" || this.options.inputType === "DateTime") ? true : false;
                var showDate = (this.options.inputType === "Date" || this.options.inputType === "DateTime") ? true : false;
                this.control.find('input').attr('data-date-format', this.options.dtFormat);
                this.control.datetimepicker({
                    pickDate: showDate,
                    hasTime: showTime,
                    //format: this.options.dtFormat,
                    icons: {
                        time: 'mi-icon-timer',
                        date: 'mi-icon-calendar',
                        up: 'mi-icon-chevron-up',
                        down: 'mi-icon-chevron-down'
                    }
                });
                
                this.control.on("dp.show",function(e){
                    var thisEl = $(e.currentTarget),
                        input = thisEl.find('input');
                    if(self.widgetSet === false) {
                        thisEl.data("DateTimePicker").setDate( self.options.value );
                        self.widgetSet = true;
                    }
                    if( !showTime ) {
                        $('.picker-open .accordion-toggle').hide();
                    }
                });

                this.inputcontrol
                    .on("focus", function() {
                        if(self.options.onGridFocus !== null) {
                            self.options.onGridFocus();
                        }
                    });
            } else {
                // this.control
                //     .on("click",function(){
                //         self.displayControl.focus();
                //     })
                //     .on("touchend",function(){
                //         self.displayControl.focus();
                //     });

                // this.inputLabel
                //     .on("click",function(){
                //         self.displayControl.focus();
                //     })
                //     .on("touchend",function(){
                //         self.displayControl.focus();
                //     });

                this.inputcontrol
                    .on("focus",function() {
                        // console.log('inputcontrol-focus');
                        self.displayControl.focus();
                    })
                    .on("click",function() {
                        // console.log('inputcontrol-click');
                        self.displayControl.focus();
                    });
                    // .on("touchend",function(){
                    //     self.displayControl.focus();
                    // });
            }

            this._bindEvents();

            this._refresh();
        },

        _bindEvents: function () {
            var self = this;

            if (this.timePicker) {
                this.timePicker.on("click", function () {
                    if( !self.isMobile ) {
                        if(self.options.value === "") {
                            self.control.data("DateTimePicker").setDate(moment().format('h:mm A'));
                        }
                        $(this.parentElement.parentElement.parentElement)
                            .data("mi-DateTimePicker")
                            ._showTimePicker();
                    } else {
                        self.displayControl.focus();
                    }
                });
            }
            if (this.datePicker) {
                this.datePicker.on("click", function () {
                    if( !self.isMobile ) {
                        $(this.parentElement.parentElement.parentElement)
                            .data("mi-DateTimePicker")
                            ._showDatePicker();
                    } else {
                        self.displayControl.focus();
                    }
                })
            }

            if (this.options.isRendered) {
                this._off(this.control, "change focus blur");
                // console.log('_bindEvents');
                var events = {};
                // if (this.options.isEventEnabled) {
                //     if (this.options.onFocus != null) {
                //         events["focus"] = this.options.onFocus;
                //     }
                //     if (this.options.onBlur != null) {
                //         events["blur"] = this.options.onBlur;
                //     }
                //     this._on(this.control, events);
                // }

                events["change"] = this._updateValue;
                this._on(this.control, events);
            }
        },

        _refresh: function () {
            // console.log('revresh')

            if (this.options.isRendered) {
                // console.log('this.options.value', this.options.value);
                //start with datetime string
                this.options.value = this._parseObj(this.options.value);
                //format output
                this.inputcontrol.val( this.formatValue(  this.options.value ) );

                //have dtbuttons follow properties
                if (this.options.disabled) {
                    this.inputcontrol.attr("disabled","disabled");
                    (this.datePicker) ? this.datePicker.attr("disabled", "disabled") : "";
                    (this.timePicker) ? this.timePicker.attr("disabled", "disabled") : "";
                } else {
                    this.inputcontrol.removeAttr("disabled");
                    (this.datePicker) ? this.datePicker.removeAttr("disabled") : "";
                    (this.timePicker) ? this.timePicker.removeAttr("disabled") : "";
                }
                this._super();
            }
        },

        //update from input or picker
        _updateValue: function (e) {
            //get new value
            this.options.prevValue = this.options.value; //set prev date object
            //start with datetime string
            var val = null;
            if (e.type === "change" || e === "change" ) {
                val = this.inputcontrol.val();
            } else {
                val = e.value;
            }

            if( this.isMobile ) {
                if(e.type == "change") {
                    val = this.displayControl.val();
                }
            }

            if( this.options.formatType === "Time" ) {
                val = moment().format('MM/DD/YYYY') + " " + val;
            }
            if( this.options.formatType === "Hour" ) {
                //console.log('val', val)
                if(isNaN(val)) {
                    var hrAppend = val.slice(-2),
                        hrPrefix = val.substring(0, val.length - 2),
                        time = hrPrefix.trim() + ":00 " + hrAppend;
                    val = moment().format('MM/DD/YYYY') + " " + time;
                } else if( val.length <= 4 ) {
                    val = moment().format('MM/DD/YYYY') + " " + val + ":00";
                } else {
                    val = moment().format('MM/DD/YYYY') + " " + val;
                }
            }

            var newValue = this._parseObj(val);
            if (newValue == "ERROR") {
                var $that = this;
                $("<div>").newDialog({
                    title: "DateTime Format Failed",
                    message: this.options.name + " failed formatting the value " + val + " to a " + this.options.formatType + ".",
                    mode: "alert",
                    onOk: function (event) {
                        if ($that.options.prevValue != null)
                            $that.setValue($that.options.prevValue);
                    }
                });
            } else {
                var formattedOutput = this.formatValue( newValue );

                if (formattedOutput !== false) {

                    this.options.value = newValue;
                    this.inputcontrol.val(formattedOutput);
                    if (this.options.isEventEnabled && this.options.onChange != null) {
                        this.options.onChange();
                    }
                }
            }
        },

        //returns moment, emptry string or ERROR
        //accepts moment, datetime string, today or empty string
        _parseObj: function (value){

            if (value === null || $.trim(value) == "") {
                return "";
            }
            else if (value == "today") {
                return new moment();
            }
            else if (typeof value === 'string') {
                //could be formatted from input or unformatted

                var returnval = $.mi.Format._types[0].validateInput(value, this.options.formatType, this.options.prevValue);

                if (returnval === false)
                    return "ERROR";
                else
                    return returnval;

            }
            else {
                if(moment(value).isValid()){
                    return moment(value);
                }else{
                    return "ERROR";
                }
            }
        },


        getValue: function () {
            if (typeof this.options.value == "string") {
                return this.options.value;
            }
            else {
                var value = this.options.value;

                if (this.options.formatType === "Short Date" || this.options.formatType === "Long Date") {
                    return value.format("YYYY-MM-DD") + " 12:00:00";
                } else {
                    return value.format("YYYY-MM-DD HH:mm:ss"); //supported ISO-8601 format    
                }
                
            }
        },
        setValue: function (value) {
            //expecting a full datetime string
            this.options.prevValue = this.options.value;
            this.options.value = value;
            this.widgetSet = false;
            this._refresh();
        },

        //pickers for datetime
        _showDatePicker: function () {
            var picker = $(this.control).data("DateTimePicker").widget;
            $("body").trigger("dtp:hidePicker", [picker]);
            setTimeout(function () {
                var calOpen = picker.find('.list-unstyled > li:first').hasClass('in');
                if (!calOpen) {
                    picker.find('.accordion-toggle').click();
                }
                $( "#foo").trigger( "custom", [ "Custom", "Event" ] );
            }, 100);
        },
        _showTimePicker: function () {
            var picker = $(this.control).data("DateTimePicker").widget;
            $("body").trigger("dtp:hidePicker", [picker]);
            setTimeout(function(){
                var calOpen = picker.find('.list-unstyled > li:first').hasClass('in');
                if (calOpen) {
                    picker.find('.accordion-toggle').click();
                }
            },100);
        },

        setFocus: function () {
            var ctl = this.inputcontrol;
            setTimeout(function () { ctl.focus(); }, 2);
        },

        getRuntimeOptions: function () {
            var opts = this._super();
            opts.value = this.getValue();
            return opts;
        }

    });

}(jQuery));