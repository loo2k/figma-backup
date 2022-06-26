<template>
  <t-dialog
    header="👩🏻‍🦱 保住肥姑妈（Figma 源文件备份）"
    width="700px"
    className="figma-bk"
    top="10%"
    :visible="dialogShow"
    @close="handleDialogClose"
  >
    <div class="figma-bk__hd">
      <div class="figma-bk-filter">
        <t-select 
          default-value="recent"
          v-model="currentFilter"
          :onChange="handleFilterChange"
          :style="{ width: '200px' }"
        >
          <t-option v-for="item in filters" :key="item.value" :value="item.value" :label="item.label" />
        </t-select>
      </div>

      <div class="figma-bk__user">
        <figma-workspace :current="workspace" :workspaces="workspaces" />
      </div>
    </div>

    <div class="figma-bk__bd">
      <figma-files-list :files="files" v-model="checked" :is-loading="isLoading" />
    </div>

    <div class="figma-bk__progress" v-if="isProcessing">
      <div class="figma-bk__progress-inner">
        <t-progress 
          theme="line" 
          :color="{ from: '#0052D9', to: '#00A870' }" 
          :percentage="progress" 
          :status="'active'" 
        />
        <div class="figma-bk__progress-text">{{ progressText }}</div>

        <div class="figma-bk__progress-action" v-if="showImportSuccess">
          <t-button 
            theme="default" 
            variant="outline" 
            size="small"
            @click="handleContinue"
          >
            继续导入
          </t-button>
          <t-button 
            theme="primary" 
            size="small" 
            @click="handleRefreshAssets"
          >
            查看导入的源文件
          </t-button>
        </div>
      </div>
    </div>

    <div class="figma-bk__error" v-if="isError">
      {{ errorText }}
    </div>

    <div class="figma-bk__ft" slot="footer">
      <div class="figma-bk__meta">
        <a href="javascript:;" @click="checkedAll">全选</a> |
        <a href="javascript:;" @click="checkedRevert">反选</a>
        <span class="figma-bk__checked">
          ({{ checked.length }}/{{ files.length }})
        </span>
      </div>
      <div class="figma-bk__action">
        <span
          v-if="!group.id"
          class="figma-bk__cloud"
        >
          支持 <a target="_blank" href="https://codesign.qq.com/?f=bk">CoDesign</a> 云备份（<a target="_blank" href="https://docs.qq.com/doc/DSWxvVnJsT1NrWFds">如何备份？</a>  ）
        </span>
        <t-button 
          theme="default" 
          variant="outline"
          :disabled="checked.length === 0 || isProcessing"
          @click="handleDownloadFigmaFiles"
        >
          下载源文件
        </t-button>
        <t-tooltip
          v-if="group && group.id"
          :content="`将保存到分组 [${ group && group.name }] 的源文件内`"
        >
          <t-button 
            theme="primary" 
            :disabled="checked.length === 0 || isProcessing"
            @click="handleImportFigmaFiles"
          >
            导入到 CoDesign
          </t-button>
        </t-tooltip>
      </div>
    </div>
  </t-dialog>
</template>

<script>
import { saveFileFromBlob } from './utils/index'
import {
  getGroupIdByPath,
  getGroup,
  uploadAttachment
} from './services/codesign'
import { 
  getState,
  getWorkspace,
  getSessionState,
  getRecentFiles,
  getFileMeta,
  getFilesByFolderId,
  getFoldersByTeamId
} from './services/figma'

import FigmaFilesList from './components/FigmaFilesList.vue'
import FigmaWorkspace from './components/FigmaWorkspace.vue'

