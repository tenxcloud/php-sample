/**
 * 工作流-表单库管理-首页
 * @author 		inaki
 * @version 	$Id$
 */

$(function() {
	//初始化普通搜索框
	$("#mn_search").search();

	Ibos.evt.add({
		/**
		 * 批量取消关注
		 * @param {type} $elem
		 * @param {type} param
		 * @returns {undefined}
		 */
		'cancelFocus': function() {
			wfList.batchOpt(Ibos.app.url('workflow/handle/focus', { focus: 0 }), null, function(res, ids) {
				wfList.removeRows(ids);
			}, Ibos.l("WF.UNFOLLOW_CONFIRM"));
		},
	});
});