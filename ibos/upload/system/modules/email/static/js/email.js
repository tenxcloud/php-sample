/**
 * email.js
 * 邮件模块JS
 * IBOS
 * Email
 * @author		inaki
 * @version		$Id$
 */

var Email = {
	op: {
		addWebMailBox: function(params) {
			return $.post(Ibos.app.url("email/web/add", { inajax: 1}), params, null, 'json')
			.done(function(res) {
				$(Email).trigger('addWebMailBox', {
					res: res,
					params: params
				});
			});
		}
	},

	getCheckedId: function() {
		return U.getCheckedValue("email");
	},
	select: function(selector) {
		var $cks = $("input[type='checkbox'][name='email']");
		$cks.each(function() {
			var $elem = $(this);
			$elem.prop('checked', $elem.is(selector)).label('refresh');
		});
	},
	refreshCounter: function() {
		$.post(Ibos.app.url('email/api/getCount'), function(res) {
			for (var prop in res) {
				if (res.hasOwnProperty(prop)) {
					if (res[prop] === 0) {
						$("[data-count='" + prop + "']").hide();
					} else {
						$("[data-count='" + prop + "']").html(res[prop]).show();
					}
				}
			}
		});
	},
	removeRows: function(ids) {
		var arr = ids.split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			$('#list_tr_' + arr[i]).remove();
		}
	},
	access: function(url, param, success, msg) {
		var emailIds = this.getCheckedId();
		var _ajax = function(url, param, success) {
			$.post(url, param, function(res) {
				if (res.isSuccess) {
					if (success && $.isFunction(success)) {
						success.call(null, res, emailIds);
					}
					Email.refreshCounter();
					Ui.tip(Ibos.l("OPERATION_SUCCESS"));
				} else {
					Ui.tip(res.errorMsg, 'danger');
				}
			});
		}
		if (emailIds !== '') {
			param = $.extend({emailids: emailIds}, param);
			if (msg) {
				Ui.confirm(msg, function() {
					_ajax(url, param, success);
				})
			} else {
				_ajax(url, param, success);
			}
		} else {
			Ui.tip(Ibos.l("SELECT_AT_LEAST_ONE_ITEM"), 'warning');
		}
	}
};


