<template>
  <div class="figma-files">
    <div class="figma-files__loading" v-if="isLoading">
      <t-loading size="medium"></t-loading>
    </div>
    <t-checkbox-group
      :value="checked"
      :style="{ display: 'block' }"
    >
      <div 
        :class="[ 'figma-files__item', { 'figma-files__item--checked': checked.includes(file.key) } ]" 
        v-for="file in files" 
        :key="file.key"
        @click="toggleChecked(file.key)"
      >
        <div class="figma-file__check">
          <t-checkbox :value="file.key" @click="toggleChecked(file.key)"></t-checkbox>
        </div>
        <div class="figma-file__thumb">
          <img :src="file.thumbnail_url" :alt="file.name">
        </div>
        <div class="figma-file__info">
          <div class="figma-file__name">
            <span v-if="file.folder_name" class="figma-file__folder-name">
              {{ file.folder_name }} /
            </span>
            {{ file.name }}
            <svg v-if="file.editor_type === 'design'" width="32" height="32" viewBox="0 0 32 32" fill="none"><path class="file_icons--designFilePrimary--2TWAR" d="M7 28H25C25.5523 28 26 27.5523 26 27V9.91421C26 9.649 25.8946 9.39464 25.7071 9.20711L20.7929 4.29289C20.6054 4.10536 20.351 4 20.0858 4H7C6.44772 4 6 4.44772 6 5V27C6 27.5523 6.44772 28 7 28Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.8582 12.9953L16.8466 12.992L12.4437 11.7366L15.7009 14.9938C15.8169 14.954 15.9412 14.9324 16.0707 14.9324C16.6993 14.9324 17.2089 15.442 17.2089 16.0707C17.2089 16.6993 16.6993 17.2089 16.0707 17.2089C15.442 17.2089 14.9324 16.6993 14.9324 16.0707C14.9324 15.9412 14.954 15.8169 14.9938 15.7009L11.7425 12.4496L12.9443 16.6419L12.9548 16.6784L12.9625 16.7156C13.26 18.1592 14.5397 19.2442 16.0707 19.2442C16.4199 19.2442 16.7541 19.1882 17.0659 19.0854L17.6507 18.8924L18.0862 19.3279L19.3171 20.5588L20.5858 19.2901L19.3411 18.0455L18.9107 17.615L19.0954 17.035C19.1918 16.7321 19.2443 16.4085 19.2443 16.0707C19.2443 14.5951 18.2363 13.3524 16.8699 12.9983L16.8582 12.9953ZM21.2929 18.583L22 19.2901L21.2929 19.9972L20.0242 21.2659L19.3171 21.973L18.61 21.2659L17.3791 20.035C16.9676 20.1708 16.5277 20.2442 16.0707 20.2442C14.0558 20.2442 12.3744 18.8165 11.983 16.9175L10.3246 11.1324L10 10L11.1329 10.323L17.1208 12.0303C18.9175 12.4959 20.2443 14.1283 20.2443 16.0707C20.2443 16.5127 20.1756 16.9386 20.0482 17.3384L21.2929 18.583Z" fill="var(--color-icon-ondesign, white)"></path><path d="M20.5 8.5V6.41421V4L22.2071 5.70711L24.2929 7.79289L26 9.5H23.5858H21.5C20.9477 9.5 20.5 9.05228 20.5 8.5Z" fill="var(--color-icondesignfilesecondary, #9bd5fd)"></path></svg>
            <svg v-if="file.editor_type === 'whiteboard'" width="32" height="32" viewBox="0 0 32 32" fill="none"><path class="file_icons--figjamFilePrimary--3szfo" d="M7 28H25C25.5523 28 26 27.5523 26 27V9.91421C26 9.649 25.8946 9.39464 25.7071 9.20711L20.7929 4.29289C20.6054 4.10536 20.351 4 20.0858 4H7C6.44772 4 6 4.44772 6 5V27C6 27.5523 6.44772 28 7 28Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2966 20.8616C19.4811 21.0461 19.7802 21.0461 19.9647 20.8616L21.0059 19.8205C21.1903 19.636 21.1903 19.3369 21.0059 19.1524L15.0579 13.2045L13.3487 14.9137L19.2966 20.8616ZM12.6416 14.2066L11.7021 13.2671L11.2748 11.1305L13.4113 11.5578L14.3508 12.4974L12.6416 14.2066ZM11.0623 10.0682L13.9043 10.6366L21.713 18.4453C22.288 19.0203 22.288 19.9526 21.713 20.5276L20.6718 21.5687C20.0968 22.1438 19.1645 22.1438 18.5895 21.5687L10.7809 13.7601L10.2125 10.9181L10 9.85578L11.0623 10.0682Z" fill="var(--color-icon-onfigjam, white)"></path><path d="M20.5 8.5V6.41421V4L22.2071 5.70711L24.2929 7.79289L26 9.5H23.5858H21.5C20.9477 9.5 20.5 9.05228 20.5 8.5Z" fill="var(--color-iconfigjamfilesecondary, #C599FF)"></path></svg>
          </div>
          <div class="figma-file__desc" :title="formatAbsoluteDate(file.updated_at)">
            {{ formatRelativeDate(file.updated_at) }}
          </div>
        </div>
        <div class="figma-file__check">
          <t-tooltip content="下载源文件">
            <t-button shape="rectangle" variant="text" size="medium" @click.stop="handleDownload(file)">
              <download-icon slot="icon"/>
            </t-button>
          </t-tooltip>
        </div>
      </div>
    </t-checkbox-group>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { DownloadIcon } from 'tdesign-icons-vue'
