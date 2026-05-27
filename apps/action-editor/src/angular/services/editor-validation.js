export default function editorValidationSvc() {

    var validationMessages = {
        100: "Please select a control.",
        101: "Please specify a result name.",
        102: "Please select a value.",
        103: "Please specify a date.",
        104: "Please select a table.",
        105: "Please select a field.",
        106: "You are referencing an action result that has not been created. Please review your actions to ensure you create action results before you reference them.",
        108: "Please enter a value.",
        109: "Please specify a message.",
        110: "Please select a filter.",
        111: "Please select a screen.",
        112: "Please select a report.",
        113: "Please specify a sender's email address.",
        114: "Please specify a recipient's email address.",
        115: "Please specify a subject.",
        116: "Please specify a selection criteria.",
        117: "Please select a grid.",
        118: "Please specify an amount.",
        119: "Please specify a payment gateway name.",
        120: "Please select a payment widget.",
        121: "Please specify the credit card number.",
        122: "Please specify the expiry month.",
        123: "Please specify the expiry year.",
        124: "Please specify the card verification number.",
        125: "Please specify the account number.",
        126: "Please specify the routing number.",
        127: "Please specify the check type.",
        128: "Please specify the product ID.",
        129: "Please specify the order ID.",
        130: "Please select an app screen.",
        131: "Please specify a web page.",
        132: "Please enter a valid URL.",
        133: "Please select a panel to open.",
        134: "Please select a section.",
        135: "Please specify a value.",
        136: "Please select a value to retrieve.",
        137: "Please enter a valid value.",
        138: "References to screen/session are not supported.",
        139: "Please specify a header title.",
        140: "Must be at most 100 characters.",
        141: "Must be at most 120 characters.",
        142: "Must be at most 40 characters.",
        143: "Please specify button text."
    };

    return {
        validationMessages: validationMessages,
    };
};

editorValidationSvc.$inject = [];