export default {
  name: 'App',
  components: {
    FigmaFilesList,
    FigmaWorkspace
  },
  model: {
    prop: 'dialogShow',
    event: 'close'
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userState: {},
      sessionState: {},
      workspace: {},
      currentFilter: 'recent',
      files: [],
      checked: [],
      isLoading: true,
      isProcessing: false,
      progress: 0,
      progressText: '',
      groupId: '',
      group: {},
      showImportSuccess: false,
      isError: false,
      errorText: ''
    }
  },
  computed: {
    workspaces() {
      const { users, orgs, org_users: orgUsers } = this.sessionState
      const workspaces = []
      users?.map(user => {
        workspaces.push({ 
          key: user.id,
          userId: user.id,
          userName: user.handle,
          userAvatar: user.img_url,
          userEmail: user.email,
          orgId: null, 
          orgName: null, 
          orgAvatar: null,
          orgRole: null
        })

        orgUsers?.filter(r => r.user_id === user.id).forEach(orgUser => {
          const org = orgs.find(org => org.id === orgUser.org_id)
          workspaces.push({ 
            key: orgUser.id,
            userId: user.id, 
            userName: user.handle, 
            userAvatar: user.img_url, 
            userEmail: user.email,
            orgId: org.id, 
            orgName: org.name, 
            orgAvatar: org.img_url,
            orgRole: org.permission
          })
        })
      })

      return workspaces
    },
    teams() {
      return this.userState.teams
    },
    draftsFolderId() {
      return this.userState.drafts_folder_id
    },
    userId() {
      return this.userState.user_realtime_token?.match(/me-([\d]+):/)[1]
    },
    userInfo() {
      const role = this.userState.roles?.find(role => role.user_id === this.userId)
      return role?.user || {}
    },
    filters() {
      const filters = [
        { label: '最近的文件', value: 'recent' },
        { label: '草稿箱', value: 'draft' },
      ]

      const teams = this.teams?.map(team => ({
        label: `团队/${team.name}`,
        value: team.id
      }))

      return filters.concat(teams || [])
    }
  },
  async beforeCreate() {
    try {
      const sessionState = await getSessionState()
      this.sessionState = sessionState
      console.log('sessionState', sessionState)
    } catch (e) {
      this.$track('figma.app.unauthorized')

      this.isLoading = false
      this.isError = true
      this.errorText = e.status === 401 ? '你好像还没有登录 Figma, 请登录后再试' : '请求数据发生错误'
      return false
    }

    try {
      const workspace = await getWorkspace()
      this.workspace = this.workspaces.find(w => {
        if (!workspace.orgId && workspace.userId) {
          return w.userId === workspace.userId
        }

        if (workspace.orgId && workspace.userId) {
          return w.userId === workspace.userId && w.orgId === workspace.orgId
        }

        return false
      })
    } catch(e) {
      console.log(e)
    } finally {
      if (!this.workspace.userId) {
        console.log('没有获取到默认身份状态 使用第一个组织身份')
        const orgWorkspaces = this.workspaces.filter(w => w.orgId !== null)
        this.workspace = orgWorkspaces[0] || {}
      }
    }

    this.handleSwitchWorkspace(this.workspace)

    // 支持 CoDesign 的导入能力
    if (window.origin.includes('codesign')) {
      this.groupId = getGroupIdByPath()
      if (this.groupId) {
        this.group = await getGroup(this.groupId)
      }
    }
  },
  async mounted() {
    this.$track('plugin.app.dialog.mounted')

    this.$EventBus.$on('DOWNLOAD_FIG', this.fetchFigAndDownload)
    this.$EventBus.$on('SWITCH_WORKSPACE', this.handleSwitchWorkspace)
  },
  beforeDestroy() {
    this.$EventBus.$off('DOWNLOAD_FIG', this.fetchFigAndDownload)
    this.$EventBus.$off('SWITCH_WORKSPACE', this.handleSwitchWorkspace)
  },
  methods: {
    handleDialogClose() {
      if (this.isProcessing) return
      this.$emit('close', false)
    },
    handleRefreshAssets() {
      const assetsPanel = document.querySelector('.assets-side-panel')
      if (assetsPanel && assetsPanel.__vue__) {
        this.$emit('close', false)
        assetsPanel.__vue__.init()
      } else {
        location.href = `/app/design/${this.groupId}`
      }
    },
    handleContinue() {
      this.isProcessing = false
      this.showImportSuccess = false
      this.progress = 0
      this.progressText = ''
    },
    checkedAll() {
      this.checked = this.files.map(f => f.key)
    },
    checkedRevert() {
      const all = this.files.map(f => f.key) || []
      this.checked = all.filter(f => !this.checked.includes(f))
    },
    async handleFilterChange(val) {
      this.$track('figma.app.filter', val)

      this.isLoading = true
      let recentFiles = []
      let draftFiles = []
      try {
        switch (val) {
          case 'recent':
            recentFiles = await getRecentFiles(this.workspace.orgId)
            console.log('recentFiles', recentFiles)
            this.files = recentFiles.recent_files
            break
          case 'draft':
            draftFiles = await getFilesByFolderId(this.draftsFolderId)
            console.log('draftFiles', draftFiles)
            this.files = draftFiles.files
          default:
            if (/^[\d]{18}$/.test(val)) {
              const team = this.teams.find(team => team.id === val)
              const { folders } = await getFoldersByTeamId(val)
              const folderIds = Object.keys(folders)
              const filesInFolders = await Promise.all(folderIds.map(async folderId => {
                const { files, folder } = await getFilesByFolderId(folderId)
                return files.map(file => ({
                  ...file,
                  folder_name: folder.name,
                  team_name: team.name
                }))
              }))
              console.log('filesInFolders', filesInFolders)
              this.files = filesInFolders.flat()
            }
            break
        }
      } finally {
        this.checked = []
        this.isLoading = false
      }
    },
    async handleSwitchWorkspace({ orgId, userId }) {
      this.$track('figma.app.workspace.switch')

      this.isLoading = true
      this.workspace = this.workspaces.find(e => e.orgId === orgId && e.userId === userId)
      this.userState = await getState(orgId)
      this.handleFilterChange(this.currentFilter)
    },
    async fetchFigAndDownload(key, fileName) {
      const fileMeta = await getFileMeta(key)
      const figFile = await fetch(fileMeta.canvas_url).then(r => r.blob())
      saveFileFromBlob(figFile, fileName ? `${fileName}.fig` : `${fileMeta.name}.fig`)
    },
    async handleImportFigmaFiles() {
      this.$track('figma.app.import', this.checked.length || 0)

      this.isProcessing = true
      this.progress = 1
      this.progressText = '正在导入源文件...'
      let done = 0

      const files = this.files.filter(f => this.checked.includes(f.key))
      await Promise.all(files.map(async (file) => {
        try {
          this.progressText = `正在导入 ${file.name}... (${done + 1}/${files.length})`
          const meta = await getFileMeta(file.key)
          const blob = await fetch(meta.canvas_url).then(r => r.blob())
          const attachment = await uploadAttachment(this.groupId, blob, `${file.name}.fig`)
          console.log('attachment', attachment)
          // await associateAttachment(this.group.id, attachment.id)
          done++
        } catch (e) {
          console.error(e)
        } finally {
          done = done + 1
          this.progress = Math.floor(done / files.length * 100)
        }
      }))

      this.checked = []
      this.progress = 100
      this.progressText = '导入已完成'
      this.showImportSuccess = true

      // setTimeout(() => {
      //   this.isProcessing = false
      // }, 5000)
    },
    async handleDownloadFigmaFiles() {
      this.$track('figma.app.download', this.checked.length || 0)

      this.isProcessing = true
      this.progress = 1
      this.progressText = '正在下载源文件...'
      let done = 0

      const files = this.files.filter(f => this.checked.includes(f.key))
      await Promise.all(files.map(async (file) => {
        try {
          this.progressText = `正在下载 ${file.name}... (${done + 1}/${files.length})`

          const fileName = [
            file.team_name,
            file.folder_name,
            file.name
          ].filter(e => e).join(' - ')

          await this.fetchFigAndDownload(file.key, fileName)
        } catch(e) {
          console.log(e)
        } finally {
          done = done + 1
          this.progress = Math.floor(done / files.length * 100)
        }
      }))

      this.checked = []
      this.progress = 100
      this.progressText = '下载已完成 5s 后自动关闭'

      setTimeout(() => {
        this.isProcessing = false
      }, 5000)
    }
  }
}
</script>


<style lang="stylus">
.figma-bk
  &__hd
    line-height: 32px
    display: flex
    justify-content: space-between
    margin-bottom: 12px

  &__filter
    width: 50%
  
  &__user
    text-align: right

  &__bd
    height: 300px
    max-height: 300px
    overflow: auto
    overflow: overlay
  
  &__ft
    display flex
    justify-content: space-between
    align-items: center
  
  &__cloud
    font-size: 13px
    word-spacing: 0
    color: #999999
    margin-right: 12px

    a
      color: #666666
      border-bottom: 1px solid #999999

      &:hover
        color: #333333

  &__meta
    color: #999
    word-spacing: 0

    a
      color: #999
      cursor: pointer

  &__error
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color rgba(255, 255, 255, .7)
    font-weight: bold
    text-align: center
    display: flex
    align-items: center
    justify-content: center

  &__progress
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color rgba(255, 255, 255, .7)
    font-weight: bold
    text-align: center
    display: flex
    align-items: center
    justify-content: center

    &-inner
      width: 80%
    
    &-action
      display: flex
      justify-content: center
      column-gap: 15px
      margin: 15px 0
</style>