dayjs.locale(navigator.language.toLowerCase())
dayjs.extend(relativeTime)

export default {
  name: 'FigmaFiles',
  components: {
    DownloadIcon
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Array,
      default: () => []
    },
    files: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatRelativeDate(date) {
      return dayjs(date).fromNow()
    },
    formatAbsoluteDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    toggleChecked(key) {
      const checked = this.checked.includes(key) ? this.checked.filter(item => item !== key) : [ ...this.checked, key ]
      this.$emit('change', checked)
    },
    handleDownload(file) {
      this.$track('figma.app.download.file')
      const fileName = `${file.name}.${file.editor_type === 'whiteboard' ? 'jam' : 'fig'}`
      this.$EventBus.$emit('DOWNLOAD_FILE', file.key, fileName)
    }
  }
}
</script>

<style lang="stylus">
.figma-files
  &__loading
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(255, 255, 255, 0.5)
    z-index: 1
    display: flex
    justify-content: center
    align-items: center

  &__item
    width: 100%
    cursor: pointer
    border-radius: 4px
    border: 1px solid #fafafa
    padding: 10px
    display: flex
    background-color: #fafafa
    margin: 6px 0
    box-sizing: border-box

    // border-color #eeeeee
    // background-color #eeeeee

    &:hover
    &--checked
      border-color: #0152d9 !important

.figma-file
  &__check
    display: flex
    justify-content: center
    align-items: center

  &__thumb
    width: 40px
    height: 40px
    padding: 2px
    overflow: hidden
    border-radius: 4px
    margin-right: 10px
    border: 1px solid #ddd
    display: flex
    justify-content: center
    align-items: center
    background-color #fff

    img
      max-width: 100%
      max-height: 100%
  
  &__info
    flex: 1
    line-height: 20px
    display: flex
    flex-direction: column
    justify-content: space-between

  &__name
    font-size: 14px
    font-weight: bold
    color: #333

    svg
      display: inline-block
      width: 20px
      height: 20px
      vertical-align: text-bottom
  
  &__folder-name
    color: #999

  &__desc
    font-size: 12px
    color: #999

  &__action
    display: flex
    justify-content: center
    align-items: center
    border-radius: 4px
    background-color: #eee
    cursor: pointer
    font-size: 20px
    color: #2c3e50
    transition: all .3s
    &:hover
      background-color: #2c3e50
      color: #fff
</style>