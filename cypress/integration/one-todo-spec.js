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

  context('one todo', () => {
    it('can be completed', () => {
      // we are aliasing the return value of
      // our custom command 'createTodo'
      //
      // the return value is the <li> in the <ul.todos-list>
      createTodo(TODO_ITEM_ONE).as('firstTodo')
      createTodo(TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo').find('.toggle').check()

      cy.get('@firstTodo').should('have.class', 'completed')

      cy.get('@secondTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').find('.toggle').check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('have.class', 'completed')
    })
    it('can remove completed status', () => {
      createTodo(TODO_ITEM_ONE).as('firstTodo')
      createTodo(TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo').find('.toggle').check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo').find('.toggle').uncheck()

      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })
    it('can be edited', () => {
      createDefaultTodos().as('todos')

      cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        // TODO: fix this, dblclick should
        // have been issued to label
        .find('label')
        .dblclick()

      // clear out the inputs current value
      // and type a new value
      cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        .type('{enter}')

      // explicitly assert about the text value
      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })
  })
})
