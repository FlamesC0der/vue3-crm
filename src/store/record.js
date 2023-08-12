import { getDatabase, ref, push, child, onValue, update } from "firebase/database";

export default {
   actions: {
      async createRecord({dispatch, commit}, {categoryId, amount, description, type, date}) {
         try {
            const uid = await dispatch('getUid')
            return await push(ref(getDatabase(), `users/${uid}/records`), {
               categoryId,
               amount,
               description,
               type,
               date
            })
         } catch (e) {
            commit('setError', e)
            throw e
         }
      },
      async fetchRecords({dispatch, commit}) {
         try {
            const uid = await dispatch('getUid')
            let cats = []
            await onValue(ref(getDatabase(), `users/${uid}/records`), (data) => {
               const records = data.val() || {}

               Object.keys(records).forEach(key => {
                  cats.push({
                     categoryId: records[key].categoryId,
                     amount: records[key].amount,
                     description: records[key].description,
                     type: records[key].type,
                     date: records[key].date,
                     id: key
                  })
               })
               // Object.keys(records).map(key => ({...records[key], id: key}))
            })
            return cats
         } catch (e) {
            commit('setError', e)
            throw e
         }
      },
      async fetchRecordById({dispatch, commit}, id) {
         try {
            const uid = await dispatch('getUid')
            let cats = {}
            await onValue(ref(getDatabase(), `users/${uid}/records/${id}`), (data) => {
               const record = data.val() || {}

               cats = {...record, id}
               // Object.keys(records).map(key => ({...records[key], id: key}))
            })
            return cats
         } catch (e) {
            commit('setError', e)
            throw e
         }
      }
   }
}
