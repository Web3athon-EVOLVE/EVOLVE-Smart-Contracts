import styles from 'styles/Home.module.scss'
import ThemeToggleButton from 'components/Theme/ThemeToggleButton'
import { useState } from 'react'
import { useNetwork, useSwitchNetwork, useAccount, useBalance } from 'wagmi'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import StakeForm from 'components/StakeForm'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className={styles.header}>
      {/* Left Header */}
      <div className="flex items-center">
        <ThemeToggleButton></ThemeToggleButton>
      </div>
      {/* Middle Header */}
      <div className={styles.main + ' space-y-1'}>
        <h1 className="text-4xl font-1 font-bold font-size-headline color-1 mt-2">EVOLUTION POOL</h1>
        <h5 className="text-2xl font-1 font-size-headline color-1 mt-2">Learn, Earn, & Profit</h5>
      </div>
      {/* Right Header */}
      <div className="flex items-center">
        <ThemeToggleButton></ThemeToggleButton>
      </div>
    </header>
  )
}

function Main() {
  const { address, isConnected, connector } = useAccount()
  const { chain, chains } = useNetwork()
  const { isLoading: isNetworkLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: address,
  })
  return (
    <main className={styles.main + ' space-y-2'}>
      {/* Opening Paragraph */}
      <div className="text-center">
        <p className="font-medium mx-20">
          Deep dive into the benefits of DeFi by contributing your earned $EVOLVE Tokens in the community's "Evolution Pool" for increased rewards and earned interest!
        </p>
      </div>
      {/* Main Body */}
      <div className="w-full max-w-xl rounded-xl bg-sky-500/10 p-6 text-center">
        <p>Wallet Account Information</p>
        <dl className={styles.dl}>
          {/* Connect To Wallet */}
          <div>
            <dt>Connect Wallet</dt>
            <div className="my-1 flex w-full flex-col items-center">
              <ConnectWallet/>
            </div>
          </div>
          {/* More Account Info */}
          <dt>Connector</dt>
          <dd>
            {connector?.name}
            {!address && (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <span onClick={openConnectModal} className="cursor-pointer hover:underline">
                    Not connected, connect wallet
                  </span>
                )}
              </ConnectButton.Custom>
            )}
          </dd>
          <dt>Connected Network</dt>
          <dd>{chain ? `${chain?.id}: ${chain?.name}` : 'n/a'}</dd>
          <dt>Account</dt>
          <dd className="break-all">{address ? `${address}` : 'n/a'}</dd>
          <dt>Balance</dt>
          <dd className="break-all">
            {isBalanceLoading ? 'loading' : balance ? `${balance?.formatted} ${balance?.symbol}` : 'n/a'}
          </dd>
        </dl>
      </div>
      {/* Staking App */}
      <div className="w-full max-w-xl rounded-xl bg-sky-500/10 p-6 text-center">
        <StakeForm/>
      </div>
    </main>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Left Footer */}
      <div>
      </div>
      {/* Middle Footer */}
      <div className="flex items-center">
      </div>
      {/* Right Footer */}
      <div className="flex items-center">
      </div>
    </footer>
  )
}
