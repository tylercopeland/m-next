# `Template Example`

To create a new widget or add an existing one to the monorepo simply copy the this folder and do the following:

## Package Setup

- In the package.json change the name of the package to be the name of your new component.
- Add a description, author, and relevent keywords

## Code Configuration

The default package configuration is setup to use the index.js file located in the in src folder. All code should be located in the src folder of subfolder from there. Any components you want to export from module should be exported via the index.js file.

## Storybook

Copy the example the story in the stories folder. Update The examples in there to reflect your new component. The storybooks example story is preconfigured to show test results, include accessiblity checks, and import the current method style sheet into your story.
