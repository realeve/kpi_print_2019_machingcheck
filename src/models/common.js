import { setStore } from '@/utils/lib';
import weixin from '@/utils/WeiXin';
import * as users from '@/utils/user';

const namespace = 'common';
export default {
  namespace,
  state: {
    user: {},
    paper: [],
    logInfo: {
      uid: 0,
      provider: 0,
    },
    hasSubmitted: 0,
    result: {
      title: '提交成功',
      status: 'success',
    },
    status: 0,
  },
  reducers: {
    setStore,
  },
  effects: {
    *getWxUser(_, { put, call, select }) {
      // 调整用户信息获取
      let user = yield select(state => state.common.user);
      if (user.openid) {
        return;
      }

      user = yield call(weixin.getWxUserInfo);
      console.log('用户信息载入完毕', user);
      if (!user) {
        return;
      }

      yield put({
        type: 'setStore',
        payload: {
          user,
        },
      });
    },
  },
  subscriptions: {
    async setup({ dispatch, history }) {
      // 不获取个人信息
      // await dispatch({ type: 'getWxUser' });
      await weixin.init(false);

      return history.listen(async ({ pathname }) => {
        // if (!['/result', '/export', '/chart', '/log', '/paper', '/new'].includes(pathname)) {
        //   await weixin.init();
        // }

        if (['/new'].includes(pathname)) {
          let paper = users.getPaperData();
          await dispatch({
            type: 'setStore',
            payload: {
              paper,
            },
          });
        }
      });
    },
  },
};
