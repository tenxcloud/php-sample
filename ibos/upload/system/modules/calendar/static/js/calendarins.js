// 在日程模块下， evt大多代表的是日程任务，而不是js事件
// @Todo 实现更好的分离
var Cld = {
	themes: [ "#3497DB", "#A6C82F", "#F4C73B", "#EE8C0C", "#E76F6F", "#AD85CC", "#98B2D1", "#82939E"],
	DATE_FORMAT: "YYYY-M-DD",
	TIME_FORMAT: "HH:mm",
	DATETIME_FORMAT: "YYYY-M-DD HH:mm",

	detailMenu: new Ui.Menu($("<div></div>").appendTo(document.body), { 
		id: "cal_info_menu"
	}),

	showDetailMenu: function(evt, jsEvt){
		var _this = this;
		this._timer = setTimeout(function(){
			var typeLang = type = evt.type == "1" ? 
				"CAL.LOOP_TYPE" : 
				evt.acrossDay ? 
				"CAL.ACROSSDAY_TYPE" : 
				evt.allDay ? 
				"CAL.ALLDAY_TYPE" : 
				"CAL.NORMAL_TYPE";
			
			_this.detailMenu.setContent($.template("cal_info_menu_tpl", { 
				time: Cld.formatInterval(evt), 
				evt: evt.title,
				type: U.lang(typeLang)
			}));
			_this.detailMenu.show();
			_this.detailMenu.$menu.offset({
				top: jsEvt.pageY,
				left: jsEvt.pageX
			})
		}, 500);
	},

	hideDetailMenu: function(evt, jsEvt){
		var _this = this;
		clearTimeout(this._timer);
		// 如果鼠标进入菜单，则菜单不隐藏
		if($.contains(this.detailMenu.$menu[0], jsEvt.toElement)) {
			// 绑定一次性事件，从菜单回到原来日程时，也不
			this.detailMenu.$menu.one("mouseleave", function(e){
				if(!$.contains(jsEvt.currentTarget, e.toElement)) {
					_this.detailMenu.hide();
				}
			})
			return false;
		}
		this.detailMenu.hide();
	},

	// 将日程事件属性解析为ajax参数
	_parseEvtToParam: function(evt){
		var oldStartTime = (evt.prevStart ? evt.prevStart : evt.start).format(this.DATETIME_FORMAT) || null,
			oldEndTime = (evt.prevEnd ? evt.prevEnd : evt.end).format(this.DATETIME_FORMAT) || null;

		var ret = {
			calendarId: evt.id,
			CalendarTitle: evt.title,
			Subject: evt.title,
			CalendarStartTimeed: oldStartTime,
			CalendarEndTimeed: oldEndTime,
			Category: evt.category,
			IsAllDayEvent: +evt.allDay,
			type: evt.type,
			timezone: evt.start.zone()/-60
		}

		// 全天日程时，直接设置开始时分和结束时分为　"00:00:00"
		if(ret.IsAllDayEvent) {
			evt.start.hour(0).minute(0).second(0);
			ret.CalendarStartTime = evt.start.format(this.DATETIME_FORMAT);
			ret.CalendarEndTime = evt.end.format(this.DATETIME_FORMAT);
		// 非全天日程时，格式为 "yyyy-MM-dd HH:mm:ss"
		} else {
			// 从全天日程移动到普通日程时，evt里的 end 属性为 null 导致出错
			// 这是 fullcalendar1.1.0的bug，在新版本中已修复
			// 不过由于修改过大，目前没办法快速升级
			// 这里先使用 Hack 这种情况
			
			evt.end = evt.end || evt.start.clone().add(2, 'h');
			ret.CalendarStartTime = evt.start.format(this.DATETIME_FORMAT);
			ret.CalendarEndTime = evt.end.format(this.DATETIME_FORMAT);
		}

		return ret;
	},

	_parseDataToParam: function(evtData){
		var start = moment(evtData.start),
			end = moment(evtData.end);

		return {
			calendarId: evtData.id,
			CalendarTitle: evtData.title,
			Subject: evtData.title,
			CalendarStartTime: start.format(this.DATETIME_FORMAT),
			CalendarEndTime: end.format(this.DATETIME_FORMAT),
			Category: evtData.category,
			IsAllDayEvent: +evtData.allDay,
			type: evtData.type,
			timezone: start.zone()/-60
		}
	},

	formatInterval: function(evt){
		var LOCAL_DATE_FORMAT = U.lang("CAL.EVT_VIEW_FORMAT");
		return evt.acrossDay ?
			evt.start.format(LOCAL_DATE_FORMAT) + (evt.end ? " - " + evt.end.format(LOCAL_DATE_FORMAT) : "") :
			evt.allDay ? 
			evt.start.format(LOCAL_DATE_FORMAT) :
			evt.start.format(LOCAL_DATE_FORMAT) + " " + evt.start.format(this.TIME_FORMAT) + " - " + evt.end.format(this.TIME_FORMAT);
	},

	saveEvtPrevTime: function(evt){
		evt.prevStart = new moment(evt.start);
		evt.prevEnd = new moment(evt.end);
	},

	updateEvt: function(evt){
		Cldm.update(this._parseEvtToParam(evt), function(res){
			res.isSuccess && Ui.tip(U.lang("CAL.UPDATE_EVT_SUCCESS"));
			evt.prevStart = evt.prevEnd = null;
		});
	},

	removeEvt: function(evt, view, doption){
		var _this = this;
		doption = doption || "this"; // only after all
		Ui.confirm(U.lang("CAL.REMOVE_EVT_CONFIRM"), function(){			
			Cldm.remove({
				calendarId: evt.id,
				type: evt.type,
				doption: doption,
				CalendarStartTime: evt.start.format(_this.DATETIME_FORMAT)
			}, function(res) {
				var evts = view.calendar.clientEvents();
				var mid = evt.id.substr(11);
				// 删除所有的周期性日程
				if(doption === "all") {
					$.each(evts, function(i, e){
						if(e.id.length > 11 && e.id.substr(11) == mid && e.start >= evt.start) {
							view.calendar.removeEvents(e.id);
						}
					})
				}
				// 删除后续的周期性日程
				else if(doption === "after" ){
					$.each(evts, function(i, e){
						if(e.id.length > 11 && e.id.substr(11) == mid && e.start >= evt.start) {
							view.calendar.removeEvents(e.id);
						}
					})
				} else {
					view.calendar.removeEvents(evt.id);
				}
				res.isSuccess && Ui.tip(U.lang("CAL.REMOVE_EVT_SUCCESS"));
			})
		});
	},

	finishEvt: function(evt, view, callback){
		var param = this._parseEvtToParam(evt);
		if(evt.status == "1") {
			Cldm.unfinish(param, function(res){
				if(res.isSuccess) {
					evt.status = "0";
					evt.className = "";
					view.calendar.updateEvent(evt);
					callback && callback(evt);
				}
			});
		} else {
			Cldm.finish(param, function(res){
				if(res.isSuccess) {
					evt.status = "1";
					evt.className = "fc-event-finish";
					view.calendar.updateEvent(evt);
					callback && callback(evt);
				}
			});
		}
	},

	saveEvt: function(evt, view, callback){
		Cldm.update(this._parseEvtToParam(evt), function(res){
			if(res.isSuccess){
				view.calendar.updateEvent(evt);
				Ui.tip(U.lang("CAL.UPDATE_EVT_SUCCESS"));
			}
			callback && callback(res)
		})
	},

	createEvt: function(evt, view, callback){
		evt.allDay = evt.end.diff(evt.start, "day", true) >= 1;
		var param = this._parseEvtToParam(evt);

		Cldm.add(param, function(res){
			if(res.isSuccess) {
				evt.id = res.data + "";
				// view.calendar.renderEvent(evt, true)
				view.calendar.refetchEvents();
				Ui.tip(U.lang("CAL.NEW_EVT_SUCCESS"));
			}
			callback && callback(res);
		})
	},

	showDialog: function(evt, jsEvt, view, op){
		var _this = this,
			dialog,
			// 是否周期性日程
			isLoop = +(evt.id) < 0;
			// 时间区间
			interval = _this.formatInterval(evt);

		var $content = $.tmpl("cal_edit_tpl", {
			isNew: op === "new",
			isEdit: op === "edit",
			isLoopRemove: op === "loopRemove",
			interval: interval,
			status: evt.status,
			title: evt.title,
			color: evt.color
		});

		$content.bindEvents({
			// 删除日程
			"click [data-cal='remove']": function(){
				// 如果是周期性日程，则提供多种删除方式
				if(isLoop) {
					_this.showDialog(evt, jsEvt, view, "loopRemove");
				} else {
					_this.removeEvt(evt, view);
					dialog.close();
				}
			},
			// 完成、未完成
			"click [data-cal='finish']": function(){
				_this.finishEvt(evt, view, function(res){
					_this.showDialog(evt, jsEvt, view);
				});
			},
			// 编辑日程
			"click .cal-dl-content-body": function(){
				_this.showDialog(evt, jsEvt, view, "edit");
			},
			// 删除周期性日程
			"click [data-cal='removeLoop']": function(){
				var loopType = $.attr(this, "data-loop");
				_this.removeEvt(evt, view, loopType);
				dialog.close();
			},
			"click [data-cal='returnEdit']": function(){
				_this.showDialog(evt, jsEvt, view);
			},
			// 新建日程、编辑日程
			"click [data-cal='save']": function(){
				var title = $("textarea", $content).val();
				var color = $(".cal-dl-colorpicker", $content).attr("data-color");
				if($.trim(title) === ""){
					Ui.tip(U.lang("CAL.PLEASE_INPUT_EVENT"), "warning");
					return false;
				}
				evt.title = title;
				evt.color = color || _this.themes[0];
				evt.category = $.inArray(color, _this.themes);
				if(evt.id) {
					_this.saveEvt(evt, view, function(){
						dialog.close();
					});
				} else {
					_this.createEvt(evt, view, function(){
						dialog.close();
					});
				}
			}
		});
		
		Ui.closeDialog("d_calendar_edit");
		dialog = Ui.dialog({
			id: "d_calendar_edit",
			title: false,
			content: $content[0],
			init: function(){
				var _this = this,
					wrap = _this.DOM.wrap;

				// 可编辑时，初始化选色器，焦点聚到textarea
				if(op === "new" || op === "edit") {
					var $picker = $(".cal-dl-colorpicker", $content);
					$picker.colorPicker({
						data: Cld.themes,
						onPick: function(hex){
							$picker.css("background-color", hex).attr("data-color", hex);
						}
					});
					$("textarea", $content).focus();
				}

				wrap.offset({
					top: jsEvt.pageY - wrap.outerHeight() - 5,
					left: jsEvt.pageX - wrap.outerWidth()/2
				});

				$(document).off("mousedown.cal").on("mousedown.cal", function(e){
					// 点击在选色器范围内
					if($(e.target).closest("#jquery-colour-picker").length){
						return false;
					} 
					if(!$.contains(wrap[0], e.target)) {
						_this.close();
					}
				})
			},
			focus: false,
			resize: false,
			padding: "15px"
		});
	}
};

