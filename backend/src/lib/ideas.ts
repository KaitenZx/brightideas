import { times } from 'lodash'

export const ideas = times(100, (i) => ({
  nick: `cool-idea-nick-${i}`,
  name: `Idea ${i}`,
  description: `Description of idea ${i}...`,
  text: times(100, (j) => `<p>Text paragrph ${j} of idea ${i}...</p>`).join(''),
}))
