
var cwcHashLoader = {

    urls : {
      'home':{'url':'/html/CwcHome.html','reqtype':'GET','reslayout':'#cwc-maincontainer','callback':'cwcHashLoader.callback.homeLayoutCall();'},
      'discussion':{'url':'/html/Discussions.html','reqtype':'GET','reslayout':'#cwc-maincontainer','callback':'cwcHashLoader.callback.discussionCall();'},
      'tutorial':{'url':'/html/Tutorial.html','reqtype':'GET','reslayout':'#cwc-maincontainer','callback':'cwcHashLoader.callback.tutorialCall();'}
    },

    onLoad : function(){
        var hash = window.location.hash.split("#")[1];
        var obj = cwcHashLoader.urls[hash];
    }

}
