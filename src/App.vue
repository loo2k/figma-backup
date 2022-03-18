<template>
  <div id="figma-bk">
    <figma-dialog v-model="figmaDialogShow" v-if="figmaDialogShow" />

    <div class="figma-trigger" title="Figma 源文件备份" @click="handleClick">
      <svg t="1647485577281" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2224" width="18" height="18"><path d="M512 512c0-94.4 76.8-171.2 171.2-171.2 94.4 0 171.2 76.8 171.2 171.2s-76.8 171.2-171.2 171.2C588.8 683.2 512 606.4 512 512z" fill="#1ABCFE" p-id="2225"></path><path d="M171.2 852.8c0-94.4 76.8-171.2 171.2-171.2H512v171.2C512 947.2 435.2 1024 340.8 1024s-169.6-76.8-169.6-171.2z" fill="#0ACF83" p-id="2226"></path><path d="M512 0v340.8h171.2c94.4 0 171.2-76.8 171.2-171.2S777.6 0 683.2 0H512z" fill="#FF7262" p-id="2227"></path><path d="M171.2 171.2c0 94.4 76.8 171.2 171.2 171.2H512V0H340.8c-94.4 0-169.6 76.8-169.6 171.2z" fill="#F24E1E" p-id="2228"></path><path d="M171.2 512c0 94.4 76.8 171.2 171.2 171.2H512V340.8H340.8c-94.4 0-169.6 76.8-169.6 171.2z" fill="#A259FF" p-id="2229"></path></svg>
    </div>
  </div>
</template>

<script>
import FigmaDialog from './FigmaDialog.vue'

