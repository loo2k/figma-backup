import Vue from 'vue'
import PluginTrack from './plugins/track'
import App from './App.vue'
import TDesign from 'tdesign-vue/esm'

// 因为 Tampermonkey 引入 TDesign 的 CSS 会出问题，所以手动引入
import './assets/tdesign.min.css'

const mounteApp = document.createElement('div')
mounteApp.id = 'import-figma-to-codesign'
document.body.appendChild(mounteApp)

if (TDesign) Vue.use(TDesign)
Vue.use(PluginTrack)
Vue.prototype.$EventBus = new Vue()

new Vue({
  render: h => h(App),
}).$mount('#import-figma-to-codesign')
