import omniwell from '@rajs8952/config-tailwind'
import type { Config } from 'tailwindcss'

const config: Config = {
  presets: [omniwell],
  // Scan the published tracker packages too, so the classes they use are generated.
  content: ['./src/**/*.{ts,tsx}', './node_modules/@rajs8952/*/dist/*.mjs'],
}

export default config
