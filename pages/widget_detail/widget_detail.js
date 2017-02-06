var config = require('../../utils/config.js');
var WxParse = require('../../utils/wxParse/wxParse.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    widgetDetail:{},
    loaded:false,//数据是否加载完毕
    comments:[]
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    var dbid = options.dbid;
    var type_ = options.type;
    that.loadData(dbid, type_);
    that.loadComments(dbid, type_);
  },
  //加载数据
  loadData: function(dbid, type_){
    var that = this;
    var url = config.host+'/widget/android/detail.html';
    if(type_ == '1')
      url = config.host+'/widget/weixin/detail.html';
    wx.request({
        url: url, 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'dbid':dbid},
        success: function(res) {
           console.log("加载全部的完毕");
           var widgetDetail = res.data.entity;
           that.setData({
             widgetDetail:widgetDetail
           });
           that.setData({
             loaded:true
           });
           WxParse.wxParse('widgetDetail.detail', 'html', widgetDetail.detail, that, 5);
        }
    })
  },
  //加载评论
  loadComments: function(dbid, type_){
    var that = this;
    var url = config.host+'/widget/android/getComments.html';
    if(type_ == '1')
      url = config.host+'/widget/weixin/getComments.html';
    wx.request({
        url: url, 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'articleDbid':dbid},
        success: function(res) {
           that.setData({
             comments:res.data.list
           });
        }
    })
  }
})
