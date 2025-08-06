import { useState, useEffect } from 'react'

interface TokenIconProps {
  symbol: string
  size?: number
  className?: string
}

const TokenIcon = ({ symbol, size = 20, className = '' }: TokenIconProps) => {
  const [hasError, setHasError] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setHasError(false)
    setHasLoaded(false)
  }, [symbol])

  const iconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol.toUpperCase()}.svg`

  const shouldShow = hasLoaded && !hasError

  return (
    <img
      key={symbol} // Force re-render when symbol changes
      src={iconUrl}
      className={shouldShow ? className : 'invisible'}
      alt={`${symbol} icon`}
      loading="lazy"
      onLoad={() => setHasLoaded(true)}
      onError={() => setHasError(true)}
      style={{ width: size, height: size }}
    />
  )
}

export default TokenIcon
