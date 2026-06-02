const FOLDER_PATH = 'src/{{folder}}'

export default function (plop) {
  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name',
      },
      {
        type: 'input',
        name: 'folder',
        message: 'Folder',
      },
      {
        type: 'confirm',
        name: 'isStyles',
        message: 'Do you want add styles?',
      },
      {
        type: 'confirm',
        name: 'isTypes',
        message: 'Do you want add types?',
      },
    ],
    actions: function (data) {
      const actions = []
      actions.push({
        type: 'add',
        path: `${FOLDER_PATH}/{{kebabCase name}}/{{kebabCase name}}.tsx`,
        templateFile: 'plop-templates/component.js.hbs',
      })

      if (data.isStyles) {
        actions.push({
          type: 'add',
          path: `${FOLDER_PATH}/{{kebabCase name}}/{{kebabCase name}}.styled.ts`,
          templateFile: 'plop-templates/styled.js.hbs',
        })
      }

      if (data.isTypes) {
        actions.push({
          type: 'add',
          path: `${FOLDER_PATH}/{{kebabCase name}}/types.ts`,
          templateFile: 'plop-templates/types.js.hbs',
        })
      }

      actions.push({
        type: 'add',
        path: `${FOLDER_PATH}/{{kebabCase name}}/index.ts`,
        templateFile: 'plop-templates/index.js.hbs',
      })

      actions.push({
        type: 'add',
        path: `${FOLDER_PATH}/index.ts`,
        templateFile: 'plop-templates/index-inject.js.hbs',
        skipIfExists: true,
      })

      actions.push({
        type: 'append',
        path: `${FOLDER_PATH}/index.ts`,
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `export { {{pascalCase name}} } from './{{kebabCase name}}'`,
      })

      return actions
    },
  })
}
