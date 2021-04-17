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

  context('counter', () => {
    it('shows the current number of todos', () => {
      createTodo(TODO_ITEM_ONE)
      cy.get('.todo-count').contains('1 item left')
      createTodo(TODO_ITEM_TWO)
      cy.get('.todo-count').contains('2 items left')
    })
  })

  context('persistence', () => {
    it('saves the todos data and state', () => {
      function testState() {
        cy.get('@firstTodo')
          .should('contain', TODO_ITEM_ONE)
          .and('have.class', 'completed')

        cy.get('@secondTodo')
          .should('contain', TODO_ITEM_TWO)
          .and('not.have.class', 'completed')
      }

      createTodo(TODO_ITEM_ONE).as('firstTodo')
      createTodo(TODO_ITEM_TWO).as('secondTodo')
      cy.get('@firstTodo')
        .find('.toggle')
        .check()
        .then(testState)

        .reload()
        .then(testState)
    })
  })
})
