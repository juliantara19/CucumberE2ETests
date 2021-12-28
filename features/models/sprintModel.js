/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('chai');

// Page Elements
const tasksWorkdrawer = 'div[data-rbd-droppable-id*=workdrawerTasks]';
const tasksWorkdrawerEditor = '.css-v62x6q';
const sprintColumn = '.css-jgyg5u';
const task3DotMenuButton = '.css-15fn66y';
const task3DotDeleteButton = '.css-1f2qrv3';

module.exports = {
  /**
   * Creates a task with no labels given a string
   * @param {import("../step_definitions/sprintPage")} scope
   * @param {string} text
   */
  createTask: async (scope, text) => {
    await scope.page.waitForSelector(tasksWorkdrawer);
    await scope.page.click(tasksWorkdrawer);
    await scope.page.waitForSelector(tasksWorkdrawerEditor);

    const tasksWorkdrawerEditorElement = await scope.page.$(tasksWorkdrawerEditor);
    await tasksWorkdrawerEditorElement.click();
    await tasksWorkdrawerEditorElement.type(text);
    await tasksWorkdrawerEditorElement.press('Enter');
    await scope.page.waitForSelector(sprintColumn);
    await scope.page.waitForTimeout(2000); // Necessary due to client taking long to send request
  },

  /**
   * Validates a task with the given text exists
   * @param {import("../step_definitions/sprintPage")} scope
   * @param {string} text
   */
  validateTaskCreated: async (scope, text) => {
    const task = `.//*[@class='css-h99jnx' and text() = '${text}']`;
    await scope.page.reload();
    await scope.page.waitForSelector(tasksWorkdrawer);
    await scope.page.click(tasksWorkdrawer);
    await scope.page.waitForXPath(task);
  },

  /**
   * Validates a task with the given text was deleted
   * @param {import("../step_definitions/sprintPage")} scope
   * @param {string} text
   */
  validateTaskDeleted: async (scope, text) => {
    const task = `.//*[@class='css-h99jnx' and text() = '${text}']`;
    await scope.page.reload();
    await scope.page.waitForSelector(sprintColumn);
    await scope.page.click(tasksWorkdrawer);
    assert.expect((await scope.page.$x(task)).length).to.eq(0);
  },

  /**
   * Deletes task with given string
   * @param {import("../step_definitions/sprintPage")} scope
   * @param {string} text
   */
  deleteTask: async (scope, text) => {
    const taskHeader = `.//*[@class='css-h99jnx' and text() = '${text}']//ancestor::*[@class='css-ewuthy']//*[@class='css-1a7q6wt']`;
    await scope.page.waitForSelector(sprintColumn);
    await scope.page.click(tasksWorkdrawer);
    await scope.page.waitForXPath(taskHeader);

    const taskHeaderElement = await scope.page.$x(taskHeader);
    await taskHeaderElement[0].click();
    await scope.page.waitForSelector(task3DotMenuButton);
    await scope.page.click(task3DotMenuButton);
    await scope.page.waitForSelector(task3DotDeleteButton);
    await scope.page.click(task3DotDeleteButton);
    await scope.page.waitForTimeout(2000); // Necessary due to client taking long to send request
  },

  /**
   * Drags task into the current sprint
   * @param {import("../step_definitions/sprintPage")} scope
   */
  dragTaskIntoCurrentSprint: async (scope) => {
    await scope.page.waitForSelector(tasksWorkdrawer);
  },
};
