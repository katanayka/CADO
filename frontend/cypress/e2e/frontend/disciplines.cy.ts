describe('Disciplines Page', () => {
    it('Check if exists', () => {
        // Check middleware to redirect to disciplines page if disciplineId is not provided in 
    })
    describe('When user is "Student"', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000')
            cy.setCookie('userType', 'student')
            cy.get('.big-tile a').first().click()
        })

        it('has a list of disciplines', () => {
            cy.get('.big-tile').should('have.length.at.least', 1)
        })

        it('navigates to discipline page on click', () => {
            cy.get('.big-tile a').first().click()
            cy.url().should('include', '/disciplines/')
        })

        it('displays breadcrumbs', () => {
            cy.get('div').find('svg').should('have.length', 3);
            cy.get('div').find('a').should('have.length', 2);
            cy.get('div').find('a').first().should('have.text', 'Home');
            cy.get('div').find('a').last().should('have.text', 'ОПиА');
        });

        it('displays discipline title', () => {
            const disciplineId = 'ОПиА';
            cy.get('h1').should('contain', decodeURIComponent(disciplineId));
        });

        it('displays GraphBlock', () => {
            cy.get('.mapBlock').should('exist');
            cy.get('.mapBlock').contains('Карта');
            cy.get('.mapBlock').find('.collapse-content').should('not.be.visible');
        });

        it('content display on mapBlock click', () => {
            cy.get('.mapBlock').click();
            cy.get('.mapBlock').find('.collapse-content').should('be.visible');
        });

        it('displays CollapseSkillsInfo when ensemble is not null', () => {
            // Add your own assertions based on what you expect when ensemble is not null
        });

        it('displays two big-tile elements', () => {
            cy.get('.big-tile').should('have.length', 4);
        });
    })
    describe('When user is "Teacher"', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000')
            cy.setCookie('userType', 'teacher')
            cy.get('.big-tile a').first().click()
        })

        it('has a list of disciplines', () => {
            cy.get('.big-tile').should('have.length.at.least', 1)
        })

        it('navigates to discipline page on click', () => {
            cy.get('.big-tile a').first().click()
            cy.url().should('include', '/disciplines/')
        })

        it('displays breadcrumbs', () => {
            cy.get('div').find('svg').should('have.length', 3);
            cy.get('div').find('a').should('have.length', 2);
            cy.get('div').find('a').first().should('have.text', 'Home');
            cy.get('div').find('a').last().should('have.text', 'ОПиА');
        });

        it('displays discipline title', () => {
            const disciplineId = 'ОПиА';
            cy.get('h1').should('contain', decodeURIComponent(disciplineId));
        });

        it('displays GraphBlock', () => {
            cy.get('.mapBlock').should('exist');
            cy.get('.mapBlock').contains('Карта');
            cy.get('.mapBlock').find('.collapse-content').should('not.be.visible');
        });

        it('content display on mapBlock click', () => {
            cy.get('.mapBlock').click();
            cy.get('.mapBlock').find('.collapse-content').should('be.visible');
            cy.get('.mapBlock').find('.collapse-content').find('#redactorLink').should('exist');
        });

        it('displays CollapseSkillsInfo when ensemble is not null', () => {
            // Add your own assertions based on what you expect when ensemble is not null
        });

        it('displays two big-tile elements', () => {
            cy.get('.big-tile').should('have.length', 4);
        });
    })
})