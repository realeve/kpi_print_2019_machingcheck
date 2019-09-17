import uuidv4 from 'uuid/v4.js';
import * as R from 'ramda';
import * as lib from './lib';
import router from 'umi/router';

// 活动开始前，参与测试人员数据加前缀
export const _dev = false;

const prefix = (_dev ? 'dev' : 'dist') + '_2019_machinecheck_';
let key: {
  [key: string]: string;
} = {
  user: prefix + 'user',
  data: prefix + 'data',
  status: prefix + 'status',
  hasSubmitted: prefix + 'hasSubmitted',
  loginfo: prefix + 'loginfo',
};

export const saveLoginfo = data => {
  window.localStorage.setItem(prefix.loginfo, JSON.stringify(data));
};

export const loadLoginfo = () => {
  return JSON.parse(window.localStorage.getItem(prefix.loginfo) || '{}');
};

export const getUid = () => {
  let user: string | null = window.localStorage.getItem(key.user);
  if (R.isNil(user)) {
    // uuidv5 中传入的字符值为随机值，此处无意义
    let uuid: string = uuidv4(key.user);
    window.localStorage.setItem(key.user, uuid);
    user = uuid;
  }
  let status = loadPaperStatus();
  return { user, status, start_time: lib.now() };
};

// 存储答题状态
export const setPaperStatus = () => {
  window.localStorage.setItem(key.status, '1');
};

// 载入答题状态
export const loadPaperStatus = () => {
  let status: string | null = window.localStorage.getItem(key.status);
  let res = R.isNil(status) ? 0 : Number(status);
  return res;
};

export const setPaperData = v => {
  window.localStorage.setItem(key.data, JSON.stringify(v));
};
export const getPaperData = () => {
  let res = window.localStorage.getItem(key.data) || '[]';
  return JSON.parse(res);
};

export let gotoSuccess = () => router.push('/result');
