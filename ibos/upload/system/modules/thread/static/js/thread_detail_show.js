/**
 * 主线模块--主线详情页
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_detail_show.js 4452 2014-10-27 06:56:41Z gzhzh $
 */

define("threadDetail", [
	Ibos.app.getAssetUrl("thread", "/js/models/thread.js")
	], function(ThreadModel){
	var app = Ibos.app;

	return new ThreadModel(app.g("thread"));
});

define([
	"threadDetail",
	Ibos.app.getAssetUrl("thread") + "/js/thread_utils.js"
	], function(threadModel, threadUtils) {

	var app = Ibos.app;
	var l = Ibos.l;

	var cbView = new (Backbone.View.extend({
		el: ".thrd-cb",

		events: {
			"click [data-node='detailToggle']": "toggleDetail",

			// 结束主线
			"click .thrd-cb-btn.btn-success": "endThread",

			// 重启主线
			"click .thrd-cb-btn:not(.btn-success)": "restartThread",

			"click .o-conf": "editThread"
		},

		editThread: function(){
			threadUtils.infoDialog(threadModel.toJSON(), function(formData){
				var dialog = this;
				threadModel.save(formData, {
					url: threadModel.url() + "&updatesubmit=1",
					wait: true,
					_parse: true,
					silent: true,
					success: threadModel._success(function(model, resp){
						if(resp.isSuccess) {
							Ui.tip(resp.msg);
							dialog.close();
							window.location.reload();
						} else {
							Ui.tip(resp.msg, "danger");
						}
					}),
				});
			});
		},

		toggleDetail: function(evt){
			this.$(".thrd-cb-bd").slideToggle(200, function(){
				$(evt.target).toggleClass("active");
			});
		},

		endThread: function(){
			$.post(app.url("thread/op/index", { id: threadModel.get("threadid"), op: "end" }), { _method: "PUT" }, function(res){
				// @:: 暂时简单暴力地刷新页面
				if(res.isSuccess) {
					window.location.reload();
				} else {
					Ui.tip(res.msg, "danger");
				}
			}, "json");
		},

		restartThread: function(){
			$.post(app.url("thread/op/index", { id: threadModel.get("threadid"), op: "restart" }), { _method: "PUT" }, function(res){
				// @:: 暂时简单暴力地刷新页面
				if(res.isSuccess) {
					window.location.reload();
				} else {
					Ui.tip(res.msg, "danger");
				}
			}, "json");
		}		
	}));

	 $("#thread_dt_nav").on("shown", showTab).find("[data-toggle='tab']").eq(0).trigger("shown");
//	$("#thread_dt_nav").on("shown", showTab).find("[data-toggle='tab']").eq(1).tab("show");
	
	function showTab(evt){
		var tabId = $.attr(evt.target, "href"),
			tabType = tabId.replace("#thread_", ""),
			$container = $(tabId).parent();

		$(tabId).empty();
		$container.waiting();

		var threadAssetUrl = Ibos.app.getAssetUrl("thread");
		var route = {
			"#thread_feed": threadAssetUrl + "/js/thread_feed.js",
			"#thread_email": threadAssetUrl + "/js/thread_email.js",
			"#thread_assignment": threadAssetUrl + "/js/thread_assignment.js",
			"#thread_flow": threadAssetUrl + "/js/thread_flow.js",
			"#thread_file": threadAssetUrl + "/js/thread_file.js",
			"#thread_team": threadAssetUrl + "/js/thread_team.js"
		}

		$.get(app.url("thread/detail/show", { id: U.getUrlParam().id, tab: tabType }), function(res){
			$container.waiting(false);
			$(tabId).html(res.html);
			if(route[tabId]) {
				require([ route[tabId] ], function(init){
					init();
				});
			}
		});
	}
});
	