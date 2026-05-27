// Global vars - Will need to move to external //
var oldcounter = 0;
var glblInitScreenParams = null;
var glblInitViewParams = null;
var dragOptions = {
    helper: function () {
        return $(this).clone().appendTo('body').css({ 'zIndex': 5 });

    }//, cursor: "crosshair", cursorAt: { left: -5, top: -5}
};

var glblSpinner = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB3aWR0aD0nMzBweCcgaGVpZ2h0PSczMHB4JyB2aWV3Qm94PScwIDAgNDAgNDAnIGVuYWJsZS1iYWNrZ3JvdW5kPSduZXcgMCAwIDQwIDQwJyB4bWw6c3BhY2U9J3ByZXNlcnZlJz4KPHBhdGggb3BhY2l0eT0nMC4yJyBmaWxsPScjOURBMUE1JyBkPSdNMjAuMjAxLDUuMTY5Yy04LjI1NCwwLTE0Ljk0Niw2LjY5Mi0xNC45NDYsMTQuOTQ2YzAsOC4yNTUsNi42OTIsMTQuOTQ2LDE0Ljk0NiwxNC45NDYgczE0Ljk0Ni02LjY5MSwxNC45NDYtMTQuOTQ2QzM1LjE0NiwxMS44NjEsMjguNDU1LDUuMTY5LDIwLjIwMSw1LjE2OXogTTIwLjIwMSwzMS43NDljLTYuNDI1LDAtMTEuNjM0LTUuMjA4LTExLjYzNC0xMS42MzQgYzAtNi40MjUsNS4yMDktMTEuNjM0LDExLjYzNC0xMS42MzRjNi40MjUsMCwxMS42MzMsNS4yMDksMTEuNjMzLDExLjYzNEMzMS44MzQsMjYuNTQxLDI2LjYyNiwzMS43NDksMjAuMjAxLDMxLjc0OXonLz4KPHBhdGggZmlsbD0nIzNFQTRFRicgZD0nTTI2LjAxMywxMC4wNDdsMS42NTQtMi44NjZjLTIuMTk4LTEuMjcyLTQuNzQzLTIuMDEyLTcuNDY2LTIuMDEyaDB2My4zMTJoMCBDMjIuMzIsOC40ODEsMjQuMzAxLDkuMDU3LDI2LjAxMywxMC4wNDd6Jz4KPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlVHlwZT0neG1sJyBhdHRyaWJ1dGVOYW1lPSd0cmFuc2Zvcm0nIHR5cGU9J3JvdGF0ZScgZnJvbT0nMCAyMCAyMCcgdG89JzM2MCAyMCAyMCcgZHVyPScxLjI1cycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KPC9wYXRoPjwvc3ZnPg==";

if (!$.isPlainObject($.mi)) {
    $.mi = {};
};

$.mi.Guid = {
    Empty: "00000000-0000-0000-0000-000000000000",
    newGuid: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    isValid: function (guid) {
        return /^\{?[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}\}?$/.test(guid);
    }
};