var Cldm = {
	parseEvtData: function(evts){
		return $.map(evts, function(evt){
			return $.extend(evt, {
				allDay: evt.allDay == "1",     // 是否全天日程
				acrossDay: evt.acrossDay == "1",  // 是否跨天日程
				color: Cld.themes[(evt.category != "-1" ? evt.category : 0)], // 主题
				editable: evt.editable == "1",   // 是否可编辑
				className: evt.status == "1" ? "fc-event-finish" : "",
			})
		});
	},
	getAll: function(param, callback){
		var mom = new moment();
		param = $.extend({
			timezone: mom.zone()/-60,
			uid: Ibos.app.g("calSettings").uid
		}, param);
		$.post(Ibos.app.url("calendar/schedule/index", {"op": "list"}), param, callback, "json");
	},
	add: function(param, callback){
		param = $.extend({
			timezone: (new moment).zone()/-60,
			Category: -1,
			IsAllDayEvent: 0,
			uid: Ibos.app.g("calSettings").uid
		}, param);

		$.post(Ibos.app.url("calendar/schedule/add"), param, callback, "json");
	},
	update: function(param, callback){
		param = $.extend({
			timezone: (new moment).zone()/-60,
			Category: -1,
			uid: Ibos.app.g("calSettings").uid
		}, param)
		$.post(Ibos.app.url("calendar/schedule/edit"), param, callback, "json");
	},
	remove: function(param, callback){
		$.post(Ibos.app.url("calendar/schedule/del"), $.extend({
			uid: Ibos.app.g("calSettings").uid
		}, param), callback, "json");
	},
	finish: function(param, callback){
		$.post(Ibos.app.url("calendar/schedule/edit", {"op": "finish"}), $.extend({
			uid: Ibos.app.g("calSettings").uid
		}, param), callback, "json");
	},
	unfinish: function(param, callback){
		$.post(Ibos.app.url("calendar/schedule/edit", {"op": "nofinish"}), $.extend({
			uid: Ibos.app.g("calSettings").uid
		}, param), callback, "json");
	}
};

