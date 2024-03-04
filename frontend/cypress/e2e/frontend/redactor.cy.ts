describe('Redactor Page', () => {
    describe('When user is "Student"', () => {
        it('redirects to not-allowed', () => {
            cy.visit('http://localhost:3000')
            cy.setCookie('userType', 'student')
            cy.visit('http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90/redactor')
            cy.url().should('include', '/not-permitted')
        })
    })
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.setCookie('userType', 'teacher')
        cy.visit('http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90/redactor')
    })
    describe('Toolbar', () => {
        it('has a visible toolbar', () => {
            cy.get('#toolbar').should('be.visible')
        })
        it('has 2 tabs (Базовые и Расширенные)', () => {
            cy.get('.tabs').find('input').should('have.length', 2)
            cy.get('.tabs').find('input').should('have.class', 'tab')
        })
        it('has menu items in each tab', () => {
            cy.get('.tabs').find('input').each((tab) => {
                cy.wrap(tab).click()
                cy.get('.menu').should('have.length.at.least', 1)
            })
        })
    })

    describe('Flow', () => {
        it('has a visible flow', () => {
            cy.get('#flow').should('be.visible')
        })
        it('has a visible save button', () => {
            cy.get('#saveButton').should('be.visible')
        })
    })
})