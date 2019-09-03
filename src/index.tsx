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
  const { features } = props

  const value = React.useMemo(() => {
    const createObject = (previous: {}, current: string) => {
      return { ...previous, [current]: true }
    }

    const featuresMap = features.reduce(createObject, {})

    const hasFeature = featureName => {
      return featureName in featuresMap
    }

    return { hasFeature, features }
  }, [])

  return <FlagContext.Provider {...props} value={value} />
}

export interface FlagProps {
  featureName: string
}

export const Flag: React.FC<FlagProps> = props => {
  const { featureName, children } = props
  const { hasFeature, features } = React.useContext(FlagContext)

  emptyFeaturesArrayWarning(features)

  const enabled = hasFeature(featureName)

  if (typeof children === 'function') {
    return children(enabled)
  }

  return enabled && children
}

export interface UseFlagHook {
  (featureName: string): boolean
}

export const useFlag: UseFlagHook = featureName => {
  const { hasFeature, features } = React.useContext(FlagContext)

  emptyFeaturesArrayWarning(features)

  return hasFeature(featureName)
}

export interface WithFF<P = {}> {
  (C: React.ComponentType<P & FFProps>): React.ComponentType<P & FFProps>
}

export type FFProps = Partial<Pick<FlagContext, 'hasFeature'>>

export const withFF: WithFF = Component => {
  const WithFF: React.FC<FFProps> = props => {
    const { hasFeature } = React.useContext(FlagContext)

    return <Component {...props} hasFeature={hasFeature} />
  }

  if (process.env.NODE_ENV !== 'production') {
    const displayName = Component.displayName || 'Component'
    WithFF.displayName = `WithFF(${displayName})`
  }

  return WithFF
}
