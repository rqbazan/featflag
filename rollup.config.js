import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'

const libraryConfig = {
  input: 'src/index.tsx',
  plugins: [typescript()],
  external: ['react'],
  output: [
    {
      format: 'cjs',
      name: pkg.name,
      file: pkg.main
    },
    {
      format: 'esm',
      name: pkg.name,
      file: pkg.module
    }
  ]
}

const avaConfig = {
  input: 'src/index.spec.tsx',
  plugins: [typescript()],
  external: Object.keys(pkg.devDependencies),
  output: {
    file: 'lib/index.spec.js',
    format: 'cjs'
  }
}

const configs = [libraryConfig]

if (process.env.NODE_ENV === 'ava') {
  configs.push(avaConfig)
}

export default configs
