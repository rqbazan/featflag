<div align="center">
  <h1> 🚩 FeatFlag 🚩 </h1>
  <img width="500px" src="https://raw.githubusercontent.com/rqbazan/featflag/master/images/fun-with-flags.jpg">
  <p>
    A small and modern ReactJS library to use
    <a href="https://martinfowler.com/articles/feature-toggles.html">
      the feature toggling principle
    </a>
  </p>
</div>

## 🌌 Installation 🌌

```sh
$ yarn add @rqbazan/featflag
```

or

```sh
$ npm install --save @rqbazan/featflag
```

## 🎉 Components and Hooks 🎉

### `<FlagProvider />`

Uses the `FlagContext.Provider` to easily pass down the features. Note, this should be always used in the root app file.

```js
import { FlagProvider } from '@rqbazan/featflag'
import App from './app'

// this should be come from a external service
const features = [
  'feature-a',
  'feature-b',
  'feature-c',
  ...
]

const Root = () => {
  return (
    <FlagProvider features={features}>
      <App />
    </FlagProvider>
  )
}
```

### `<Flag />`

Render its children if the feature name passed as prop is in the provided context.

```js
import { Flag } from '@rqbazan/featflag'

const AwesomeComponent = () => {
  return (
    <Flag featureName="some-feature-name">
      <h1>Hi there</h1>
    </Flag>
  )
}
```

Also support the render prop style

```js
import { Flag } from '@rqbazan/featflag'

const AwesomeComponent = () => {
  return (
    <Flag featureName="some-feature-name">
      {enabled => {
        return enabled ? <span>😉</span> : <span>🤔</span>
      }}
    </Flag>
  )
}
```

### `useFlag(featureName)`

Returns `true` if the feature name passed as argument is in the provided context. Otherwise, `false`.

```js
import { useFlag } from '@rqbazan/featflag'

const AwesomeComponent = () => {
  const hasThatFeature = useFlag('some-feature-name')

  return (
    <>
      <h1>My awesome app</h1>
      {hasThatFeature && <SomeComponent />}
    </>
  )
}
```

## 🍕 LICENSE 🍕

MIT
