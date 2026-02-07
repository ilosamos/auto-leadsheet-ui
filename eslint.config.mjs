import mantineConfig from 'eslint-config-mantine';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const { flatConfig: nextFlatConfig } = nextPlugin;

export default [
  ...mantineConfig,
  nextFlatConfig.coreWebVitals,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', '**/*.{js,mjs,cjs}', 'next-env.d.ts'],
  },
];
