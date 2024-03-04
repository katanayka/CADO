describe('Server', () => {
    // Check save with data from fixture
    it('save empty data', () => {
        cy.fixture('/example_empty_data_save.json').then((data) => {
            cy.request('POST', 'http://localhost:3000/api/discipline/save', data).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Data saved successfully')
            })
        })
    })

    it('get saved empty data', () => {
        cy.request('GET', 'http://localhost:3000/api/discipline/data?discipline=%D0%90%D0%A2%D0%9F%D0%B8%D0%A0%D0%92').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('disciplineId')
            expect(response.body).to.have.property('dataTree').to.have.property('trees').length(0)
        })
    })

    it('saves data from fixture', () => {
        cy.fixture('/example_data_save.json').then((data) => {
            cy.request('POST', 'http://localhost:3000/api/discipline/save', data).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Data saved successfully')
            })
        })
    })

    it('get saved data', () => {
        cy.request('GET', 'http://localhost:3000/api/discipline/data?discipline=%D0%90%D0%A2%D0%9F%D0%B8%D0%A0%D0%92').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('disciplineId')
            expect(response.body).to.have.property('dataTree').to.have.property('trees').length(2)
            expect(response.body).to.have.property('dataTree').to.have.property('trees').to.have.property('0').to.have.property('root').to.have.property('children').length(2)
            expect(response.body).to.have.property('dataTree').to.have.property('trees').to.have.property('1').to.have.property('root').to.have.property('children').to.have.property('0').to.have.property('children').to.have.property('0').to.have.property('data').to.have.property('label').to.eq('Синтаксис')
        })
    })
})