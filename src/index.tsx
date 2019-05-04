import React from 'react'

const emptyFeaturesArrayWarning = (features: string[]) => {
  if (features && features.length > 0) {
    return
  }

  console.warn(`The provided "features" array is empty`)
}

export interface FlagContext {
  hasFeature: (featureName: string) => boolean
  features: string[]
}

export const FlagContext = React.createContext<FlagContext>({
  hasFeature: () => false,
  features: []
})

export interface FlagProviderProps {
  features: string[]
}

export const FlagProvider: React.FC<FlagProviderProps> = props => {
  const { children, features } = props

  const featuresMap = React.useMemo(() => {
    const createObject = (previous, current) => {
      return { ...previous, [current]: true }
    }

    return features.reduce(createObject, {})
  }, [features])

  const hasFeature = React.useCallback(
    featureName => featureName in featuresMap,
    [features]
  )

  return (
    <FlagContext.Provider value={{ features, hasFeature }}>
      {children}
    </FlagContext.Provider>
  )
}

export interface FlagProps {
  featureName: string
}

export const Flag: React.FC<FlagProps> = props => {
  const { hasFeature, features } = React.useContext(FlagContext)
  const { featureName, children } = props

  emptyFeaturesArrayWarning(features)

  const enabled = hasFeature(featureName)

  if (typeof children === 'function') {
    return children(enabled)
  }

  if (!enabled) {
    return null
  }

  return children as React.ReactElement
}

export interface UseFlagHook {
  (featureName: string): boolean
}

export const useFlag: UseFlagHook = featureName => {
  const { hasFeature, features } = React.useContext(FlagContext)

  emptyFeaturesArrayWarning(features)

  return hasFeature(featureName)
}
