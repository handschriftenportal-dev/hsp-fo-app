import '@testing-library/cypress'

describe('Navigate all pages', function() {
  it('Visit home page', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, 'languages', {
          value: ['de']
        })
      }
    })
  })

  it('Confirm alpha dialog', () => {
    cy.findByRole('button', { name: /ok/i }).click()
  })

  it('Change language to german', () => {
    cy.findByRole('button', { name: /sprache/i }).click()
    cy.findByRole('button', { name: /deutsch/i }).click()
  })

  it('Go to search page via menu', () => {
    cy.findByRole('link', { name: /suche/i }).click()
    cy.url().should('include', '/search')
  })

  it('Go to workspace page via menu', () => {
    cy.findByRole('link', { name: /arbeitsplatz/i }).click()
    cy.url().should('include', '/workspace')
    cy.findByText(/arbeitsbereich/i)
  })

  it('Go to cms page via menu', () => {
    cy.findByRole('link', { name: /über uns/i }).click()
    cy.url().should('include', '/cms')
  })

  it('Go back to home page via menu', () => {
    // We need the `$` in the regexp because the logo link
    // has the accessabiblity name `startseite` and would
    // match too.
    cy.findByRole('link', { name: /start$/i }).click()
    cy.url().should('include', '/')
  })

})
