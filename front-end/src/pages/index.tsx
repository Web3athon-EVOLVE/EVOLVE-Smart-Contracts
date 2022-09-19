import styles from 'styles/Home.module.scss'
import ThemeToggleButton from 'components/Theme/ThemeToggleButton'
import { useState } from 'react'
import { useNetwork, useSwitchNetwork, useAccount, useBalance } from 'wagmi'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import StakeForm from 'components/LendingPoolDeposit/StakeForm'

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
  const { data: balanceWMATIC, isLoading: isBalanceWMATICLoading } = useBalance({
    addressOrName: address,
    token: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  })
  const { data: balanceAmwMATIC, isLoading: isBalanceAmWMATICLoading } = useBalance({
    addressOrName: address,
    token: '0xF45444171435d0aCB08a8af493837eF18e86EE27'
  })
  const { data: balanceOfSmartContract, isLoading: isBalanceOfSmartContractLoading } = useBalance({
    addressOrName: '0xe7B9f22B8Ee284abF25fACe18E756E48B57CB70e',
    token: '0xF45444171435d0aCB08a8af493837eF18e86EE27'
  })
  return (
    <main className={styles.main + ' space-y-2'}>
      {/* Opening Paragraph */}
      <div className="text-center">
        <p className="font-medium mx-20">
          Deep dive into the benefits of DeFi by contributing your earned $EVOLVE Tokens in the community's "Evolution Pool" for increased rewards and earned interest!
        </p>
      </div>
      {/* Evolution Pool Info */}
      <div className="w-full max-w-xl rounded-xl bg-sky-500/10 p-6 text-center">
        <p>Evolution Pool Earnings</p>
          <dl className={styles.dl}>
            <dt>Balance (Aave Matic Market WMATIC)</dt>
              <dd className="break-all">
                {isBalanceOfSmartContractLoading ? 'loading' : balanceOfSmartContract ? `${balanceOfSmartContract?.formatted} ${balanceOfSmartContract?.symbol}` : 'n/a'}
              </dd>
            <dt>Evolution Pool Account</dt>
            <dd className="break-all">{`0xe7B9f22B8Ee284abF25fACe18E756E48B57CB70e`}</dd>
          </dl>
      </div>
      {/* Staking App */}
      <div className="w-full max-w-xl rounded-xl bg-sky-500/10 p-6 text-center">
        <StakeForm balance={balanceWMATIC?.formatted}/>
      </div>
      {/* WALLET INFO COMPONENT */}
      <div className="w-full max-w-xl rounded-xl bg-sky-500/10 p-6 text-center">
        <p>Wallet Account Information</p>
        <dl className={styles.dl}>
          <div>
            <dt>Connect Wallet</dt>
            <div className="my-1 flex w-full flex-col items-center">
              <ConnectWallet/>
            </div>
          </div>
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
          <dt>Balance (MATIC)</dt>
            <dd className="break-all">
              {isBalanceLoading ? 'loading' : balance ? `${balance?.formatted} ${balance?.symbol}` : 'n/a'}
            </dd>
          <dt>Balance (Wrapped Matic)</dt>
            <dd className="break-all">
              {isBalanceWMATICLoading ? 'loading' : balanceWMATIC ? `${balanceWMATIC?.formatted} ${balanceWMATIC?.symbol}` : 'n/a'}
            </dd>
          <dt>Balance (Aave Matic Market WMATIC)</dt>
            <dd className="break-all">
              {isBalanceAmWMATICLoading ? 'loading' : balanceAmwMATIC ? `${balanceAmwMATIC?.formatted} ${balanceAmwMATIC?.symbol}` : 'n/a'}            
            </dd>
        </dl>
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
