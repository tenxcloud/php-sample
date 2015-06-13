/**
 * 主线 -- 任务
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_assignment.js 4642 2014-11-27 02:30:55Z gzzcs $
 */

// 视图类 -- 主线任务列表项(默认视图、按结束时间)
define("AmItemTimeView", [
	"text!" + Ibos.app.assetUrl + "/templates/thread_am_time.html",
	Ibos.app.getAssetUrl("thread", "/js/views/threadAmItem.js")
	], function(amItemTimeTmpl, AmItemView){

	return AmItemView.extend({
		template: _.template(amItemTimeTmpl),

		render: function(){
			this.$el.html(this.template(this.getRenderData()));
			return this;
		}
	});
});


// 视图类 -- 主线任务列表项(按负责人、发布人)
define("AmItemUserView", [
	"text!" + Ibos.app.assetUrl + "/templates/thread_am_user.html",
	Ibos.app.getAssetUrl("thread", "/js/views/threadAmItem.js"),
	"moment"
	], function(amItemChargeUidTmpl, AmItemView, moment){

	return AmItemView.extend({
		template: _.template(amItemChargeUidTmpl),

		render: function(key){
			var data = this.getRenderData();
			data.formattedStartTime = moment(data.starttime * 1000).lang("zh-cn").format("ll HH:mm");
			data.formattedEndTime = moment(data.endtime * 1000).lang("zh-cn").format("ll HH:mm");
			data.key = key;

			this.$el.html(this.template(data));
			return this;
		}
	});
});


// 视图类 -- 主线任务列表(默认视图、按结束时间)
define("AmListTimeView", [
	Ibos.app.getAssetUrl("thread", "/js/views/threadAmList.js"),
	"AmItemTimeView",
	"text!" + Ibos.app.assetUrl + "/templates/thread_am_time_category.html",
	"moment"
	], function(AmListView, AmItemTimeView, amDateCategoryTmpl, moment){

	return AmListView.extend({
		template: _.template(amDateCategoryTmpl),

		itemView: AmItemTimeView,

		// 将模型分组并排序后返回
		getSortAndGroupData: function(models){
			var view = this;
			models = models || this.collection.models;

			return _.sortBy(_.groupBy(models, function(m){
			 	// 将增加时间格式化对比
		 		return moment(m.get(view.groupKey) * 1000).format("YYYY-MM-DD");
			}), function(ms, k){
				return view.desc ? -moment(k) : moment(k) ;
			});
		},

		// 获取分类模板需要的数据
		getTmplData: function(model){
			var mm = moment(model.get(this.groupKey) * 1000).lang("zh-cn");
			return {
				date: mm.date(),
				weekDay: mm.format("dddd"),
				yearMonth: mm.format("YYYY-MM")
			}
		}
	});
});


// 视图类 -- 主线任务列表(按负责人)
define("AmListChargeView", [
	Ibos.app.getAssetUrl("thread", "/js/views/threadAmList.js"),
	"AmItemUserView",
	"text!" + Ibos.app.assetUrl + "/templates/thread_am_user_category.html",
	Ibos.app.getAssetUrl("thread", "/js/lang/zh-cn.js")
	], function(AmListView, AmItemUserView, amUserCategoryTmpl){

	var l = Ibos.l;

	return AmListView.extend({
		template: _.template(amUserCategoryTmpl),

		itemView: AmItemUserView,

		groupKey: "chargeuid",

		getTmplData: function(model){
			var data = model.toJSON();
			var queryAttrs = {};
			queryAttrs[this.groupKey] = data[this.groupKey]

			return {
				userName: data.chargeName || "",
				userAvatar: data.chargeAvatar || "",
				action: l("THREAD.INCHARGE"),
				finishCount: this.collection.getFinishCount(queryAttrs),
				totalCount: this.collection.getTotalCount(queryAttrs)
			};
		}
	});
});


// 视图类 -- 主线任务列表(按指派人)
define("AmListDesigneeView", [
	Ibos.app.getAssetUrl("thread", "/js/views/threadAmList.js"),
	"AmItemUserView",
	"text!" + Ibos.app.assetUrl + "/templates/thread_am_user_category.html",
	Ibos.app.getAssetUrl("thread", "/js/lang/zh-cn.js")
	], function(AmListView, AmItemUserView, amUserCategoryTmpl){

	var l = Ibos.l;

	return AmListView.extend({
		template: _.template(amUserCategoryTmpl),

		itemView: AmItemUserView,

		groupKey: "designeeuid",

		getTmplData: function(model){
			var data = model.toJSON();
			var queryAttrs = {};
			queryAttrs[this.groupKey] = data[this.groupKey]

			return {
				userName: data.designeeName || "",
				userAvatar: data.designeeAvatar || "",
				action: l("THREAD.ARRANGE"),
				finishCount: this.collection.getFinishCount(queryAttrs),
				totalCount: this.collection.getTotalCount(queryAttrs)
			};
		}
	});
});


