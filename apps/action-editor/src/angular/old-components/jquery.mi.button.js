(function ($) {

    $.widget("mi.Button", $.mi.Base, {

        elId: null,

        options: {
            name: 'button',
            value: 'buttontext',
            regularCaption: false,
            icon: '',
            iconAlign: 'Left',
            Type: 'BTN',
            class: 'mi-button',
            onClick: null
        },

        properties: {
            events: [
                { name: "Click", func: "onClick" }
            ]
        },

        _create: function () {
            this.element.empty();
            this._super();
            this.elId = this.options.name;

            //remove next sprint Nov 10
            if (this.options.caption != "")
                this.options.value = this.options.caption;

            this.control = $("<button class='"+ this.options.class +"' id='"+ this.elId +"' data-type='background-bar' />").appendTo(this.element);
        
            // Adding class if button text hidden
            if(this.options.hideCaption) {
                $(this.control).addClass('noCaption');
            }

            this._bindEvents();

            this._refresh();
        },

        _bindEvents: function () {
            if (this.options.isRendered) {
                this._off(this.control, "click");
                if (this.options.isEventEnabled && this.options.onClick != null) {
                    this._on(this.control, {
                        "click": function (event) {
                            if (!this.options.isInCallback) {
                                this.options.onClick(event);
                            }
                        }
                    });
                }
            }
        },

        _refresh: function () {
            if (this.options.isRendered) {
                this._display();
                this._super();
            }
        },

        _display: function () {

            //var buttonValue = (this.options.icon != "") ? "<i class='" + this.options.icon + " " + this.options.iconAlign + "'></i>" : "";
            //buttonValue += (this.options.hideCaption) ? "" : this.options.value;
            if (!this.options.hideCaption)
                this.control.html(" " + this.options.value + " ");
            if (this.options.icon != "")
                this.control.addClass(this.options.icon).addClass(this.options.iconAlign);
            //this.control.html(buttonValue);
            //calback state
            //this.control.progressInitialize();

        },

        getValue: function () {
            //Updates and returns widget value from DOM,
            this.options.value = this.control.text();
            return this.options.value;
        },
        setValue: function (value) {
            //No refresh
            this.control.text(value);
            this.options.value = value;
        },

        setCallBackState: function (on) {
            if (on) {
                this.options.isInCallback = true;
                this.control.attr("disabled", true);
            } else {
                this.options.isInCallback = false;
                this.control.attr("disabled", false);
            }
        },

        getRuntimeOptions: function () {
            var opts = this._super();
            opts.value = this.getValue();
            return opts;
        }

    });

} (jQuery));