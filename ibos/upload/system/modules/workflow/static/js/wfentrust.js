$(function() {
	//workflow_entrust_add.js里有postCheck定义，有待优化
	var $select = $("#flow_select_input"),
			$dateBegin = $('#entrust_date_begin'),
			$dateEnd = $('#entrust_date_end'),
			$user = $('#be_entrust_user');

	function postCheck() {
		if ($select.val() == "") {
			Ui.tip('@WF.PLEASE_SELECT_PROCESS', 'danger');
			return false;
		}
		if ($user.val() == "") {
			Ui.tip('@WF.DESIGNATED_THE_CLIENT', 'danger');
			return false;
		}
		var beginDateVal = $dateBegin.find('input').val();
		var endDateVal = $dateEnd.find('input').val();
		if ($('#always_effected').prop('checked') == false) {
			if (beginDateVal !== '' && endDateVal !== '') {
				var beginDate = Date.parse(beginDateVal);
				var endDate = Date.parse(endDateVal);
				if (beginDate > endDate) {
					Ui.tip('@BEGIN_GREATER_THAN_END', 'danger');
					return false;
				}
			} else if (beginDateVal == '' && endDateVal == '') {
				Ui.tip('@WF.TIME_CANNOT_BE_EMPTY', 'danger');
				return false;
			}
		}
		return true
	}
	Ibos.events.add({
		/**
		 * 添加规则
		 * @param {Object} param
		 * @param {Object} $elem
		 * @returns {undefined}
		 */
		'addRule': function(param, $elem) {
			var url = Ibos.app.url('workflow/entrust/add');
			Ui.ajaxDialog(url, {
				title: Ibos.l('WF.ADD_ENTRUST_RULE'),
				id: 'd_rule',
				width: '380px',
				ok: function() {
					if (postCheck()) {
						$('#entrust_form').submit();
					}
					return false;
				},
				cancel: true
			});
		},
		/**
		 * 开启
		 * @param {type} param
		 * @param {type} $elem
		 * @returns {undefined}
		 */
		'setEnabled': function(param, $elem) {
			var ids = wfList.getCheckedId();
			wfList.batchOpt(Ibos.app.url('workflow/entrust/status'), {flag: '1'}, function() {
				var arr = ids.split(",");
				for (var i = 0; i < arr.length; i++) {
					var $tr = $("#list_tr_" + arr[i]);
					$tr.find('[data-change]').prop('checked', true).trigger('change');
				}
			}, null);
		},
		/**
		 * 关闭
		 * @param {type} param
		 * @param {type} $elem
		 * @returns {undefined}
		 */
		'setDisabled': function(param, $elem) {
			wfList.batchOpt(Ibos.app.url('workflow/entrust/status'), {flag: '0'}, function(res, ids) {
				var arr = ids.split(",");
				for (var i = 0; i < arr.length; i++) {
					var $tr = $("#list_tr_" + arr[i]);
					$tr.find('[data-change]').prop('checked', false).trigger('change');
				}
			}, null);
		},
		/**
		 * 删除规则
		 * @param {type} param
		 * @param {type} $elem
		 * @returns {undefined}
		 */
		'delRule': function(param, $elem) {
			wfList.batchOpt(Ibos.app.url('workflow/entrust/del'), null, function(res, ids) {
				var arr = ids.split(",");
				for (var i = 0; i < arr.length; i++) {
					$("#list_tr_" + arr[i]).remove();
				}
			}, Ibos.l('WF.CONFIRM_DEL_RULE'));
		}
	});

	$('[data-change]').on('change', function() {
		var id = $(this).data('id');
		wfList.deal(Ibos.app.url('workflow/entrust/status'), {flag: +$(this).prop('checked')}, id, function(res, id) {
			var $tr = $('#list_tr_' + id);
			if ($tr.find('[data-change]').prop('checked') == true) {
				$tr.removeClass('state-close');
			} else {
				$tr.addClass("state-close");
			}
		});
	});
});