define("AmMainView", [
	"AmListTimeView",
	"AmListChargeView",
	"AmListDesigneeView"
	], function(AmListTimeView, AmListChargeView, AmListDesigneeView){
	
	return Backbone.View.extend({
		el: "#thread_assignment_list",

		initialize: function(){
			this.listenTo(this.collection, "change:status", function(){
				this.filterBy();
			});
		},

		render: function(prop){
			this.$el.empty();
			this.$el.append(this.getListView(prop).el);
			this.filterBy();
		},

		listViews: {},

		getListView: function(prop){
			var listView;
			// if(this.listViews[prop]) {
			// 	listView = this.listViews[prop];
			// } else {
				switch(prop){
					case "chargeuid": 
						listView = new AmListChargeView({ collection: this.collection });
						break;

					case "designeeuid": 
						listView = new AmListDesigneeView({ collection: this.collection });
						break;

					case "endtime": 
						listView = new (AmListTimeView.extend({
								groupKey: "endtime",
								collection: this.collection
							}))();
						break;

					case "addtime": 
						listView = new (AmListTimeView.extend({
								groupKey: "addtime",
								desc: true,
								collection: this.collection
							}))();
						break;
				}

				this.listViews[prop] = listView;
			// }
			return listView;
		},

		filterProps: {},

		/**
		 * 合并新的过滤属性，并触发过滤
		 * @filterBy
		 * @param  {Object} props 要求配备的键值对
		 * @return
		 */
		filterBy: function(props){
			props = $.extend(this.filterProps, props);
			this.collection.trigger("filterByProps", props);
		},

		/**
		 * 清除指定的过滤属性
		 * @clearFilter
		 * @param  {Array} props
		 * @return
		 */
		clearFilter: function(props) {
			if(props) {
				this.filterProps = _.omit.apply(null, [this.filterProps].concat(props));
				this.filterBy();
			}
		}
	});
});

