import http from 'axios';
import qs from 'qs';
import * as R from 'ramda';
import { sport } from './setting';

const host = sport.apiHost;
export const DEV = false;
export const _commonData = {
  rows: 1,
  data: [{ affected_rows: 1, id: Math.ceil(Math.random() * 100) }],
  time: 20,
  ip: '127.0.0.1',
  title: '数据更新/插入/删除返回值',
};

// 导出数据，随机时长
export type MockFn = <T>(path: T, time: number) => Promise<T>;
export const mock: MockFn = (path, time = Math.random() * 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(path);
    }, time);
  });

export const getType: (data: any) => string = data => R.type(data).toLowerCase();

// 自动处理token更新，data 序列化等
export interface AxiosOption {
  [key: string]: any;
}
export let axios = (option: AxiosOption) => {
  option = Object.assign(option, {
    method: option.method || 'get',
  });

  return http
    .create({
      baseURL: host,
      timeout: 30 * 1000,
      transformRequest: [
        function(data) {
          let dataType = getType(data);
          switch (dataType) {
            case 'object':
            case 'array':
              data = qs.stringify(data);
              break;
            default:
              break;
          }
          return data;
        },
      ],
    })(option)
    .then(({ data }) => data);
};
