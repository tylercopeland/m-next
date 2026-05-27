# `App Builder`

## IIS Setup

Find the method platform website in IIS. (On your local it'll be called something like methodlocal.com) Add a new virtual directory to the website called app-builder pointing to this app's dist folder.

## Folder Structure

The folder structure for the `App Builder` app is as follows:

```
/c:/MethodDev/method-platform-ui/m-one/apps/app-builder/
├── dist/                          # Compiled files
├── src/                           # Source files
│   ├── app/                       # Application boots strapping and top level configuration
│   ├── common/                    # Shared resources libraries and state management
│   │   ├──  rum/                  # Datadog interactions used to capture user interactions and push it to RUM
│   │   └──  services/             # Api endpoints and redux state classes built on the ReduxToolkit library 
│   ├── components/                # React components to be used across different views
│   └── views/                     # Each functional area has its own separate view encapsulating its components and workflows 
│   │   ├── header                 # Top header
│   │   ├── layout-designer        # Wysiwyg editor for screens
│   │   │   ├── component-wrappers # Renders and click handlers for each runtime component
│   │   │   ├── component          # Layout components
│   │   │   ├── control-classes    # Creation and migration of runtime components
│   │   │   ├── editors            # Editors for each runtime component
│   │   │   ├── validation         # Validators for each runtime component
│   │   ├── left-nav               # Left navigation - not currently in use
│   │   ├── management             # App creation and management - not currently in use
│   │   ├── models                 # Model visualization and editing - not currently in use
│   │   └── screens                # Screen creation and management - not currently in use
├── public/                        # Public files
│   └── index.html                 # HTML template
├── README.md                      # Project documentation
└── package.json                   # Project metadata and dependencies
```
