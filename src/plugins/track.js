const get = (key) => {
  return typeof GM_getValue === 'function' ? GM_getValue(key) : localStorage.getItem(key)
}

const set = (key, value) => {
  return typeof GM_setValue === 'function' ? GM_setValue(key, value) : localStorage.setItem(key, value)
}

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 初始化用户 ID
if (get('__track_uuid__') === null) {
  set('__track_uuid__', uuid())
}

const img = new Image()
const reportEvent = (eventName = '', eventData = '') => {
  try {
    const data = {
      v: 1,
      a: 'figma.app',
      d: location.hostname,
      dp: `${location.pathname}${location.search}`,
      t: 'event',
      referer: document.referrer,
      title: document.title,
      uid: get('__track_uuid__'),
      sid: uuid(),
      sr: `${window.screen.width}x${window.screen.height}`,
      vp: `${window.innerWidth}x${window.innerHeight}`,
      ts: Date.now(),
      l: navigator.language,
      ec: eventName,
      ea: '',
      el: typeof eventData === 'string' ? eventData : '',
      ev: typeof eventData === 'number' ? eventData : '',
      et: {}
    }

    const url = `https://horizon-assets.qq.com/collect?${Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&')}`
    img.src = url
  } catch (e) {}
}

export default {
  install(Vue, options) {
    Vue.prototype.$track = reportEvent
  }
}