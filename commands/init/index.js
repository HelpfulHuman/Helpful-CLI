const R = require('ramda');
const inquirer = require('inquirer');
const validate = require('./validate');
const compileProject = require('./compileProject');

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'What is the name of the project?',
    validate: validate.name
  },
  {
    type: 'input',
    name: 'projectSummary',
    message: 'Could you provide a short description for this project?'
  },
  {
    type: 'list',
    name: 'projectType',
    message: 'What type of project is this?',
    choices: [
      { name: 'Static Site', value: 'site' },
      { name: 'Application / Service', value: 'app' },
      { name: 'Library', value: 'lib' },
    ]
  },
  // {
  //   type: 'list',
  //   name: 'appType',
  //   message: 'What type of application are you building?',
  //   choices: [
  //     { name: 'Single Page App (Frontend)', value: 'frontend' },
  //     { name: 'Web Service', value: 'backend' },
  //     { name: 'Full-Stack Application', value: 'fullstack' }
  //   ],
  //   when: R.where({ projectType: R.equals('app') })
  // },
  {
    type: 'list',
    name: 'libType',
    message: 'What type of library are you building?',
    choices: [
      { name: 'Front-end Javascript', value: 'frontend' },
      { name: 'Back-end Javascript (Node)', value: 'node' },
      // { name: 'Go', value: 'go' }
    ],
    when: R.where({ projectType: R.equals('lib') })
  },
  {
    type: 'list',
    name: 'frontend',
    message: 'What front-end set up are you planning on using?',
    choices: [
      { name: 'No Frontend', value: false },
      { name: 'Vanilla JS (ES2015)', value: 'es' },
      { name: 'React + Redux', value: 'react' },
      // { name: 'Preact + Redux', value: 'preact' },
    ],
    when: R.where({ projectType: R.equals('app') })
  },
  {
    type: 'list',
    name: 'backend',
    message: 'What back-end set up are you planning on using?',
    choices: [
      { name: 'No Backend', value: false },
      { name: 'Vanilla Node', value: 'node' },
      { name: 'ExpressJS (Node)', value: 'express' },
    ],
    when: R.where({ projectType: R.equals('app') })
  },
  // {
  //   type: 'list',
  //   name: 'templating',
  //   message: 'What templating engine would you like to use?',
  //   choices: [
  //     { name: 'None', value: false },
  //     { name: 'Pug / Jade', value: 'pug' },
  //     { name: 'Nunjucks', value: 'nunjucks' }
  //   ],
  //   when: R.where({ projectType: R.complement(R.equals('lib')) })
  // },
  {
    type: 'checkbox',
    name: 'jsLibs',
    message: 'Would you like to add any of these common Javascript libraries to your project?',
    choices: function (input) {
      return [].concat.apply([], [
        (input.projectType === 'site' ? ['jquery'] : []),
        ['lodash', 'ramda', 'async', 'rx', 'classnames'],
        (input.frontend === 'react' ? ['redux-session', 'react-addons-update'] : ['portals'])
      ]);
    },
    when: R.anyPass([
      R.where({ projectType: R.anyPass([ R.equals('site'), R.equals('app') ])}),
      R.where({ libType: R.anyPass([ R.complement(R.equals('go')) ]) })
    ])
  },
  {
    type: 'list',
    name: 'targetEnv',
    message: 'What is your target deployment environment?',
    choices: [
      { name: 'None', value: false },
      { name: 'Heroku', value: 'foreman' },
      { name: 'Docker', value: 'docker' }
    ],
    when: R.where({ projectType: R.equals('app') })
  }
];

module.exports = function (cmd, opts) {
  inquirer
    .prompt(questions)
    .then(compileProject)
    .catch(console.error);
}