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

  context('routing', () => {
    beforeEach(() => {
      createDefaultTodos().as('todos')
    })

    it('goes to the active items view', () => {
      cy.get('@todos').eq(1).find('.toggle').check()

      cy.get('.filters').contains('Active').click()

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)

      cy.get('@todos').eq(1).should('contain', TODO_ITEM_THREE)
    })
    it('respects the browser back button', () => {
      cy.get('@todos').eq(1).find('.toggle').check()

      cy.get('.filters').contains('Active').click()

      cy.get('.filters').contains('Completed').click()

      cy.get('@todos').should('have.length', 1)
      cy.go('back')
      cy.get('@todos').should('have.length', 2)
      cy.go('back')
      cy.get('@todos').should('have.length', 3)
    })
    it('goes to the completed items view', () => {
      cy.get('@todos').eq(1).find('.toggle').check()

      cy.get('.filters').contains('Completed').click()

      cy.get('@todos').should('have.length', 1)
    })
    it('goes to the display all items view', () => {
      cy.get('@todos').eq(1).find('.toggle').check()

      cy.get('.filters').contains('Active').click()

      cy.get('.filters').contains('Completed').click()

      cy.get('.filters').contains('All').click()

      cy.get('@todos').should('have.length', 3)
    })
    it('highlights the current view', () => {
      // using a within here which will automatically scope
      // nested 'cy' queries to our parent element <ul.filters>
      cy.get('.filters').within(function () {
        cy.contains('All').should('have.class', 'selected')
        cy.contains('Active').click().should('have.class', 'selected')

        cy.contains('Completed').click().should('have.class', 'selected')
      })
    })
  })
})