(function() {
	// 定时更新未读条数
	// setTimeout(Email.refreshCounter, 5000)


	var _moveToFolder = function(param) {
		Email.access(param.url, {fid: param.fid}, function(res, emailIds) {
			Email.removeRows(emailIds);
		});
	}

	// 自定义文件夹
	var folderList = {
		$container: $('[data-node-type="folderList"]'),
		_itemTpl: '<li data-node-type="folderItem" data-folder-id="<%=fid%>"><a href="<%=url%>" title="<%=text%>"><%=text%></a></li>',
		_formatData: function(data){
			return $.extend({ 
				url: '', 
				fid: '', 
				text: ''
			}, data)
		},
		addItem: function(data){
			return $.tmpl(this._itemTpl, this._formatData(data)).hide().appendTo(this.$container).fadeIn();
		},
		removeItem: function(fid){
			return this.$container.find('[data-node-type="folderItem"][data-folder-id="' + fid + '"]').fadeOut(function(){
				$(this).remove();
			});
		},
		updateItem: function(fid, data){
			return this.$container.find('[data-node-type="folderItem"][data-folder-id="' + fid + '"]')
			.replaceWith($.tmpl(this._itemTpl, this._formatData(data)))
		}
	}

	// “移动至”文件夹列表
	var moveTargetList = {
		$container: $('[data-node-type="moveTargetList"]'),
		_itemTpl: '<li data-node-type="moveTargetItem" data-id="<%=fid%>"><a href="javascript:;" data-click="moveToFolder" data-param="{&quot;fid&quot;:&quot;<%=fid%>&quot;,&quot;url&quot;: &quot;/?r=email/api/mark&amp;op=move&quot;}"><%=text%></a></li>',
		_formatData: function(data){
			return $.extend({ 
				fid: '', 
				text: ''
			}, data)
		},
		addItem: function(data){
			var $items = this.$container.find("li");
			return $.tmpl(this._itemTpl, this._formatData(data)).hide().insertBefore($items.eq(-1)).fadeIn();
		},
		removeItem: function(fid){
			return this.$container.find('[data-node-type="moveTargetItem"][data-id="' + fid + '"]').fadeOut(function(){
				$(this).remove();
			});
		},
		updateItem: function(fid, data){
			return this.$container.find('[data-node-type="moveTargetItem"][data-id="' + fid + '"]')
			.replaceWith($.tmpl(this._itemTpl, this._formatData(data)))
		}
	}

	var eventHandler = {
		"click": {
			// 切换 抄送、密送、外部收件人显隐状态
			"toggleRec": function(elem, param) {
				var $target = $("#" + param.targetId), $input = $("#" + param.inputId), value = $input.val();
				if (value === "0") {
					$input.val("1");
					$target.show();
				} else {
					$input.val("0");
					$target.hide();
				}
			},
			// 切换发送人详细信息
			"toggleSenderDetail": function(elem, param) {
				var $elem = $(elem),
						$brief = $("#" + param.briefId),
						$detail = $("#" + param.detailId),
						speed = 200;

				if ($(elem).hasClass("active")) {

					$detail.slideUp(speed, function() {
						$brief.show();
						$elem.removeClass("active");
					});

				} else {
					$brief.hide(0, function() {
						$detail.slideDown(speed);
						$elem.addClass("active");
					})
				}
			},
			// 发送快捷回复
			"sendQuickReply": function(elem, param) {
				var $content = $("#" + param.targetId), content = $content.val();
				if ($.trim(content) === "") {
					Ui.tip(Ibos.l('EM.INPUT_REPLY'), 'danger');
				} else {
					$.post(param.url, {
						content: content,
						formhash: param.formhash,
						islocal: 1
					}, function(res) {
						if (res.isSuccess) {
							Ui.tip(Ibos.l("REPLY_SUCCESS"), 'success');
							$content.val('');
						} else {
							Ui.tip(res.errorMsg, 'danger');
						}
					}, 'json');
				}
			},
			// 删除一封邮件，需要传入邮件id，及删除操作的Url地址
			"deleteOneEmail": function(elem, param) {
				var msg = Ibos.l("EM.DELETE_EMAIL_CONFIRM"), data = {}, url = param.url;
				if (param.emailids && param.url) {
					$.post(url, param, function(res) {
						if (res.isSuccess) {
							window.location.href = res.url;
						} else {
							Ui.tip(res.errorMsg, 'danger');
						}
					}, 'json');
				} else {
					Ui.tip(Ibos.l('PARAM_ERROR'), 'danger');
				}
			},
			// 切换是否标记为待办
			"toggleMark": function(elem, param) {
				var $elem = $(elem), toMark = $elem.hasClass("o-unmark");
				$elem.hide().parent().append($('#img_loading').clone().show());
				$.post(param.url, {ismark: toMark}, function(data) {
					if (data.isSuccess) {
						$elem.attr({
							'class': (toMark ? 'o-mark' : 'o-unmark')
						}).show().next('img').remove();
						Email.refreshCounter();
					} else {
						Ui.tip(data.errorMsg, 'danger');
					}
				},'json');
			},
			// 增加外部邮箱
			"addWebMail": function(elem, param) {
				function validate() {
					if ($.trim($("#mal").val()) === "") {
						$("#mal").blink().focus();
						return false;
					}
					if (!U.regex($("#mal").val(), "email")) {
						Ui.tip(Ibos.l("EM.INCORRECT_EMAIL_ADDRESS"), "warning");
						$("#mal").blink().focus();
						return false;
					}
					if ($.trim($("#pwd").val()) === "") {
						$("#pwd").blink().focus();
						return false;
					}
					return true;
				}

				$.artDialog({
					title: Ibos.l("EM.ADD_WEB_MAIL"),
					id: "d_new_web_mail",
					padding: "0 0",
					init: function() {
						var api = this;
						$.get(Ibos.app.url("email/web/add", { inajax: 1}), function(res) {
							res && api.content(res);
						});
					},
					ok: function() {
						if(!validate()) {
							return false;
						}
						var dialog = this;
						var $form = $("#add_form").waiting(Ibos.l("EM.BEING_VALIDATED"), "mini", true);

						Email.op.addWebMailBox($form.serializeObject())
						.done(function(res) {
							$form.stopWaiting();
							// 需要更多信息
							if (typeof res.moreinfo !== "undefined") {
								dialog.content(res.content);
								return false;
							}

							// 添加成功
							if(res.isSuccess == 1) {
								Ui.tip(res.msg);
								dialog.close();
							} else {
								Ui.tip(res.msg, "danger");
							}
						});

						return false;
					},
					cancel: true
				});
			},
			// 设置默认外部邮箱
			"setDefaultWebMailBox": function(elem, param) {
				var isDefault = $.attr(elem, "data-isDefault");
				// 已经是默认外部邮箱时，直接返回
				if (isDefault === "1") {
					return false;
				}
				if (param.id && param.url) {
					$.post(param.url, {webid: param.id}, function(res) {
						if (res.isSuccess) {
							Ui.tip(Ibos.l("SETUP_SUCCEESS"));
							$("[data-click='setDefaultWebMailBox']").each(function() {
								$(this).attr({
									"data-isDefault": "0",
									"title": Ibos.l("EM.SET_DEFAULT")
								}).text(Ibos.l("EM.SET_DEFAULT")).removeClass("active");
							});
							$(elem).text(Ibos.l("CM.DEFAULT")).attr("title", Ibos.l("CM.DEFAULT")).addClass("active");
						} else {
							Ui.tip(res.errorMsg, 'danger');
						}
					});
				} else {
					Ui.tip(Ibos.l("PARAM_ERROR"),'danger');
				}
			},
			// 删除外部邮箱
			"deleteWebMailBox": function(elem, param) {
				var ids = Email.getCheckedId();
				Email.access(param.url, {webids: ids}, function(res, ids) {
					Email.removeRows(ids);
				}, Ibos.l("EM.DELETE_EMAILBOX_CONFIRM"));
			},
			// 处理回执
			"receipt": function(elem, param) {
				$.get(param.url, {emailids: param.id}, function(res) {
					if (res.isSuccess) {
						$(elem).parent().parent().remove();
					} else {
						data.msg && Ui.tip(data.msg, "danger");
						// 报错
					}
				});
			},
			"receiveMail": function(elem, param) {
				$('.page-list').waiting(Ibos.l("EM.BEING_RECEIVE") + param.name + '...', 'mini', true);
				$.get(param.url, function(data) {
					$('.page-list').stopWaiting();
					if (data.isSuccess) {
						alert(Ibos.l('EM.RECEIVE_SUCCESS_TIP'));
						window.location.reload();
					} else {
						Ui.tip(data.msg, "danger");
					}
				}, 'json');
			},
			//设置所有为已读
			"markReadAll": function(elem, param) {
				$.post(param.url, function(res) {
					if (res.isSuccess === true) {
						Ui.tip(Ibos.l("OPERATION_SUCCESS"));
						window.location.reload();
					} else {
						Ui.tip(res.errorMsg, 'danger');
					}
				});
			},
			//移动至文件夹
			"moveToFolder": function(elem, param) {
				_moveToFolder(param);
			},
			// 移动至新建文件夹
			"moveToNewFolder": function(elem, param) {
				var emailIds = Email.getCheckedId();
				if (emailIds !== "") {
					Ui.dialog({
						title: Ibos.l("EM.NEW_DIR_AND_MOVE"),
						content: '<input type="text" placeholder="' + Ibos.l("EM.INPUT_DIR_NAME") + '" id="new_folder">',
						id: 'd_myfolder_new_and_move',
						width: 400,
						ok: function() {
							var folderName = $('#new_folder').val();
							if ($.trim(folderName) !== '') {
								$.post(param.newUrl, {name: folderName}, function(res) {
									if (res.isSuccess) {
										param.fid = res.fid;
										_moveToFolder(param);
									}
								});
							} else {
								Ui.tip(Ibos.l("EM.INPUT_DIR_NAME"), 'danger');
								return false;
							}
						}
					});
				} else {
					Ui.tip(Ibos.l("SELECT_AT_LEAST_ONE_ITEM"), 'warning');
				}
			},
			// 恢复已删除邮件
			"restore": function(elem, param) {
				Email.access(param.url, null, function(res, emailIds) {
					Email.removeRows(emailIds);
				});
			},
			//
			"del": function(elem, param) {
				Email.access(param.url, null, function(res, ids) {
					Email.removeRows(ids);
				}, Ibos.l("EM.DELETE_EMAIL_CONFIRM"));
			},
			"deleteWebMail": function(elem, param) {
				Email.access(param.url, null, function(res, ids) {
					Email.removeRows(ids);
				}, Ibos.l("EM.DELETE_WEBEMAIL_CONFIRM"));
			},
			'replyAll': function(elem, param) {
				if (param.isSecretUser) {
					Ui.confirm(Ibos.l("EM.SCRECT_USER_REPLY"), function() {
						window.location.href = param.url;
					});
				} else {
					window.location.href = param.url;
				}
			},
			"erase": function(elem, param) {
				Email.access(param.url, null, function(res, ids) {
					Email.removeRows(ids);
				}, Ibos.l("EM.CP_DELETE_EMAIL_CONFIRM"));
			},
			"eraseOneEmail": function(elem, param){
				Ui.confirm(Ibos.l("EM.CP_DELETE_EMAIL_CONFIRM"), function() {
					$.post(param.url, null, function(res) {
						if(res.isSuccess){
							Ui.tip(Ibos.l("OPERATION_SUCCESS"), 'success');
							window.location.href = Ibos.app.url("email/list/index", {op: "del"});
						} else {
							Ui.tip(res.errorMsg, 'warning');
						}
					});
				});
			},
			// 标为已读
			"markRead": function(elem, param) {
				Email.access(param.url, null, function(res, ids) {
					var arr = ids.split(",");
					for (var i = 0, len = arr.length; i < len; i++) {
						$('#list_tr_' + arr[i]).children().eq(1).empty();
					}
				});
			},
			// 标为未读
			"markUnread": function(elem, param) {
				Email.access(param.url, null, function(res, ids) {
					var arr = ids.split(",");
					for (var i = 0, len = arr.length; i < len; i++) {
						$('#list_tr_' + arr[i]).children().eq(1).html('<i class="o-mal-new"></i>');
					}
				});
			},
			// 批量标记为待办
			"mark": function(elem, param) {
				Email.access(param.url, {ismark: 'true'});
			},
			// 批量取消待办
			"unmark": function(elem, param) {
				Email.access(param.url, {ismark: 'false'}, function(res, ids) {
					Email.removeRows(ids);
				});
			},
			// 撤回
			"recall": function(elem, param) {
				Email.access(param.url, null, function(res, ids) {
					Email.removeRows(ids);
				});
			},
			"showRow": function(elem, param) {
				$(elem).hide();
				$("#" + param.targetId).show();
			},
			// 反选
			"selectReverse": function() {
				Email.select(":not(:checked)");
			},
			// 附件
			"selectAttach": function() {
				Email.select("[data-attach='1']");
			},
			// 未读
			"selectUnread": function() {
				Email.select("[data-read='0']");
			},
			// 已读
			"selectRead": function() {
				Email.select("[data-read='1']");
			},
			"setupFolder": function(elem, param) {
				Ui.dialog({
					title: Ibos.l("EM.MY_FOLDER_SETUP"),
					id: 'd_myfolder_setup',
					padding: "0 0",
					init: function() {
						var api = this;
						$.post(param.url, function(res) {
							res && api.content(res);
						});
					},
					ok: false,
					cancel: true,
					cancelVal: Ibos.l('CLOSE')
				});
			},
			// 修改文件夹
			"editFolder": function(elem) {
				var $elem = $(elem), $row = $elem.parent().parent(), $cells = $row.find("td"),
					sort = $cells.eq(0).html(), name = $cells.eq(1).html();
				$row.data({
					"sort": sort,
					"name": name
				})
				$cells.eq(0).html('<input type="text" name="sort" class="input-small" size="2" value="' + (sort || "") + '">');
				$cells.eq(1).html('<input type="text" name="name" class="input-small" value="' + (name || "") + '">');
				$elem.attr('data-click', 'saveFolder').html(Ibos.l("SAVE")).next().attr('data-click', 'cancelFolderEdit').html(Ibos.l("CANCEL"));
			},
			// 取消文件夹修改
			'cancelFolderEdit': function(elem) {
				var $elem = $(elem), $row = $elem.parent().parent(), $cells = $row.find("td");
				$cells.eq(0).html($row.data("sort") || "");
				$cells.eq(1).html($row.data("name") || "");

				$row.removeData("sort name")
				$elem.attr("data-click", "deleteFolder").html(Ibos.l("DELETE")).prev().attr("data-click", "editFolder").html(Ibos.l("EDIT"));
			},
			// 保存文件夹修改
			'saveFolder': function(elem, param) {
				var $elem = $(elem), $row = $elem.parent().parent(), $cells = $row.find("td");
				var rowData = $row.find("input").serializeArray(), postData = {};
				if ($.trim(rowData[0].value) === "") {
					$cells.eq(0).find("input").blink();
				} else if ($.trim(rowData[1].value) === "") {
					$cells.eq(1).find("input").blink();
				} else {
					postData.fid = param.fid;
					postData[rowData[0].name] = rowData[0].value;
					postData[rowData[1].name] = rowData[1].value;
					$.post(param.saveUrl, postData, function(res) {
						if (res.isSuccess) {
							$cells.eq(0).html(rowData[0].value);
							$cells.eq(1).html(rowData[1].value);
							$elem.attr('data-click', 'editFolder').html(Ibos.l("EDIT")).next().attr('data-click', 'deleteFolder').html(Ibos.l("DELETE"));
							// 更新侧栏对应文件夹信息
							folderList.updateItem(param.fid, {
								fid: param.fid,
								text: rowData[1].value,
								url: Ibos.app.url('email/list/index', { op: 'folder', fid: res.fid })
							});
							// 更新“移动至”列表
							moveTargetList.updateItem(param.fid, {
								fid: param.fid,
								text: rowData[1].value
							})
						} else {
							Ui.tip(res.errorMsg, 'danger');
						}
					}, 'json');
				}
			},
			// 删除文件夹
			"deleteFolder": function(elem, param) {
				Ui.dialog({
					id: 'd_folder_delete',
					width: 300,
					title: Ibos.l("EM.DELETE_DIR"),
					content: '<h5 class="mbs">' + Ibos.l("EM.DELETE_DIR_CONFIRM") + '</h5><label for="clean_mail" class="checkbox"><input type="checkbox" id="clean_mail" />' + Ibos.l("EM.DELETE_DIR_TIP") + '</label>',
					init: function() {
						$("#clean_mail").label();
					},
					ok: function() {
						var toCleanMail = $('#clean_mail').prop('checked');
						$.post(param.delUrl, {fid: param.fid, delemail: +toCleanMail}, function(res) {
							if (res.isSuccess) {
								// 移除一行
								$(elem).parent().parent().fadeOut(function(){ 
									$(this).remove();
								});
								// 移除侧栏对应文件夹
								folderList.removeItem(param.fid);
								// 移除“移到至”对应项
								moveTargetList.removeItem(param.fid);
							} else {
								Ui.tip(res.errorMsg, 'danger');
							}
						}, 'json');
					}
				});
			},
			// 增加文件夹
			"addFolder": function(elem, param) {
				var $elem = $(elem), $row = $elem.parent().parent(), 
					$table = $row.parent().prev(), 
					$cells = $row.find("td");

				var rowData = $row.find("input").serializeArray(), postData = {};

				if ($.trim(rowData[0].value) === "") {
					$cells.eq(0).find("input").blink();
				} else if ($.trim(rowData[1].value) === "") {
					$cells.eq(1).find("input").blink();
				} else {
					postData[rowData[0].name] = rowData[0].value;
					postData[rowData[1].name] = rowData[1].value;

					$.post(param.addUrl, postData, function(res) {
						if (res.isSuccess) {
							// 插入一行
							$.tmpl("add_folder_tpl", $.extend({
								fid: res.fid
							}, postData)).appendTo($table).hide().fadeIn();
							// 清空
							$cells.eq(0).find("input").val("");
							$cells.eq(1).find("input").val("");

							// 增加侧栏文件夹
							folderList.addItem({ 
								fid: res.fid,
								text: rowData[1].value,
								url: Ibos.app.url('email/list/index', { op: 'folder', fid: res.fid })
							})
							// 增加“移动至”项
							moveTargetList.addItem({ 
								fid: res.fid,
								text: rowData[1].value
							})
						} else {
							Ui.tip(res.errorMsg, 'danger');
						}
					}, 'json');
				}
			}
		},
		"focus": {
			// 快捷回复
			"flexArea": function(elem, param) {
				var $elem = $(elem), $target = $("#" + param.targetId);
				$(elem).animate({"height": "100px"}, 100);
				$target.show();
			}
		},
		"blur": {
			// 快捷回复
			"flexArea": function(elem, param) {
				var $elem = $(elem), $target = $("#" + param.targetId);
				if ($.trim($elem.val()) === "") {
					setTimeout(function() {
						$elem.animate({"height": ""}, 100);
						$target.hide();
					}, 200);
				}
			}
		},
		"change": {
			"subop": function(elem, url) {
				window.location.href = url + '&' + $.param({subop: $(elem).val()});
			}
		}
	};

	var _trigger = function(elem, type) {
		var prop = "data-" + type, name = $.attr(elem, prop), param;
		if (eventHandler[type][name] && $.isFunction(eventHandler[type][name])) {
			param = $(elem).data("param");
			eventHandler[type][name].call(eventHandler[type], elem, param);
		}
	};

	$(document).on("click", "[data-click]", function() {
		_trigger(this, "click");
	}).on("focus", "[data-focus]", function() {
		_trigger(this, "focus");
	}).on("blur", "[data-blur]", function() {
		_trigger(this, "blur");
	}).on("change", "[data-change]", function() {
		_trigger(this, "change");
	}).ready(function() {
		setTimeout(function() {
			var loopCount = '';
			var getCount = function() {
				Email.refreshCounter();
			};
			loopCount = setInterval(getCount, 10000); //10秒轮询一次
			getCount();
		}, G.settings.notifyInterval);
	});
})();



$(function(){

	Ibos.evt.add({
		"toggleSidebarList": function(param, elem){
			$(elem).toggleClass("active").parent().next().toggle();
		}
	});

});