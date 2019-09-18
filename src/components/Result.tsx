import React from 'react';
import { Result, Button, WingBlank, Icon } from 'antd-mobile';
import router from 'umi/router';

export default function ResultComponent({ title = '提交成功', status = 'success' }) {
  return (
    <>
      <Result
        img={
          status === 'success' ? (
            <Icon
              type="check-circle"
              style={{
                fill: '#1F90E6',
                width: 60,
                height: 60,
              }}
            />
          ) : (
            <Icon
              type="cross-circle-o"
              style={{
                fill: '#F13642',
                width: 60,
                height: 60,
              }}
            />
          )
        }
        title={title}
        message="感谢您的参与！"
      />
      <WingBlank>
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            router.push('/userscore');
          }}
          type="primary"
        >
          查看投票得分
        </Button>
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            router.goBack();
          }}
        >
          返回
        </Button>
      </WingBlank>
    </>
  );
}
