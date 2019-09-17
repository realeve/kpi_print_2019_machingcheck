import React from 'react';
import styles from './index.less';

interface IPropsLayout {
  location: { pathname: string };
  [key: string]: any;
}
const BasicLayout: (props: IPropsLayout) => React.ReactElement = (props: IPropsLayout) => (
  <div className={styles.app}>
    <div className={styles.container}>{props.children}</div>
    <footer className={styles.footer}></footer>
  </div>
);
export default BasicLayout;
