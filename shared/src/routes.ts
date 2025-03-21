// BrightIdeas/shared/src/routes.ts

/**
 * "Чистые" функции, которые возвращают относительные пути.
 * Эти функции можно вызывать и на бэке, и на фронте.
 * Параметры, если нужны, передаются аргументом.
 */

// Без параметров:
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

// С параметром:
export function viewIdeaPath(ideaNick: string) {
  return `/ideas/${ideaNick}`
}

export function editIdeaPath(ideaNick: string) {
  return `/ideas/${ideaNick}/edit`
}
