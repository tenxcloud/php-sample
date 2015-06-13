/**
 * 主线 -- 入口模块，及模块通用自执行代码
 * Thread
 * @author         inaki
 * @version     $Id: thread.js 4452 2014-10-27 06:56:41Z gzhzh $
 */
define(function(){
    var app = Ibos.app;
    var threadAssetUrl = app.getAssetUrl("thread");

    var routeMap = {
        "thread/list/index": [ threadAssetUrl + "/js/thread_list_index.js" ],
        "thread/detail/show": [ threadAssetUrl + "/js/thread_detail_show.js" ]
    };

    var urlParam = U.getUrlParam();
//    if(urlParam.side == "sub") {
//        // 加载侧栏下属树
//        require(["zTree"], function(){
//            var setting = {
//                async: {
//                    enable: true,
//                    url: app.url("thread/list/getsubordinates"),
//                    autoParam:["id=uid"],
//                    dataType: "json",
//                    otherParam:{ "item":"9999" },
//                    dataFilter: filter
//                },
//                view: {
//                    nameIsHTML: true
//                }
//            };
//
//            function filter(treeId, parentNode, childNodes) {
//                if (!childNodes) return null;
//                return $.map(childNodes, function(node){
//                    return {
//                        id: node.uid,
//                        uid: node.uid,
//                        pid: node.upuid || 0,
//                        url: app.url("thread/list/index", { side: "sub", uid: node.uid }),
//                        target: "_self",
//                        name: '<img src=' + node.avatar_small + ' width="20" height="20" style="margin-top: -4px;"/> ' + node.realname,
//                        isParent: Math.round(Math.random()) //node.hasSub
//                    }
//                });
//            }
//            var treeObj = $.fn.zTree.init($("#thread_sub_tree"), $.extend(true, {}, Ibos.settings.zTree, setting));
//        });
//    }

    return routeMap;
});
