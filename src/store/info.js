import { getDatabase, ref, onValue, update } from "firebase/database"

export default {
   state: {
      info: {}
   },
   mutations: {
      setInfo(state, info) {
         state.info = info
      },
      clearInfo(state) {
         state.info = {}
      }
   },
   actions: {
      async updateInfo({dispatch, commit, getters}, toUpdate) {
         try {
            const uid = await dispatch('getUid')
            const updateData = {...getters.info, ...toUpdate}
            await update(ref(getDatabase(), `users/${uid}/info`), updateData)
            commit('setInfo', updateData)
         } catch (e) {
            commit('setError', e)
            console.log(e)
            throw e
         }
      },
      async fetchInfo({dispatch, commit}) {
         try {
            const uid = await dispatch('getUid')
            console.log("fetch: ", uid)
            onValue(ref(getDatabase(), `users/${uid}/info`), (data) => {
               const info = data.val()
               console.log(info)
               commit('setInfo', info)
            })
         } catch (e) {
            throw e
         }
      }
   },
   getters: {
      info: s => s.info
   }
}
