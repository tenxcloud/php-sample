/**
 * 主线 -- 任务集合类
 * Thread
 * @Todo: 过滤用，在指派任务模块用 Backbone 重构之后将直接其模型
 * @author 		inaki
 * @version 	$Id: threadAm.js 4315 2014-10-08 06:07:41Z gzzcs $
 */
define([
	Ibos.app.getAssetUrl("thread", "/js/models/threadAm.js")
	], function(AmModel){
	return Backbone.Collection.extend({
		model: AmModel,

		getTotalCount: function(attrs){
			return attrs ? this.where(attrs).length : this.length;
		},

		// 完成的任务数，包括已评价、已完成
		getFinishCount: function(attrs){
			var models = this.models;
			if(attrs) {
				models = this.where(attrs);
			}

			return _.filter(models, function(model){
				var status = model.get("status");
				return status == "2" || status == "3";
			}).length;
		}
	});
});