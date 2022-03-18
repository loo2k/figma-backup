<template>
  <div class="figma-ws">
    <t-popup
      v-if="current.userId" 
      placement="bottom-right"
      trigger="click"
      v-model="popupVisible"
    >
      <div class="figma-ws__current" slot='triggerElement'>
        <t-avatar size="20px" :image="current.userAvatar" :alt="current.userName" />
        <span class="figma-ws__username">{{ current.userName }}</span>
        <span v-if="current.orgName" class="figma-ws__orgname">@{{ current.orgName }}</span>
      </div>

      <div class="figma-ws-switch" slot="content">
        <div class="figma-ws__usergroup" v-for="user in users" :key="user.userId">
          <div class="figma-ws__usergroup-title">
            {{ user.userName }}({{ user.userEmail }})
          </div>
          <div 
            :class="[
              'figma-ws__useritem',
              { 'figma-ws__useritem--active': item.userId === current.userId && current.orgId === item.orgId }
            ]" 
            v-for="item in workspaces.filter(e => e.userId === user.userId)" :key="item.key"
            @click="handleSwitchWorkspace(item)"
          >
            <t-avatar size="20px" :image="item.orgAvatar || item.userAvatar" :alt="item.orgName || item.userName" />
            <span class="figma-ws__username">{{ item.orgName || item.userName }}</span>
          </div>
        </div>
      </div>
    </t-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popupVisible: false
    }
  },
  props: {
    current: {
      type: Object,
      default: () => {}
    },
    workspaces: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    users() {
      const userIds =  Array.from(new Set(this.workspaces.map(ws => ws.userId))) || []
      return userIds.map(id => this.workspaces.find(ws => ws.userId === id))
    }
  },
  methods: {
    handleSwitchWorkspace(item) {
      this.popupVisible = false
      this.$EventBus.$emit('SWITCH_WORKSPACE', { orgId: item.orgId, userId: item.userId })
    }
  }
}
</script>

<style lang="stylus">
.figma-ws
  &__current
    display: flex
    align-items: center
    padding: 0 10px
    border-radius: 4px
    color: #666666
    line-height: 32px
    cursor: pointer
    font-weight: bold

    &:hover
      background-color: #eee

  &__username
    margin: 0 5px
  
  &__orgname
    color: #0152d9
    font-size: 0.8em

  &__usergroup
    max-width: 200px
    font-size: 13px
    padding-bottom: 5px
    margin-bottom: 5px
    border-bottom: 1px solid #eee

    &:last-child
      border-bottom: none

  &__usergroup-title
    color: #999999
    font-weight: bold
    font-size: 0.8em
    padding: 0 5px
    line-height: 26px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
  
  &__useritem
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    cursor: pointer
    padding: 0 5px
    line-height: 32px
    border-radius: 4px
    margin: 1px 0

    &:hover
      background-color: #eee

    &--active
      background-color: #e8f0ff
</style>