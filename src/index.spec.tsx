import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { render, cleanup } from 'react-testing-library'
import { renderHook } from 'react-hooks-testing-library'
import getObjectValuesAsArray from 'lodash.values'
import { useFlag, FlagProvider, Flag } from './index'

let warnSpy

test.before(() => {
  warnSpy = sinon.spy(console, 'warn')
})

test.afterEach(() => {
  cleanup()
  warnSpy.restore()
})

const features = {
  RUN_IN_BACKGROUND: 'run-in-background',
  CUSTOM_PICK_UP: 'custom-pick-up'
}

const wrapper = props => {
  const { children } = props

  return (
    <FlagProvider features={getObjectValuesAsArray(features)}>
      {children}
    </FlagProvider>
  )
}

test('useFlag returns always false when the features array is empty', t => {
  const { result } = renderHook(() => useFlag('some-feature-name'))

  t.false(result.current)
  t.true(warnSpy.calledOnce)
  t.true(warnSpy.calledWith('The provided "features" array is empty'))
})

test('useFlag returns true when the provider has that feature', t => {
  const { result } = renderHook(() => useFlag(features.RUN_IN_BACKGROUND), {
    wrapper
  })

  t.true(result.current)
})

test('Flag renders its children if the feature exists', t => {
  const tree = (
    <Flag featureName={features.CUSTOM_PICK_UP}>
      <h1>Hi there</h1>
    </Flag>
  )

  const { getByText } = render(tree, { wrapper })

  t.is(getByText(/Hi there/), document.querySelector('h1'))
})

test("Flag doesn't render its children if the feature doesn't exist", t => {
  const tree = (
    <Flag featureName="some-feature-name">
      <h1>Hi there</h1>
    </Flag>
  )

  render(tree, { wrapper })

  t.falsy(document.querySelector('h1'))
})

test('ensure the render prop style of Flag', t => {
  const tree = (
    <Flag featureName={features.RUN_IN_BACKGROUND}>
      {(enabled: boolean) => {
        return enabled ? <span id="winking">😉</span> : <span>🤔</span>
      }}
    </Flag>
  )

  const { container } = render(tree, { wrapper })

  t.is(container.children.length, 1)
  t.is(container.firstChild, document.querySelector('#winking'))
})

test('avoid re-render by context provider render', t => {
  const renderContent = () => {
    return 'Hello there'
  }

  const renderContentSpy = sinon.spy(renderContent)

  const tree = <Flag featureName="run-in-background">{renderContentSpy}</Flag>

  const { rerender } = render(tree, { wrapper })

  rerender(tree)

  t.true(renderContentSpy.calledOnce)
})

test('Flag calls to empty array warning if the provided value is empty', t => {
  const tree = (
    <Flag featureName="some-feature-name">
      <h1>Hi there</h1>
    </Flag>
  )

  render(tree)

  t.true(warnSpy.calledOnce)
  t.true(warnSpy.calledWith('The provided "features" array is empty'))
})
