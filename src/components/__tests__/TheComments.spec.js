//Firebase
import { getAdditionalUserInfo, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth, db } from 'src/firebase'

//Testing Frameworks
import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount, shallowMount, config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vitest, vi, afterAll } from 'vitest'

// Necessary Components
import { useUserStore } from 'src/stores/user'
import { useCommentStore, useEntryStore } from 'src/stores'
import commentCard from '../TheComments.vue'

installQuasar()

describe('TheComment Component', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    const userStore = useUserStore()
    const userString = '{"sub": "WCeN1oLBMndoLKzNBCS7RccV9cz1?", "email": "algae.peach.153@example.com", "email_verified": true}'
    const credential = GoogleAuthProvider.credential(userString)
    const result = await signInWithCredential(auth, credential)
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser
    const { email, displayName, photoURL, uid } = result.user

    if (isNewUser) {
      try {
        await setDoc(doc(db, 'users', uid), { email, displayName, photoURL })
      } catch (e) {
        console.error('TheComments.spec.js Error: ', e)
      }
    }
    await userStore.testing_loadUserProfile(result.user)
  })

  it('create fake comment in here', async () => {
    // 2) Create fake comment
    const commenStore = useCommentStore()
    const entryStore = useEntryStore()
    await commenStore.fetchComments("/2023/03/pompt-entry-3")
    await entryStore.fetchEntryBySlug("/2023/03/pompt-entry-3")

    const startingNumberOfComments = commenStore.getComments.length
    const fakeCommentId = `${2000 + Math.round(Math.random() * 100)}-01`
    const fakeComment = shallowMount(commentCard, {
      global: {
        mocks: {
          testMock: vi.fn(() => {
            console.log('This mock is just a dummy')
          }),
          onSubmit: vi.fn(async () => {
            console.log("We're now mocking with the best...")
            await commenStore.addComment(fakeComment.vm.comment, entryStore.getEntries)
          })
        }
      },
    })

    fakeComment.vm.comment.text = 'category1'
    fakeComment.vm.comment.id = fakeCommentId

    // 3) Trigger submission programatically
    await fakeComment.vm.onSubmit() //Mocked

    // 4) Test
    await commenStore.fetchComments("/2023/02/more-frogs")
    expect(commenStore.getComments.length).toBe(startingNumberOfComments + 1)
  })

  it('delete that comment in here', async () => {})

  afterAll(async () => {
    localStorage.clear()
  })
})
