import store from 'store'
const USER_KEY = 'B0364_user'
export default {
    saveUser(user) {
        store.set(USER_KEY, user)
    },
    getUser() {
        return store.get(USER_KEY) || {}
    },
    removeUser() {
        store.remove(USER_KEY)
    }
}