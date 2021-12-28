/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('chai');

module.exports = {
  login: async (scope, username, password) => {
    await scope.page.goto('https://app.staging.tara.ai/login');
    await scope.page.waitForSelector('#root');
    const loginPage = await scope.page.$('.css-1nt71ax');
    assert.expect(loginPage).to.not.eq(undefined);
    assert.expect(loginPage).to.not.eq(null);

    // Click Email and input email
    const emailButton = await scope.page.$('.firebaseui-idp-password');
    await emailButton.click();
    const emailInputElement = await scope.page.$(['#ui-sign-in-email-input']);
    const nextButtonElement = await scope.page.$('.firebaseui-id-submit');
    await emailInputElement.type(username);
    await nextButtonElement.click();

    // Enter password after dom rebuild
    await scope.page.waitForSelector('#ui-sign-in-password-input');
    const passwordInputElement = await scope.page.$(['#ui-sign-in-password-input']);
    const loginButtonElement = await scope.page.$('.firebaseui-id-submit');
    await passwordInputElement.type(password);

    // Prepare for login
    await Promise.all([loginButtonElement.click(), scope.page.waitForNavigation()]);
    await scope.page.waitForTimeout(500); // waitForNavigation isn't working so forced to add timeout
  },
};
