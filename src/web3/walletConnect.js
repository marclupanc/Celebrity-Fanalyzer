import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5'
import { useWalletStore } from '../stores'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const baseUrl = window.location.origin
const currentNetworkName = import.meta.env.VITE_CURRENT_NETWORK_NAME.toLowerCase()

let web3ModalInstance = null

// Lazily initialize the Web3Modal instance
const initializeWeb3Modal = () => {
  if (!web3ModalInstance) {
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

// Create a proxy object to defer initialization
const web3ModalProxy = new Proxy(
  {},
  {
    get(target, prop) {
      // Ensure Web3Modal is initialized lazily
      const web3Modal = initializeWeb3Modal()

      // If the requested method exists on the Web3Modal instance, return it
      if (web3Modal[prop]) {
        return web3Modal[prop].bind(web3Modal)
      }

      // If no such method exists, throw an error
      throw new Error(`Web3Modal has no method: ${prop}`)
    }
  }
)

// Export the proxy as your customWeb3Modal
export const customWeb3modal = web3ModalProxy
