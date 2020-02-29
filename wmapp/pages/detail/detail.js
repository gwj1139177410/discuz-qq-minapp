// detail.js
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thread_data: {
      un_image_attach: 0,
      price: 0
    },
    imageList: [],
    newpost:  false,
    username: '',
    post_message: '',
    time: '',
    tid: 0,
    page_index: 0,
    page_size: 5,
    new_reader: 0,
    loading_hidden: true,
    loading_msg: '加载中...',
    login_flag: false,
  },

  previewImage: function (e) {
    var current = e.target.dataset.src
    var urls = e.target.dataset.image_list;
    qq.previewImage({
      current: current,
      urls: urls,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    qq.getStorage({
      key: 'login',
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          that.setData({
            login_flag: true
          })
        }
      }
    })

    console.log(options);
    var tid = options.tid;
    this.setData({
      tid: tid,
      new_reader: 1,
    })

    var token = qq.getStorageSync("token");
    if (token == null || token == undefined || token == '') {
      qq.login({
        success: function (res) {
          if (res.code) {
            console.log(res);

            that.setData({
              loading_hidden: false,
              loading_msg: '加载中...'
            })

            qq.request({
              url: getApp().globalData.svr_url+'get_token.php',
              method: 'POST',
              header: { "content-type": "application/x-www-form-urlencoded" },
              data: {
                token: token,
                code: res.code,
              },
              success: function(resp) {
                console.log(resp);
                var resp_dict = resp.data;
                if (resp_dict.err_code == 0) {
                  qq.setStorage({
                    key: 'token',
                    data: resp.data.data.token,
                    success: function(){
                      that.reloadIndex();
                    }
                  });
                } else {
                  getApp().showSvrErrModal(resp);
                }

                that.setData({
                  loading_hidden: true,
                  loading_msg: '加载中...'
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    } else {
      this.reloadIndex();
    }
  },

  reloadIndex: function () {
    var that = this;
    qq.request({
      url: getApp().globalData.svr_url + "get_post_detail.php",
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        token: qq.getStorageSync("token"),
        tid: that.data.tid,
        new_reader: that.data.new_reader,
        page_size: 5,
        page_index: 0
      },
      success: function (resp) {
        console.log(resp);
        var resp_dict = resp.data;
        if (resp_dict.err_code == 0) {
          var imageList = [];
          that.setData({
            articleList: resp_dict.data.post_list,
            thread_data: resp_dict.data.thread_data,
            new_reader: 0,
          })  
          // 富文本
          
          var post_list = resp_dict.data.post_list
          console.log(resp_dict.data.post_list)
          // todo 将回复的楼层也进行 parse

          var postArr = []

          for (var i = 0; i < post_list.length; i++){
            // console.log(post_list[i].message)
            postArr.push(post_list[i].message)
          }

          // console.log(postArr);

          for (let j = 0; j < postArr.length; j++) {
            WxParse.wxParse('reply' + j, 'html', postArr[j], that);
            if (j === postArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', postArr.length, that)
            }
          }
          // console.log(resp_dict.data.thread_data.message)
          WxParse.wxParse('thread_data.message', 'html', resp_dict.data.thread_data.message, that, 5);  
        } else {
          getApp().showSvrErrModal(resp);
        }
      }
    })
  },

  input_message: function(e) {
    this.setData({
      message: e.detail.value
    });
  },

  submit_message: function(e) {
    var that = this;
    
    var message = that.data.message; 
    if (message == null || message == undefined || message == ''){
      getApp().showErrModal('评论内容不能为空');
      return;
    }

    qq.request({
      url: getApp().globalData.svr_url + 'add_post.php',
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        token: qq.getStorageSync("token"),
        tid: that.data.tid,
        message: encodeURI(that.data.message),
      },
      success: function(resp) {
        var resp_dict = resp.data;
        if (resp_dict.err_code == 10001) {
          qq.showModal({
            content: "请先登录",
            success: function(res) {
              if (res.confirm) {
                qq.switchTab({
                  url:"../user/user"
                });  
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        } else if (resp_dict.err_code == 0) {
          // console.log(resp);
          qq.showToast({
            title: '发表成功',
            icon: 'success',
          })
          // that.reloadIndex();
          that.addPost(that.data.message);
        } else {
          getApp().showSvrErrModal(resp);
        }
      }
    })
  },
  addPost: function (message){
    var that = this
    var time = that.getNowFormatDate()
    qq.getStorage({
      key: 'username',
      success: function(res) {
        // console.log(time)
        // console.log(res.data)
        // console.log(message)
        that.setData({
          newpost: true,
          username: res.data,
          time: time,
          message: '',
          post_message: message
        })
        qq.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      },
      fail: function() {
        that.reloadIndex();
      }
    })
  },

  getNowFormatDate:function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  onReachBottom: function() {
    var that = this;
    var page_size = that.data.page_size;
    var page_index = that.data.page_index+1;
    qq.request({
      url: getApp().globalData.svr_url + "get_post_detail.php",
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        token: qq.getStorageSync("token"),
        page_size: page_size,
        page_index: page_index,
        tid: that.data.tid,
      },
      success: function (resp) {
        console.log(resp);
        var resp_dict = resp.data;
        if (resp_dict.err_code == 0) {
          var tmpArticleList = that.data.articleList;
          var respArticleList = resp_dict.data.post_list;
          var has_append = 0;
          for (var i = 0; i < respArticleList.length; ++i) {
            var has_in = 0;
            for (var j = 0; j < tmpArticleList.length; ++j) {
              if (respArticleList[i].pid == tmpArticleList[j].pid) {
                has_in = 1;
              } 
            }
            if (has_in == 0) {
              tmpArticleList.push(respArticleList[i]);
              has_append = 1;
            }
          }

          if (has_append == 1)
          {
            that.setData({
              articleList: tmpArticleList,
              page_index: page_index  
            })

            // 回复消息也经过 wxParse

            var postArr = []

            for (var i = 0; i < tmpArticleList.length; i++) {
              // console.log(tmpArticleList[i].message)
              postArr.push(tmpArticleList[i].message)
            }

            // console.log(postArr);

            for (let j = 0; j < postArr.length; j++) {
              WxParse.wxParse('reply' + j, 'html', postArr[j], that);
              if (j === postArr.length - 1) {
                WxParse.wxParseTemArray("replyTemArray", 'reply', postArr.length, that)
              }
            }

          }
        } else {
          getApp().showSvrErrModal(resp);
        }
      }
    })
  },

  toIndex: function () {
    qq.switchTab({
      url: '../index/index',
    })
  },
  
  onShareAppMessage: function (res) {
    return {
      title: "",
      path: '/pages/detail/detail?tid='+this.data.tid,
      success: function(res) {
        console.log(res);
      },
    }
  },
  onPageScroll: function (e) {
    if (e.scrollTop >= 600) {
      this.setData({
        scroll_show: true
      })
    } else {
      this.setData({
        scroll_show: false
      })
    }
  },
  scrollToTop: function () {
    if (qq.pageScrollTo) {
      qq.pageScrollTo({
        scrollTop: 0,
        duration: 600
      })
    } else {
      qq.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    this.setData({
      scroll_show: false
    })
  }
})