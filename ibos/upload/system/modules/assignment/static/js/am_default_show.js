/**
 * Assignment/default/show
 * 指派任务查看详情页
 * @version $Id$
 */

// 任务状态(0:未读,1:进行中,2:已完成,3:已评价,4:取消)

$(function(){
	// 更新状态标签
	var updateTaskStatus = function(status) {
		var $statusTag = $('[data-node-type="taskStatusTag"]');
		var statusTagCls = [
			"am-status-unread",
			"am-status-underway",
			"am-status-finished",
			"am-status-hasscore",
			"am-status-canceled"
		];
		$statusTag.removeClass().addClass(statusTagCls[status]);
	}

	// 更新主按钮
	var updateButton = function(status) {
		var $btnWrap = $("#task_op_btn_wrap");
		var tpls = [
			// 催办提醒
			'<button class="btn btn-large btn-success" data-action="urgeTask" data-param=\'{"id": <%= Ibos.app.g("taskId") %>}\'>' +
				'<i class="o-amc-clock"></i> <%= U.lang("ASM.URGE_REMIND")%> ' +
			'</button>',
			// 完成任务
			'<button class="btn btn-large btn-success" data-action="finishTask" data-param=\'{"id": <%= Ibos.app.g("taskId") %>}\'>' +
				'<i class="o-amc-ok"></i> <%= U.lang("ASM.FINISH_TASK")%>' +
			'</button>',
			// 马上评价
			'<button class="btn btn-large btn-danger" data-node-type="stampTaskBtn" data-param=\'{"id": <%= Ibos.app.g("taskId") %>}\'>' +
				'<i class="o-amc-stamp"></i> <%= U.lang("ASM.STAMP_NOW")%>' +
			'</button>',
			// 重启任务
			'<button class="btn btn-large am-restart-btn" data-action="restartTask" data-param=\'{"id": <%= Ibos.app.g("taskId") %>}\'>' +
				'<i class="o-amc-winding"></i> <%= U.lang("ASM.RESTART_TASK")%>' +
			'</button>',
		];
		var isCharge = Ibos.app.g("isCharge"),
			isDesignee = Ibos.app.g("isDesignee");

		switch(status) {
			case 0:
				if(isDesignee) {
					$btnWrap.html($.template(tpls[0]));
				} else if(isCharge){
					$btnWrap.html($.template(tpls[1]));
				}
				break;
			case 1:
				$btnWrap.html($.template(tpls[1]));
				break;
			case 2:
				if(isDesignee) {
					// 变更为“马上评价”按钮时，需要初始化图章选择器
					$btnWrap.html($.template(tpls[2]));
					initStampBtn($('[data-node-type="stampTaskBtn"]'));
				} else if(isCharge){
					$btnWrap.html($.template(tpls[3]));
				}
				break;
			case 3:
			case 4:
				$btnWrap.html($.template(tpls[3]));
				break;
		}
	}

	// 更新操作菜单
	var updateOpMenu = function(status) {
		// task_op_menu
		var $menu = $("#task_op_menu");
		switch(status){
			// 未读
			case 0:
			// 进行中
			case 1:
				$menu.find('[data-node="restart"]').hide()
				$menu.find('[data-node="cancel"], [data-node="remind"], [data-node="delay"]').show()
				break;
			// 已完成
			case 2:
			// 已评价
			case 3:
			// 已取消
			case 4:
				$menu.find('[data-node="cancel"], [data-node="remind"], [data-node="delay"]').hide()
				$menu.find('[data-node="restart"]').show()
		}
	}

	// 初始化评价按钮图章功能
	var initStampBtn = function($btn){
		var stampData = Ibos.app.g("stamps");

		if($btn && $btn.length){
			var taskId = $.parseJSON($btn.attr("data-param")).id;

			Ibosapp.stampPicker($btn, stampData);
			$btn.on("stampChange", function(evt, data){
				Assignment.op.addStamp(taskId, data.value, function(res){
					if(res.isSuccess) {
						Ui.tip(res.msg);
						// setTaskStatus(3);
						addStampInView(data.stamp);
						window.location.reload();
					} else {
						Ui.tip(res.msg, "danger");
					}
				})
			});
		}
	}

	var setTaskStatus = function(status){
		updateTaskStatus(status);
		updateButton(status);
		updateOpMenu(status);
	}

	// 页面初始化时，更新操作菜单及任务状态标签和主按钮
	setTaskStatus(Ibos.app.g("taskStatus"))

	// 在视图上添加图章
	var addStampInView = function(stamp){
		var fullUrl = Ibos.app.g("stampUrl") + "/" + stamp;
		$("#am_stamp_holder").html('<img src="' + fullUrl + '" width="150" height="90">');
	}

	var showTaskCancelDialog = function(ok){
		Ui.closeDialog("d_task_cancel");
		Ui.dialog({
			id: "d_task_cancel",
			title: U.lang("ASM.APPLY_TASK_CANCEL"),
			content: '<textarea style="width: 300px; height: 100px;" placeholder="' + U.lang("ASM.INPUT_TASK_CANCEL_REASON") + '"></textarea>',
			padding: "20px",
			ok: ok
		})
	}

	var showTaskDelayDialog = function(ok){
		Ui.closeDialog("d_task_delay");
		Ui.dialog({
			id: "d_task_delay",
			title: U.lang("ASM.APPLY_TASK_DELAY"),
			content: $.template("tpl_delay_dialog"),
			padding: "20px",
			width: 300,
			init: function(){
				// 初始化时间选择
				$("#task_delay_starttime").datepicker({
					target: "task_delay_endtime",
					format: "yyyy-mm-dd hh:ii",
					pickTime: true,
					pickSeconds: false
				})
			},
			ok: ok
		})
	}


	Ibos.evt.add({
		// 催办任务
		"urgeTask": function(param){
			Assignment.op.urgeTask(param.id, function(res){
				Ui.tip(res.msg, res.isSuccess ? "" : "danger");
			})
		},

		// 完成任务
		"finishTask": function(param){
			Ui.confirm(U.lang("ASM.FINISH_TASK_CONFIRM"), function(){
				Assignment.op.finishTask(param.id, function(res){
					if(res.isSuccess){
						// setTaskStatus(2);
						Ui.dialog({
							padding: 0,
							title: false,
							cancel: false,
							skin: "simple-dialog",
							content: "<div class='am-finish-tip'></div>"
						}).time(2);

						setTimeout(function(){
							window.location.reload();
						}, 2000);
					} else {
						Ui.tip(res.msg, "danger");
					}
				});
			});
		},

		// 重启任务
		"restartTask": function(param){
			Ui.confirm(U.lang("ASM.RESTART_TASK_CONFIRM"), function(){
				Assignment.op.restartTask(param.id, function(res){
					if(res.isSuccess){
						// setTaskStatus(1);
						Ui.tip(res.msg);
						window.location.reload();
					} else {
						Ui.tip(res.msg, "danger");
					}
				});
			});
		},

		// 在详细页删除任务
		"removeTaskInShow": function(param){
			Ui.confirm(U.lang("ASM.REMOVE_TASK_CONFIRM"), function(){
				Assignment.op.removeTask(param.id, function(res){
					if(res.isSuccess){
						Ui.tip(res.msg);
						window.location.href = Ibos.app.url("assignment/unfinished/index")
					}
				});
			});
		},

		// 取消任务
		"cancelTask": function(param){
			// 指派人可以直接取消任务
			if(Ibos.app.g("isDesignee")){
				Ui.confirm(U.lang("ASM.CANCEL_TASK_CONFIRM"), function(){
					Assignment.op.cancelTask(param.id, function(res){
						if(res.isSuccess){
							// setTaskStatus(4);
							Ui.tip(res.msg);
							window.location.reload();
						} else {
							Ui.tip(res.msg, "danger");
						}
					})
				})
			// 负责人需要获得指派人的同意
			} else if(Ibos.app.g("isCharge")){
				showTaskCancelDialog(function(){
					var dialog = this,
						reason = this.DOM.content.find("textarea").val();

					if($.trim(reason) === ""){
						Ui.tip("@ASM.INPUT_TASK_CANCEL_REASON","warning")
					} else {
						Assignment.op.applyCancelTask(param.id, { cancelReason: reason }, function(res){
							if(res.isSuccess){
								dialog.close();
								Ui.tip(res.msg);
								window.location.reload();
							} else {
								Ui.tip(res.msg, "danger");
							}
						})
					}
					return false;
				})	
			}
		},

		// 延期任务
		"delayTask": function(param){
			showTaskDelayDialog(function(){
				var dialog = this,
					$form = this.DOM.content.find("form"),
					data = {
						delayReason: $form[0].reason.value,
						starttime: $form[0].starttime.value,
						endtime: $form[0].endtime.value
					};

				// 验证表单项，延时原因、开始时间、结束时间皆不为空
				if($.trim(data.delayReason) === "") {
					Ui.tip("@ASM.INPUT_TASK_DELAY_REASON", "warning");
					return false;
				} else if(!data.starttime) {
					Ui.tip("@ASM.INPUT_DELAY_STARTTIME", "warning");
					return false;
				} else if(!data.endtime) {
					Ui.tip("@ASM.INPUT_DELAY_ENDTIME", "warning");
					return false;
				}

				// 指派人
				if(Ibos.app.g("isDesignee")){
					Assignment.op.delayTask(param.id, data, function(res){
						Ui.tip(res.msg, res.isSuccess ? "" : "danger");
						res.isSuccess && dialog.close();
						window.location.reload();
					});
				// 负责人
				} else if(Ibos.app.g("isCharge")){
					Assignment.op.applyDelayTask(param.id, data, function(res){
						Ui.tip(res.msg, res.isSuccess ? "" : "danger");
						res.isSuccess && dialog.close();
						window.location.reload();
					});
				}
				return false;
			})
		}
	});
	
	// 弹出延期申请、取消申请对话框
	var showApplyConfirm = function(data, agree, refuse){
		data = $.extend({}, data, Ibos.data.getUser(data.uid));
		Ui.dialog({
			title: false,
			cancel: false,
			lock: true,
			padding: "20px 15px",
			content: $.template("tpl_apply_confirm", { data:data }),
			init: function(){
				var dialog = this;
				this.DOM.content.bindEvents({
					"click [data-node-type='refuseBtn']": function(){
						if(!agree || agree.call(dialog) !== false){
							dialog.close();
						}
					},
					"click [data-node-type='agreeBtn']": function(){
						if(!refuse || refuse.call(dialog) !== false){
							dialog.close();
						}
					}
				}, false)
			}
		})
	}
	// 开始处理申请
	var startHandleApply = function(apply){
		if(apply && apply.id){
			showApplyConfirm(apply, 
			// 同意申请
			function(){
				// 如果是延期，数据中包含时间
				// 否则判断为取消
				Assignment.op[apply.startTime ? "dealDelayApply" : "dealCancelApply"](apply.id, false);
			// 拒绝申请
			}, function(){
				Assignment.op[apply.startTime ? "dealDelayApply" : "dealCancelApply"](apply.id, true);
			});
		}
	};

	// 处理取消申请和延时申请
	var apply = Ibos.app.g("apply");
	var isDesignee = Ibos.app.g("isDesignee");
	if(isDesignee){
		startHandleApply(apply);
	}
});