$.mi.Constants = {
    ui: {
        mouseOverDelay: 550,
        isPanelOpen: false,
        scrollLocation: null,
        isMobile: function () {
            return $(window).width() < 604; // This is based on Nexus 7 being mobile (600 to 603px)
        },
        isTabletPortraitOrSmaller: function () {
            return $(window).width() < 800; //globabl var also
        },
        GetBrowserInstanceId: function () {
            var browserInstance = $.mi.Guid.newGuid();
            try {
                browserInstance = window.sessionStorage.getItem('BrowserInstanceID');
                if (!browserInstance) {
                    browserInstance = $.mi.Guid.newGuid();
                    window.sessionStorage.setItem('BrowserInstanceID', browserInstance);
                }
            }
            catch (err){
                return browserInstance;
            }
            return browserInstance;
        },
        GetBrowserSize: function () {
            //from scss partials media queries
            var width = $(window).width() / parseFloat($("body").css("font-size"));
            if(width <= 20){
                return "Mobile Portrait";
            }
            else if (width <= 35.5) {
                return "Mobile Landscape";
            }
            else if (width <= 37.5) {
                return "Small Tablet Portrait";
            }
            else if (width <= 48) {
                return "Tablet Portrait";
            }
            else if (width <= 50) {
                return "Small Tablet Landscape";
            }
            else if (width <= 64) {
                return "Tablet Landscape";
            }
            else if (width <= 76.5) {
                return "Desktop";
            }
            else {
                return "Desktop Wide";
            }
        },
        GetMobileProviderList: function() {
            return [
                ["Alltel", "(USA) - Alltel"],
                ["Airtouch pager", "(USA) - Airtouch pager"],
                ["Ameritech", "(USA) - Ameritech"],
                ["AT&T", "(USA) - AT&T"],
                ["Bellsouth", "(USA) - Bellsouth"],
                ["Boost", "(USA) - Boost"],
                ["CellularOne", "(USA) - CellularOne"],
                ["Cingular", "(USA) - Cingular"],
                ["Edge Wireless", "(USA) - Edge Wireless"],
                ["Metro PCS", "(USA) - Metro PCS"],
                ["Nextel", "(USA) - Nextel"],
                ["O2 (USA)", "(USA) - O2"],
                ["Orange (USA)", "(USA) - Orange"],
                ["Qwest", "(USA) - Qwest"],
                ["Sprint PCS", "(USA) - Sprint PCS"],
                ["T-Mobile (USA)", "(USA) - T-Mobile"],
                ["Teleflip", "(USA) - Teleflip"],
                ["US Cellular", "(USA) - US Cellular"],
                ["Verizon", "(USA) - Verizon"],
                ["Virgin Mobile (USA)", "(USA) - Virgin Mobile"],
                ["Aliant", "(CAN) - Aliant"],
                ["Bell Mobility", "(CAN) - Bell Mobility"],
                ["Fido", "(CAN) - Fido"],
                ["MTS Mobility", "(CAN) - MTS Mobility"],
                ["Rogers", "(CAN) - Rogers"],
                ["Sasktel Mobility", "(CAN) - Sasktel Mobility"],
                ["Telus", "(CAN) - Telus"],
                ["Virgin Mobile (Canada)", "(CAN) - Virgin Mobile"],
                ["President's Choice", "(CAN) - President's Choice"],
                ["O2 #1", "(UK) - O2 #1"],
                ["O2 #2", "(UK) - O2 #2"],
                ["Orange (UK)", "(UK) - Orange"],
                ["T-Mobile (UK)", "(UK) - T-Mobile"],
                ["Virgin Mobile (UK)", "(UK) - Virgin Mobile"],
                ["Vodafone", "(UK) - Vodafone"],
                ["Other", "Other"]
            ];
        }
    },

    toList: function (array) {
        if ($.isArray(array) && array.length > 0) {


            var asList = "";
            $.each(array, function (i, item) {
                asList += item + ",";
            });

            return asList;
        }

        return "";
    },

    Alignment: {
        Left: "left",
        Center: "center",
        Right: "right"
    },

    BillingPortalLink: {
        SubscriptionPortal: 0,
        AccountDetailPortal: 1,
        CancelAccountPortal: 2,
        PayOutstandingBalancePortal: 3
    },

    CalendarEventMode: {
        Add: 0,
        Edit: 1
    },

    ColumnType: {
        Data: 0,
        Link: 1,
        Expression: 2,
        Button: 3,
        CardColumn: 4
    },

    ControlStatus: {
        New: 0,
        Edit: 1,
        Delete: 2,
        Unchanged: 3
    },

    DesignerMode: {
        Override: 0,
        Design: 1,
        ReadOnly: 2
    },

    DisplayType: {
        Data: 0,
        Image: 1,
        Document: 2,
        Icon: 3,
        TagList: 4
    },

    GridEvent: {
        GridRefresh: 0,
        SortChanged: 1,
        PageChanged: 2,
        PageSizeChanged: 3,
        SettingChanged: 4,
        ActiveRowChanged: 5,
        FilterChanged: 6,
        ParentChanged: 7,
        GridLinkClicked: 8,
        RowChecked: 9,
        SearchClicked: 10,
        ColumnClicked: 11
    },

    FieldType: {
        Text: 0,
        Decimal: 1,
        Integer: 2,
        DateTime: 3,
        Money: 4,
        YesNo: 5,
        FileAttachment: 6,
        Picture: 7,
        Dropdown: 8,
        Linked: 9,
        Button: 10,
        CardColumn: 11
    },

    InstallAppStatus: {
        Unknown: 0,
        Started: 1,
        Successful: 2,
        Failed: 3
    },

    LinkType: {
        Screen: 0,
        Website: 1
    },

    LoginType: {
        Regular: 0,
        OpenId: 1,
        Inuit: 2,
        SignUp: 3,
        MiUrl: 4
    },

    MenuBodyType: {
        CompanyName: 0,
        CompanyLogo: 1,
        CustomHtml: 2,
        None: 3
    },

    MenuIconType: {
        AppIcon: 0,
        Choose: 1,
        ImageUrl: 2,
        None: 3
    },

    Mode: {
        Test: 0,
        Production: 1,
        Debug: 2
    },

    PreferenceCategory: {
        DateFormatPreferences: 0,
        NumberFormatPreferences: 1,
        AppPreferences: 2,
        EmailPreferences: 3,
        ReminderPreferences: 4,
        NotificationPreferences: 5,
        QuickBooksPreferences: 6,
        GmailGadgetPreferences: 7,
        XeroPreferences: 8
    },

    PreferenceUsageType: {        
        Account: 1,
        User: 3,
    },

    PermissionType: {
        Access: 0,
        View: 1,
        Edit: 2,
        Create: 3,
        Delete: 4,
        Approve: 5,
        Customize: 6,
        Manage: 7,
    },

    ResourceType: {
        App: 1,
        Screen: 2,
    },

    Pages: {
        User: "default.aspx",
        Guest: "guest.aspx",
        Public: "public.aspx"
    },

    PortalType: {
        StickyHorizontal: "0",
        Horizontal: "1"
    },

    Roles: {
        Administrator: "Administrator",
        Customizer: "Customizer",
        Guest: "Guest"
    },

    SnapshotType: {
        Link: 0,
        Aggregate: 1
    },

    SortType: {
        None: 0,
        Asc: 1,
        Desc: 2
    },

    StatusType: {
        New: 0,
        Edit: 1,
        Delete: 2,
        Unchanged: 3
    },

    UserType: {
        User: 0,
        Guest: 1,
        Public: 2
    },

    WidthType: {
        Pixels: 0,
        Percent: 1
    },

    ScreenVersionStatus:{
        SetActiveForMe: 0,
        LiveForAll: 1,
        Archive: 2,
        UnsetActiveForMe: 3
    },
    
    AccountingSoftware: {
        All: 0,
        QuickBooksDesktop: 1,
        QuickBooksOnline: 2,
        QuickBooksOnlineGlobal: 3,
        Xero: 4,
        None: 5
    },

    UserFilterTypes: {
        Active: 0,
        Inactive: 1,
        Invited: 2,
        Unlinked: 3
    },

    JsonResponseStatus: {
        GoodStanding: 0,
        SoftReminder: 1,
        HardReminder: 2
    },

    OnboardingStatus: {
        SyncRequired: 1,
        SurveyRequired: 2,
        Complete: 3, 
        InviteRequired : 4,
        AccountingPackageRequired: 5,
        Unsupported: 6,
        ReadyToConnect: 7,
        QbVersionRequired: 8,
        SyncComplete: 9
    },
    
    ControlMamlMapping: {
        "GRD": "Grid",
        "CHT": "Chart",
        "CAL": "Calendar",
        "PAY": "PaymentWidget"
    },
    MamlTokens: [ "Screen", "Grid", "Chart", "Calendar", "PaymentWidget"],

    PaymentGateway: {
        AuthorizeNet: { Text: "Authorize.NET", Value: "AuthorizeNET"},
        Intuit: { Text: "Intuit Merchant Services", Value: "IntuitMerchantServices"},
        PSI: { Text: "PSI Gateway", Value: "PSIGateway"},
        PayPalAccount: { Text: "PayPal Account", Value: "PayPalAccount"},
        PayPalCreditCard: { Text: "PayPal Credit Card Payments", Value: "PayPalCreditCardPayments" },
        PayPalCreditCardClassic: { Text: "PayPal Credit Card (Classic)", Value: "PayPalCreditCard" },
        IntuitPayments: { Text: "Intuit QuickBooks Payments", Value: "IntuitPayments" }
    },

    SyncResultType: {
        None: 0,
        Aborted: 1,
        Success: 2
    },

    SyncType: {
        Full: 3,
        ChangesOnly: 6        
    },
    AccountSoftwareType: {
        All: 0,
        QuickBooksDesktop: 1,
        QuickBooksOnline: 2,
        QuickBooksOnlineGlobal: 3,
        Xero: 4
    },

    validationRuleTypes: {
        required: 0,
        validEmail: 1,
        maxLength: 2,
        minLength: 3
    },
};
