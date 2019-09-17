import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './index.less';
import { connect } from 'dva';
import router from 'umi/router';
import * as userLib from '@/utils/user';
import * as db from '@/utils/db.js';

function PaperPage(props) {
  const [state, setState] = useState<string[]>([]);
  const [userList, setUserList] = useState([]);
  console.log(props);
  useEffect(() => {
    let res = userLib.loadLoginfo();
    if (!res.provider) {
      router.push('/home');
    }

    db.getCbpcUserGroup(res.provider).then(res => {
      setUserList(res.data);
    });
  }, []);

  const [loading, setLoading] = useState(false);

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);

    db.getCbpcUserList({ card_no: state[1], username: state[0] }).then(res => {
      console.log(res);
      setLoading(false);
      if (res.rows === 0) {
        Toast.fail('登录失败');
        return;
      }
      userLib.saveLoginfo(res.data[0]);
    });
  };

  return (
    <div>
      <div className={styles.content}>
        <div style={{ paddingLeft: 20 }}>评分</div>

        <WhiteSpace size="lg" />
        <div>asdf</div>

        <WhiteSpace size="lg" />
      </div>
      <WingBlank>
        <Button type="primary" onClick={onSubmmit} loading={loading} disabled={loading}>
          提交
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(PaperPage);
