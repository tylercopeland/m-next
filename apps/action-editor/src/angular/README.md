* READ ME

*** How to create a new action

- Each action will have it's own folder that exists in the actions folder
- Each action will have a ctrl.js, model.js and tmpl.html file
- You can use the model-tmpl.js file for a template
- Models will inherit functions from the models/base.js file
- Make sure you create a unique namespace for each action

*** Register new action with action editor

- Add both .js files to Bundles.ajaxmin File in the actioneditor bundle approx line 362
- Register the model and controller in the registrations.js file within this directory
- Open the models/editor.js and do the following: 
  - Add the new model name you added to the registrations.js file to the top function line 5
  - Add the same model to the array in line 8
  - Add the same model to the $inject call at the bottom of this file

*** Other things to note

Things are split up into individual models each model has their own validation and functionality. Actions will use this models.

***** EditorModel

Which basically controls the functionality for the action editor itself from menu, selected control/event and actions to add. Also this will give you the ability to call functions on the ActionSetModel from the editor.

***** ActionSetModel

This is the main model that houses all the list of actions and has specific functionality associated to it. This Model can be used in other actions that have their own specific action sets.

***** ComplexValueModel 

This model is one of the most commonly used components on the page this deals with handling the validation and functionality of complex values. Front end functionality is handled by the complex-value-dir in the components directory.

***** ResultToSetModel

This model deals with the ability to create and choose a new Action Result this is also commonly used throughout each action. The front end for this model is handled by the result-to-set-dir in the components directory.

***** ControlModel

This model handles all functionality when dealing with ResultToSetModel and assigning a result to a control it self.



