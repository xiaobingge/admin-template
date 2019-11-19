import request from '@/utils/request'
import Qs from 'qs'

export function loginByUsername(username, password) {
  const data = {
      username:username,
      password:password,
      provider:'admins'
  }
    return  request({
    url: '/admin/loginCenter',
    method: 'post',
    data: Qs.stringify(data),
  })

}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/user',
    method: 'post',
  })
}

export function generateRoutes() {
  return request({
    url: '/admin/menu',
    method: 'post',
  })
}