var op ={
	getCalendarArray : function(param,callback){
		Cldm.getAll({ startDate: param.start, endDate: param.end, viewtype: param.type }, function(res){
			Ibos.app.s("calendarArray", res.events);
		var	calendarArray = Cldm.parseEvtData(res.events);
			callback(calendarArray);

		});
	},
	resetCalendarArray : function(array){
		var arryLength =  array.length,
			resetArray = [],
			data = {};
		for(var i = 0; i < arryLength; i++){
			var start = new moment(array[i].start).format("HH:MM"),
				end = new moment(array[i].end).format("HH:MM"),
				day = new moment(array[i].start).format("DD"),
				week = new moment(array[i].start).format("dddd"),
				yearAndMonth = new moment(array[i].start).format("YYYY-MM");
			data[i] = $.extend({}, array[i], {
				day: day,
				week: week,
				yearAndMonth: yearAndMonth,
				start: start,
				end: end
			})
			resetArray.push(data[i]);
		}
		return resetArray;
	},
	getEvt: function(id){
		var evtArr = Ibos.app.g("calendarArray");
		if(evtArr && evtArr.length) {
			return $.grep(evtArr, function(e){
				return e.id == id;
			})[0];
		}
	}
};

var calendar = {
	getNewTmpl : function($elem, start, end, type){
		if(type == "add"){
			var startDay = moment(start).add(1,"month").format("YYYY-MM-DD"),
				endDay = moment(end).add(1, "month").format("YYYY-MM-DD");
		}else if(type == "subtract"){
			var startDay = moment(start).subtract(1, "month").format("YYYY-MM-DD"),
				endDay = moment(end).subtract(1, "month").format("YYYY-MM-DD");
		}

		var param = {
			start : startDay,
			end : endDay,
			type : "month"
		},
		calendarData;

		op.getCalendarArray(param, function(res){
			calendarData = res;
			dataArray = op.resetCalendarArray(calendarData);
			var dataHtml = $.template("tpl_calender_list", {dataArray: dataArray});
			$(".cal-content").html(dataHtml);
			if(!dataArray.length){
				var $noDataTip = "<div class='no-data-tip'></div>";
				$(".calendar-list").after($noDataTip);
			}
		});
		return param;
	}
};

