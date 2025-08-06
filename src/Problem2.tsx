import { useState, useRef } from 'react'
import TokenIcon from './components/TokenIcon'

interface PriceData {
  currency: string
  date: string
  price: number
}

// Hardcoded token list taken from the API - assume this rarely changes
// If tokens frequently change, fetch this list on component mount instead
const AVAILABLE_TOKENS = [
  'ATOM',
  'BLUR',
  'bNEO',
  'BUSD',
  'ETH',
  'EVMOS',
  'GMX',
  'IBCX',
  'IRIS',
  'KUJI',
  'LSI',
  'LUNA',
  'OKB',
  'OKT',
  'OSMO',
  'RATOM',
  'rSWTH',
  'STATOM',
  'STEVMOS',
  'STLUNA',
  'STOSMO',
  'STRD',
  'SWTH',
  'USD',
  'USDC',
  'USC',
  'WBTC',
  'wstETH',
  'YieldUSD',
  'ZIL',
  'ampLUNA',
  'axlUSDC',
]
const API_URL = 'https://interview.switcheo.com/prices.json'
const DEBOUNCE_DELAY = 500

function Problem2() {
  // We can combine three states into one if desired, but here separating them is better because they have different update patterns and usually being used separately e.g. amount changes frequently, token selection less, and price updates only on API response
  const [fromToken, setFromToken] = useState(AVAILABLE_TOKENS[0])
  const [fromPrice, setFromPrice] = useState<number | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toToken, setToToken] = useState(AVAILABLE_TOKENS[1])
  const [toPrice, setToPrice] = useState<number | null>(null)
  const [toAmount, setToAmount] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const clearScheduledTrigger = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const getLatestPriceData = (prices: PriceData[], token: string) => {
    return prices
      .filter((p) => p.currency === token)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
  }

  const calculateSwap = async (
    inputType: 'from' | 'to',
    amount: string,
    currentFromToken: string,
    currentToToken: string
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      if (inputType === 'from') {
        setToAmount('')
      } else {
        setFromAmount('')
      }

      setIsLoading(false)
      setFromPrice(null)
      setToPrice(null)
      setLastUpdated('')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch prices')
      }

      const prices: PriceData[] = await response.json()

      const fromPriceData = getLatestPriceData(prices, currentFromToken)
      const toPriceData = getLatestPriceData(prices, currentToToken)

      if (!fromPriceData) {
        throw new Error(`Price not available for ${currentFromToken}`)
      }
      if (!toPriceData) {
        throw new Error(`Price not available for ${currentToToken}`)
      }

      if (inputType === 'from') {
        const result =
          (parseFloat(amount) * fromPriceData.price) / toPriceData.price
        setToAmount(result.toFixed(2))
      } else {
        const result =
          (parseFloat(amount) * toPriceData.price) / fromPriceData.price
        setFromAmount(result.toFixed(2))
      }

      setFromPrice(fromPriceData.price)
      setToPrice(toPriceData.price)

      const latestDate =
        new Date(fromPriceData.date) > new Date(toPriceData.date)
          ? fromPriceData.date
          : toPriceData.date
      setLastUpdated(new Date(latestDate).toLocaleString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate swap')
      if (inputType === 'from') {
        setToAmount('')
      } else {
        setFromAmount('')
      }
      setFromPrice(null)
      setToPrice(null)
      setLastUpdated('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountChange = (inputType: 'from' | 'to', amount: string) => {
    if (inputType === 'from') {
      setFromAmount(amount)
    } else {
      setToAmount(amount)
    }

    clearScheduledTrigger()

    timeoutRef.current = setTimeout(() => {
      calculateSwap(inputType, amount, fromToken, toToken)
    }, DEBOUNCE_DELAY)
  }

  const handleTokenChange = (inputType: 'from' | 'to', newToken: string) => {
    if (inputType === 'from') {
      setFromToken(newToken)
    } else {
      setToToken(newToken)
    }

    setFromPrice(null)
    setToPrice(null)
    setLastUpdated('')

    const newFromToken = inputType === 'from' ? newToken : fromToken
    const newToToken = inputType === 'to' ? newToken : toToken

    if (fromAmount && parseFloat(fromAmount) > 0) {
      clearScheduledTrigger()
      calculateSwap('from', fromAmount, newFromToken, newToToken)
    } else if (toAmount && parseFloat(toAmount) > 0) {
      clearScheduledTrigger()
      calculateSwap('to', toAmount, newFromToken, newToToken)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Token Swap
        </h1>

        <div className="space-y-2">
          <label
            htmlFor="input-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount to send
          </label>
          <div className="flex gap-2">
            <input
              id="input-amount"
              type="number"
              placeholder="0"
              min="0"
              step="any"
              value={fromAmount}
              onChange={(e) => handleAmountChange('from', e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg border-gray-300"
            />
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <TokenIcon symbol={fromToken} />
              <select
                value={fromToken}
                name="token-to-send"
                title="Token to send"
                onChange={(e) => handleTokenChange('from', e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-medium"
              >
                {AVAILABLE_TOKENS.filter((token) => token !== toToken).map(
                  (token) => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Amount to receive
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="0"
              min="0"
              step="any"
              value={toAmount}
              onChange={(e) => handleAmountChange('to', e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg border-gray-300"
            />
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <TokenIcon symbol={toToken} />
              <select
                value={toToken}
                name="token-to-receive"
                title="Token to receive"
                onChange={(e) => handleTokenChange('to', e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-medium"
              >
                {AVAILABLE_TOKENS.filter((token) => token !== fromToken).map(
                  (token) => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {((fromPrice && toPrice) || isLoading) && (
          <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200 font-medium">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 h-10">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Loading exchange rate...
              </div>
            ) : (
              fromPrice &&
              toPrice && (
                <>
                  <p>
                    Exchange Rate: 1 {fromToken} ={' '}
                    {(fromPrice / toPrice).toFixed(4)} {toToken}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    Last updated at {lastUpdated}
                  </div>
                </>
              )
            )}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default Problem2
