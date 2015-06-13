/**
 * 主线 -- 列表项视图类
 * Module
 * @author 		inaki
 * @version 	$Id: thread.js 4778 2014-12-23 07:48:00Z gzzcs $
 */

define([
	"text!" + Ibos.app.getAssetUrl("thread") + "/templates/thread.html",
	"artDialog",
	Ibos.app.getAssetUrl("thread") + "/js/thread_utils.js",
	Ibos.app.assetUrl + "/js/lang/zh-cn.js",
], function(tmpl, dialog, threadUtils){
	var app = Ibos.app;
	var l = Ibos.l;
	
	/**
	 * 视图类 -- 主线项视图
	 * @class ThreadView
	 * @constructor
	 * @extends {Backbone.View}
	 */
	var ThreadView = Backbone.View.extend({
		tagName: "li",

		template: _.template(tmpl),

		className: "thread-item",

		render: function(){
			var data = this.model.toJSON();
			data.detailUrl = app.url("thread/detail/show", { id: data.threadid, side: U.getUrlParam().side });
			this.$el.html(this.template(data));
			return this;
		},

		initialize: function(){
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "sync", this.serverstatus);
			this.listenTo(this.model, "hide", this.remove);

			this.listenTo(this.model, "change:editAble", this.ifEditable);
			this.listenTo(this.model, "change:delAble", this.ifEditable);
			this.ifEditable();
		},

		events: {
			"click": "detail",
			"click .o-g16-star": "star",
			"click .o-g16-gstar": "star",
			"click .o-trash": "clear",
			"click .o-edit": "edit"
		},

		// 查看详细（进入详细页）
		detail: function() {
			window.location.href = Ibos.app.url("thread/detail/show", {
				id: this.model.get("threadid"),
				side: U.getUrlParam().side
			});
		},

		// 星标、取消星标
		star: function(e){
			this.model.star();
			e.stopPropagation();
		},

		ifEditable: function(){
			this.$el.toggleClass("thread-item-editable", this.model.get("editAble") || this.model.get("delAble"));
		},

		clear: function(e){
			var model = this.model,
				collection = model.collection;
			// 由于涉及到页码，销毁模型时，不直接移除节点
			// 而是触发集合 reset 当前页数据
			dialog.confirm(l("THREAD.REMOVE_THREAD_CONFIRM"), function(){
				model.destroy({
					wait: true,
					silent: true,
					success: function(model){
						collection.customFetch();
					}
				});
			});
			e.stopPropagation();
		},

		/**
		 * 打开主线信息编辑框
		 * @method edit
		 * @return
		 */
		edit: function(e){
			var model = this.model;

			threadUtils.infoDialog(model.toJSON(), function(formData){
				var dialog = this;

				model.save(formData, {
					url: model.url() + "&updatesubmit=1",
					wait: true,
					_parse: true,
					silent: true,
					success: model._success(function(model, resp){
						if(resp.isSuccess){
							Ui.tip(resp.msg);
							dialog.close();
						} else {
							Ui.tip(resp.msg, "danger");
						}
					}),
				});
			});

			e.stopPropagation();
		},

		remove: function () {
	    	this.$el.fadeOut(function(){
	    		$(this).remove();
	    	});
	    	this.stopListening();
	    	return this;
	    },

	    serverstatus: function(model, resp, options){
	    	resp.msg && Ui.tip(resp.msg, resp.isSuccess ? "" : "danger");
	    }
	});

	return ThreadView;
});
