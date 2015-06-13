(function(){

	var WF = Ibos.l("WF");

	// 办理完毕流程提示
	if (U.getCookie('flow_complete_flag') == 1) {
		Ui.tip(WF.COMPLETE_SUCEESS);
		U.setCookie('flow_complete_flag', '');
	}
	// 转交成功提示
	if (U.getCookie('flow_turn_flag') == 1) {
		Ui.tip(WF.TRUN_SUCEESS);
		U.setCookie('flow_turn_flag', '');
	}
	
	$("#mn_search").search();
	
	// 显示延期对话框
	var delayDialogInit = false;
	function showDelayDialog(conf){
		return Ui.dialog($.extend({
			title: WF.HOW_LONG_IS_THE_DELAY,
			id: 'd_dialog_delay',
			init: function(){
				if(!delayDialogInit) {
					//初始化延期弹框中延期时间
					$("#custom_time_datepicker").datepicker({
						startDate: new Date
					});

					//点击时间选择类型中的"自定义"项后,时间选择出现
					$(":radio[name='delay-time']", this.DOM.content).change(function() {
						var val = $(this).val();
						$("#custom_time_datepicker").toggleClass("show", val == "4");
					});

					delayDialogInit = true;
				}
			},
			content: document.getElementById('dialog_delay'),
			ok: true,
			cancel: true
		}, conf));
	}

	Ibos.evt.add({
		// 延期操作
		'delay': function(param, elem) {
			var $elem = $(elem);

			showDelayDialog({
				ok: function() {
					// 拿到延期类型
					var time = this.DOM.content.find('input[name="delay-time"]:checked').val();

					// 如果是自定义类型，则拿到自定义的具体值
					if (time == "4") {
						time = $("#custom_time").val();
					}
				
					$.post(Ibos.app.url('workflow/handle/adddelay'), {
						key: param.key,
						time: time
					}, function(res) {
						if (res.isSuccess) {
							Ui.tip(WF.DELAY_OPT_SUCCESS);
							Ui.getDialog('d_dialog_delay').close();
							$elem.closest('tr').remove();
						} else {
							Ui.tip(res.msg ? res.msg : Ibos.l('OPERATION_FAILED'), 'danger');
						}
					}, 'json');

					return false;
				}
			});
		},

		// 恢复延期
		'restore': function(param, elem) {
			var $elem = $(elem);

			Ui.confirm(WF.CONFIRM_RESTORE, function() {
				$.get(Ibos.app.url("workflow/handle/restoredelay", {key: param.key}), function(res) {
					if (res.isSuccess) {
						Ui.tip(WF.RESTORE_SUCCESS);
						$elem.closest("tr").remove();
					} else {
						Ui.tip(res.msg ? res.msg : Ibos.l("OPERATION_FAILED"), "danger");
					}
				}, "json");
			});
		},

		// 回收
		"takeback": function(param, elem) {
			var $elem = $(elem);

			Ui.confirm(WF.CONFIRM_CALLBACK, function() {

				var url = Ibos.app.url("workflow/handle/takeback", {key: param.key});
				
				$.get(url, function(res) {
					if (res.status == 1) {
						Ui.alert(WF.ALREADY_RECEIVED);
					} else if (res.status == 2) {
						Ui.alert(WF.NO_ACCESS_TAKEBACK);
					} else {
						Ui.tip("@OPERATION_SUCCESS");
						$elem.closest("tr").remove();
					}
				}, "json");
			});
		}
	})
})();
