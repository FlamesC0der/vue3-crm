import { getDatabase, ref, push, child, onValue, update } from "firebase/database";

export default {
   actions: {
      async fetchCategories({commit, dispatch}) {
         try {
            const uid = await dispatch('getUid')
            let cats = []
            await onValue(ref(getDatabase(), `users/${uid}/categories`), (data) => {
               const categories = data.val() || {}

               Object.keys(categories).forEach(key => {
                  cats.push({
                     title: categories[key].title,
                     limit: categories[key].limit,
                     id: key
                  })
               })
               // Object.keys(categories).map(key => ({...categories[key], id: key}))
            })
            return cats
         } catch (e) {
            commit('setError', e)
            throw e
         }
      },
      async fetchCategoryById({commit, dispatch}, id) {
         try {
            const uid = await dispatch('getUid')
            let cats = {}
            await onValue(ref(getDatabase(), `users/${uid}/categories/${id}`), (data) => {
               const category = data.val() || {}

               cats = {...category, id}
               // Object.keys(categories).map(key => ({...categories[key], id: key}))
            })
            return cats
         } catch (e) {
            commit('setError', e)
            throw e
         }
      },
      async updateCategory({commit, dispatch}, {title, limit, id}) {
         try {
            const uid = await dispatch('getUid')
            await update(ref(child(getDatabase(), `users/${uid}/categories/`).set({title, limit})))
         } catch (e) {
            commit('setError', e)
            console.log(e)
            throw e
         }
      },
      async createCategory({commit, dispatch}, {title, limit}) {
         try {
            const uid = await dispatch('getUid')
            const category = await push(ref(getDatabase(), `users/${uid}/categories`), {
               title,
               limit
            })
            return {title, limit, id: category.key}
         } catch (e) {
            commit('setError', e)
            console.log(e)
            throw e
         }
      }
   }
}
