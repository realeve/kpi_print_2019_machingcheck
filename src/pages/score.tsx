import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast, List } from 'antd-mobile';
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

let res = {
  data: [
    {
      uid: 2925,
      username: '胡新玥',
      score: 4,
      orderId: '3',
    },
    {
      uid: 2929,
      username: '马可',
      score: 5,
      orderId: '2',
    },
    {
      uid: 2933,
      username: '李宾',
      score: 6,
      orderId: '1',
    },
    {
      uid: 3263,
      username: '任礼科',
      score: 2,
      orderId: '5',
    },
  ],
  rows: 4,
  dates: [],
  ip: '172.31.85.39',
  header: ['uid', 'username', 'score', 'orderId'],
  title: '自评排名',
  time: '5.401ms',
  source: '数据来源：微信开发',
};
let avgRes = {
  data: [
    {
      username: '李宾',
      score: '6.0000',
      provider: 18,
    },
    {
      username: '蒲明玥',
      score: '4.0000',
      provider: 18,
    },
    {
      username: '李超群',
      score: '2.0000',
      provider: 18,
    },
    {
      username: '朱振华',
      score: '6.0000',
      provider: 19,
    },
    {
      username: '马可',
      score: '5.0000',
      provider: 19,
    },
    {
      username: '徐闵',
      score: '4.0000',
      provider: 19,
    },
    {
      username: '潘成',
      score: '3.0000',
      provider: 19,
    },
    {
      username: '张立力',
      score: '2.0000',
      provider: 19,
    },
    {
      username: '杨林',
      score: '5.5000',
      provider: 20,
    },
    {
      username: '胡新玥',
      score: '4.5000',
      provider: 20,
    },
    {
      username: '任礼科',
      score: '4.0000',
      provider: 20,
    },
    {
      username: '蒋荣',
      score: '3.5000',
      provider: 20,
    },
    {
      username: '冯诗伟',
      score: '2.5000',
      provider: 20,
    },
  ],
  rows: 13,
  dates: [],
  ip: '172.31.85.39',
  header: ['username', 'score', 'provider'],
  title: '互评平均得分',
  time: '5.857ms',
  source: '数据来源：微信开发',
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
    avgList[name] = [{}, ...item];
  });

  return Object.entries(avgList).map(item => ({
    name: item[0],
    value: item[1],
  }));
};

function ScorePage({ logInfo, dispatch }) {
  const userInfo = handleUserScore(res, avgRes);

  return (
    <div className={styles.content}>
      <h3 style={{ textAlign: 'center' }}>{lib.ym()}机检互评得分结果</h3>
      <WingBlank>说明：自评排名与互评排名每差1名，得分扣0.2分</WingBlank>
      <WhiteSpace size="lg" />

      {userInfo.map(item => (
        <List key={item.name} renderHeader={() => item.name}>
          {item.value.map((user, idx) =>
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
                  得分
                </span>
              </Item>
            ) : (
              <Item key={user.username} className={styles.scoreItem}>
                <span>{user.username}</span>
                <span>{user.score}</span>
                <span>{user.order}</span>
                <span>{user.orderId}</span>
                <span>{user.distScore}</span>
              </Item>
            ),
          )}
        </List>
      ))}
      <WhiteSpace size="lg" />
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(ScorePage);
