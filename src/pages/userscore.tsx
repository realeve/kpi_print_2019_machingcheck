import React, { useState, useEffect } from 'react';
import { WhiteSpace, WingBlank, List } from 'antd-mobile';
import * as R from 'ramda';
import styles from './index.less';
import { connect } from 'dva';
import * as db from '@/utils/db.js';
import * as lib from '@/utils/lib';
const Item = List.Item;

let groupList = {
  18: '胶凹机检组',
  19: '印码机检组',
  20: '检封机检组',
};

const handleUserScore = (res, avgRes) => {
  avgRes.data = avgRes.data.map(item => {
    item.score = Number(item.score);
    return item;
  });

  // 获取人员排名与得分
  let avgList = R.groupBy(item => groupList[item.provider])(avgRes.data);
  Object.keys(avgList).map(name => {
    let item = R.prop(name, avgList);
    item = item.map((detail, idx) => {
      detail.order = idx + 1;
      return detail;
    });
    avgList[name] = item;
  });

  Object.keys(avgList).map(name => {
    let item = R.prop(name, avgList);
    item = item.map((detail, idx) => {
      let scoreByMyself = R.find(R.propEq('username', detail.username))(res.data);
      detail.selfOrder = R.isNil(scoreByMyself) ? '未评分' : Number(scoreByMyself.orderId);
      detail.orderId = (scoreByMyself && scoreByMyself.orderId) || '未评分';
      detail.distScore = R.isNil(scoreByMyself)
        ? detail.score
        : detail.score - Math.abs(Number(scoreByMyself.orderId) - detail.order) * 0.2;
      return detail;
    });
    item.sort((b, a) => a.distScore - b.distScore);
    avgList[name] = item;
  });

  return Object.entries(avgList).map(item => ({
    name: item[0],
    value: item[1],
  }));
};

function ScorePage({ logInfo, dispatch }) {
  const [userInfo, setUserinfo] = useState([]);

  const [notShow, setNotShow] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let myself = await db.getCbpcPerformancePrintMcEachotherLog();
    let avgRes = await db.getCbpcPerformancePrintMcEachotherAvg();
    const userInfo = handleUserScore(myself, avgRes);

    let users = userInfo.map(item => item.value);
    let res = R.flatten(users);
    if (res.length < 4) {
      setNotShow('当前投票数不足4位，暂时不予显示，请稍后再查看。');
      return;
    }
    res = res.sort((a, b) => b.distScore - a.distScore);
    let arr = [];
    if (res.length > 0) {
      if (res.length === 3) {
        arr = [{}, ...res];
      } else {
        arr = [{}, res[0], res[1], res[2], R.last(res)];
      }
    }

    setUserinfo(arr);
  };

  return (
    <div className={styles.content}>
      <h3 style={{ textAlign: 'center' }}>{lib.ym()}机检互评得分结果</h3>
      <WingBlank>说明：自评排名与互评排名每差1名，得分扣0.2分</WingBlank>
      <WhiteSpace size="lg" />
      <WingBlank> {notShow}</WingBlank>

      <List renderHeader={() => '排名排名（前3名及最后一名）'}>
        {userInfo.map((user, idx) =>
          idx === 0 ? (
            <Item className={styles.scoreItem} key="表头">
              <span>姓名</span>
              <span>
                互评
                <br />
                得分
              </span>
              <span>
                互评
                <br />
                排名
              </span>
              <span>
                自评
                <br />
                排名
              </span>
              <span>
                最终
                <br />
                得分(10分制)
              </span>
            </Item>
          ) : (
            <Item key={user.username} className={styles.scoreItem}>
              <span>{user.username}</span>
              <span>{user.score.toFixed(2)}</span>
              <span>{user.order}</span>
              <span>{user.orderId}</span>
              <span>{((user.distScore * 5) / 3).toFixed(2)}</span>
            </Item>
          ),
        )}
      </List>
      <WhiteSpace size="lg" />
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(ScorePage);
