import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { db } from 'src/firebase'
import { useUserStore } from 'src/stores'

export const useCommentStore = defineStore('comments', {
  state: () => ({
    _comments: [],
    _entries: [],
    _isLoading: false
  }),

  getters: {
    getComments: (state) => state._comments,
    getEntries: (state) => state._entries,
    isLoading: (state) => state._isLoading
  },

  actions: {
    async fetchComments(slug) {
      const q = query(collection(db, 'entries'), where('slug', '==', slug))
      this._isLoading = true
      const querySnapshot = await getDocs(q)

      const entry = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0]

      entry.author = await getDoc(entry.author).then((doc) => doc.data())
      entry.prompt = await getDoc(entry.prompt).then((doc) => doc.data())

      this._isLoading = false

      return entry.comments
      console.log(entry.comments)
    },

    async addComment(comment, entry) {
      const userStore = useUserStore()

      comment.author = userStore.getUserRef
      comment.id = new Date().toJSON()

      console.log('entry.id', entry.id)
      console.log({ comment })

      this._isLoading = true
      await setDoc(doc(db, 'entries', entry.id, 'comments', comment.id), comment)
        .then(() => {
          this.$patch({ _comments: [...this._comments, comment] })
        })
        .catch((err) => {
          console.log(err)
          throw new Error(err)
        })
        .finally(() => (this._isLoading = false))
    },

    async editComment(entry) {
      console.log(entry)
    },

    async deleteComment(id) {
      console.log(id)
    }
  }
})
