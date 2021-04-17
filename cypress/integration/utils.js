/// <reference types="cypress" />

export const TODO_ITEM_ONE = 'buy some cheese'
export const TODO_ITEM_TWO = 'feed the cat'
export const TODO_ITEM_THREE = 'book a doctors appointment'

export const createDefaultTodos = () => {
  // do not log any commands inside this utility function
  const options = { log: false }
  cy.get('.new-todo', options)
    .type(`${TODO_ITEM_ONE}{enter}`, options)
    .type(`${TODO_ITEM_TWO}{enter}`, options)
    .type(`${TODO_ITEM_THREE}{enter}`, options)

  return cy.get('.todo-list li', options)
}

export const createTodo = (todo) => {
  // do not log any commands inside this utility function
  const options = { log: false }

  // create the todo
  cy.get('.new-todo', options).type(`${todo}{enter}`, options)
  return cy.get('.todo-list', options).contains('li', todo.trim(), options)
}
