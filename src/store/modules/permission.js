import { asyncRoutes, constantRoutes } from '@/router'
import { generateRoutes } from '@/api/login'
import { asyncMenus } from  './settings'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export function menuAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    tmp.component = asyncMenus[tmp.component];
    if (tmp.children) {
      tmp.children = menuAsyncRoutes(tmp.children)
    }
    res.push(tmp)
  })
  //404页面跳转
  res.push({ path: '*', redirect: '/404', hidden: true });
  return res
}

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject)  => {
        // const { roles } = data
        // let accessedRoutes
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRoutes
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        // }
        // commit('SET_ROUTES', accessedRoutes)
        // resolve(accessedRoutes)
        generateRoutes().then(response => {
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const accessedRoutes = menuAsyncRoutes(response.data);
          commit('SET_ROUTES', accessedRoutes);
          resolve(accessedRoutes);
        }).catch(error => {
          reject(error)
        });

      })
    }
  }
}

export default permission

