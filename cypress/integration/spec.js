/// <reference types="cypress" />
import {
  TODO_ITEM_ONE,
  TODO_ITEM_TWO,
  TODO_ITEM_THREE,
  createDefaultTodos,
} from './utils'

describe('TodoMVC app', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('on start', () => {
    it('sets the focus on the todo input field', () => {
      cy.focused().should('have.class', 'new-todo')
    })
  })
  context('without todos', () => {
    it('hides any filters and actions', () => {
      cy.get('.todo-list li').should('not.exist')
      cy.get('.main').should('not.exist')
      cy.get('.footer').should('not.exist')
    })
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
    it('trims text input')
    it('shows the filters and actions after adding a todo')
  })
  context('completing all todos', () => {
    it('can mark all todos as completed')
    it('can remove completed status for all todos')
    it('updates the state when changing one todo')
  })
  context('one todo', () => {
    it('can be completed')
    it('can remove completed status')
    it('can be edited')
  })
  context('editing todos', () => {
    it('hides other controls')
    it('saves edit on blur')
    it('trims entered text')
    it('removes todo if text is empty')
    it('cancels edit on escape')
  })
  context('counter', () => {
    it('shows the current number of todos')
  })
  context('clear completed todos', () => {
    it('shows the right text')
    it('should remove completed todos')
    it('is hidden if there are no completed todos')
  })
  context('persistence', () => {
    it('saves the todos data and state')
  })
  context('routing', () => {
    it('goes to the active items view')
    it('respects the browser back button')
    it('goes to the completed items view')
    it('goes to the display all items view')
    it('highlights the current view')
  })
})
