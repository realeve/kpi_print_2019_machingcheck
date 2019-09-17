import { IConfig } from 'umi-types';

const config: IConfig = {
  publicPath: './',
  history: 'hash',
  hash: true, //添加hash后缀
  treeShaking: true,
  exportStatic: false,
  targets: {
    ie: 10,
    chrome: 47,
    firefox: 40,
    ios: 7,
    android: 4,
  },
  cssnano: {
    mergeRules: false,
  },
  autoprefixer: { flexbox: true },
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: '机检互评',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};

export default config;
