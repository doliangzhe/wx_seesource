var config = require('../../utils/config.js');
var WxParse = require('../../utils/wxParse/wxParse.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    newsDetail:{},
    loaded:false,//数据是否加载完毕
    comments:[]
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    var dbid = options.dbid;
    that.loadData(dbid);
    that.loadComments(dbid);
  },
  //加载数据
  loadData: function(dbid){
    var that = this;
    wx.request({
        url: config.host+'/news/detail.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'dbid':dbid},
        success: function(res) {
           console.log("加载全部的完毕");
           var newsDetail = res.data.entity;
           newsDetail.source = '来源: '+newsDetail.source;
           that.setData({
             newsDetail:newsDetail
           });
           that.setData({
             loaded:true
           });
           WxParse.wxParse('newsDetail.content', 'html', newsDetail.content, that, 5);
        }
    })
  },
  //加载评论
  loadComments: function(dbid){
    var that = this;
    wx.request({
        url: config.host+'/news/getComments.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'dbid':dbid},
        success: function(res) {
           that.setData({
             comments:res.data.list
           });
        }
    })
  }
})
