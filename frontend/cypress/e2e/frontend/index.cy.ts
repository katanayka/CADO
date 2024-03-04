describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('successfully loads', () => {
    cy.url().should('include', '/')
  })

  it('has the correct title', () => {
    cy.title().should('include', 'CADO')
  })

  it('has a visible header', () => {
    cy.get('h1').should('be.visible')
  })

  it('has a visible dropdown', () => {
    cy.get('details').should('have.class', 'dropdown')
  })

  it('has a correct initial state of dropdown', () => {
    cy.get('summary').should('have.text', 'Студент')
  })

  it('has a correct dropdown items', () => {
    cy.get('summary').click()
    cy.get('button').should('have.length', 2)
    cy.get('button').first().should('have.text', 'Студент')
    cy.get('button').last().should('have.text', 'Преподаватель')
  })

  it('changes dropdown item', () => {
    cy.get('summary').click()
    cy.get('button').last().click()
    cy.get('summary').should('have.text', 'Преподаватель')
    Cypress.Cookies.debug(true)
    cy.setCookie('userType', 'teacher')
    cy.getCookie('userType')
    Cypress.Cookies.debug(false)
  })

  it('has a list of disciplines', () => {
    cy.get('.big-tile').should('have.length.at.least', 1)
  })

  it('navigates to discipline page on click', () => {
    cy.get('.big-tile a').first().click()
    cy.url().should('include', '/disciplines/')
  })
})