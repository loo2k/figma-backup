import axios from 'axios'
import request from '../utils/request'

const baseUrl = window.origin.includes('codesign') ? window.origin : 'https://codesign.qq.com'

export const getGroup = (groupId) => {
  return request({ url: `${baseUrl}/api/groups/${groupId}` })
}

export const uploadAttachment = (groupId, blob, filename) => {
  const data = new FormData()
  data.append('sketch', blob.slice(0, blob.size, 'application/x-xfig'), filename)
  return axios({
    method: 'POST',
    url: `${baseUrl}/api/groups/${groupId}/upload`,
    data,
    withCredentials: true
  }).then(r => r.data)
}

// /workspace/prototype/R1JyMjolr9LbAVq/assets
// /workspace/board/PnRMdGZQd0Xk8xo
// /workspace/prototype/PnRMdGZQd0Xk8xo

export const getGroupIdByPath = (path = '') => {
  const pathStr = path || location.pathname
  const pathRegx = /\/workspace\/(prototype|board)\/(\w{15})\/?/i
  const [, , groupId] = pathRegx.exec(pathStr) || []
  return groupId
}