import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const AppKey = 'default-app'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getApp() {
  return Cookies.get(AppKey)
}

export function setApp(token) {
  return Cookies.set(AppKey, token)
}

export function removeApp() {
  return Cookies.remove(AppKey)
}
