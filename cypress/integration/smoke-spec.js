/// <reference types="cypress" />

describe('TodoMVC', () => {
  it('adds 2 todos', () => {
    cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })
})
