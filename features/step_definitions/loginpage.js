/* eslint-disable @typescript-eslint/no-var-requires */

const { After, Before, Given, Then, When } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('chai');

// Initialize puppeteer in Cucumber World scope
Before(async () => {
  this.browser = await puppeteer.launch({ headless: true });
  this.page = await this.browser.newPage();
});

Given('I am on the login page', async () => {
  await this.page.goto('https://app.staging.tara.ai/login');
  await this.page.waitForSelector('#root');
  const loginPage = await this.page.$('.css-1nt71ax');
  assert.expect(loginPage).to.not.eq(undefined);
  assert.expect(loginPage).to.not.eq(null);
});

When('User enters a username {string} and password {string}', async (username, password) => {
  // Click Email and input email
  const emailButton = await this.page.$('.firebaseui-idp-password');
  await emailButton.click();
  const emailInputElement = await this.page.$(['#ui-sign-in-email-input']);
  const nextButtonElement = await this.page.$('.firebaseui-id-submit');
  await emailInputElement.type(username);
  await nextButtonElement.click();

  // Enter password after dom rebuild
  await this.page.waitForSelector('#ui-sign-in-password-input');
  const passwordInputElement = await this.page.$(['#ui-sign-in-password-input']);
  const loginButtonElement = await this.page.$('.firebaseui-id-submit');
  await passwordInputElement.type(password);

  // Prepare for login
  await Promise.all([loginButtonElement.click(), this.page.waitForNavigation()]);
});

Then('System logs user in', async () => {
  await this.page.waitForTimeout(500); // waitForNavigation isn't working so forced to add timeout
  assert.expect(this.page.url()).to.eq('https://app.staging.tara.ai/cucumberqa/team-cucumberqa/sprints');
});

// Close out session
After(async () => this.browser.close());
