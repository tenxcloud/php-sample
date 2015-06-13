$(function() {
	Ibos.events.add({
		/**
		 * 管理员删除
		 * @returns {undefined}
		 */
		'admindel': function() {
			wfList.batchOpt(Ibos.app.url('workflow/handle/del'), null, function(res, ids) {
				var arr = ids.split(",");
				for (var i = 0; i < arr.length; i++) {
					$("#list_tr_" + arr[i]).remove();
				}
			}, Ibos.l('WF.CONFIRM_DEL_SELECT_RUN'));
		},
		/**
		 * 强制结束
		 * @returns {undefined}
		 */
		'forceend': function() {
			wfList.batchOpt(Ibos.app.url('workflow/handle/end'), null, function(res, ids) {
				var arr = ids.split(",");
				for (var i = 0; i < arr.length; i++) {
					var $elem = $('#list_tr_' + arr[i]).children().eq(4).children();
					$elem.removeClass("xcgn").addClass("tcm");
					$elem.text(Ibos.l('WF.HAS_ENDED'));
				}
			}, Ibos.l('WF.CONFIRM_END_SELECT_RUN'));
		}
	});
});