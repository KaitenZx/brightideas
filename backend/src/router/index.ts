import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createTrpcRouter } from '../lib/trpc.js'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMeTrpcRoute } from './auth/getMe/index.js'
import { signInTrpcRoute } from './auth/signIn/index.js'
import { signUpTrpcRoute } from './auth/signUp/index.js'
import { updatePasswordTrpcRoute } from './auth/updatePassword/index.js'
import { updateProfileTrpcRoute } from './auth/updateProfile/index.js'
import { addCommentTrpcRoute } from './comments/addComment/index.js'
import { getCommentsTrpcRoute } from './comments/getComments/index.js'
import { blockIdeaTrpcRoute } from './ideas/blockIdea/index.js'
import { createIdeaTrpcRoute } from './ideas/createIdea/index.js'
import { getIdeaTrpcRoute } from './ideas/getIdea/index.js'
import { getIdeasTrpcRoute } from './ideas/getIdeas/index.js'
import { getLikedIdeasTrpcRoute } from './ideas/getLikedIdeas/index.js'
import { getMyIdeasTrpcRoute } from './ideas/getMyIdeas/index.js'
import { setIdeaLikeTrpcRoute } from './ideas/setIdeaLike/index.js'
import { updateIdeaTrpcRoute } from './ideas/updateIdea/index.js'
import { prepareCloudinaryUploadTrpcRoute } from './upload/prepareCloudinaryUpload/index.js'
import { prepareS3UploadTrpcRoute } from './upload/prepareS3Upload/index.js'
// @endindex

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  blockIdea: blockIdeaTrpcRoute,
  createIdea: createIdeaTrpcRoute,
  getIdea: getIdeaTrpcRoute,
  getIdeas: getIdeasTrpcRoute,
  setIdeaLike: setIdeaLikeTrpcRoute,
  updateIdea: updateIdeaTrpcRoute,
  prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
  prepareS3Upload: prepareS3UploadTrpcRoute,
  getLikedIdeas: getLikedIdeasTrpcRoute,
  getMyIdeas: getMyIdeasTrpcRoute,
  addComment: addCommentTrpcRoute,
  getComments: getCommentsTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
