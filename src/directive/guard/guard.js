import store from '@/store'
import {isAuth} from '@/guard'

export default {

    inserted(el, binding,vnode){

        const {value} = binding

        if(!value ){
            throw new Error(`need roles! Like v-guard="{roles:['admin','test'],permissions:['user-edit','user-update'],mode:'oneOf'}"`)
        }

        const roles = store.getters && store.getters.roles
        const permissions = store.getters && store.getters.permissions

        if(!isAuth(value,roles,permissions)){
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}