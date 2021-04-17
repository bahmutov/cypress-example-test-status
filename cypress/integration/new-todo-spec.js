/// <reference types="cypress" />
import {
  TODO_ITEM_ONE,
  TODO_ITEM_TWO,
  TODO_ITEM_THREE,
  createDefaultTodos,
  createTodo,
} from './utils'

describe('TodoMVC app', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  context('new todo', () => {
    it('allows to add new todos', () => {
      // create 1st todo
      cy.get('.new-todo').type(TODO_ITEM_ONE).type('{enter}')

      // make sure the 1st label contains the 1st todo text
      cy.get('.todo-list li')
        .eq(0)
        .find('label')
        .should('contain', TODO_ITEM_ONE)

      // create 2nd todo
      cy.get('.new-todo').type(TODO_ITEM_TWO).type('{enter}')

      // make sure the 2nd label contains the 2nd todo text
      cy.get('.todo-list li')
        .eq(1)
        .find('label')
        .should('contain', TODO_ITEM_TWO)
    })

    it('clears the input field when adding', () => {
      cy.get('.new-todo').type(TODO_ITEM_ONE).type('{enter}')

      cy.get('.new-todo').should('have.text', '')
    })

    it('adds new items to the bottom of the list', () => {
      // this is an example of a custom command
      // defined in cypress/support/commands.js
      createDefaultTodos().as('todos')

      // even though the text content is split across
      // multiple <span> and <strong> elements
      // `cy.contains` can verify this correctly
      cy.get('.todo-count').contains('3 items left')

      cy.get('@todos').eq(0).find('label').should('contain', TODO_ITEM_ONE)

      cy.get('@todos').eq(1).find('label').should('contain', TODO_ITEM_TWO)

      cy.get('@todos')
        .eq(2)
        .find('label')
        .should('contain', TODO_ITEM_THREE)
    })
    it('trims text input', () => {
      createTodo(`    ${TODO_ITEM_ONE}    `)
      cy.get('.todo-list li').eq(0).should('have.text', TODO_ITEM_ONE)
    })
    it('shows the filters and actions after adding a todo', () => {
      createTodo(TODO_ITEM_ONE)
      cy.get('.main').should('be.visible')
      cy.get('.footer').should('be.visible')
    })
  })
})
