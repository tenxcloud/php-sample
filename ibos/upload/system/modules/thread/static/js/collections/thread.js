/**
 * 主线 -- 集合类
 * Thread
 * @author 		inaki
 * @version 	$Id: thread.js 4315 2014-10-08 06:07:41Z gzzcs $
 */

define([
	Ibos.app.assetUrl + "/js/models/thread.js"
], function(ThreadModel){
	var app = Ibos.app;
	var l = Ibos.l;
	
	/**
	 * 集合类 -- 主线集合
	 * @class ThreadCollection
	 * @constructor
	 * @extends {Backbone.Collection}
	 */
	var ThreadCollection = Backbone.Collection.extend({
		url: app.url("thread/list/getlist"),

		page: 0,

		// response 解析函数
		parse: function(resp) {
			return resp.datas;
		},

		model: ThreadModel,

		pageTo: function(){},

		queries: {},

		// iteration 迭代查询
		customFetch: function(options){
			options = options || {};
			options.data = _.extend(this.queries, options.data);

			this.trigger("customfetchstart", this, options);
			var _success = options.success;
			options.success = function(collection, resp, options){
				_success && _success.apply(this, arguments);
				collection.trigger("customfetchend", collection, resp, options);
			};

			this.fetch(_.extend({
				reset: true
			}, options));
		},

		/**
		 * 获取已结束的主线
		 * @method fetchEnded
		 * @return
		 */
		fetchEnded: function(){
			this.customFetch({
				data: {
					page: 1,
					status: 1,
					keyword: "",
					search: 0,
					normal_search: 0
				}
			});
		},

		/**
		 * 获取进行中的主线
		 * @method fetchOnGoing
		 * @return
		 */
		fetchOnGoing: function(){
			this.customFetch({
				data: {
					page: 1,
					status: 0,
					keyword: "",
					search: 0,
					normal_search: 0
				}
			});	
		}
	});

	return ThreadCollection;
});