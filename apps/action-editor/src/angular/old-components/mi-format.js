import moment from 'moment';

if (!$.isPlainObject($.mi)) {
    $.mi = {};
};

$.mi.Format = {

    initialize: function (preferences, timezone) {
        var self = this;
        self.update(preferences);
        //self._types[0]._updateTimeZone(timezone);
    },

    update: function (preferences) {

        this._types[0]._updateFormats(_.filter(preferences, function (preference) {
            return preference.category == $.mi.Constants.PreferenceCategory.DateFormatPreferences;
        }));

        this._types[1]._updateFormats(_.filter(preferences, function (preference) {
            return preference.category == $.mi.Constants.PreferenceCategory.NumberFormatPreferences;
        }));
    },

    _types: [
        {
            name: "DateTime",
            options: {

                // timezone: "Eastern Standard Time",
                // timezoneAbr: "EST",

                shortDateFormat: "MMM-DD-YYYY",  //support MMM-DD-YYYY || DD/MM/YYYY || MM/DD/YYYY || YYYY-MM-DD
                timeFormat: "hh:mm A", //support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
                longDateFormat: "ddd, MMM DD, YYYY", //support ddd, MMM DD, YYYY  ||  dddd, MMMM DD, YYYY || MMMM DD, YYYY
                hourFormat: "ha", //support  ha || hh A || HH
                dayOfWeekFormat: "ddd", //support ddd || dddd
                monthFormat: "MMM", //support MMM || MM || MMMM
                monthAndYearFormat: "MMM-YYYY", //support MMM-YYYY || MM-YYYY || MMM YYYY || MMMM YYYY
                dayFormat: "DD",
                yearFormat: "YYYY",

            },

            getTimeZone: function (type) {
                return (type === "long") ? this.options.timezone : this.options.timezoneAbr;
            },

            validator: function (date) {
                return moment(date).isValid();
            },

            //returns moment or false
            validateInput: function (strVal, datetimeFormat, prevValue) {

                var newDate = null;
                var prevDate = null;
                if (prevValue != null && prevValue != "") {
                    prevDate = moment(prevValue);
                }

                switch (datetimeFormat) {
                    case "Short Date":
                        newDate = moment(strVal, this.options.shortDateFormat, true);
                        break;
                    case "Short Date and Time":
                        newDate = moment(strVal, this.options.shortDateFormat + " " + this.options.timeFormat, true);
                        break;
                    case "Long Date":
                        newDate = moment(strVal, this.options.longDateFormat, true);
                        break;
                    case "Long Date and Time":
                        newDate = moment(strVal, this.options.longDateFormat + " " + this.options.timeFormat, true);
                        break;
                    case "Time":
                        newDate = moment(strVal, this.options.timeFormat, true);
                        break;
                    case "Hour":
                        newDate = moment(strVal, this.options.hourFormat, true);
                        break;
                    case "Day":
                        newDate = moment(strVal, this.options.dayFormat, true);
                        break;
                    case "Day of Week":
                        newDate = moment(strVal, this.options.dayOfWeekFormat, true);
                        break;
                    case "Month":
                        newDate = moment(strVal, this.options.monthFormat, true);
                        break;
                    case "Month and Year":
                        newDate = moment(strVal, this.options.monthAndYearFormat, true);
                        break;
                    case "Year":
                        newDate = moment(strVal, this.options.yearFormat, true);
                        break;
                    default:
                        return false;
                        break;
                }

                if (!newDate.isValid()) {
                    //try to parse without format
                    newDate = moment(strVal);
                }
                if (!newDate.isValid()) {
                    return false;
                }

                //picker type usuallly time
                if (prevDate != null && (datetimeFormat == "Time" || datetimeFormat == "Hour")) {
                    //preserve date
                    if (prevDate.format('YYYY MM DD') != newDate.format('YYYY MM DD')) {
                        newDate.year(prevDate.year())
                            .month(prevDate.month())
                            .date(prevDate.date());
                    }
                }
                // picker type usually date
                else if (prevDate != null && (datetimeFormat != "Hour" && datetimeFormat.indexOf("Time") == -1)) {
                    //preserve time
                    if (prevDate.format('HH mm ss') != newDate.format('HH mm ss')) {
                        newDate.hour(prevDate.hour())
                            .minute(prevDate.minute())
                            .second(prevDate.second());
                    }
                }

                return newDate;


            },
            formatter: function (date, datetimeFormat) {

                var format = "";

                if ($.isPlainObject(datetimeFormat)) {
                    var i = 0;
                    while (i != -1) {
                        if (datetimeFormat[i]) {
                            format += datetimeFormat[i];
                            i++;
                        }
                        else {
                            i = -1;
                        }
                    }
                }
                else {
                    format = datetimeFormat;
                }

                var mDate = moment(date);

                switch (format) {
                    case "Short Date":
                        return mDate.format(this.options.shortDateFormat);
                        break;
                    case "Short Date and Time":
                        return mDate.format(this.options.shortDateFormat + " " + this.options.timeFormat);
                        break;
                    case "Long Date":
                        return mDate.format(this.options.longDateFormat);
                        break;
                    case "Long Date and Time":
                        return mDate.format(this.options.longDateFormat + " " + this.options.timeFormat);
                        break;
                    case "Time":
                        return mDate.format(this.options.timeFormat);
                        break;
                    case "Hour":
                        return mDate.format(this.options.hourFormat);
                        break;
                    case "Day":
                        return mDate.format(this.options.dayFormat);
                        break;
                    case "Day of Week":
                        return mDate.format(this.options.dayOfWeekFormat);
                        break;
                    case "Month":
                        return mDate.format(this.options.monthFormat);
                        break;
                    case "Month and Year":
                        return mDate.format(this.options.monthAndYearFormat);
                        break;
                    case "Year":
                        return mDate.format(this.options.yearFormat);
                        break;
                    default:
                        return mDate.toDate().toString();
                        break;
                }

            },

            _updateFormats: function (data) {
                for (var x in data) {
                    switch (data[x].description) {
                        case "Short Date Format":
                            this.options.shortDateFormat = data[x].value;
                            break;
                        case "Long Date Format":
                            this.options.longDateFormat = data[x].value;
                            break;
                        case "Time Format":
                            this.options.timeFormat = data[x].value;
                            break;
                        case "Hour Format":
                            this.options.hourFormat = data[x].value;
                            break;
                        case "Day of Week Format":
                            this.options.dayOfWeekFormat = data[x].value;
                            break;
                        case "Month Format":
                            this.options.monthFormat = data[x].value;
                            break;
                        case "Month and Year Format":
                            this.options.monthAndYearFormat = data[x].value;
                            break;
                        default:
                            break;
                    }
                }
            },

            _updateTimeZone: function (timezone) {
                this.options.timezone = timezone;
                var arr = timezone.split(' ');
                this.options.timezoneAbr = arr[0][0] + arr[1][0] + arr[2][0];
            }
        },
        {
            name: "Number",
            options: {
                roundToDecimalPlace: 2, // decimal places, 2 is default
                useNegativeParenthesis: false, //post format
                useThousandsSeparator: true //post format
            },
            validator: function (number) {
                var numberstring = number.toString().replace(",", "").replace("(", "-").replace(")", "");
                return $.isNumeric(numberstring);
            },
            formatter: function (number, opts) {

                opts = $.extend({}, this.options, opts);

                var numberstring = number.toString().replace(",", "").replace("(", "-").replace(")", "");

                if (opts.unformat)
                    return numberstring;

                var valNumeric = parseFloat(numberstring).toFixed(opts.roundToDecimalPlace);
                var returnVal = valNumeric.toString().replace("-", "");

                if (opts.useThousandsSeparator && (valNumeric >= 1000 || valNumeric <= -1000)) {
                    returnVal = this.addCommas(returnVal);
                }
                if (valNumeric < 0) {
                    if (opts.useNegativeParenthesis)
                        returnVal = "(" + returnVal + ")";
                    else
                        returnVal = "-" + returnVal;
                }
                return returnVal;

            },
            addCommas: function (nStr) {
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            },
            _updateFormats: function (data) {
                for (var x in data) {
                    switch (data[x].description) {
                        case "Negative Number Format":
                            this.options.useNegativeParenthesis = (data[x].value != "-%s%n") ? true : false;
                            break;
                        case "Use Thousands Separator":
                            this.options.useThousandsSeparator = (data[x].value == "true") ? true : false;
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        {
            name: "Integer",
            options: {
                roundToDecimalPlace: -2, // no rounding, 0 decimals
                symbol: "",
                groupDigits: false,
                negativeFormat: "-%n"
            },
            validator: function (number) {
                return $.isNumeric(number);
            },
            formatter: function (number, opts) {
                //var input = $("<input>").val(number).formatCurrency(opts);
                return input.val();
            }
        },
        {
            name: "Decimal",
            options: {
                roundToDecimalPlace: -1, // no rounding, 2 decimals
                symbol: "",
                groupDigits: false,
                negativeFormat: "-%n"
            },
            validator: function (number) {
                return $.isNumeric(number);
            },
            formatter: function (number, opts) {
                //var input = $("<input>").val(number).formatCurrency(opts);
                return input.val();
            }
        },
        {
            name: "Money",
            options: {
                roundToDecimalPlace: 2,
                symbol: "$",
            },
            validator: function (number) {
                return $.isNumeric(number);
            },
            formatter: function (number, opts) {
                //var input = $("<input>").val(number).formatCurrency(opts);
                return input.val();
            }
        },
        {
            name: "Rate",
            options: {
                roundToDecimalPlace: 4,
                groupDigits: false,
                symbol: "%",
                positiveFormat: "%n%s",
                negativeFormat: "-%n%s"
            },
            validator: function (number) {
                return $.isNumeric(number);
            },
            formatter: function (number, opts) {
                //var input = $("<input>").val(number).formatCurrency(opts);
                return input.val();
            }
        },
        {
            name: "YesNo",
            options: {
                output: "Literal" // or Boolean or Numeric
            },
            validator: function (value) {
                if ($.trim(value).length > 0) {
                    if (typeof value == "boolean") {
                        return true;
                    }
                    else if ($.isNumeric(value) && (value == 0 || value == 1)) {
                        return true;
                    }
                    else if (typeof value == "string") {
                        var lower = value.toLowerCase();
                        return lower == "true" || lower == "false" || lower == "yes" || lower == "no";
                    }
                }
                return false;
            },
            formatter: function (value, opts) {
                if (typeof value == "boolean") {
                    return opts.output == "Literal" ? (value ? "Yes" : "No") : (opts.output == "Numeric" ? (value ? 1 : 0) : value);
                }
                else if ($.isNumeric(value) && (value == 0 || value == 1)) {
                    return opts.output == "Literal" ? (value == 1 ? "Yes" : "No") : (opts.output == "Boolean" ? (value == 1) : value);
                }
                else if (typeof value == "string") {
                    var isTrue = value.toLowerCase() == "true" || value.toLowerCase() == "yes";
                    return opts.output == "Literal" ? (isTrue ? "Yes" : "No") : (opts.output == "Numeric" ? (isTrue ? 1 : 0) : isTrue);
                }
            }
        },
    ],

    types: function () {
        var types = [];

        $.each(this._types, function (i, type) {
            types.push(type.name);
        });

        return types;
    },

    options: function (name) {
        var options = {};

        if ($.trim(name).length > 0) {
            $.each(this._types, function (i, type) {
                if (type.name == name) {
                    options = type.options;
                    return false;
                }
            });
        }

        return options;
    },

    toString: function (val, type, options) {

        if ($.trim(type).length > 0 && _.contains(this.types(), type)) {
            var x = _.find(this._types, function (_type) { return _type.name == type; });

            if (x.validator(val)) {
                return x.formatter(val, $.extend($.extend({}, this.options(type)), options));
            } else {
                // FIXME At some point move this to correct ErrorDialog
                console.error("Value provided is not in the correct format for the type specified!", [val, type, options]);
            }
        }

        return "";
    }
};