/**
 * 工作流-工作流管理-首页
 * @author 		inaki
 * @version 	$Id$
 */

$(function() {
	//搜索
	$("#mn_search").search();

	var $slide = $("#wf_slide"),
		$mainer = $("#wf_manage_mn"),
		$manageTable = $("#wf_manage_table"),
		$slideCtrl = $("#wf_slide_ctrl");

	// 初始化侧滑效果效果
	var slidewin = slideWindow($slide, $mainer, "right", {
		justify: true
	});

	// 单击行打开隐藏面板并加载相关流程信息
	$manageTable.on("click", "tbody tr", function() {
		var flowid = $.attr(this, "data-id");
		if (flowid) {
			guide.open(flowid);
		}
	})
		.on("click", ".checkbox", function(evt) {
			evt.stopPropagation();
		});

	// 关闭流程信息面板
	$slideCtrl.click(function() {
		slidewin.slideOut();
		$slide.stopWaiting();
	});

	window.guide = (function() {
		// 工作流ID
		var flowid,
			formid,
			$guideList = $("#wf_guide_list"),
			$guideHeader = $("#wf_guide_header");

		$guideList.on("mouseover", "li", function() {
			Ui.selectOne($(this));
		});

		// 流程信息面板标题设置，对应三种状态
		var _setHeader = function(title, status) {
			var _headerTpl = '<i class="cbtn <%=cls%>"></i> <h4><%=title%></h4> <span><%=text%></span></div>';

			var _map = {
				warning: ["o-wf-warning", Ibos.l('WF.PROCESS_NOT_DONE')],
				success: ["o-wf-success", Ibos.l('WF.PROCESS_RUNNING_WELL')],
				error: ["o-wf-error", Ibos.l('WF.PROCESS_ERROR')]
			};

			var data = {
				title: title || "",
				cls: _map[status] ? _map[status][0] : "",
				text: _map[status] ? _map[status][1] : ""
			};

			$guideHeader.html($.template(_headerTpl, data));
		};

		// 设置当前流程步骤
		var _setCurrent = function(index) {
			if (index && index > 0) {
				var $items = $guideList.find("li");
				$items.removeClass("active").eq(parseInt(index, 10) - 1).addClass("active");
			}
		};

		// 给已完成的引导加上对应的样式，参数以逗号分隔的序号字符串，如"1,2,3,4"
		var _setFinished = function(indexes) {
			var $items = $guideList.find("li:visible");
			$items.removeClass("finished");
			if (indexes !== "") {
				var indexArr = indexes.split(",");
				for (var i = 0, len = indexArr.length; i < len; i++) {
					var index = $items.eq(parseInt(indexArr[i], 10) - 1);
					index.addClass("finished");
				}
			}
		};

		function _change(res) {
			_setHeader(res.title, res.status);
			_setCurrent(res.current);
			_setFinished(res.finished);
		}

		return {
			getId: function() {
				return flowid;
			},

			getFormId: function() {
				return formid;
			},

			open: function(id, callback) {
				var $tr = $('#flow_tr_' + id);
				var type;

				if ($tr.length) {
					flowid = id;
					formid = $tr.attr('data-formid');
					type = $tr.attr('data-type');

					if (type == '1') {
						$('#fixed_opt').show();
						$('#free_opt').hide();
					} else {
						$('#fixed_opt').hide();
						$('#free_opt').show();
					}

					Ui.selectOne($tr);

					slidewin.slideIn(function() {
						$slide.waitingC();
						$.post(Ibos.app.url('workflow/type/getguide', {
							formhash: Ibos.app.g("formHash")
						}), {
							id: flowid
						}, function(res) {
							_change(res);
							$slide.waiting(false);
							callback && callback(res);
						}, "json");
					});
				}
			},

			dialog: function(url, param, options) {
				var opts;

				if (!url) {
					return false;
				}

				url += (url.indexOf("?") === -1 ? "?flowid=" : "&flowid=") + this.getId() + (param ? "&" + $.param(param) : "");

				opts = $.extend({
					padding: 0,
					ok: true,
					cancel: true
				}, options);

				this.hideDialog();
				this._dialog = Ui.ajaxDialog(url, opts);
			},

			hideDialog: function() {
				this._dialog && this._dialog.close();
			}
		};
	})();


	var flowType = {
		getCheckedId: function() {
			return U.getCheckedValue("work");
		},

		access: function(url, param, success, msg) {
			var flowIds = this.getCheckedId();
			var _ajax = function(url, param, success) {
				$.post(url, param, function(res) {
					if (res.isSuccess) {
						$.isFunction(success) && success.call(null, res, flowIds);
						Ui.tip("@OPERATION_SUCCESS");
					} else {
						Ui.tip(res.errorMsg, 'danger');
					}
				}, 'json');
			};
			if (flowIds !== '') {
				param = $.extend({
					flowids: flowIds,
					formhash: G.formHash
				}, param);
				if (msg) {
					Ui.confirm(msg, function() {
						_ajax(url, param, success);
					});
				} else {
					_ajax(url, param, success);
				}
			} else {
				Ui.tip("@SELECT_AT_LEAST_ONE_ITEM", 'warning');
			}
		},

		removeRows: function(ids) {
			var arr = ids.split(',');
			for (var i = 0, len = arr.length; i < len; i++) {
				$('#flow_tr_' + arr[i]).remove();
			}
		},

		refreshRows: function(ids, callback) {
			var arr = ids.split(',');
			for (var i = 0, len = arr.length; i < len; i++) {
				callback && callback($('#flow_tr_' + arr[i]));
			}
		}
	};

	Ibos.evt.add({
		"del": function(param, elem) {
			flowType.access(Ibos.app.url("workflow/type/del"), null, function(res, ids) {
				flowType.removeRows(ids);
				slidewin.slideOut();
			}, Ibos.l("WF.DELETE_FLOW_CONFIRM"));
		},

		"clear": function(param, elem) {
			flowType.access(Ibos.app.url("workflow/type/del", {
				op: "clear"
			}), null, function(res, ids) {
				// 清空后统计数归0
				flowType.refreshRows(ids, function(obj) {
					obj.find('.counter').html('0 / 0');
				});

				slidewin.slideOut();

			}, Ibos.l("WF.CLEAR_FLOW_CONFIRM"));
		},

		"handover": function(param, elem) {
			var url = Ibos.app.url('workflow/type/trans');

			var dialog = Ui.ajaxDialog(url, {

				title: Ibos.l('WF.WORK_HANDOVER'),

				padding: '20px',

				ok: function() {
					if ($('#work_handover_user_from').val() === '') {
						Ui.tip(Ibos.l('WF.TRANSACTOR_CANT_BE_EMPTY'), 'danger');
						return false;
					}

					if ($('#work_handover_user_to').val() === '') {
						Ui.tip(Ibos.l('WF.TRANS_OBJECT_CANT_BE_EMPTY'), 'danger');
						return false;
					}

					$('#handover_form').waiting(Ibos.l('IN_SUBMIT'), "mini", true);

					$.post(url, $('#handover_form').serializeArray(), function(data) {
						$('#handover_form').waiting(false);
						if (data.isSuccess) {
							Ui.tip("@OPERATION_SUCCESS");
							dialog.close();
						} else {
							Ui.tip("@OPERATION_FAILED", "danger");
						}
					}, 'json');

					return false;
				},

				cancel: true
			});
		}
	});

	// 接收传来的flowid，显示对应的引导面板
	if (Ibos.app.g('flowid') && Ibos.app.g('catid')) {
		guide.open(Ibos.app.g('flowid'));
	}
});