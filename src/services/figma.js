import request from '../utils/request'

export const getWorkspace = async () => {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.figma.com/',
        onerror: (err) => reject(err),
        onabort: (err) => reject(err),
        onload: (resp) => {
          console.log('getWorkspace', resp)
          const { status, finalUrl } = resp
          const regxUrl = /\/files\/(\d+)?\/?recent\?fuid=(\d+)/i
          if (status !== 200 || !finalUrl || regxUrl.test(finalUrl) === false) {
            reject(false)
          }

          const [, id, fuid] = regxUrl.exec(finalUrl)

          resolve({
            orgId: id,
            userId: fuid,
          })
        }
      })
    } else {
      reject(false)
      // TODO: 测试用代码
      // resolve({
      //   orgId: '957365921422661958',
      //   userId: '957104936575872654'
      // })
    }
  })
}

export const getState = (orgId = '') => {
  return request({ 
    url: `https://www.figma.com/api/user/state?org_id=${orgId ? orgId : ''}` 
  })
}

export const getSessionState = () => {
  return request({ 
    url: 'https://www.figma.com/api/session/state' 
  })
}

export const getFoldersByTeamId = (teamId) => {
  return request({
    url: `https://www.figma.com/api/teams/${teamId}/folders`
  })
}

export const getFilesByFolderId = (folderId) => {
  return request({
    url: `https://www.figma.com/api/folders/${folderId}/files`
  })
}

export const getFileMeta = (fileId) => {
  return request({
    url: `https://www.figma.com/api/file_metadata/${fileId}`
  })
}

export const getRecentFiles = (orgId = '') => {
  return request({
    url: `https://www.figma.com/api/recent_files?org_id=${orgId ? orgId : ''}`
  })
}