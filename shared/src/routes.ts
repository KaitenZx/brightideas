export function signUpPath() {
  return '/sign-up'
}

export function signInPath() {
  return '/sign-in'
}

export function signOutPath() {
  return '/sign-out'
}

export function editProfilePath() {
  return '/edit-profile'
}

export function allIdeasPath() {
  return '/'
}

export function newIdeaPath() {
  return '/ideas/new'
}

export function getMyIdeasPath() {
  return '/my-ideas'
}
export function getLikedIdeasPath() {
  return '/liked-ideas'
}

export function viewIdeaPath(ideaNick: string) {
  return `/ideas/${ideaNick}`
}

export function editIdeaPath(ideaNick: string) {
  return `/ideas/${ideaNick}/edit`
}
