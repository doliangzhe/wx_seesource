var config = require('../../utils/config.js')

//获取应用实例
var app = getApp()
Page({
  data: {
    articleDatas:[
      {name:'全部', selected:true, pageNo: 1, list:[], loading: false, haveMore:true},
      {name:'安卓', selected:false, pageNo: 1, list:[], loading: false, haveMore:true},
      {name:'小程序', selected:false, pageNo: 1, list:[], loading: false, haveMore:true}
    ],
    articleDataMsgs:[//单独定义，减少渲染次数
      {moreMsg:'加载更多'},
      {moreMsg:'加载更多'},
      {moreMsg:'加载更多'}
    ]
  },
  onLoad: function () {
    console.log('onLoad');
    var that = this;
    that.loadAllData();
    that.loadAndroidData();
    that.loadWxData();
  },
  //切换tab
  switchTab: function(e){
    var index = e.target.dataset.index;
    console.log(index);
    var articleDatas = this.data.articleDatas;
    for(var i in articleDatas){
      if(i == index){
        articleDatas[i].selected = true;
      }else{
        articleDatas[i].selected = false;
      }
    }
    this.setData({
        articleDatas:articleDatas
    });
  },
  //加载全部数据
  loadAllData: function(){
    var that = this;
    var articleDatas = that.data.articleDatas; 
    var articleDataMsgs = that.data.articleDataMsgs;
    var articleData = articleDatas[0];
    var articleDataMsg = articleDataMsgs[0];
    if(articleData.loading || articleData.haveMore == false)
      return ;
    articleData.loading = true;
    articleDataMsg.moreMsg = '加载中...';
    that.setData({
       articleDataMsgs:articleDataMsgs
    }); 
    wx.request({
        url: config.host+'/article/findAll.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'pageNo':articleData.pageNo, "pageSize":20},
        success: function(res) {
           console.log("加载全部的完毕");
           articleData.pageNo = articleData.pageNo + 1;
           articleData.loading = false;
           if(res.data.list.length == 0){
              articleData.haveMore = false;
              articleDataMsg.moreMsg = '我是有底线的';
           }else{
              articleDataMsg.moreMsg = '加载更多';
           }
           for(var i in res.data.list){
             articleData.list.push(res.data.list[i]);
           }
           that.setData({
             articleDatas:articleDatas
           });
           that.setData({
             articleDataMsgs:articleDataMsgs
           });
        }
    })
  },
  //加载安卓数据
  loadAndroidData: function(){
    var that = this;
    var articleDatas = that.data.articleDatas; 
    var articleDataMsgs = that.data.articleDataMsgs;
    var articleData = articleDatas[1];
    var articleDataMsg = articleDataMsgs[1];
    if(articleData.loading)
      return ;
    articleData.loading = true;
    articleDataMsg.moreMsg = '加载中...';
    that.setData({
       articleDataMsgs:articleDataMsgs
    });    
    wx.request({
        url: config.host+'/article/findByCategory.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'pageNo':articleData.pageNo, "pageSize":20, "category":"android"},
        success: function(res) {
           articleData.pageNo = articleData.pageNo + 1;
           articleData.loading = false;
           if(res.data.list.length == 0){
              articleData.haveMore = false;
              articleDataMsg.moreMsg = '我是有底线的';
           }else{
              articleDataMsg.moreMsg = '加载更多';
           }
           for(var i in res.data.list){
             articleData.list.push(res.data.list[i]);
           }
           that.setData({
             articleDatas:articleDatas
           });
           that.setData({
             articleDataMsgs:articleDataMsgs
           });
        }
    })
  },
  //加载小程序数据
  loadWxData: function(){
    var that = this;
    var articleDatas = that.data.articleDatas; 
    var articleDataMsgs = that.data.articleDataMsgs;
    var articleData = articleDatas[2];
    var articleDataMsg = articleDataMsgs[2];
    if(articleData.loading)
      return ;
    articleData.loading = true;
    articleDataMsg.moreMsg = '加载中...';
    that.setData({
       articleDataMsgs:articleDataMsgs
    });  
    wx.request({
        url: config.host+'/article/findByCategory.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'pageNo':articleData.pageNo, "pageSize":20, "category":"wx"},
        success: function(res) {
           articleData.pageNo = articleData.pageNo + 1;
           articleData.loading = false;
           if(res.data.list.length == 0){
              articleData.haveMore = false;
              articleDataMsg.moreMsg = '我是有底线的';
           }else{
              articleDataMsg.moreMsg = '加载更多';
           }
           for(var i in res.data.list){
             articleData.list.push(res.data.list[i]);
           }
           that.setData({
             articleDatas:articleDatas
           });
           that.setData({
             articleDataMsgs:articleDataMsgs
           });
        }
    })
  },
  //监听滚动到底端
  scrolltolower: function(e){
    console.log("scrolltolower");
    var index = e.target.dataset.index;
    console.log(index);
    var that = this;
    if(index == 0){
      that.loadAllData();
      return ;
    }
    if(index == 1){
      that.loadAndroidData();
      return ;
    }
    if(index == 2){
      that.loadWxData();
      return ;
    }
  }
})
