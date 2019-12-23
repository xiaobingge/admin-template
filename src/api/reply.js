import request from '@/utils/request'

export function getReply(rule_id) {
  return request({
    url: '/reply/getReply',
    method: 'get',
    params:{rule_id:rule_id}
  })
}

export function getReplyDetail(query) {
  return request({
    url: '/reply/getReplyDetail',
    method: 'get',
    params: query
  })
}
export function handleReply(data) {
  return request({
    url: '/reply/handleReply',
    method: 'post',
    data
  })
}

export function deleteReply(id) {
  return request({
    url: '/reply/deleteReply',
    method: 'get',
    params:{id:id}
  })
}

export function handleRule(data) {
  return request({
    url: '/reply/handleRule',
    method: 'post',
    data
  })
}

export function deleteRule(id) {
  return request({
    url: '/reply/deleteRule',
    method: 'get',
    params:{id:id}
  })
}

export function getRules(query) {
  return request({
    url: '/reply/getRules',
    method: 'get',
    params:query
  })
}

