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
          </div>
          <div class="figma-file__desc" :title="formatAbsoluteDate(file.updated_at)">
            {{ formatRelativeDate(file.updated_at) }}
          </div>
        </div>
        <div class="figma-file__check">
          <t-tooltip content="下载 .fig 文件">
            <t-button shape="rectangle" variant="text" size="medium" @click.stop="handleDownload(file.key)">
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
    handleDownload(fileKey) {
      this.$track('figma.app.download.file')
      this.$EventBus.$emit('DOWNLOAD_FIG', fileKey)
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
    background-color #fafafa
    margin 6px 0

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
    width: 32px
    height: 32px
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
    line-height: 1
    display: flex
    flex-direction: column
    justify-content: space-between

  &__name
    font-size: 14px
    font-weight: bold
    color: #333
  
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