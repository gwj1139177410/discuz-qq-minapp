//app.js
App({
  onLaunch: function() {
    var that = this
    qq.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo;
      }
    })
    that.get_token() // 获取token
  },

  get_token: function() {
    var that = this;
    qq.login({
      success: function (res) {
        if (res.code) {
          // console.log(res);
          qq.request({
            url: getApp().globalData.svr_url+'get_token.php',
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              token: qq.getStorageSync("token"),
              code: res.code,
            },
            success: function(resp) {
              console.log('Get token...');
              console.log(resp);
              var resp_dict = resp.data;
              if (resp_dict.err_code == 0) {
                qq.setStorage({
                  key: 'token',
                  data: resp_dict.data.token,
                  success: function() {
                    console.log('Close wechat login...');
                    /*
                    if (resp_dict.data.has_login != 1) {
                        that.wxLogin();
                    }
                    */
                  }
                })
              } else {
                that.showSvrErrModal(resp)
              }
            }
          })
        } else {
          console.log('获取用户登录状态失败！' + res.errMsg)
        }
      }
    });
  },

  wxLogin: function() {
    var that = this;
    qq.getUserInfo({
      success: function (res) {
        var username = res.userInfo.nickName;
        var avatar_url = res.userInfo.avatarUrl;
        if (username && avatar_url){
          qq.request({
            url: getApp().globalData.svr_url+'wx_login.php',
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              token: qq.getStorageSync("token"),
              username: username,
              avatar_url: avatar_url
            },
            success: function(resp) {
              var resp_dict = resp.data;
              if (resp_dict.err_code == 0) {
                qq.setStorage({
                  key: 'token',
                  data: resp_dict.data.token,
                })
              } else {
                that.showSvrErrModal(resp);
              }
            }
          })
        }
      }
    });
  },

  showSvrErrModal: function(resp) {
    if (resp.data.err_code != 0 && resp.data.err_msg) {
      console.log(resp.data.err_msg)
      this.showErrModal(resp.data.err_msg);
    } else {
      console.log(resp);
      qq.request({
        url: getApp().globalData.svr_url+'report_error.php',
        method: 'POST',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          token: qq.getStorageSync("token"),
          error_log: resp.data,
          svr_url: getApp().globalData.svr_url,
        },
        success: function(resp) {
          console.log(resp);
        }
      })
    }
  },

  checkLogin: function() {
    var that = this
    qq.getStorage({
      key: 'login',
      success: function (res) {
        if (!res.data) {
          that.unLoginModal()
        }
      },
      fail: function () {
        that.unLoginModal()
      }
    })
  },

  unLoginModal:function (){
    qq.showModal({
      content: '您还没有登录，请先登录！',
      showCancel: false,
      success: function () {
        qq.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  },

  showErrModal: function(err_msg) {
    qq.showModal({
      content: err_msg,
      showCancel: false
    });
  },

  /* 封装微信缓存 Api */
  putSt: function (k, v, t) {
    qq.setStorageSync(k, v)
    var seconds = parseInt(t);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      qq.setStorageSync(k + 'dtime', timestamp + "")
    } else {
      qq.removeStorageSync(k + 'dtime')
    }
  },

  getSt: function (k, def) {
    var deadtime = parseInt(qq.getStorageSync(k + 'dtime'))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        if (def) { return def; } else { return; }
      }
    }
    var res = qq.getStorageSync(k);
    if (res) {
      return res;
    } else {
      return def;
    }
  },

  globalData: {    
    base_url: 'https://test.gwj1314.space/',
    svr_url: 'https://test.gwj1314.space/wmapi/',
    
    userInfo: null,
    lite_switch: false,
  }
})