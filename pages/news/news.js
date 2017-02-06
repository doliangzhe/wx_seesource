var config = require('../../utils/config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    newsData:{pageNo: 1, list:[], loading: false, haveMore:true},
    newsDataMsg:{moreMsg:'加载更多'},
    swiperInfo:[]
  },
  onLoad: function () {
    console.log('onLoad');
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    that.loadBanner(function(){
      wx.hideToast();
    });
    that.loadData(function(){
      wx.hideToast();
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    
  },
  //加载资讯
  loadData: function(callback){
    var that = this;
    var newsData = that.data.newsData; 
    var newsDataMsg = that.data.newsDataMsg;
    if(newsData.loading || newsData.haveMore == false)
      return ;
    newsData.loading = true;
    newsDataMsg.moreMsg = '加载中...';  
    that.setData({
       newsDataMsg:newsDataMsg
    });
    wx.request({
        url: config.host+'/news/find.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'pageNo':newsData.pageNo, "pageSize":20},
        success: function(res) {
           console.log("加载全部的完毕");
           newsData.pageNo = newsData.pageNo + 1;
           newsData.loading = false;
           if(res.data.list.length == 0){
              newsData.haveMore = false;
              newsDataMsg.moreMsg = '我是有底线的';
           }else{
              newsDataMsg.moreMsg = '加载更多';
           }
           for(var i in res.data.list){
             newsData.list.push(res.data.list[i]);
           }
           that.setData({
             newsData:newsData
           });
           that.setData({
             newsDataMsg:newsDataMsg
           });
           if(typeof(callback) == "function")
             callback(res.data);
        }
    })
  },
  //加载轮播
  loadBanner: function(callback){
     var that = this;
     wx.request({
        url: config.host+'/news/getRecommends.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if(typeof(callback) == "function")
             callback(res.data.list);
           that.setData({
             swiperInfo:res.data.list
           });
        }
    })
  },
  //监听滚动到底端
  scrolltolower: function(e){
    console.log("scrolltolower");
    var that = this;
    that.loadData();
  }
})
