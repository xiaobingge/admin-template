import request from '@/utils/request'

export function getData(data) {
  return request({
    url: '/tools',
    method: 'post',
    data
  })
}
