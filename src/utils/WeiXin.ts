import { axios } from './axios';
import { sport } from './setting.js';
import qs from 'qs';

const wx = require('weixin-js-sdk');

const url: string = window.location.href.split('#')[0];
const redirectUrl: string = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
  sport.apiId
}&redirect_uri=${encodeURIComponent(
  url,
)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;

let { origin, pathname } = window.location;
const shareUrl: string = origin + pathname;

const wxPermissionInit: () => void = async () => {
  let data = await axios({
    params: {
      s: '/weixin/signature',
      url,
    },
  });
  let config = {
    debug: false,
    appId: data.appId,
    timestamp: data.timestamp,
    nonceStr: data.nonceStr,
    signature: data.signature,
    jsApiList: [
      'onMenuShareAppMessage',
      'onMenuShareTimeline',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      // "getNetworkType"
    ],
  };
  wx.config(config);
  initWxShare();
};

const initWxShare: () => void = () => {
  wx.ready(() => {
    let option = {
      title: sport.title,
      desc: sport.desc,
      link: shareUrl,
      imgUrl: 'http://www.cbpc.ltd/cdn/cbpc.jpg',
      type: '',
      dataUrl: '',
      success: function() {
        // 记录分享次数
      },
      cancel: function() {},
    };
    wx.onMenuShareAppMessage(option);
    wx.onMenuShareTimeline(option);
    wx.onMenuShareQQ(option);
    wx.onMenuShareWeibo(option);
    wx.onMenuShareQZone(option);

    // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    wx.hideMenuItems({
      menuList: [
        'menuItem:editTag',
        'menuItem:delete',
        'menuItem:copyUrl',
        'menuItem:originPage',
        'menuItem:readMode',
        'menuItem:openWithQQBrowser',
        'menuItem:openWithSafari',
        'menuItem:share:email',
        // 从以下起禁止分享功能
        // 'menuItem:share:appMessage',
        // 'menuItem:share:timeline',
        // 'menuItem:share:qq',
        // 'menuItem:share:weiboApp',
        // 'menuItem:share:QZone',
        // 'menuItem:share:brand',
      ],
    });
  });
};

const needRedirect: () => boolean | string = () => {
  let hrefArr: string[] = window.location.href.split('?');
  if (hrefArr.length == 1) {
    window.location.href = redirectUrl;
    return false;
  }
  let params = qs.parse(hrefArr[1]);
  return params.code;
};

interface IPropUser {
  openid: string;
  nickname: string;
  sex: 1;
  language: string;
  city: string;
  province: string;
  country: string;
  headimgurl: string;
  privilege: any[];
}

const getWxUserInfo: () => Promise<IPropUser | boolean> = async () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      openid: 'oW0w1v4qftC8xUP3q-MPIHtXB7hI',
      nickname: '宾不厌诈',
      sex: 1,
      language: 'zh_CN',
      city: '成都',
      province: '四川',
      country: '中国',
      headimgurl:
        'http://wx.qlogo.cn/mmhead/Q3auHgzwzM7RSAYiaxiaC1lOZYicWic9YZKEFJ2TKEfh3pFJibLvf7IxdLQ/0',
      privilege: [],
    };
  }

  // 是否需要重定向
  let code: string | boolean = needRedirect();
  if (!code) {
    return false;
  }

  let userInfo: IPropUser;
  let wx_userinfo: undefined | string = localStorage['wx_userinfo'];
  if (typeof wx_userinfo != 'undefined') {
    userInfo = JSON.parse(wx_userinfo);
    console.log(userInfo);
    return userInfo;
  }

  userInfo = await axios({
    params: {
      s: '/weixin/user_info',
      code,
    },
  });

  console.log(userInfo);

  if (typeof userInfo.nickname != 'undefined') {
    localStorage.setItem('wx_userinfo', JSON.stringify(userInfo));
  }
  return userInfo;
};

const init = () => {
  // 微信初始化
  console.log('weixin init');
  wxPermissionInit();
};

export default { init, getWxUserInfo };
