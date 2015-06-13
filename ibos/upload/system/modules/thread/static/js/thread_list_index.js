/**
 * 主线 -- 列表页
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_list_index.js 4778 2014-12-23 07:48:00Z gzzcs $
 */
;(function() {
	var app = Ibos.app;
	var l = Ibos.l;

	define([
		app.assetUrl + "/js/collections/thread.js",
		app.assetUrl + "/js/views/threadMain.js",
		app.assetUrl + "/js/lang/zh-cn.js"
	], function(ThreadCollection, ThreadMainView) {
		// 初始化主线列表
		// @Debug: 此处使用全局变量方便调试
		var urlParam = U.getUrlParam();
		var thCollection;

		// 关注列表
		if(urlParam.side == "attention") {
			var AttThreadCollection = ThreadCollection.extend({
				url: app.url("thread/list/getlist", { side: urlParam.side })
			});

			thCollection = new AttThreadCollection();

			// 取消某项的关注后，刷新页面
			thCollection.on("change", function(model, options){
				if(!model.get("isAttention")) {
					thCollection.customFetch();
				}
			});

		// 下属列表
		} else if(urlParam.side == "sub") {
			var SubThreadCollection = ThreadCollection.extend({
				url: app.url("thread/list/getlist", { side: urlParam.side, uid: urlParam.uid })
			});

			thCollection = tc = new SubThreadCollection();
		} else {
			thCollection = tc = new ThreadCollection();
		}



		var thMainView = new ThreadMainView({
			collection: thCollection
		});

		// 初始化发布区相关功能
		require([
			"charCount",
			"userSelect"
		], function($){

			var PublishView = Backbone.View.extend({
				el: "#thread_publish_box",

				initialize: function(){
					var view = this;
					var MAXCHAR = 25;

					// 初始化发布框字符计数
					this.$("#thread_subject").charCount({
						display: "thread_subject_placeholder",
						max: MAXCHAR,
						template: l("THREAD.CHARCOUNT_TPL"),
						warningTemplate: l("THREAD.CHARCOUNT_WARNING_TPL")
					}).on({
						"blur": function(e) {
							$(this).parent().toggleClass("has-value", $.trim(this.value) !== "");
						},
						"countchange": function(e, data){
							// 当字符超出规定时，改变样式
							$(this).parent().toggleClass("has-error", data.remnant < 0);
						}
					}).focus();


					// 初始化负责人员选择框
					this.$("#thread_charge").userSelect({
						data: Ibos.data.get("user"),
						type: "user",
						maximumSelectionSize: 1,
						placeholder: l("THREAD.CHARGER"),
						clearable: false
					});

					if(app.g("requireFinishtime")) {
						require(["datetimepicker"], function(){
							view.$("#thread_pb_endtime_dp").datepicker();
						});
					}
				},

				events: {
					"click .o-am-plus": "publish",
					"keydown .am-publish-input": function(evt){
						if(evt.which === 13) {
							this.publish();
						}
					}
				},

				publish: function(){
					var $subject = this.$(".am-publish-input"),
						subject = $subject.val(),
						chargeuid = this.$("#thread_charge").val(),
						endtime = this.$(".datepicker-input").val();

					thCollection.create({
						subject: subject,
						chargeuid: chargeuid,
						endtime: endtime
					}, {
						wait: true,
						validate: true,
						_parse: true,
						silent: true,
						success: function(model){
							thMainView.$el.find('[data-node="ongoing"]').click();
							$subject.val("");
						}
					});
				}
			});

			new PublishView({ collection: thCollection });
		});

	});
})();
