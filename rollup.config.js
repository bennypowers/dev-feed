import { createDefaultConfig } from '@open-wc/building-rollup';

const config = createDefaultConfig({ input: './demo/index.html' });

export default {
  ...config,
  output: {
    ...config.output,
    dir: './docs',
  },
};
