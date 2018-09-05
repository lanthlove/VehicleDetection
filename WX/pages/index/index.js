//index.js
//获取应用实例
const app = getApp()

globalData: {
  imgResult: null;
  vh_label:null;
  vh_prob:null;
}

Page({
  data: {
    motto: '这个车叫啥呢',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //server_url: 'http://100.64.204.151:8081',
    server_url: 'http://192.168.1.2:8081',
    //server_url: 'http://localhost:5000',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  convertImageToCanvas:function (image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
  },

  chooseImage: function(from) {
    var that = this
    app.globalData.imgResult = that.data.imgResult;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"], 
      //sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [from.target.dataset.way],
      //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          title: '正在处理', icon: 'loading', duration: 120000
        });
        wx.uploadFile({
          url: that.data.server_url +'/images_upload',
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data",
          },
          success: function (res) {
            wx.hideToast();
            if (res.statusCode == 200) {
              var data = JSON.parse(res.data);
              if (data.code == 0){
                app.globalData.imgResult = that.data.server_url + data.img_url;
                app.globalData.vh_label = data.vh_label;
                app.globalData.vh_prob = data.vh_prob;
                console.log(app.globalData.imgResult)
                wx.navigateTo({
                  url: '../result/result',
                })
              }else if(data.code == 1){
                wx.hideToast();
                wx.showModal({
                  title: '提示',
                  content: '未识别到车辆',
                })
              }
              
            } else {
              wx.hideToast();
              wx.showModal({
                title: '提示',
                content: '服务器错误，请重试，error！',
              })
            }
          },
          fail: function (res) {
            console.log(that.data.server_url + '/images_upload')
            wx.hideToast();
            wx.showModal({
              title: '提示',
              content: '服务器错误，请稍后重试！',
            });
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log('choose image failed');
      },
      complete: (res) => {
        console.log('choose image complete');
      },
    })
  },
  

  onLoad: function () {
    /*
    wx.navigateTo({
      url: '../result/result',
    })*/
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
