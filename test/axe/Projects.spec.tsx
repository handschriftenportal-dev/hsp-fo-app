import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { mockProjects } from 'test/mocks/jestAxeMocks'

import { Description } from 'src/components/projects/Detailpage/Description'
import { Manuscripts } from 'src/components/projects/Detailpage/Manuscripts'
import { Overview } from 'src/components/projects/Detailpage/Overview'
import { Publications } from 'src/components/projects/Detailpage/Publications'
import { EntryPage } from 'src/components/projects/EntryPage'
import { CardBack } from 'src/components/projects/EntryPage/CardBack'
import { CardFront } from 'src/components/projects/EntryPage/CardFront'
import { FlipCard } from 'src/components/projects/EntryPage/FlipCard'
import { initI18n } from 'src/contexts/i18n'

import { renderWithProviders } from '../testutils/'

expect.extend(toHaveNoViolations)

describe('Project Detailpage accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('Overview ', async () => {
    const { container } = renderWithProviders(
      <Overview project={mockProjects} />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Description ', async () => {
    const { container } = renderWithProviders(
      <Description project={mockProjects} />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Manuscripts ', async () => {
    const { container } = renderWithProviders(
      <Manuscripts project={mockProjects} />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Publications ', async () => {
    const { container } = renderWithProviders(
      <Publications project={mockProjects} />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})

describe('Project EntryPage accesibility', function () {
  it('Entry Point ', async () => {
    const { container } = renderWithProviders(
      <EntryPage projects={[mockProjects]} projectStatus={'running'} />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Flipcard ', async () => {
    const { container } = renderWithProviders(
      <FlipCard project={mockProjects} />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Flipcard front', async () => {
    const { container } = renderWithProviders(<CardFront {...mockProjects} />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Flipcard back ', async () => {
    const { container } = renderWithProviders(
      <CardBack
        descriptionShort={mockProjects.descriptionShort}
        flip={true}
        id={mockProjects.id}
      />,
    )
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
