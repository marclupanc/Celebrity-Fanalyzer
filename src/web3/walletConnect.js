import { useWalletStore } from '../stores'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const baseUrl = window.location.origin
const currentNetworkName = import.meta.env.VITE_CURRENT_NETWORK_NAME.toLowerCase()

let web3ModalInstance = null

const initializeWeb3Modal = async () => {
  if (!web3ModalInstance) {
    const { createWeb3Modal, defaultConfig } = await import('@web3modal/ethers5')
    const chainConfig = useWalletStore().getChainConfig(currentNetworkName)

    const metadata = {
      name: 'Celebrity Fanalyser',
      description: 'Celebrity Fanalyser',
      url: baseUrl,
      icons: ['']
    }

    const ethersConfig = defaultConfig({
      metadata
    })

    web3ModalInstance = createWeb3Modal({
      ethersConfig,
      chains: [chainConfig],
      projectId,
      enableAnalytics: true,
      enableOnramp: true
    })
  }

  return web3ModalInstance
}

// Proxy object with dynamic import support
const web3ModalProxy = new Proxy(
  {},
  {
    get(target, prop) {
      // Ensure Web3Modal is initialized lazily and dynamically
      return async (...args) => {
        const web3Modal = await initializeWeb3Modal()

        if (web3Modal[prop]) {
          return web3Modal[prop].apply(web3Modal, args)
        }

        throw new Error(`Web3Modal has no method: ${prop}`)
      }
    }
  }
)

// Export the proxy as customWeb3Modal
export const customWeb3modal = web3ModalProxy
