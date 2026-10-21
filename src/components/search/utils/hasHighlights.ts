import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'

export const hasHighlights = (
  entry: HspObjectGroup,
  highlighting: Highlighting,
) => {
  const ids = [
    ...entry.hspDescriptions.map((desc) => desc.id),
    entry.hspObject.id,
  ]
  return ids.some(
    (id) => highlighting[id] && Object.keys(highlighting[id]).length > 0,
  )
}
