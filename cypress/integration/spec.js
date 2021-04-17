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
  context('completing all todos', () => {
    beforeEach(() => {
      createDefaultTodos().as('todos')
    })

    it('can mark all todos as completed', () => {
      // complete all todos
      // we use 'check' instead of 'click'
      // because that indicates our intention much clearer
      cy.get('.toggle-all').check()

      // get each todo li and ensure its class is 'completed'
      cy.get('@todos').eq(0).should('have.class', 'completed')

      cy.get('@todos').eq(1).should('have.class', 'completed')

      cy.get('@todos').eq(2).should('have.class', 'completed')
    })
    it('can remove completed status for all todos', () => {
      // check and then immediately uncheck
      cy.get('.toggle-all').check().uncheck()

      cy.get('@todos').eq(0).should('not.have.class', 'completed')

      cy.get('@todos').eq(1).should('not.have.class', 'completed')

      cy.get('@todos').eq(2).should('not.have.class', 'completed')
    })
    it('updates the state when changing one todo', () => {
      // alias the .toggle-all for reuse later
      cy.get('.toggle-all')
        .as('toggleAll')
        .check()
        // this assertion is silly here IMO but
        // it is what TodoMVC does
        .should('be.checked')

      // alias the first todo and then click it
      cy.get('.todo-list li')
        .eq(0)
        .as('firstTodo')
        .find('.toggle')
        .uncheck()

      // reference the .toggle-all element again
      // and make sure its not checked
      cy.get('@toggleAll').should('not.be.checked')

      // reference the first todo again and now toggle it
      cy.get('@firstTodo').find('.toggle').check()

      // assert the toggle all is checked again
      cy.get('@toggleAll').should('be.checked')
    })
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
  context('counter', () => {
    it('shows the current number of todos', () => {
      createTodo(TODO_ITEM_ONE)
      cy.get('.todo-count').contains('1 item left')
      createTodo(TODO_ITEM_TWO)
      cy.get('.todo-count').contains('2 items left')
    })
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
