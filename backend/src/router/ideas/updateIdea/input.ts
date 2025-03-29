import { zStringRequired } from '@brightideas/shared'
import { zCreateIdeaTrpcInput } from '../createIdea/input.js'

export const zUpdateIdeaTrpcInput = zCreateIdeaTrpcInput.extend({
  ideaId: zStringRequired,
})
