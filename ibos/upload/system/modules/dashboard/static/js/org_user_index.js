/**
 * Dashboard/user/index
 */

$(document).ready(function() {

	// 接
	if (U.getCookie('hooksyncuser') == '1') {
		parent.Ui.openFrame(U.getCookie('syncurl'), {
			title: U.lang("ORG.SYNC_USER"),
			cancel: true
		});
		U.setCookie('hooksyncuser', '');
		U.setCookie('syncurl', '');
	}
	//搜索
	$("#mn_search").search();

	//初始化上传
	Ibos.upload.attach({
		post_params: {module: 'dashboard'},
		file_types: "*.xls; *.xlsx;",
		file_upload_limit: 1,
		custom_settings: {
			containerId: "file_target",
			inputId: "attachmentid"
		}
	});

	Ibos.evt.add({
		"setUserStatus": function(param, elem) {
			var uid = U.getCheckedValue("user");
			if (!uid) {
				Ui.tip(U.lang("SELECT_AT_LEAST_ONE_ITEM"), "warning");
				return false;
			}
			$("#org_user_table").waiting(null, "normal");
			$.get(Ibos.app.url('dashboard/user/edit'), {op: param.op, uid: uid}, function(res) {
				$("#org_user_table").waiting(false);
				if (res.isSuccess) {
					Ui.tip(U.lang("OPERATION_SUCCESS"));
					window.location.reload();
				} else {
					Ui.tip(res.msg, "danger");
				}
			}, 'json');
		},
		"exportUser": function() {
			var uid = U.getCheckedValue("user");
			if (!uid) {
				Ui.tip(U.lang("SELECT_AT_LEAST_ONE_ITEM"), "warning");
				return false;
			}
			window.location.href = Ibos.app.url('dashboard/user/export', {uid: encodeURI(uid)});
		},
		"batchImport": function(param, elem) {
			var dialog = Ui.dialog({
				title: "批量导入新成员",
				id: "import_dialog",
				padding: 0,
				width: "480px",
				height: "382px",
				lock: true,
				content: document.getElementById("batch_import_dialog"),
				init: function() {
					$("#batch_result_wrap").hide();
					$("#batch_import_wrap").show();
					$("#attachmentid").val("");
					$("#download_error_info").attr("href", "");
					$("#file_target").children().remove();
				},
				close: function() {
					window.location.reload();
				}
			});
		},
		"closeDialog": function(param, elem) {
			var dialog = Ui.dialog.get("import_dialog");
			dialog.close();
			window.location.reload();
		},
		"againImport": function(param, elem) {
			var dialog = Ui.dialog.get("import_dialog");
			dialog.DOM.title.html("批量导入新成员");
			$("#batch_result_wrap").hide();
			$("#batch_import_wrap").show();
			$("#attachmentid").val("");
			$("#download_error_info").attr("href", "");
			$("#file_target").children().remove();
		},
		"importExel": function(param, elem) {
			var dialog = Ui.dialog.get("import_dialog"),
					attachmentid = $("#attachmentid").val(),
					$wrap = $("#upload_wrap");
			if (attachmentid) {
				var param = {aid: attachmentid},
				url = Ibos.app.url('dashboard/user/import', {'op': 'import'});
				$wrap.waiting(null, "mini", "normal");
				$.post(url, param, function(res) {
					if (true) {
						var url = res.url,
								success = res.successCount,
								failure = res.errorCount;
						$wrap.waiting(false);
						dialog.DOM.title.html("导入结果");
						if (failure == 0) {
							$('#download_error_info').hide();
							$('#download_error_tip').hide();
						}else{
							$('#download_error_info').show();
							$('#download_error_tip').show();
						}
						$("#batch_result_wrap").show();
						$("#batch_import_wrap").hide();
						$("#download_error_info").attr("href", url);
						$("#import_success").html(success);
						$("#import_failure").html(failure);
					} else {
						$wrap.waiting(false);
						Ui.tip("导入失败,请重新导入", "danger");
					}
				});
			} else {
				Ui.tip("请选择导入文件", "warning");
			}
		},
		// 查看上下级关系
		"checkRelationship": function(param, elem) {
			var url = Ibos.app.url('dashboard/user/relation');
			var dialog = Ui.dialog({
				title: "查看上下级关系",
				id: "r_dialog",
				padding: 0,
				lock: true,
				width: "560px"
			});
			$.get(url)
			.done(function(res){
				dialog.content(res.html);
			})
		}
	});


	var ztreeOpt = {
		"addDiyDom": function(treeId, treeNode) {
			var aObj = $("#" + treeNode.tId + "_a");
			var optBtn ="<span class='utree-opt-wrap'>" + 
							"<a href='" + Ibos.app.url('dashboard/department/edit', {'op': 'get', 'id': treeNode.deptid}) + "' title='编辑部门信息' class='o-org-ztree-edit opt-btn opt-edit-btn'></a>" +
							"<a href='javascript:;' title='删除部门' class='o-org-ztree-del opt-btn opt-del-btn' data-action='delZtreeNode' data-deptname='" + treeNode.deptname + "' id='" + treeNode.deptid + "'></a>" +
						"</span>";

			aObj.append(optBtn);

			//绑定删除节点操作
			$("#utree").on("click", ".opt-del-btn", function(evt) {
				var $tree = $("#utree"),
						treeObj = $.fn.zTree.getZTreeObj("utree"),
						$this = $(this),
						id = $.attr(this, "id"),
						name = $this.attr("data-deptname");
				Ui.confirm("确定删除" + name + "?", function() {
					var node = treeObj.getNodesByParamFuzzy("id", id, null);
					param = {id: id},
					url = Ibos.app.url('dashboard/department/del');
					$tree.waiting(null, 'mini', 'normal');
					$.post(url, param, function(res) {
						if (res.isSuccess) {
							treeObj.removeNode(node[0]);
							Ui.tip(res.msg);
							$tree.waiting(false);
						} else {
							Ui.tip(res.msg, "danger");
							$tree.waiting(false);
						}
					});
				});
				evt.stopPropagation();
			});

			//阻止点击编辑跳转时的冒泡事件
			$("#utree").on("click", ".opt-edit-btn", function(evt) {
				evt.stopPropagation();
			});
		},
		"zTreeOnDrop": function(event, treeId, treeNodes, targetNode, moveType) {
			var node = treeNodes[0],
					tid = node.tId,
					index = $("#" + tid).index(),
					id = node.id,
					pid;
			if (moveType == "inner") {
				pid = targetNode ? targetNode.id : 0;
			} else {
				pid = targetNode ? targetNode.pid : 0;
			}
			var param = {id: id, pid: pid, index: index},
			url = Ibos.app.url('dashboard/department/edit', {'op': 'structure'});
			$.post(url, param, function(res) {
				if (res.isSuccess) {
					Ui.tip("操作成功");
				} else {
					Ui.tip("操作失败", "danger");
					window.location.reload();
				}
			});
		},
		"nodeOnClick": function(event, treeId, treeNode) {
			var url = treeNode.url;
			window.location.href = url;
		},
		"getFontCss": function(treeId, treeNode) {
			return (!!treeNode.highlight) ? {"font-weight": "700"} : {"font-weight": "normal"};
		},
		"selectAuxiliaryNode": function(array){
			var treeObj = $.fn.zTree.getZTreeObj("utree");
			for(var i = 0; i < array.length; i++){
				var node = treeObj.getNodesByParam("id", array[i], null);
				if(node.length){
					node[0].highlight = true;
					treeObj.updateNode(node[0]);		
				}
			}
		}
	}


	// 初始化右栏树
	var settings = {
		data: {
			simpleData: {enable: true}
		},
		view: {
			showLine: false,
			selectedMulti: false,
			showIcon: false,
			addDiyDom: ztreeOpt.addDiyDom,
			fontCss: ztreeOpt.getFontCss
		},
		edit: {
			enable: true,
			drag: {
				isCopy: false,
				isMove: true
			}
		},
		callback: {
			onDrop: ztreeOpt.zTreeOnDrop,
			onClick: ztreeOpt.nodeOnClick
		}
	},
	$tree = $("#utree");
	$tree.waiting(null, 'mini');
	$.get(Ibos.app.url('dashboard/user/index', {'op': 'tree'}), function(data) {
		var selectedDeptId = Ibos.app.g("selectedDeptId");
		$.fn.zTree.init($tree, settings, data);
		$tree.waiting(false);
		var treeObj = $.fn.zTree.getZTreeObj("utree");

		var auxiliaryId = Ibos.app.g("auxiliaryId");
		ztreeOpt.selectAuxiliaryNode(auxiliaryId);

		// 有catid才初始化选中
		if (selectedDeptId && selectedDeptId > 0) {
			var treeObj = $.fn.zTree.getZTreeObj("utree");
			var node = treeObj.getNodeByParam("id", selectedDeptId, null);
			treeObj.selectNode(node);
		}
	}, 'json');

	/**
	 * 编辑总公司
	 */
	$("#edit_corporation").on("click", function(evt) {
		evt.preventDefault();
		var url = $(this).data("url");
		window.location.href = url;
	});

});