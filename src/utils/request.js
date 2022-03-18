import axios from 'axios'

const request = (config) => {
  return new Promise((resolve, reject) => {
    console.log(config.method || 'GET', config.url)

    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest({
        method: config.method || 'GET',
        url: config.url,
        headers: config.headers || {},
        data: config.data || {},
        responseType: config.responseType || 'json',
        onerror: (err) => reject(err),
        onabort: (err) => reject(err),
        onload: ({ finalUrl, response }) => {
          // 判断是否 Figma 的请求
          if (finalUrl.indexOf('https://www.figma.com/') === 0) {
            if (response.status !== 200 || response.error) {
              reject(response)
            }
            resolve(response.meta)
          } else {
            resolve(response)
          }
        },
      })
    } else {
      axios(config)
        .then(({ data }) => {
          const { status, error, meta } = data
          
          if (status !== 200 || error) {
            reject(data)
          }

          if (meta) {
            resolve(meta)
          }

          resolve(data)
        })
        .catch(error => {
          // console.log('error', error, error.response)
          const { status, data } = error.response
          if (status === 401 && data) {
            reject(data)
          } else {
            reject(error)
          }
        })
    }
  })
}

export default request