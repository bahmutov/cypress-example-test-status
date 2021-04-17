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

  context('editing todos', () => {
    beforeEach(() => {
      createDefaultTodos().as('todos')
    })

    it('hides other controls', () => {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.toggle').should('not.be.visible')

      cy.get('@secondTodo').find('label').should('not.be.visible')
    })
    it('saves edit on blur', () => {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        // we can just send the blur event directly
        // to the input instead of having to click
        // on another button on the page. though you
        // could do that its just more mental work
        .blur()

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })
    it('trims entered text', () => {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('    buy some sausages    ')
        .type('{enter}')

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })
    it('removes todo if text is empty', () => {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.edit').clear().type('{enter}')

      cy.get('@todos').should('have.length', 2)
    })
    it('cancels edit on escape', () => {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.edit').clear().type('foo{esc}')

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)

      cy.get('@todos').eq(1).should('contain', TODO_ITEM_TWO)

      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })
  })
})
