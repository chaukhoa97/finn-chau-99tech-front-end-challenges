import React, { useMemo } from 'react'
// BoxProps, WalletRow, useWalletBalances, usePrices are simple hypothetical implementations

interface BoxProps {
  className?: string
}

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}

interface WalletPageProps extends BoxProps {
  // Could add specific wallet page props here if needed
  children?: React.ReactNode
}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
    case 'Neo':
      return 20
    default:
      return -99
  }
}

const WalletRow = ({
  className,
  amount,
  usdValue,
  formattedAmount,
}: {
  className?: string
  amount: number
  usdValue: number
  formattedAmount: string
}) => {
  return (
    <div className={className || ''}>
      <div>Amount: {amount}</div>
      <div>USD Value: {usdValue}</div>
      <div>Formatted Amount: {formattedAmount}</div>
    </div>
  )
}

const useWalletBalances = () => {
  return []
}
const usePrices = (): Record<string, number> => {
  return {
    USD: 1,
    EUR: 0.85,
  }
}

const WalletPage: React.FC<WalletPageProps> = ({ children, ...rest }) => {
  const balances = useWalletBalances()
  const prices = usePrices()

  const processedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain)
        return balancePriority > -99 && balance.amount > 0
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        return rightPriority - leftPriority
      })
      .map(
        (balance: WalletBalance): FormattedWalletBalance => ({
          ...balance,
          formatted: balance.amount.toFixed(),
        })
      )
  }, [balances])

  const rows = useMemo(() => {
    return processedBalances.map((balance: FormattedWalletBalance) => {
      const { currency, amount, formatted, blockchain } = balance

      const price = prices[currency] ?? 0
      const usdValue = price * amount

      return (
        <WalletRow
          className="some-classes"
          key={`${currency}-${blockchain}`}
          amount={amount}
          usdValue={usdValue}
          formattedAmount={formatted}
        />
      )
    })
  }, [processedBalances, prices])

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  )
}

export default WalletPage
