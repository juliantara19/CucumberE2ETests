/* eslint-disable @typescript-eslint/no-var-requires */
const { After, Before, Given, Then, When } = require('@cucumber/cucumber');
const assert = require('chai');
const puppeteer = require('puppeteer');
const loginModel = require('../models/loginModel');
const sprintModel = require('../models/sprintModel');

// Initialize puppeteer in Cucumber World scope
Before(async () => {
  this.browser = await puppeteer.launch({ headless: false });
  this.page = await this.browser.newPage();
});

Given('User is logged in', { timeout: 10000 }, async () => {
  await loginModel.login(this, 'taratest@email.com', 'testing');
});

Given('User is on the sprint page', async () => {
  await Promise.all([
    this.page.goto('https://app.staging.tara.ai/cucumberqa/team-cucumberqa/sprints'),
    this.page.waitForNavigation(),
  ]);
  assert.expect(this.page.url()).to.eq('https://app.staging.tara.ai/cucumberqa/team-cucumberqa/sprints');
});

Given('A task has been created', { timeout: 10000 }, async () => {
  const text = 'Cucumber Generated Task';
  await sprintModel.createTask(this, text);
  await sprintModel.validateTaskCreated(this, text);
});

When('User enters {string} in the create tasks workdrawer', { timeout: 10000 }, async (text) => {
  await sprintModel.createTask(this, text);
});

Then('System creates task with {string} in the workdrawer', async (text) => {
  await sprintModel.validateTaskCreated(this, text);
});

Then('User deletes created task with {string}', { timeout: 10000 }, async (text) => {
  await sprintModel.deleteTask(this, text);
  await sprintModel.validateTaskDeleted(this, text);
});

When('User drags task into sprint', async () => {
  await sprintModel.dragTaskIntoCurrentSprint(this);
});

// Close out session
After(async () => this.browser.close());
