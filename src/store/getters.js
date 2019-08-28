/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-27 17:13:15
 * @LastEditTime: 2019-08-13 17:12:02
 * @LastEditors: Please set LastEditors
 */
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  preferredUsername: state => state.user.preferredUsername,
  userId: state => state.user.id,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  errorLogs: state => state.errorLog.logs,
  menus: state => state.menus.authMenus
}
export default getters