export default {
  components: {
    FigmaDialog
  },
  data() {
    return {
      figmaDialogShow: false
    }
  },
  mounted() {
    this.$track('plugin.app.mounted')

    // 注入 figma 入口
    if (window.origin.includes('figma.com')) {
      this.$track('plugin.app.mounted.figma')

      let mountInterval = setInterval(() => {
        const figmaBkId = 'figma-bk-navbar-btn'
        const figmaBkBtn = document.getElementById(figmaBkId)
        if (figmaBkBtn) { clearInterval(mountInterval) }

        const navbarAction = document.querySelector('.navbar--navbarContainer--13Uu5 > div:nth-child(2)')
        if (!document.getElementById(figmaBkId) && navbarAction) {
          const figmaBk = document.createElement('div')
          figmaBk.id = figmaBkId
          figmaBk.className = 'figma-bk-trigger action--enabled--16Cku action--root--1ClVW toolbar_styles--enabledButton--2cWGq navbar--navbarAction--3J65x'
          figmaBk.innerHTML = '<span style="padding: 0 10px;">源文件备份</span>'
          figmaBk.addEventListener('click', () => {
            this.$track('figma.app.click.figma.navbar')
            this.figmaDialogShow = true
          })

          navbarAction?.insertBefore(figmaBk, navbarAction.firstChild)
          clearInterval(mountInterval)
        }
      }, 2000)
    }

    if (window.origin.includes('codesign')) {
      this.$track('plugin.app.mounted.codesign')

      const assetsFigmaBkId = 'figma-bk-assets-btn'
      const headerFigmaBkId = 'figma-bk-header-btn'
      
      const injectAssetsFigmaBk = () => {
        const wsFigmaBk = document.getElementById(assetsFigmaBkId)
        const wsToolbar = document.querySelector('.workspace-main__assets--opt')

        if (!wsFigmaBk && wsToolbar) {
          wsToolbar.style.display = 'flex'
          wsToolbar.style.columnGap = '12px'
          
          const wsFigmaBk = document.createElement('div')
          wsFigmaBk.id = assetsFigmaBkId
          wsFigmaBk.className = 'figma-bk-trigger'
          wsFigmaBk.innerHTML = `<button type="button" class="noborder ten-button ten-button--size-small ten-button--type-default">
              <span>
                <i class="com-icon iconfont" style="display: flex;align-items: center;">
                  <svg t="1647485577281" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2224" width="18" height="18"><path d="M512 512c0-94.4 76.8-171.2 171.2-171.2 94.4 0 171.2 76.8 171.2 171.2s-76.8 171.2-171.2 171.2C588.8 683.2 512 606.4 512 512z" fill="#1ABCFE" p-id="2225"></path><path d="M171.2 852.8c0-94.4 76.8-171.2 171.2-171.2H512v171.2C512 947.2 435.2 1024 340.8 1024s-169.6-76.8-169.6-171.2z" fill="#0ACF83" p-id="2226"></path><path d="M512 0v340.8h171.2c94.4 0 171.2-76.8 171.2-171.2S777.6 0 683.2 0H512z" fill="#FF7262" p-id="2227"></path><path d="M171.2 171.2c0 94.4 76.8 171.2 171.2 171.2H512V0H340.8c-94.4 0-169.6 76.8-169.6 171.2z" fill="#F24E1E" p-id="2228"></path><path d="M171.2 512c0 94.4 76.8 171.2 171.2 171.2H512V340.8H340.8c-94.4 0-169.6 76.8-169.6 171.2z" fill="#A259FF" p-id="2229"></path></svg>
                </i> 
                从 Figma 导入源文件
              </span>
            </button>`
          wsFigmaBk.addEventListener('click', () => {
            this.$track('figma.app.click.codesign.assets')
            this.figmaDialogShow = true
          })
          wsToolbar.appendChild(wsFigmaBk)
        }
      }

      const inejctHeaderFigmaBk = () => {
        let headerFigmaBk = document.getElementById(headerFigmaBkId)
        let header = document.querySelector('.board-header__item--right')

        if (!headerFigmaBk && header) {
          headerFigmaBk = document.createElement('button')
          headerFigmaBk.id = headerFigmaBkId
          headerFigmaBk.type = 'button'
          headerFigmaBk.className = 'figma-bk-trigger icon-only ten-button ten-button--size-default ten-button--type-text'
          headerFigmaBk.innerHTML = `<span>
              <i class="com-icon iconfont">
                <svg t="1647485577281" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2224" width="18" height="18"><path d="M512 512c0-94.4 76.8-171.2 171.2-171.2 94.4 0 171.2 76.8 171.2 171.2s-76.8 171.2-171.2 171.2C588.8 683.2 512 606.4 512 512z" fill="#1ABCFE" p-id="2225"></path><path d="M171.2 852.8c0-94.4 76.8-171.2 171.2-171.2H512v171.2C512 947.2 435.2 1024 340.8 1024s-169.6-76.8-169.6-171.2z" fill="#0ACF83" p-id="2226"></path><path d="M512 0v340.8h171.2c94.4 0 171.2-76.8 171.2-171.2S777.6 0 683.2 0H512z" fill="#FF7262" p-id="2227"></path><path d="M171.2 171.2c0 94.4 76.8 171.2 171.2 171.2H512V0H340.8c-94.4 0-169.6 76.8-169.6 171.2z" fill="#F24E1E" p-id="2228"></path><path d="M171.2 512c0 94.4 76.8 171.2 171.2 171.2H512V340.8H340.8c-94.4 0-169.6 76.8-169.6 171.2z" fill="#A259FF" p-id="2229"></path></svg>
              </i>
            </span>`
          headerFigmaBk.addEventListener('click', () => {
            this.$track('figma.app.click.codesign.header')
            this.figmaDialogShow = true
          })
          header.appendChild(headerFigmaBk)
        }
      }

      const injectFigmaBkInterval = setInterval(() => {
        // 源文件页面注入上传按钮
        if (document.querySelector('.workspace-main__assets--opt')) {
          if (!document.getElementById(assetsFigmaBkId)) {
            injectAssetsFigmaBk()
          }
        }

        // 画布详情页注入上传按钮
        if (document.querySelector('.board-header__item--right')) {
          if (!document.getElementById(headerFigmaBkId)) {
            inejctHeaderFigmaBk()
          }
        }
      }, 2000)
    }
  },
  methods: {
    handleClick() {
      this.$track('figma.app.click.main')
      this.figmaDialogShow = true
    }
  }
}
</script>

<style lang="stylus">
#figma-bk
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: left
  color: #2c3e50

  .t-dialog__header
    word-spacing: 0

.figma-trigger
  width: 60px
  height: 60px
  position: fixed
  bottom: -30px
  right: -30px
  cursor: pointer
  background-color: #000
  border-radius: 100%
  z-index: 99

  svg
    margin: 12px 0 0 12px
    width: 16px
    height: 16px
</style>