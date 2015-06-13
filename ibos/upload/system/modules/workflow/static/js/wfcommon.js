/**
 * wfcommon.js
 * 工作流前台使用模块JS
 * IBOS
 * Workflow
 * @author		banyan
 * @version		$Id$
 */

/**
 * 列表事件
 * @type object
 */
var wfList = {
	/*
	 * 获取选中
	 * @returns {@exp;U@call;getCheckedValue}*
	 */
	getCheckedId: function() {
		return U.getCheckedValue("id[]") || U.getCheckedValue("runid[]");
	},
	/**
	 * 删除行
	 * @param {string} ids 要删除的行ID
	 * @returns {undefined}
	 */
	removeRows: function(ids) {
		var arr = ids.split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			$('#list_tr_' + arr[i]).remove();
		}
	},
	/**
	 * 刷新统计
	 * @returns {undefined}
	 */
	refreshCounter: function() {
		$.get(Ibos.app.url('workflow/list/count'), function(res) {
			for (var prop in res) {
				if (res.hasOwnProperty(prop)) {
					if (res[prop] === 0) {
						$("[data-count='" + prop + "']").hide();
					} else {
						$("[data-count='" + prop + "']").html(res[prop]).show();
					}
				}
			}
		}, 'json');
	},
	/**
	 * 列表批量操作
	 * @param {string} url
	 * @param {object} param
	 * @param {Function} success
	 * @param {string} msg
	 * @returns {undefined}
	 */
	batchOpt: function(url, param, success, msg) {
		var ids = this.getCheckedId(), that = this;
		var _ajax = function(url, param, success) {
			$.post(url, param, function(res) {
				if (res.isSuccess) {
					if (success && $.isFunction(success)) {
						success.call(null, res, ids);
					}
					that.refreshCounter();
					Ui.tip(Ibos.l("OPERATION_SUCCESS"), 'success');
				} else {
					Ui.tip(res.errorMsg, 'danger');
				}
			}, 'json');
		};
		if (ids !== '') {
			param = $.extend({id: ids, formhash: Ibos.app.g('formHash')}, param);
			if (msg) {
				Ui.confirm(msg, function() {
					_ajax(url, param, success);
				});
			} else {
				_ajax(url, param, success);
			}
		} else {
			Ui.tip(Ibos.l("SELECT_AT_LEAST_ONE_ITEM"), 'warning');
		}
	},
	/**
	 处理单项操作集合
	 * @method deal
	 * @param  {String} url 后台处理功能php的路径
	 * @param  {Array} param post请求发送的参数集合形式为{key:value}
	 * @param  {Number} id 处理对象的id
	 * @param  {Function} success 当ajax请求成功后的操作函数
	 * @param  {String} msg 弹出提示框的提示语言
	 */
	deal: function(url, param, Id, success, msg) {
		var _ajax = function(url, param, success) {
			$.post(url, param, function(res) {
				if (res.isSuccess) {
					if (success && $.isFunction(success)) {
						success.call(null, res, Id);
						Ui.tip(Ibos.l("OPERATION_SUCCESS"));
					}
				} else {
					Ui.tip(Ibos.l("OPERATION_FAILED"), "danger");
				}
			});
		};
		param = $.extend({id: Id, formhash: Ibos.app.g('formHash')}, param);
		if (msg) {
			Ui.confirm(msg, function() {
				_ajax(url, param, success);
			});
		} else {
			_ajax(url, param, success);
		}
	}
};