// @Todo: 这里代码大量与指派任务模块重复，需要整理
define([
	Ibos.app.getAssetUrl("thread", "/js/collections/threadAm.js"),
	"AmMainView",
	"swfUploadHandler",
	"charCount",
	"userSelect",
	"datetimepicker",
	Ibos.app.getAssetUrl("assignment", "/js/lang/zh-cn.js")
	], function(AmCollection, AmMainView) {

	return function(){

		var app = Ibos.app,
			l = Ibos.l,
			upload = Ibos.upload,
			org = Ibos.data;

		var amCollection = amc = new AmCollection(app.g("assignments"));
		var ammView = new AmMainView({ collection: amCollection });

		var AmPublishView = Backbone.View.extend({
			el: ".am-publish-box",

			events: {
				"keydown #am_publish_input": "keydownPublish",
				"keydown #am_endtime_input": "keydownPublish",
				"click .o-am-plus": "publish",
				"click .am-publish-dt .btn-primary": "publish",
				"click .am-publish-toggle": "toggleMode"
			},

			// 最大字数
			ASSIGN_MAXCHAR: 25,

			initialize: function(){
				var view = this;

				this.$input = $("#am_publish_input");

				// 初始化发布框字符计数
				this.$input.charCount({
					display: "am_publish_charcount",
					max: this.ASSIGN_MAXCHAR,
					template: l("ASM.CHARCOUNT_TPL"),
					warningTemplate: l("ASM.CHARCOUNT_WARNING_TPL")
				}).on({
					"blur": function() {
						view.toggleHasValueStatus();
					},
					"countchange": function(e, data){
						view.toggleErrorStatus(data);
					}
				});


				// 初始化时间选择器
				var currentDate = new Date;
				$("#am_starttime").datepicker({
					format: "yyyy-mm-dd hh:ii",
					pickTime: true,
					pickSeconds: false,
					target: "am_endtime"
				})
				// 设置初始时间为当前时间
				.datepicker("setLocalDate", currentDate);

				// 快捷选择结束时间
				$("#am_bar_endtime").datepicker({
					format: "yyyy-mm-dd hh:ii",
					pickTime: true,
					pickSeconds: false
				});

				// 设置初始时间为三天后
				$("#am_endtime, #am_bar_endtime").datepicker("setStartDate", currentDate)
				.datepicker("setLocalDate", new Date(+currentDate + 259200000));

				// 从高级视图同步时间至简洁视图
				function syncDateToSimple(val){
					$("#am_bar_endtime_input").val(val);
				}

				function syncDateToAdvanced(val){
					$("#am_endtime_input").val(val);
				}

				$("#am_endtime").on("hide", function(evt, data){
					syncDateToSimple($(this).data("date"));
				});

				$("#am_endtime_input").on("change", function(){
					syncDateToSimple(this.value);
				});

				// 从简洁视图同步时间至高级视图
				$("#am_bar_endtime").on("hide", function(evt, data){
					syncDateToAdvanced($(this).data("date"))
				});

				$("#am_bar_endtime_input").on("change", function(){
					syncDateToAdvanced(this.value);
				});


				// 同步负责人至简洁视图
				// 初始化人员选择
				var userData = org.get("user");

				// 负责人为单选
				$("#am_charge, #am_bar_charge").userSelect({
					data: userData,
					type: "user",
					maximumSelectionSize: 1,
					placeholder: l("ASM.CHARGER"),
					clearable: false
				});

				// 相互同步负责人
				$("#am_charge").on("uschange", function(evt, data){
					$("#am_bar_charge").userSelect("setValue", data.val, true);
				});

				$("#am_bar_charge").on("uschange", function(evt, data){
					$("#am_charge").userSelect("setValue", data.val, true);
				});

				// 参与人人员选择
				$("#am_participant").userSelect({
					data: userData,
					type: "user",
					placeholder: l("ASM.PARTICIPANT")
				});

				// 任务说明计数器
				$("#am_description").charCount({
					display: "am_description_charcount",
					template: "<strong><%=count%></strong>/<strong><%=maxcount%></strong>",
					warningTemplate: "<strong><%=count%></strong>/<strong><%=maxcount%></strong>",
					countdown: false
				});

				// 附件上传功能
				upload.attach({
					post_params: { module: 'assignment' },
					button_placeholder_id: 'am_att_upload',
					button_image_url: '',
					custom_settings: {
						containerId: 'am_att_list',
						inputId: 'attachmentid'
					}
				})
			},

			toggleHasValueStatus: function(){
				this.$input.parent().toggleClass("has-value", $.trim(this.$input.val()) !== "");
			},

			// 当字符超出规定时，改变样式
			toggleErrorStatus: function(data){
				this.$input.parent().toggleClass("has-error", data.remnant < 0);
			},

			// 切换发布模式（简易、高级）
			toggleMode: function(){
				var $el = this.$el;
				if(!$el.hasClass("open")){
					$el.toggleClass("open show");
					this.$(".am-publish-dt").slideDown(200);
				} else {
					this.$(".am-publish-dt").slideUp(200, function(){
						$el.toggleClass("open show");
					})
				}
			},

			keydownPublish: function(evt){
				if(evt.which === 13) {
					this.publish();
				}
			},

			publish: function(){
				var view = this;
				var data = this.$el.serializeObject();
				if($.trim(data.subject) == "") {
					Ui.tip(l("ASM.PLEASE_INPUT_SUBJECT"), "warning");
					this.$input.focus();
					return false;
				}
	
				$.post(app.url("thread/detail/show", { id: U.getUrlParam().id, tab: "assignment", addsubmit: 1 }), data, function(res){
					if(res.isSuccess) {
						amCollection.add(res.assignment);
						Ui.tip(l("ASM.ADD_TASK_SUCCESS"));
						view.reset();
					}
				});
			},

			reset: function() {
				this.$input.val("");
				this.$("#am_participant, #am_description").val("").trigger("change");
				this.$('[data-node-type="attachRemoveBtn"]').trigger("click");
			}
		});

		new AmPublishView();

		amCollection.on("add", function(model, collection){
			$('[data-node="assignmentCount"]').html(collection.length);
		});

		require([
			"pSelect"
			], function(){

			var FilterBar = Backbone.View.extend({
				el: "#thrd_filter_bar",

				initialize: function(){
					var view = this;

					this.$("#thrd_f_charge").pSelect();
					this.$("#thrd_f_status").pSelect();
					amCollection.on("add", function(){
						view.$("[data-toggle='tab']").eq(0).tab("show");
						view.$("#thrd_f_status").data("pSelect").select("show");
						view.$("#thrd_f_status").data("pSelect").select("");
					});
				},

				events: {
					"show [data-toggle='tab']": function(evt){
						ammView.render($.attr(evt.target, "href").substring(1));
					},

					"change #thrd_f_status": function(evt){
						if(evt.target.value){
							ammView.filterBy({ status: evt.target.value })
						} else {
							ammView.clearFilter(["status"]);
						}
					},

					"change #thrd_f_charge": function(evt){
						if(evt.target.value){
							ammView.filterBy({ chargeuid: evt.target.value });
						} else {
							ammView.clearFilter(["chargeuid"]);
						}
					}
				}
			});

			var fb = new FilterBar();
			ammView.render("addtime");
		});
	}
});
