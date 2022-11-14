import Vue from 'vue'
import PluginTrack from './plugins/track'
import App from './App.vue'
import TDesign from 'tdesign-vue'

const mounteApp = document.createElement('div')
mounteApp.id = 'import-figma-to-codesign'
document.body.appendChild(mounteApp)

if (TDesign) Vue.use(TDesign)
Vue.use(PluginTrack)
Vue.prototype.$EventBus = new Vue()

new Vue({
  render: h => h(App),
}).$mount('#import-figma-to-codesign')
