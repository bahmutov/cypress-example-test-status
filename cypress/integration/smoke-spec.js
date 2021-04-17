/// <reference types="cypress" />

describe('TodoMVC', () => {
  before(() => {
    cy.visit('/hmm')
  })

  it('hides footer initially', () => {
    cy.get('.filters').should('not.exist')
  })

  it('adds 2 todos', () => {
    cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })
})
