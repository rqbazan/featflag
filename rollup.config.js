import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'

export default {
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