$(function(){
	var settings = {
		header: {
			left: "today hehe",
			center: "prev title next",
			right: "agendaDay,agendaWeek,month"
		},
		hiddenDays: Ibos.app.g("calSettings").hiddenDays,
		defaultView: "agendaWeek",//日历初始化时默认视图 agendaWeek（周视图）
		timezone: "local",
		scrollTime: "07:00:00",
		allDayText: "",//定义日历上方显示全天信息的文本
		lang: "zh-cn",
		axisFormat: "HH:mm",//设置日历agenda视图下左侧的时间显示格式，默认显示如：5:30pm
		editable: Ibos.app.g("calSettings").editable,//是否可编辑，即进行可拖动和缩放操作。
		selectable: Ibos.app.g("calSettings").addable,//是否允许用户通过单击或拖动选择日历中的对象，包括天和时间。
		select: function(smom, emom, jsEvt, view){
			// 选择区域跨的天数
			var days = emom.diff(smom, "day");
			Cld.showDialog({
				start: smom,
				end: emom,
				acrossDay: days > 1,
				allDay: days >= 1
			}, jsEvt, view, "new");
		},
		eventClick: function(evt, jsEvt, view){
			var editable = typeof evt.editable !== "undefined" ? evt.editable : Ibos.app.g("calSettings").editable;
			if(editable) {
				Cld.showDialog(evt, jsEvt, view);
			}
		},
		eventDragStart: function(evt, jsEvt, ui, view){
			Cld.saveEvtPrevTime(evt);
		},
		// revertFunc调用时，撤销修改
		eventDrop: function(evt, revertFunc, jsEvt, ui, view){
			Cld.updateEvt(evt);
		},
		eventResizeStart: function(evt, jsEvt, ui, view){
			Cld.saveEvtPrevTime(evt);
		},
		eventResize: function(evt, revertFunc, jsEvt, ui, view){
			Cld.updateEvt(evt);
		},
		eventMouseover: function(evt, jsEvt, view){
			Cld.showDetailMenu(evt, jsEvt)
		},
		eventMouseout: function(evt, jsEvt, view){
			Cld.hideDetailMenu(evt, jsEvt)
		},
		events: function(start, end, timezone, callback){
			var viewTypeMap = {
					"agendaDay": "day",
					"agendaWeek": "week",
					"month": "month"
				};

			Cldm.getAll({
				startDate: start.format(Cld.DATE_FORMAT),
				endDate: end.format(Cld.DATE_FORMAT),
				viewtype: viewTypeMap[this.getView().name],
			}, function(res){
				var data = Cldm.parseEvtData(res.events);
				callback(data);
			});
		}
	}
	if(Ibos.app.g("calSettings").minTime && Ibos.app.g("calSettings").minTime != 0) {
		settings.minTime = moment([1970, 0, 1, Ibos.app.g("calSettings").minTime, 0, 0]).format("HH:mm:ss");
	}
	if(Ibos.app.g("calSettings").maxTime && Ibos.app.g("calSettings").maxTime != 24) {
		settings.maxTime = moment([1970, 0, 1, Ibos.app.g("calSettings").maxTime, 0, 0]).format("HH:mm:ss");
	}

	$("#calendar").fullCalendar(settings);

	var settingBtn = $('<button class="btn">' + U.lang("SETTING") + '</button>');
	settingBtn.on("click", function(){
		var setupUrl = Ibos.app.url("calendar/schedule/edit", {op: "setup", random: Math.random()});
		var dialog = Ui.dialog({
			id: "d_cal_setup",
			title: U.lang("CAL.SET_INTERVAL"),
			ok: function(){
				var $form = this.DOM.content.find("form"),
					res = $form.serializeArray(),
					interval, 
					hiddenDays = [];

				$.each(res, function(i, v){
					if(v.name === "calviewinterval") {
						interval = v.value.split(",")
					} else if(v.name="calviewhiddenday"){
						hiddenDays.push(+v.value);
					}
				});
				 $.post(setupUrl, { formhash:Ibos.app.g("FORMHASH"), interval: interval, hiddenDays: hiddenDays }, function(){
					var ins = $("#calendar").data("fullCalendar");
					var view = ins.getView();
						name = view.name;
					ins.options.hiddenDays = hiddenDays;
					ins.options.minTime = Ibos.date.numberToTime(+interval[0]);
					ins.options.maxTime = Ibos.date.numberToTime(+interval[1]);
					view.name = "";
					ins.changeView(name);
					Ui.tip("@OPERATION_SUCCESS");
				 })
			},
			cancel: true,
			padding: "20px"
		});
		$.get(setupUrl, function(res){
			if(res.isSuccess){
				dialog.content(res.view);
			}
		});
	});
	$("#calendar .fc-header-left").append(settingBtn);

	var $listButton = $("<button class='btn cld-list-btn'><i class='o-cld-list'></i></button>");
	$listButton.on("click", function(){
		//将日程控件的内容隐藏，显示日程列表
		$(".fc-view").children().hide();
		$(".fc-view").append("<div class='cal-content'></div>")
		$(".fc-header-center").hide();
		$(".fc-button").removeClass("fc-state-active");

		var nowDate = new moment(),
			startDay = nowDate.date(1).format("YYYY-MM-DD"),
			endDay = nowDate.date(1).add(1, "month").subtract(1, "day").format("YYYY-MM-DD"),
			param = {
				start : startDay,
				end : endDay,
				type : "month"
			},
			calendarData = op.getCalendarArray(param, function(res){
				calendarData = res;
				var dataArray = op.resetCalendarArray(calendarData), 
					$calendarList = $.tmpl("tpl_calender_list", {dataArray: dataArray});
				$(".cal-content").append($calendarList);
				if(!res.length){
					var $noDataTip = "<div class='no-data-tip'></div>";
					$(".calendar-list").after($noDataTip);
				}
			});

		//设置时间范围
		$("#time_range").attr({
			"data-start": startDay,
			"data-end": endDay
		});
	});
	$("#calendar .fc-header-right").append($listButton);

	//点击日程类型(日，周，月)时，显示范围选择按钮
	$(".fc-button").on("click", function(){
		$(".fc-header-center").show();
		$(".fc-view").children().show();
		$(".cal-content").hide();
		$("#calendar").data("fullCalendar").refetchEvents();
	});

	Ibos.evt.add({
		//切换上下月操作
		"changeTime": function(param, elem){
			var $elem = $(elem),
				$range = $("#time_range"),
				start = $range.attr("data-start"),
				end = $range.attr("data-end"),
				type = $elem.attr("data-type");
			var param = calendar.getNewTmpl($elem, start, end, type);
			$range.attr({
				"data-start": param.start,
				"data-end": param.end
			});
		},
		//删除日程操作
		"deleteCal": function(param, elem){
			var $elem = $(elem),
				id = $elem.attr("data-id"),
				evt = op.getEvt(id),
				$range = $("#time_range"),
				start = $range.attr("data-start"),
				end = $range.attr("data-end"),
				param = Cld._parseDataToParam(evt),
				liLength = $(".calendar-list li").length-1;

			Cldm.remove(param, function(res){
				if(res.isSuccess){
					//重置存储的全局数据
					Cldm.getAll({ startDate: start, endDate: end, viewtype: "month" }, function(res){
						Ibos.app.s("calendarArray", res.events);
					});

					//改变视图
					var $calLi = $elem.parents("li"),
						$nextLi = $calLi.next();
					if($calLi.hasClass("diff-day") && $nextLi.hasClass("same-day")){
						$nextLi.removeClass("same-day").addClass("diff-day");
					}
					$calLi.remove();

					if(!liLength){
						var $noDataTip = "<div class='no-data-tip'></div>";
						$(".calendar-list").after($noDataTip);
					}

					Ui.tip("@OPERATION_SUCCESS");
				}
			});
		},
		//点击完成操作
		"finishCal": function(param, elem){
			var $elem = $(elem),
				id = $elem.attr("data-id"),
				evt = op.getEvt(id),
				$range = $("#time_range"),
				start = $range.attr("data-start"),
				end = $range.attr("data-end"),
				param = Cld._parseDataToParam(evt);

			Cldm.finish(param, function(res){
				if(res.isSuccess){
					//重置存储的全局数据
					Cldm.getAll({ startDate: start, endDate: end, viewtype: "month" }, function(res){
						Ibos.app.s("calendarArray", res.events);
					});

					//改变视图
					$elem.attr("data-action", "unfinishCal")
					.removeClass("o-ok").addClass("o-finish")
					.parents("li").eq(0).find(".fc-title").addClass("cal-finish");

					Ui.tip("@OPERATION_SUCCESS");		
				}
			});

		},
		//取消完成操作
		"unfinishCal": function(param, elem){
			var $elem = $(elem),
				id = $elem.attr("data-id"),
				evt = op.getEvt(id),
				$range = $("#time_range"),
				start = $range.attr("data-start"),
				end = $range.attr("data-end"),
				param = Cld._parseDataToParam(evt);
			Cldm.unfinish(param, function(res){
				if(res.isSuccess){
					//重置存储的全局数据
					Cldm.getAll({ startDate: start, endDate: end, viewtype: "month" }, function(res){
						Ibos.app.s("calendarArray", res.events);
					});

					//改变视图
					$elem.attr("data-action", "finishCal")
					.removeClass("o-finish").addClass("o-ok")
					.parents("li").eq(0).find(".fc-title").removeClass("cal-finish");

					Ui.tip("@OPERATION_SUCCESS");
				}
			});
		}
	});
});