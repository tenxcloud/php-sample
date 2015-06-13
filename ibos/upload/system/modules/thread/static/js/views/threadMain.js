define([
	Ibos.app.assetUrl + "/js/views/thread.js",
	Ibos.app.assetUrl + "/js/lang/zh-cn.js",
	"pagination"
], function(ThreadView){
	var app = Ibos.app;
	var l = Ibos.l;
	/**
	 * 视图类 -- 主线主视图
	 * @class ThreadMainView
	 * @constructor
	 * @extends {Backbone.View}
	 */
	var ThreadMainView = Backbone.View.extend({
		el: "#thread_main",

		threadType: "ongoing",

		initialize: function(){
			this.listenTo(this.collection, "add", this.addThread);
			this.listenTo(this.collection, "reset", this.addThreads);
			this.listenTo(this.collection, "invalid", this.isInvalid);

			this.listenTo(this.collection, /*"request"*/ "customfetchstart", function(){
				this.loading();
			});
			this.listenTo(this.collection, /*"sync"*/ "customfetchend", function(){
				this.loading(false);
			});

			this.listenTo(this.collection, "customfetchend", function(collection, resp, options){
				this.setThreadCount(resp);
				this.initPagination(collection, resp, options);
			});

			this.$list = this.$("#thread_list");

			this.loading();
			this.collection.fetchOnGoing();
		},

		events: {
			"keydown .sp-search-input": function(evt) {
				if(evt.which === 13) {
					this.search(evt);
				}
			},

			"click .sp-search-box .o-ol16-search": "search",

			"click [data-node='ongoing']": function(){
				this.$el.find(".sp-search-input").val("");
				this.collection.fetchOnGoing();
			},

			"click [data-node='ended']": function(){
				this.$el.find(".sp-search-input").val("");
				this.collection.fetchEnded();
			}
		},

		/**
		 * 过渡状态
		 * @method loading
		 * @return
		 */
		loading: function(state){
			if(state === false){
				this.$list.waiting(false);
			} else {
				this.$list.waiting(null, null, true);
			}
		},

		isInvalid: function(model, msg, options){
			Ui.tip(msg, "warning");
		},

		/**
		 * 初始化页码
		 * @method initPagination
		 * @return {[type]} [description]
		 */
		initPagination: function(collection, resp, options){
			var collection = this.collection;
			var pages = resp.pages;
			if(pages){
				// 初始化页码
				var _settings = {
					items_per_page: pages.limit,
					current_page: pages.curPage,
					num_display_entries: 5,
					prev_text: false,
					next_text: false,
					renderer: "ibosRenderer",
					allow_jump: true,
					load_first_page: false,
					callback: function(page, elem) {
						collection.customFetch({
							data: {
								page: page+1
							}
						});
					}
				};

				var pageCount = Math.ceil(pages.count / pages.limit);
				if(pageCount > 1){
					this.$el.find(".page-list-footer").show();
					this.$("#thread_pagination").pagination(pages.count, _settings);
				} else {
					this.$el.find(".page-list-footer").hide();
				}
			}
		},

		setThreadCount: function(resp){
			this.$el.find('[data-node="ongoingCount"]').text(resp.ongoingCount);
			this.$el.find('[data-node="endedCount"]').text(resp.endedCount);
		},

		/**
		 * 添加一个主线项视图到列表
		 * @method addThread
		 * @param {Model} model 主线模型
		 * @return 
		 */
		addThread: function(model) {
			var view = new ThreadView({ model: model });
			view.render().$el.hide().appendTo(this.$list).fadeIn();
		},

		/**
		 * 添加当前集合里的所有模型对应的视图到列表
		 * @method addThreads
		 * @return
		 */
		addThreads: function() {
			this.$list.empty();
			if(this.collection.length){
				this.collection.each(this.addThread, this);
			} else {
				this.$list.html("<li class='no-data-tip'></li>")
			}
		},

		/**
		 * 搜索相关主线
		 * @method search
		 * @return
		 */
		search: function(evt){
			var $search = this.$el.find(".sp-search-input");
			var keyword = $search.val();
			var keywordIsEmpty = $.trim(keyword) == "";

			this.collection.customFetch({ 
				data: {
					page: 1,
					search: +!keywordIsEmpty,
					normal_search: +!keywordIsEmpty,
					keyword: keyword
				}
			});

		}
	});

	return ThreadMainView;
});