import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/index',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function updateStatus(id,type) {
  return request({
    url: '/user/updateStatus',
    method: 'get',
    params:{id:id,type:type}
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete',
    method: 'get',
    params:{id:id}
  })
}

export function getRoles(id) {
  return request({
    url: '/user/getRoles',
    method: 'get',
    params:{uid:id}
  })
}


export function getPermission(id) {
  return request({
    url: '/user/permission',
    method: 'get',
    params : {id:id}
  })
}

export function setPermission(data) {
  return request({
    url: '/user/setPermission',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}
