import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/role/index',
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete',
    method: 'get',
    params:{id:id}
  })
}

export function addRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function getPermission(id) {
  return request({
    url: '/role/permission',
    method: 'get',
    params : {id:id}
  })
}

export function setPermission(data) {
  return request({
    url: '/role/setPermission',
    method: 'post',
    data
  })
}


export function getUsers(id) {
  return request({
    url: '/role/getUsers',
    method: 'get',
    params : {id:id}
  })
}

export function bindUsers(data) {
  return request({
    url: '/role/bindUsers',
    method: 'post',
    data
  })
}


