/**
 * 主线 -- 任务模型类
 * Thread
 * @Todo: 过滤用，在指派任务模块用 Backbone 重构之后将直接其模型
 * @author 		inaki
 * @version 	$Id: threadAm.js 4315 2014-10-08 06:07:41Z gzzcs $
 */
define(function(){
	return Backbone.Model.extend({
		defaults: {
			subject: "",
			chargeuid: "",
			participantuid: "",
			description: "",
			attachmentid: "",
			starttime: "",
			endtime: ""
		},

		idAttribute: "assignmentid"
	});
});
