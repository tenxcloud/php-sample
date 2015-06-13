/**
 * 工作总结与计划--新建\编辑共用
 * Report
 * @author 		inaki
 * @version 	$Id$
 */
$(function(){
	// 工作总结进度条初始化
	$("[data-toggle='bamboo-pgb']").each(function(){
		var value = $(this).next().val() || 10;
		return $(this).studyplay_star({
			CurrentStar: parseInt(value, 10),
			prefix: $.attr(this, "data-id")
		}, function(value, $elem){
			$elem.next().val(value);
		});
	});


	// 计划外列表
	var outPlanList = new Report.NpList("#rp_out_plan_list", {
		tpl: "tpl_rp_out_plan",
		start: $("#rp_in_plan_list").children().length + 1
	});

	$(outPlanList).on({
		// 添加一行后，初始化该行进度条
		"itemadd": function(evt, data){
			var $pgb = data.item.find("[data-toggle='bamboo-pgb']");
			$pgb.studyplay_star({
				CurrentStar: 10,
				prefix: $pgb.attr("data-id")
			}, function(value, $el){
				// 此处确保初始化目标的下一个节点为其对应input控件
				$el.next().val(value);
			});
		}
	});

	// 初始化后自动新建一个空行
	outPlanList.addItem(true);
	$("#rp_report_add").on("click", $.proxy(outPlanList.addItem, outPlanList, null, true));


	// 新计划列表
	var planList = new Report.NpList("#rp_new_plan_list", {
		tpl: "tpl_rp_new_plan",
		start: 1
	});
	var _addItem = planList.addItem;
	planList.addItem = function(data, focus){
		return _addItem.call(this, $.extend({
			content: "",
			reminddate: ""
		}, data), focus);
	}

	$(planList).on({
		// 添加一行后，初始化日程提醒功能
		"itemadd": function(evt, data){
			var $item = data.item,
				$remindBtn = $(".remind-time-btn", $item);

			if(!$remindBtn.length) {
				return false;
			}

			$remindBtn.datepicker();
			$remindBtn.datepicker('setStartDate', new Date)
			.on("changeDate", function(evt) {
				var date = $.data(evt.target, "date");
				$remindBtn.css("display","none");

				$item.find(".rp-remind-bar").css("display", "inline-block").find('.remind-time').text(date);
				$item.find(".remind-value").val(date);
			});

			//给动态添加的行绑定删除提醒已选时间功能
			$(".o-close-small", $item).on("click",function(){
				var $elemParent = $(this).parent();
				$remindBtn.css("display", "inline-block");

				$item.find(".rp-remind-bar").css("display", "none");
				$item.find(".remind-value").val("");
			});		
		},

		"beforeitemremove": function(evt, data){
			data.item.find(".remind-time-btn").datepicker('destroy');
		}
	});

	var newPlan = Ibos.app.g("newPlan");
	// 编辑时，还原计划列表
	if(newPlan && newPlan.length) {
		$.each(newPlan, function(i, p){
			planList.addItem({
				content: p.content,
				reminddate: p.reminddate && p.reminddate != 0 ? Ibos.date.format(new Date(p.reminddate * 1000)) : ""
			}, true);
		});
	}
	planList.addItem();

	$("#rp_plan_add").on("click", $.proxy(planList.addItem, planList, null, true));


	//表单改动离开页面提示
	Ibos.checkFormChange("#report_form");


	// 编辑器初始化
	var ue = UE.getEditor('editor', {
		initialFrameWidth: 700,
		autoHeightEnabled:true,
		toolbars: UEDITOR_CONFIG.mode.simple
	});
	ue.addListener("contentchange", function(){
		$("#report_form").trigger("formchange");
	})


	// 上传事件初始化
	var attachUpload = Ibos.upload.attach({
		post_params: { module:'report' },
		custom_settings: {
			containerId: "file_target",
			inputId: "attachmentid"
		}
	});


	// 汇报对象
	var userData = Ibos.data.get("user");
	$("#rp_to").userSelect({
		data: userData,
		box: $("#rp_to_box"),
		type: "user"
	});


	$("#date_summary_start").datepicker({ target: $("#date_summary_end") });
	$("#date_plan_start").datepicker({ target: $("#date_plan_end") });


	// 根据某一日期获取某周期的起末
	var getPeriod = function(startDate, offset, type, intervals){
		offset = offset || 0;

		var mm = moment(startDate);
		var start, end;

		switch(type) {
			// 周
			case "0":
				mm.add(offset, "weeks");
				end = mm.clone().endOf("week").toDate();
				break;

			// 月
			case "1":
				mm.add(offset, "months");
				end = mm.clone().endOf("month").toDate();
				break;

			// 季
			case "2":
				// 调整至当前季开始的月份
				mm.add(offset * 3, "months");
				end = mm.clone().add(2, "months").endOf("month").toDate();
				break;

			// 半年
			case "3":
				// 调整至当前半年周期开始的月份
				mm.add(offset * 6, "months");
				end = mm.clone().add(5, "months").endOf("month").toDate();
				break;

			// 年
			case "4":
				mm.add(offset, "years");
				end = mm.clone().endOf("year").toDate();
				break;

			// 自定义
			default:
				mm.add(offset * intervals, "days");
				end = mm.clone().add(intervals, "days").toDate();
				break;
		}

		return {
			start: mm.toDate(),
			end: end
		}
	}

	// 设置时间段
	function setPeriod(start, end, param, dir){
		dir = dir || "next";
		
		// 获取对应的datetimepicker实例
		var $start = $(start),
			$end = $(end),
			startDp = $start.data("datetimepicker"),
			endDp = $end.data("datetimepicker"),
			startDate = $start.attr("data-value");

		var offset = (+$start.data("offset") || 0) + (dir == "next" ? 1 : -1),
			period = getPeriod(startDate, offset, param.type, +param.intervals);
		
		// 赋值并更改可选时间范围
		startDp.setEndDate(period.end);
		startDp.setLocalDate(period.start);
		endDp.setStartDate(period.start);
		endDp.setLocalDate(period.end);

		$start.data("offset", offset);
	}


	Ibos.evt.add({
		// 上一总结周期
		"prevSummaryDate": function(param){
			setPeriod("#date_summary_start", "#date_summary_end", param, "prev");
		},
		// 下一总结周期
		"nextSummaryDate": function(param){
			setPeriod("#date_summary_start", "#date_summary_end", param, "next");
		},
		// 上一计划周期
		"prevPlanDate": function(param){
			setPeriod("#date_plan_start", "#date_plan_end", param, "prev");
		},
		// 下一计划周期
		"nextPlanDate": function(param){
			setPeriod("#date_plan_start", "#date_plan_end", param, "next");
		}
	});
	
	// 防重复提交
	$("#report_form").on("submit", function(){
		if($.data(this, "submit")) {
			return false;
		}
		$.data(this, "submit", true);
	});
});