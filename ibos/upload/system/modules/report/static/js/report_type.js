/**
 * reportType.js
 * 总结计划--汇报类型设置
 * IBOS
 * Report
 * @author		gzhzh
 * @version		$Id$
 */

(function() {
	var typeTableInited = false;
	var typeTable =  {
		el: "#rp_type_table",

		template: "rp_type_tpl",

		init: function(){
			var that = this;

			this.$el = $(this.el);

			this.$el.bindEvents({
				"click .o-plus": function(){
					var formData = that.$el.find("tfoot input, tfoot select").serializeArray();
					that.addType(U.serializedToObject(formData));
				},

				"click [data-click='removeType']": function(){
					that.removeType($.attr(this, "data-id"));
				},

				"click [data-click='editType']": function(){
					that.editType($.attr(this, "data-id"));
				},

				"click [data-click='saveType']": function(){
					that.updateType($.attr(this, "data-id"));
				},

				"click [data-click='cancelEdit']": function(){
					that.cancelEdit($.attr(this, "data-id"));
				},

				// 区间改变，如果值为“其他”，显示天数框，否则隐藏
				"change [name='intervaltype']": function(){
					$(this).next().toggle(this.value == "5");
				}
			});

			this.$el.on("validerror", function(evt, data){
				var $elem = $('[name="' + data.name + '"]', data.context || $(this).find("tfoot"));

				$elem.blink().focus();
				
				Ui.tip(data.msg, "warning");
			});
		},

		// 验证信息的有效性
		validTypeData: function(data, context){
			var errorInfo = null;
			// 序号不为空
			if($.trim(data.sort) === "") {
				errorInfo = {
					name: "sort",
					msg: "@RP.SORT_CAN_NOT_BE_EMPTY"
				};
			// 序号必须为数字
			} else if(!U.isPositiveInt(data.sort)) {
				errorInfo = {
					name: "sort",
					msg: "@RP.SORT_ONLY_BE_POSITIVEINT"
				};
			// 类型名不为空
			} else if($.trim(data.typename) === "") {
				errorInfo = {
					name: "typename",
					msg: "@RP.TYPENAME_CAN_NOT_BE_EMPTY"
				};
			// 自定义区间周期
			} else if(data.intervaltype == "5") {
				// 区间天数不为空
				if($.trim(data.intervals) === "") {
					errorInfo = {
						name: "intervals",
						msg: "@RP.INTERVALS_CAN_NOT_BE_EMPTY"
					}
				// 区间天数必须为数字
				} else if(!U.isPositiveInt(data.intervals)) {
					errorInfo = {
						name: "intervals",
						msg: "@RP.INTERVALS_ONLY_BE_POSITIVEINT"
					}
				}
			}

			if(errorInfo) {
				errorInfo.source = data;
				errorInfo.context = context;
				this.$el.trigger("validerror", errorInfo);
				return false;
			}

			return true;
		},

		// 添加汇报类型
		addType: function(data){
			var that = this;

			if(this.validTypeData(data)) {
				$.post(Ibos.app.url('report/type/add'), { typeData: data }, function(res) {
					var $item;
					// AJAX成功后，返回数据，添加一行
					if (res.isSuccess === true) {
						$item = $.tmpl(that.template, res).hide().appendTo(that.$el.find("tbody")).fadeIn();
						that.$el.trigger("addType", { data: res, $item: $item });
						Ui.tip(res.msg);
					} else {
						Ui.tip(res.msg, 'danger');
					}
				}, 'json');
			}
		},

		// 移除汇报类型
		removeType: function(id){
			var that = this;

			Ui.confirm(Ibos.l('RP.SURE_DEL_REPORT_TYPE'), function(){
				$.post(Ibos.app.url('report/type/del'), { typeid: id }, function(res) {
					// AJAX成功后，移除一行
					if (res.isSuccess === true) {
						var $item = that.$el.find("tr[data-id='" + id + "']").fadeOut(function(){
							$(this).remove();	
						});
						that.$el.trigger("removeType", {
							id: id,
							$item: $item
						})
						Ui.tip(res.msg, 'success');
					} else {
						Ui.tip(res.msg, 'danger');
					}
				}, 'json');
				
			});
		},

		// 进入编辑状态
		editType: function(id){
			var $row = this.$el.find("tr[data-id='" + id + "']");
			var data = { typeid: id };

			$row.find("[data-name]").each(function(){
				data[$.attr(this, "data-name")] = $.attr(this, "data-value");
			});

			// 将原本的节点备份并替换成编辑状态
			var $newRow = $.tmpl("rp_type_edit_tpl", data);
			$newRow.data("oldRow", $row);

			$row.replaceWith($newRow);
		},

		// 更新类型数据
		updateType: function(id){
			var that = this;
			var $row = this.$el.find("tr[data-id='" + id + "']");
			var data = U.serializedToObject($row.find("select, input").serializeArray());

			if(this.validTypeData(data, $row)) {
				$.post(Ibos.app.url('report/type/edit'), {
					typeid: id,
					typeData: data
				}, function(res) {
					// AJAX成功后，返回数据，添加一行
					if (res.isSuccess === true) {
						var $item = $.tmpl(that.template, res).hide().replaceAll($row).fadeIn();
						that.$el.trigger("updateType", { id: id, data: res, $item: $item });
						Ui.tip(data.msg);
					} else {
						Ui.tip(data.msg, "danger");
					}
				}, "json");
			}
		},

		// 取消编辑
		cancelEdit: function(id) {
			var $row = this.$el.find("tr[data-id='" + id + "']");
			var $oldRow = $row.data("oldRow");
			
			if($oldRow) {
				$row.removeData("oldRow");
				$row.replaceWith($oldRow);
			}
		}
	};

	function initTypeTable(){
		if(!typeTableInited) {
			typeTable.init();
			var sideTypeList = new Ibos.CmList("#rp_type_aside_list", {
				tpl: "rp_type_sidebar_tpl"
			})

			typeTable.$el.on({
				"addType": function(evt, evtData){
					sideTypeList.addItem(evtData.data);
				},
				"updateType": function(evt, evtData){
					sideTypeList.updateItem(evtData.id, evtData.data);
				},
				"removeType": function(evt, evtData){
					sideTypeList.removeItem(evtData.id);
				}
			});

			typeTableInited = true;
		}
	}

	// 汇报类型设置
	$("#rp_type_setup").on("click", function() {
		Ui.dialog({
			title: Ibos.l('RP.REPORT_TYPE_SETTING'),
			id: "report_type_dialog",
			content: Dom.byId("d_report_type"),
			init: initTypeTable,
			ok: false,
			cancel: true,
			cancelVal: Ibos.l("CLOSE"),
			padding: 0
		});
	});
})();