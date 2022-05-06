import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    logged: false,
    isToken: false,
    posts: []
  },
  getters: {
    user(state) {
      return state.user
    },
    loggedIn(state) {
      return state.logged
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOGIN(state) {
      state.logged = true
    },
    SET_LOGOUT(state) {
      state.logged = false
      state.user = null
      state.posts = []
    },
    SET_POSTS(state, posts) {
      state.posts = posts
    }
  },
  actions: {
    setUser(context, user) {
      context.commit('SET_USER', user)
    },
    setLogin({ commit }) {
      commit('SET_LOGIN')
    },
    setLogout({ commit }) {
      commit('SET_LOGOUT')
    },
    setPosts(context, posts) {
      context.commit('SET_POSTS', posts)
    },
    checkToken({ commit }) {
      // commit;
      if(localStorage.getItem("token")) {
        // console.log("localstorage token", localStorage.getItem("token"))
        // console.log("localstorage userID", localStorage.getItem("userId"))

        commit('SET_LOGIN')
        commit('SET_USER', JSON.parse(localStorage.getItem("user")))
      } else {
        // console.log("localstorage token", localStorage.getItem("token"))
        console.log('pas de token')
        commit('SET_LOGOUT')
      }
    }
    
  },
  modules: {
  }
})