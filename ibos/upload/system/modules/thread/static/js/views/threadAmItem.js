/**
 * 主线 -- 任务列表项视图基类
 * Thread
 * @author 		inaki
 * @version 	$Id: threadAmItem.js 4703 2014-12-03 02:00:23Z gzzcs $
 */

define(function(){
	var app = Ibos.app;

	return Backbone.View.extend({
		tagName: "tr",

		events: {
			"click .am-checkbox:not(.checked):not(.disabled)": "finish",
			"click .am-checkbox.checked": "unfinish",
			"click .o-trahs": "clear"
		},

		initialize: function(){
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "show", function(){
				this.$el.show();
			});
			this.listenTo(this.model, "hide", function(){
				this.$el.hide();
			})
		},

		getRenderData: function(){
			var data = this.model.toJSON();

			// 附加上详情页的 Url 地址
			data.detailUrl = app.url("assignment/default/show", {
				assignmentId: data.assignmentid
			});
			data.outDate = data.endtime * 1000 < new Date;
			data.isDesignee = app.g("uid") == data.designeeuid;

			return data;
		},

		// 完成任务
		finish: function(){
			var model = this.model;

			model.set("status", "2");
			$.post(app.url("assignment/unfinished/ajaxentrance", { op: "toFinished" }), {
				id: this.model.get("assignmentid")
			});
		},

		// 重启任务
		unfinish: function(){
			var model = this.model;

			model.set("status", "1");
			$.post(app.url("assignment/unfinished/ajaxentrance", { op: "restart" }), {
				id: this.model.get("assignmentid")
			});
		},

		clear: function(){
			
		}
	});
});
