import { createPinia } from 'pinia'
import { store } from 'quasar/wrappers'
import { useCommentStore } from './comments'
import { useEntryStore } from './entries'
import { useErrorStore } from './errors'
import { useFeedbackStore } from './feedbacks'
import { useReportStore } from './reports'
import { useLikeStore } from './likes'
import { useNotificationStore } from './notifications'
import { usePromptStore } from './prompts'
import { useShareStore } from './shares'
import { useStatStore } from './stats'
import { useStorageStore } from './storage'
import { useUserStore } from './user'
import { useVisitorStore } from './visitors'
import { useWalletStore } from './wallet'
import { useAdvertiseStore } from './advertises'
import { useClicksStore } from './clicks'
import { useImpressionsStore } from './impressions'
import { useLoadingStore } from './loading'

export default store(() => {
  return createPinia()
})

export {
  useCommentStore,
  useEntryStore,
  useErrorStore,
  useFeedbackStore,
  useReportStore,
  useLikeStore,
  useNotificationStore,
  usePromptStore,
  useShareStore,
  useStatStore,
  useStorageStore,
  useUserStore,
  useVisitorStore,
  useWalletStore,
  useAdvertiseStore,
  useClicksStore,
  useImpressionsStore,
  useLoadingStore
}
