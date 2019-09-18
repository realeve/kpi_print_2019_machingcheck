import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast, List } from 'antd-mobile';
import styles from './index.less';
import { connect } from 'dva';
import router from 'umi/router';
import * as userLib from '@/utils/user';
import * as db from '@/utils/db.js';
import * as lib from '@/utils/lib';
import Sortable from 'react-sortablejs';
import * as R from 'ramda';

const Item = List.Item;

let scoreListShort = [6, 4, 2];
let scoreListLong = [6, 5, 4, 3, 2, 1];
const sortUsers = (order, users) =>
  order.map((item, idx) => {
    let res = R.find(R.propEq('uid', Number(item)), users);
    let score = users.length > 3 ? scoreListLong : scoreListShort;
    res.score = score[idx];
    res.rec_time = lib.now();
    return res;
  });

function PaperPage({ logInfo, dispatch }) {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    if (logInfo.uid === 0) {
      return;
    }
    init();
  }, []);

  const [disabled, setDisabled] = useState(true);
  const init = async () => {
    let isVote = await db.getCbpcPerformancePrintMcEachother(logInfo.uid).then(({ data }) => data);
    if (isVote[0] && isVote[0].num > 0) {
      Toast.fail('本月您已投票');
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    db.getCbpcUserGroup(logInfo.provider).then(res => {
      setUserList(
        res.data.map((item, idx) => {
          let score = res.rows > 3 ? scoreListLong : scoreListShort;
          item.score = score[idx];
          item.operator = logInfo.uid; // 操作人员
          item.rec_time = lib.now();
          return item;
        }),
      );
    });
  };

  const [loading, setLoading] = useState(false);
  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    if (disabled) {
      Toast.fail('本月您已投票');
      return;
    }
    setLoading(true);

    db.addCbpcPerformancePrintMcEachother(userList).then(res => {
      setLoading(false);
      if (res.rows === 0) {
        Toast.fail('提交失败');
        return;
      }
      dispatch({
        type: 'common/setStore',
        payload: {
          result: {
            title: '提交成功',
            status: 'success',
          },
        },
      });
      router.push('/result');
    });
  };
  return (
    <div>
      <div className={styles.content}>
        <h3 style={{ textAlign: 'center' }}>{lib.ym()}机检互评</h3>
        <div style={{ paddingLeft: 20 }}>请根据各组员工作情况评分，拖动姓名排序</div>

        <WhiteSpace size="lg" />
        <Sortable
          onChange={(order, sortable, evt) => {
            setUserList(sortUsers(order, userList));
          }}
        >
          {userList.map((item, idx) => (
            <Item key={item.uid} data-id={item.uid}>
              {idx + 1}.{item.username}
            </Item>
          ))}
        </Sortable>

        <WhiteSpace size="lg" />
      </div>
      <WingBlank>
        <Button type="primary" onClick={onSubmmit} loading={loading} disabled={disabled}>
          提交
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(PaperPage);