$(function() {
	Ibos.events.add({
		/**
		 * 查看流程图 （点击步骤及流程图）
		 * @param {object} elem
		 * @param {object} param
		 * @returns {undefined}
		 */
		'viewFlow': function(param, $elem) {
			window.open(Ibos.app.url('workflow/preview/flow', param), "viewFlow");
		},
		/**
		 * 关注与取消关注操作
		 * @param {object} elem 
		 * @param {string} param
		 * @returns {undefined}
		 */
		'focus': function(param, $elem) {
			var toFocus = $elem.hasClass("o-tr-attention");
			$.get(Ibos.app.url('workflow/handle/focus', {id: param}), {focus: +toFocus}, function(data) {
				if (data.isSuccess) {
					$elem.attr({'class': (toFocus ? 'o-ck-attention' : 'o-tr-attention')});
					wfList.refreshCounter();
				} else {
					Ui.tip(data.errorMsg, 'danger');
				}
			}, 'json');
		},
		/**
		 * 删除工作流操作
		 * @param {object} $elem
		 * @param {mixed} param
		 * @returns {undefined}
		 */
		'del': function(param, $elem) {
			Ui.confirm(Ibos.l('WF.CONFIRM_DEL_RUN'), function() {
				var url = Ibos.app.url('workflow/handle/del', {id: param, formhash: Ibos.app.g('formHash')});
				$.post(url, function(data) {
					if (data.isSuccess) {
						$elem.closest('tr').remove();
						Ui.tip(Ibos.l('DELETE_SUCCESS'), 'success');
						wfList.refreshCounter();
					} else {
						Ui.tip(data.msg ? data.msg : Ibos.l('DELETE_FAILED'), 'danger');
					}
				}, 'json');
			});
		},
		/**
		 * 
		 * @param {type} param
		 * @param {type} $elem
		 * @returns {undefined}
		 */
		'batchDel': function(param, $elem) {
			wfList.batchOpt(Ibos.app.url('workflow/handle/del'), null, function(res, id) {
				wfList.removeRows(id);
			}, Ibos.l('WF.CONFIRM_DEL_SELECT_RUN'));
		},
		/**
		 * 弹出委托确认对话框
		 * @param {object} elem
		 * @param {mixed} param
		 * @returns {undefined}
		 */
		'entrust': function(param, $elem) {
			var opt = {
				title: Ibos.l('WF.CONFIRM_ENTRUST'),
				id: 'd_entrust',
				cancel: true,
				ok: function() {
					$('#entrust_form').submit();
					return false;
				}
			};
			delete param.name;

			Ui.ajaxDialog(Ibos.app.url('workflow/entrust/confirm', param), opt);
		},
		/**
		 * 转交操作
		 * @param {object} elem
		 * @param {mixed} param
		 * @returns {undefined}
		 */
		'turn': function(param, $elem) {
			var turnType = param.type == '1' ? 'showNext' : 'showNextFree';

			Ui.ajaxDialog(Ibos.app.url('workflow/handle/' + turnType, {key: param.key}), {
				title: Ibos.l('CONFIRM_POST'),
				id: 'd_turn',
				lock: true,
				ok: function() {
					if (sncheckform()) {
						$('#turn_next_form').submit();
					}
					return false;
				},
				cancel: true
			});
		},
		/**
		 * 导出
		 * @param {object} elem
		 * @param {object} id
		 * @returns {Boolean}
		 */
		'export': function(param, $elem) {
			if (!$.isNumeric(param)) {
				param = wfList.getCheckedId();
				if (param === '') {
					Ui.tip(Ibos.l("SELECT_AT_LEAST_ONE_ITEM"), 'warning');
					return false;
				}
			}

			window.location.href = Ibos.app.url('workflow/handle/export', {runid: param});
		},
		/**
		 * 结束
		 * @param {object} elem
		 * @param {object} id
		 * @returns {Boolean}
		 */
		'end': function(param, $elem) {
			Ui.confirm(Ibos.l('WF.CONFIRM_END_FLOW'), function() {
				var url = Ibos.app.url('workflow/handle/complete', {key: param.key, inajax: 1, topflag: 1, op: 'manage', formhash: Ibos.app.g('formHash')});
				$.post(url, function(data) {
					if (data.isSuccess) {
						$elem.closest('tr').remove();
						Ui.tip(Ibos.l('OPERATION_SUCCESS'));
					} else {
						Ui.tip(data.msg ? data.msg : Ibos.l('OPERATION_FAILED'), 'danger');
					}
				}, 'json');
			});
		}
	});

	wfList.refreshCounter();
});

