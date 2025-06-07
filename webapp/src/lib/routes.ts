import {
  signUpPath,
  signInPath,
  signOutPath,
  editProfilePath,
  allIdeasPath,
  newIdeaPath,
  viewIdeaPath,
  editIdeaPath,
  getMyIdeasPath,
  getLikedIdeasPath,
} from '@brightideas/shared'
import { defineRoute } from '../utils/defineRoute'

export const getSignUpRoute = defineRoute(() => signUpPath())
export const getSignInRoute = defineRoute(() => signInPath())
export const getSignOutRoute = defineRoute(() => signOutPath())
export const getEditProfileRoute = defineRoute(() => editProfilePath())
export const getAllIdeasRoute = defineRoute(() => allIdeasPath())
export const getNewIdeaRoute = defineRoute(() => newIdeaPath())
export const getMyIdeasRoute = defineRoute(() => getMyIdeasPath())
export const getLikedIdeasRoute = defineRoute(() => getLikedIdeasPath())

export const getViewIdeaRoute = defineRoute({ ideaNick: true }, ({ ideaNick }) => viewIdeaPath(ideaNick))

export const getEditIdeaRoute = defineRoute({ ideaNick: true }, ({ ideaNick }) => editIdeaPath(ideaNick))
