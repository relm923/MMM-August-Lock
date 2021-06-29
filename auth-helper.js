const Inquirer = require('inquirer');
const August = require('august-connect');
const Chalk = require('chalk');

const EMAIL_REGEX = /.+@.+/;
const PHONE_REGEX = /^\+\d{11}$/;

const originalConsoleLog = console.log;

// Disable logging from august-connect
console.log = function () {};

const run = async () => {
  const { IDType } = await Inquirer.prompt([
    {
      type: 'list',
      name: 'IDType',
      message: 'What type of ID do you use to access your August account?',
      choices: ['email', 'phone'],
    },
  ]);

  const { augustID } = await Inquirer.prompt([
    {
      type: 'input',
      name: 'augustID',
      message: `Enter your August UserId (ex: ${
        IDType === 'email' ? 'foo@bar.com' : '+12345678901'
      })?`,
      validate: (input) => {
        if (IDType === 'email') {
          const valid = EMAIL_REGEX.test(input);
          if (!valid) {
            return 'Enter valid email address (ex: foo@bar.com)';
          }
        }
        if (IDType === 'phone') {
          const valid = PHONE_REGEX.test(input);
          if (!valid) {
            return 'Enter valid phone number (ex: +12345678901)';
          }
        }

        return true;
      },
    },
  ]);

  const config = {
    apiKey: '79fd0eb6-381d-4adf-95a0-47721289d1d9',
    augustID,
    IDType,
    installID: 'magic-mirror',
    password: 'PASSWORD',
  };

  await August.authorize({ config });

  const { code } = await Inquirer.prompt([
    {
      type: 'input',
      name: 'code',
      message: 'Enter the code August just sent you',
    },
  ]);

  await August.authorize({ code, config });

  originalConsoleLog(Chalk.green('Successfully Authorized!'));
};

run();
