/// <reference types="cypress" />
import {
  TODO_ITEM_ONE,
  TODO_ITEM_THREE,
  createDefaultTodos,
} from './utils'

describe('TodoMVC app', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('clear completed todos', () => {
    beforeEach(() => {
      createDefaultTodos().as('todos')
    })

    it('shows the right text', () => {
      cy.get('@todos').eq(0).find('.toggle').check()

      cy.get('.clear-completed').contains('Clear completed')
    })
    it('should remove completed todos', () => {
      cy.get('@todos').eq(1).find('.toggle').check()

      cy.get('.clear-completed').click()
      cy.get('@todos').should('have.length', 2)
      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)

      cy.get('@todos').eq(1).should('contain', TODO_ITEM_THREE)
    })
    it('is hidden if there are no completed todos', () => {
      cy.get('@todos').eq(1).find('.toggle').check()

      cy.get('.clear-completed').should('be.visible').click()

      cy.get('.clear-completed').should('not.exist')
    })
  })
})
