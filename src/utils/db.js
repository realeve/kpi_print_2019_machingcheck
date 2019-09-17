import { axios, DEV, _commonData, mock } from './axios';
/**
*   @database: { 微信开发 }
*   @desc:     { 机检互评登录 } 
    const { card_no, username } = params;
*/
export const getCbpcUserList = params =>
  axios({
    url: '/205/c3a3070535.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 机检评分人员列表 }
 */
export const getCbpcUserGroup = provider =>
  axios({
    url: '/206/3b3c37dfb6.json',
    params: {
      provider,
    },
  });
