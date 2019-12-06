import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/wechat/getmenus',
    method: 'get',
    params: query
  })
}

export function setMenus(data) {
  return request({
    url: '/wechat/setmenus',
    method: 'post',
    data
  })
}

export function selectmaterial(query) {
  return request({
    url: '/wechat/selectmaterial',
    method: 'get',
    params: query
  })
}


export function getmaterial(query) {
  return request({
    url: '/wechat/getmaterial',
    method: 'get',
    params: query
  })
}

export function sysmaterial() {
  return request({
    url: '/wechat/sysmaterial',
    method: 'post'
  })
}
