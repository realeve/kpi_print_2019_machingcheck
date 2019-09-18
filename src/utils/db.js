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

/**
*   @database: { 微信开发 }
*   @desc:     { 批量记录评分结果 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{uid,username,score,operator,rec_time }]，数组的每一项表示一条数据*/
export const addCbpcPerformancePrintMcEachother = values =>
  axios({
    method: 'post',
    data: {
      values,
      id: 207,
      nonce: '021d683f98',
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 是否已投票 }
 */
export const getCbpcPerformancePrintMcEachother = operator =>
  axios({
    url: '/208/3becb72fb3.json',
    params: {
      operator,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 评分原始数据 } 
    const { tstart, tend } = params;
*/
export const getCbpcPerformancePrintMcEachotherLog = params =>
  axios({
    url: '/209/c41f50b0af.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 互评平均得分 }
 */
export const getCbpcPerformancePrintMcEachotherAvg = () =>
  axios({
    url: '/210/dbb8db602a.json',
  });
