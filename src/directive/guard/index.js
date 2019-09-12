import guard from './guard'
import permission from '../permission/permission';

const install = function(Vue) {
    Vue.directive('guard', guard)
}

if(window.Vue) {
    window['guard'] = guard
    Vue.use(install) // eslint-disable-line
}

guard.install = install

export default guard
