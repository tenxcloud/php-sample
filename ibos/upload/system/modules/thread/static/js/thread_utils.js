define([
	"artDialog",
	Ibos.app.assetUrl + "/js/lang/zh-cn.js"
	], function(artDialog){

	var app = Ibos.app,
		l = Ibos.l;

	var threadUtils = {
		// 主线详情对话框
		infoDialog: function(data, ok){
			var dialog = artDialog.get("d_thread_info");
			// 如果页面上已经存在该对话框，则先关闭
			dialog && dialog.close();

			dialog = artDialog({
				id: "d_thread_info",
				title: l("THREAD.EDIT_THREAD"),
				padding: "20px",
				width: 800,
				zIndex: 1000
			});

			require([
				"text!" + app.assetUrl + "/templates/thread_info.html",
				"ueditor",
				"moment",
				"userSelect",
				"datetimepicker"
				], function(threadInfoTmpl, UE, moment, handler){

				// @Todo: 此处反复创建和销毁datetimepicker, userSelect, editor各种对象
				// 感觉比较浪费，考虑优化
				dialog.content($.template(threadInfoTmpl, $.extend({}, data, {
					chargeuid: data.chargeuid && data.chargeuid != 0 ?
						"u_" + data.chargeuid : 
						"",

					starttime: data.starttime != 0 ? 
						moment(data.starttime * 1000).format("YYYY-MM-DD") : 
						"",

					endtime: data.endtime != 0 ? 
						moment(data.endtime * 1000).format("YYYY-MM-DD") : 
						"",

					participantuid: data.participantuid ?
						"u_" + data.participantuid.split(",").join(",u_") :
						""
				})));

				dialog.config.close = function(){
					$("#thread_starttime, #thread_endtime").datepicker("destroy");
					UE.getEditor("thread_editor").destroy();
				};

				var userData = Ibos.data.get("user");
					
				// 初始化负责人员选择框
				$("#thread_chargeuid").userSelect({
					data: userData,
					type: "user",
					clearable: false,
					maximumSelectionSize: 1
				});

				// 初始化参与人员选择框
				$("#thread_participantuid").userSelect({
					data: userData,
					type: "user"
				});

				// 初始化开始时间选择
				$("#thread_starttime").datepicker({
					target: $("#thread_endtime")
				});

				// 初始化描述编辑器
				UE.getEditor("thread_editor", {
					toolbars: UEDITOR_CONFIG.mode.simple,
					initialFrameWidth: 760,
 						initialFrameHeight:240,
 						autoHeightEnabled: false
				});

				// 点击保存后，获取表单和编辑器数据，保存到模型
				dialog.DOM.content.find(".btn-primary").on("click", function(){
					var formData = dialog.DOM.content.children().eq(0).serializeObject();
					formData.description = UE.getEditor("thread_editor").getContent();

					ok && ok.call(dialog, formData);
				});
			});
		}
	}

	return threadUtils
});
