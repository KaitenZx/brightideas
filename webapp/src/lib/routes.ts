import {
  signUpPath,
  signInPath,
  signOutPath,
  editProfilePath,
  allIdeasPath,
  newIdeaPath,
  viewIdeaPath,
  editIdeaPath,
} from '@brightideas/shared'
import { pgr } from '../utils/pumpGetRoute'

export const getSignUpRoute = pgr(() => signUpPath())
export const getSignInRoute = pgr(() => signInPath())
export const getSignOutRoute = pgr(() => signOutPath())
export const getEditProfileRoute = pgr(() => editProfilePath())
export const getAllIdeasRoute = pgr(() => allIdeasPath())
export const getNewIdeaRoute = pgr(() => newIdeaPath())

export const getViewIdeaRoute = pgr({ ideaNick: true }, ({ ideaNick }) => viewIdeaPath(ideaNick))

export const getEditIdeaRoute = pgr({ ideaNick: true }, ({ ideaNick }) => editIdeaPath(ideaNick))
