/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

describe('App', function () {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Display home page', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, 'languages', {
          value: ['de'],
        })
      },
    })
  })

  it('Open site menu', () => {
    cy.findByRole('button', { name: /Seitenleiste ausklappen/i }).click()
    cy.findByRole('link', { name: /Impressum & Datenschutz/i }).click()
    cy.url().should('include', '/legal-notice-data-privacy')
  })

  it('Change language to german', () => {
    cy.findByRole('button', { name: /sprache/i }).click()
    cy.findByRole('button', { name: /deutsch/i }).click()
  })

  it('Go to search page via menu', () => {
    cy.findByRole('link', { name: /suche/i }).click()
    cy.url().should('include', '/search')
  })

  it('Go to project pages via menu', () => {
    cy.findByRole('link', { name: /Projekte/i }).click()
    cy.url().should('include', '/projects')
  })

  it('Go to workspace page via menu', () => {
    cy.findByRole('link', { name: /arbeitsplatz/i }).click()
    cy.url().should('include', '/workspace')
    cy.findByText(/arbeitsbereich/i)
  })

  it('Go to cms page via menu', () => {
    cy.findByRole('link', { name: /Test$/i }).click()
    cy.url().should('include', '/info')
  })

  it('Go back to home page via menu', () => {
    // We need the `$` in the regexp because the logo link
    // has the accessabiblity name `startseite` and would
    // match too.
    cy.findByRole('link', { name: /start$/i }).click()
    cy.url().should('include', '/')
  })
})
