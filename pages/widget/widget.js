var config = require('../../utils/config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    widgetDatas:[
      {name:'安卓', selected:true, pageNo: 1, list:[], loading: false, haveMore:true},
      {name:'小程序', selected:false, pageNo: 1, list:[], loading: false, haveMore:true}
    ],
    widgetDataMsgs:[//单独定义，减少渲染次数
      {moreMsg:'加载更多'},
      {moreMsg:'加载更多'}
    ]
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    that.loadAndroidData();
    that.loadWxData();
  },
  //切换tab
  switchTab: function(e){
    var index = e.target.dataset.index;
    var widgetDatas = this.data.widgetDatas;
    for(var i in widgetDatas){
      if(i == index){
        widgetDatas[i].selected = true;
      }else{
        widgetDatas[i].selected = false;
      }
    }
    this.setData({
        widgetDatas:widgetDatas
    });
  },
  //加载安卓数据
  loadAndroidData: function(){
    var that = this;
    var widgetDatas = that.data.widgetDatas; 
    var widgetDataMsgs = that.data.widgetDataMsgs;
    var widgetData = widgetDatas[0];
    var widgetDataMsg = widgetDataMsgs[0];
    if(widgetData.loading)
      return ;
    widgetData.loading = true;
    widgetDataMsg.moreMsg = '加载中...';
    that.setData({
       widgetDataMsgs:widgetDataMsgs
    });    
    wx.request({
        url: config.host+'/widget/android/find.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'pageNo':widgetData.pageNo, "pageSize":20},
        success: function(res) {
           widgetData.pageNo = widgetData.pageNo + 1;
           widgetData.loading = false;
           if(res.data.list.length == 0){
              widgetData.haveMore = false;
              widgetDataMsg.moreMsg = '我是有底线的';
           }else{
              widgetDataMsg.moreMsg = '加载更多';
           }
           for(var i in res.data.list){
             widgetData.list.push(res.data.list[i]);
           }
           that.setData({
             widgetDatas:widgetDatas
           });
           that.setData({
             widgetDataMsg:widgetDataMsg
           });
        }
    })
  },
  //加载小程序数据
  loadWxData: function(){
    var that = this;
    var widgetDatas = that.data.widgetDatas; 
    var widgetDataMsgs = that.data.widgetDataMsgs;
    var widgetData = widgetDatas[1];
    var widgetDataMsg = widgetDataMsgs[1];
    if(widgetData.loading)
      return ;
    widgetData.loading = true;
    widgetDataMsg.moreMsg = '加载中...';
    that.setData({
       widgetDataMsgs:widgetDataMsgs
    });    
    wx.request({
        url: config.host+'/widget/weixin/find.html', 
        method: 'POST',
        header: {
           'content-type': 'application/x-www-form-urlencoded'
        },
        data: {'pageNo':widgetData.pageNo, "pageSize":20},
        success: function(res) {
           widgetData.pageNo = widgetData.pageNo + 1;
           widgetData.loading = false;
           if(res.data.list.length == 0){
              widgetData.haveMore = false;
              widgetDataMsg.moreMsg = '我是有底线的';
           }else{
              widgetDataMsg.moreMsg = '加载更多';
           }
           for(var i in res.data.list){
             widgetData.list.push(res.data.list[i]);
           }
           that.setData({
             widgetDatas:widgetDatas
           });
           that.setData({
             widgetDataMsg:widgetDataMsg
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
      that.loadAndroidData();
      return ;
    }
    if(index == 1){
      that.loadWxData();
      return ;
    }
  }
})
