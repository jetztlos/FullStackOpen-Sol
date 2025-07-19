// part7/bloglist/frontend/src/services/storage.js

const KEY = 'loggedBlogAppUser'

const saveUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user))
}

const loadUser = () => {
  return JSON.parse(window.localStorage.getItem(KEY))
}

const removeUser = () => {
  localStorage.removeItem(KEY)
}

const storageService = {
  saveUser,
  loadUser,
  removeUser,
}

export default storageService
