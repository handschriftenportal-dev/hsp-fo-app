import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import { mockProjects } from 'test/mocks/jestAxeMocks'
import 'test/testutils/mockEmblaCarousel'

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

  it('Overview', async () => {
    const { container } = await renderWithProviders(
      <Overview project={mockProjects} />,
    )
    expect(container.textContent).toContain('example project')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('Description', async () => {
    const { container } = await renderWithProviders(
      <Description project={mockProjects} />,
    )
    expect(container.textContent).toContain('descirption')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('Manuscripts', async () => {
    const projectWithManuscripts = {
      ...mockProjects,
      manuscriptListing: 'Manuscript listing',
    }
    const { container } = await renderWithProviders(
      <Manuscripts project={projectWithManuscripts} />,
    )
    expect(container.textContent).toContain('Manuscript listing')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('Publications', async () => {
    const { container } = await renderWithProviders(
      <Publications project={mockProjects} />,
    )
    expect(container.textContent).toContain('1. pub')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Project EntryPage accesibility', function () {
  it('EntryPage', async () => {
    const { container } = await renderWithProviders(
      <EntryPage projects={[mockProjects]} projectStatus={'running'} />,
    )
    expect(container.textContent).not.toContain('testProject')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('FlipCard', async () => {
    const { container } = await renderWithProviders(
      <FlipCard project={mockProjects} />,
    )
    expect(container.textContent).toContain('title')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('CardFront', async () => {
    const { container } = await renderWithProviders(
      <CardFront {...mockProjects} />,
    )
    expect(container.textContent).toContain('title')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('CardBack', async () => {
    const { container } = await renderWithProviders(
      <CardBack
        descriptionShort={mockProjects.descriptionShort}
        flip={true}
        id={mockProjects.id}
      />,
    )
    expect(container.textContent).toContain('short description')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
