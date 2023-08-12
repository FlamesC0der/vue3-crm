import {getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database";

export default {
   actions: {
      async login({dispatch, commit}, {email, password}) {
         try {
            await signInWithEmailAndPassword(getAuth(), email, password)
            console.log('log')
         } catch (e) {
            commit('setError', e)
            throw e
         }
      },
      async register({dispatch, commit}, {email, password, name}) {
         try {
            await createUserWithEmailAndPassword(getAuth(), email, password)
            const uid = await dispatch('getUid')
            console.log("reg uid: ", uid)
            await set(ref(getDatabase(), `users/${uid}/info`), {
               bill: 0,
               name: name
            })
            console.log('reg')
         } catch (e) {
            commit('setError', e)
            throw e
         }
      },
      async getUid() {
         const user = getAuth().currentUser.uid
         console.dir(user)
         return user
      },
      async logout({commit}) {
         await signOut(getAuth())
         commit('clearInfo')
      },
   }
}
