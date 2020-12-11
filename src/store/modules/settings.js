import defaultSettings from '@/settings'
import Layout from '@/layout'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export const asyncMenus = {
  'layout': Layout,
  'menu.index': resolve => require(['@/views/admin/menu'], resolve),
  'role.index': resolve => require(['@/views/admin/role'], resolve),
  'user.index': resolve => require(['@/views/admin/user'], resolve),
  'wechat.menu': resolve => require(['@/views/admin/wechat'], resolve),
  'wechat.reply': resolve => require(['@/views/admin/reply'], resolve),
  'live.label': resolve => require(['@/views/admin/label'], resolve),

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

