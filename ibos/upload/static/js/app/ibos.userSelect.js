(function(){
	/**
	 * 选择框弹出窗的类
	 * @class SelectBox
	 * @uses $.fn.label    label插件
	 * @uses $.fn.zTree    zTree插件
	 * @todo   是否增加一些自定义回调函数
	 * @param  {Jquery}    $element            要初始化的宿主
	 * @param  {Key-Value} options             配置
	 * @param  {Array}     options.navSettings 导航栏配置
	 * @param  {Array}     options.data        数据
	 * @param  {Array}     options.values      默认值
	 * @return {Object}                        SelectBox实例对象
	 */
	var SelectBox = function($element, options) {
		if(!Ibos || !Ibos.data){
			$.error("(SelectBox): 未定义数据Ibos.data");
		}
		this.$element = $element;
		this.options = $.extend(true, {}, SelectBox.defaults, options);

		this.hasInit = false;
		this.currentType = "";
		this.currentId = "";
		this.values = this.options.values;
		this._init();
	}
	/**
	 * SelectBox默认配置
	 * @property defaults 
	 * @type {Object}
	 */
	SelectBox.defaults = {
		data: [],
		navSettings: [{
				// id: "select_box_department",
				icon: "select-box-department",
				text: U.lang("US.PER_DEPARTMENT"),
				data: Ibos.data && Ibos.data.get("department") || [],
				type: "department"
			}, {
				// id: "select_box_position",
				icon: "select-box-position",
				text: U.lang("US.PER_POSITION"),
				data: Ibos.data && (Ibos.data.get("position").concat(Ibos.data.get("positioncategory"))) || [],
				type: "position"
			},
			{
				// id: "select_box_contact",
				icon: "select-box-contact",
				text: U.lang("US.CONTACT"),
				data: Ibos.data && Ibos.data.get("contact") || [],
				type: "contact"
			}
		],
		values: [],
		// 只可选用户
		// userOnly: false
		// maximumSelectionSize: 1, // 最大选项数只能在type 为 "user" 下使用
		type: "all" //"user" "position" "department"
	}
	/**
	 * SelectBox语言包
	 * @property lang
	 * @type {Object}
	 */

	SelectBox.zIndex = 7000;
	SelectBox.prototype = {
		constructor: SelectBox,
		/**
		 * 初始化
		 * @method _init
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_init: function() {
			this._createSelectBox();
		},
		/**
		 * 创建选择窗
		 * @method _createSelectBox
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_createSelectBox: function() {
			var //$selectBox = $("#select_box"),
			hasInit = this.$element.attr("data-init") === "1",
				lang = SelectBox.lang,
				selectBoxTpl;
			if (!hasInit) {
				selectBoxTpl = [
					// '<div id="select_box" class="select-box">',
					'	<div class="select-box-header">',
						'		<ul class="select-box-nav"></ul>',
						'	</div>',
						'	<div class="select-box-mainer">',
						'		<div class="select-box-mainer-inner scroll">',
						'			<div class="select-box-area">',
						'				<div class="select-box-area-header">' + U.lang("US.SELECT_ALL"),
						'					<label class="checkbox pull-right"><input type="checkbox" data-type="checkall"/></label>',
						'				</div>',
						'				<div class="select-box-area-mainer">',
						'					<ul class="select-box-list"></ul>',
						'				</div>',
						'			</div>',
						'		</div>',
						'		<div class="select-box-mainer-aside scroll"></div>',
						'	</div>',
					// '</div>'
				].join("");
				this.$element.addClass("select-box").attr("data-init", "1").append(selectBoxTpl).css("z-index", SelectBox.zIndex++)
				.mousedown(function(evt){ evt.stopPropagation()});
				this._initSelectBox();
			}
			return this;
		},
		/**
		 * 初始化选择窗
		 * @method _initSelectBox
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_initSelectBox: function() {
			// @Todo: 让其可配置
			var settings = this.options.navSettings,
				type = this.options.type,
				// 有右侧栏
				userSelectable = (type === "all" || type === "user"); 

			this.$header = this.$element.find(".select-box-header");
			this.$nav = this.$header.find(".select-box-nav");
			this.$mainer = this.$element.find(".select-box-mainer");
			this.$aside = this.$mainer.find(".select-box-mainer-aside");
			this.$inner = this.$mainer.find(".select-box-mainer-inner");
			this.$checkbox = this.$inner.find(".select-box-area-header input").label();
			this.$list = this.$inner.find(".select-box-list")

			for (var i = 0, len = settings.length; i < len; i++) {
				var setting = settings[i];
				// 只输出对应选择方式的导航
				if(userSelectable || type === setting.type){
					this._createNavItem(setting);
					this._createTree(setting.type, setting.data);
				}
			}
			// 当可选择用户时，需要绑定导航切换事件及列表刷新事件
			if(userSelectable){
				this._bindChangeEvent();
				this._bindNavEvent();
			// 否则，隐藏右侧栏
			}else{
				this.$inner.hide();
			}
			this.setNav(0)
		},

		_getListItems: function(){
			var vals = [];
			this.$list.find("input[type='checkbox']").each(function(){
				vals.push(this.value);
			})
			return vals;
		},

		_getListChecked: function(){
			var checkeds = [];
			this.$list.find("input[type='checkbox']").each(function(){
				checkeds.push(this.value);
			})
			return checkeds;
		},
		/**
		 * 绑定右侧复选框change时的事件
		 * @method _bindChangeEvent
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_bindChangeEvent: function() {
			var that = this;
			this.$inner.on("change", "input[type='checkbox']", function(evt) {
				var results = [],
					$checkbox = $(this),
					type = $checkbox.attr("data-type"), //此属性用于判断此复选框是否全选
					isChecked = $checkbox.prop("checked"),
					val = $checkbox.val();
				// 当点击了全选框时
				if (type && type === "checkall") {
					if (isChecked) {
						that.checkListCheckbox();
						$checkbox.label("check");
					} else {
						
						that.uncheckListCheckbox();
						$checkbox.label("uncheck");
					}
					results = that._getListItems();
				} else {
					if(isChecked){
						that.addValue(val)
					}else{
						that.removeValue(val)
					}
					results.push(val);
				}
				$(that).trigger("slblistchange", { values: results, checked: isChecked })
				evt.stopPropagation();
			});
			return this;
		},

		/**
		 * 修改复选框的状态, 全选或全取消选择
		 * @_toggleListCheckboxes
		 * @param  {String} toCheck true为选中， false为取消选中
		 * @private
		 * @return {Array}      发生改变的复选框值
		 */
		_toggleListCheckboxes: function(toCheck) {
			var that = this;

			this.$list.find("input[type='checkbox']").each(function() {
				var val = this.value;
				if(toCheck){
					that.addValue(val);
				}else{
					that.removeValue(val)
				}
			});
			that.refreshList();
		},
		/**
		 * 全选
		 * @method checkListCheckbox
		 * @return {[type]} 发生改变的值
		 */
		checkListCheckbox: function() {
			this._toggleListCheckboxes(true);
		},
		/**
		 * 全不选
		 * @method uncheckListCheckbox
		 * @return {[type]} 发生改变的值
		 */
		uncheckListCheckbox: function() {
			this._toggleListCheckboxes(false);
		},
		/**
		 * 绑定导航点击事件
		 * @method _bindNavEvent
		 * @private
		 * @chainable
		 * @return {Objec} 当前调用对象
		 */
		_bindNavEvent: function() {
			var that = this;
			this._unBindNavEvent();
			this.$nav.on("click.userSelect.nav", "li", function() {
				var index = $(this).index();
				that.setNav(index);
				return false;
			});
			return this;
		},
		/**
		 * 解绑导航点击事件
		 * @method _unBindNavEvent
		 * @private
		 * @chainable
		 * @return {Objec} 当前调用对象
		 */
		_unBindNavEvent: function(){
			this.$nav.off("click.userSelect.nav");
			return this;
		},
		/**
		 * 创建导航项
		 * @method _createNavItem
		 * @private
		 * @chainable
		 * @param  {Key-Value} setting 配置
		 * @param  {String} settings.type 导航项的标识，相当于ID
		 * @param  {String} settings.icon 图标样式类
		 * @param  {String} settings.data 用于生成树的数据
		 * @param  {String} settings.text 导航项的文本
		 * @return {Objec}         当前调用对象
		 */
		_createNavItem: function(setting) {
			// if (this.options.type === "all" || this.options.type === setting.type) {
				var tpl = '<li data-type="' + setting.type + '"><a href="javascript:;"><i class="' + setting.icon + '"></i><span>' + setting.text + '</span></a></li>';
			// }
			this.$nav.append(tpl);
			return this
		},
		/**
		 * 创建树
		 * @method _createTree
		 * @private
		 * @chainable
		 * @param  {String} type 与导航项对应的标识
		 * @param  {Array}  data 用于生成树的数据
		 * @return {Object}      当前调用对象
		 */
		_createTree: function(type, data) {
			//@Debug
			if (!$.fn.zTree) {
				$.error("(UserSelect): 缺少zTree组件")
			}
			if (!data || !$.isArray(data)) {
				data = [];
			}
			var that = this,
				treeidPrefix = this.$element[0].id,
				lastChecked = null,
				treeClick = function(evt, treeid, node) {
					var type = that.options.type,
						userSelectable = (type === "user" || type === "all");
					// 当用户可选择时，点击树项为刷新右侧列表
					if(userSelectable){
						that.currentId = node.id;
						that.refreshList(node.id);
					// 否则，为选中该项
					}else{
						// 排除不可选中的项
						if(!node.nocheck){
							if (node.checked) {
								that.removeValue(node.id);
								node.checked = false;
								lastChecked = null;
							} else {
								// 当超过最大可选数时，取消上一个选中的项，加入当前选中的项
								if(that.options.maximumSelectionSize && that.options.maximumSelectionSize <= that.values.length){
									if(lastChecked){
										that._checkNode(lastChecked.id, false);
									}
								}
								that.addValue(node.id);
								node.checked = true;
								lastChecked = node;
							}
						}
					}
				},
				treeCheck = function(evt, treeid, node) {
					// 排除不可选中的项
					if(!node.nocheck){
						if (!node.checked) {
							that.removeValue(node.id);
							lastChecked = null;
						} else {
							// 当超过最大可选数时，取消上一个选中的项，加入当前选中的项
							if(that.options.maximumSelectionSize && that.options.maximumSelectionSize <= that.values.length){
								if(lastChecked){
									that._checkNode(lastChecked.id, false);
								}
							}
							that.addValue(node.id);
							lastChecked = node;
						}
					}
				},
				treeSetting = {
					check: {
						enable: true,
						chkboxType: {
							"Y": "",
							"N": ""
						}
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						onClick: treeClick,
						onCheck: treeCheck
					},
					view: {
						showLine: false,
						showIcon: false,
						selectedMulti: false
					}
				},
				$tree = $('<ul id="' + treeidPrefix + '_' + type + '_tree" class="ztree user-ztree"></ul>');
			if(this.options.type === "user"){
				treeSetting.check.enable = false;
			}
			this.$aside.append($tree);
			$.fn.zTree.init($tree, treeSetting, data);
			return this;
		},
		/**
		 * 设置当前导航，相当于tab功能
		 * @method setNav 
		 * @param  {Number} index 导航项下标
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		setNav: function(index) {
			var items = this.$nav.find("li"),
				trees = this.$aside.find(".ztree"),
				fixNumber = function() {
					if (index > items.length - 1) {
						index = 0;
					} else if (index < 0) {
						index += items.length;
						fixNumber();
					}
				},
				currentTree,
				currentZTreeObj,
				currentSelected,
				currentSelectedId;
			this.currentId = "";
			if (typeof index === "number") {
				fixNumber();
				this.currentType = items.removeClass("active").eq(index).addClass("active").attr("data-type");
				currentTree = trees.hide().eq(index).show();
				// 常用联系人
				if(index == 2) {
					this.refreshList("contact");
					this.refreshCheckbox();
					return true;
				}
				// 根据当前树选中的节点ID刷新列表
				currentZTreeObj = $.fn.zTree.getZTreeObj(currentTree[0].id);
				currentSelected = currentZTreeObj.getSelectedNodes()[0];
				currentSelectedId = (currentSelected && currentSelected.id) || "";
				this.refreshList(currentSelectedId);
				this.refreshCheckbox();
			} else {
				this.setNav(0);
			}
		},
		/**
		 * 根据id刷新右侧列表
		 * @method refreshList
		 * @param  {String} id 目标id
		 * @return {Object}    当前调用对象
		 */
		refreshList: function(id) {
			var contact = this.options.contact,
				data = this.options.data,
				type = this.currentType,
				isChild = false;
			id = id || this.currentId || "";
			this.clearList();
			// @Debug: Hack, 列出所有人员，临时使用
			if(id === "c_0") {
				for(var i = 0; i < data.length; i++) {
					if(data[i].type === "user") {
						this.$list.append(this._createListItem(data[i]));
					}
				}
				return this;
			// @Hack: 常用联系人
			} else if(id === "contact" && contact && contact.length) {
				for(i = 0; i < data.length; i++) {
					if($.inArray(data[i].id, contact) !== -1) {
						this.$list.append(this._createListItem(data[i]));
					}
				}
				this.currentId = "contact";
				return this;
			}

			for (var i = 0; i < data.length; i++) {
				// isChild 为 true时，当前data项为 目标id对应项的子项，会出现在右侧列表
				if(!data[i]){
					continue;
				}
				isChild = data[i][type] && $.inArray(id, data[i][type].split(",")) !== -1;
				if (isChild) {
				// if (data[i][type] === id) {
					var $item = this._createListItem(data[i]);
					this.$list.append($item);
				}
			}
			return this;
		},
		/**
		 * 获取当前显示的树
		 * @method _getCurrentTree 
		 * @param  {String} type 导航标识
		 * @return {Objec}       当前调用对象
		 */
		_getCurrentTree: function(type) {
			type = type || this.currentType;
			var treeidPrefix = this.$element[0].id,
				treeid = treeidPrefix + "_" + type + "_tree",
				treeObj = $.fn.zTree.getZTreeObj(treeid);
			return treeObj || null;
		},
		/**
		 * 根据ID选中或取消左侧项的选中
		 * @method _checkNode
		 * @private
		 * @chainable
		 * @param  {String} id       数据id
		 * @param  {boolean} toCheck 是否选中
		 * @return {Object}          当前调用对象
		 */
		_checkNode: function(id, toCheck, slient) {
			var type = this.currentType,
				values = this.values,
				treeObj = this._getCurrentTree(),
				treeNode;
			toCheck = typeof toCheck === 'undefined' ? true : toCheck;
			if (id) {
				treeNode = treeObj.getNodeByParam("id", id);
				if(treeNode !== null){
					treeObj.checkNode(treeNode, toCheck, false);
				}
			}
			if(!slient) {
				$(this).trigger("slbchange", { id: id, checked: toCheck });
			}
		},
		/**
		 * 更新对应标识下，整体的checkbox状态
		 * @method refreshCheckbox
		 * @chainable 
		 * @param  {String} [type] 导航项标识，不存在此参数时，设置为此前标识 
		 * @return {Object}        当前调用对象
		 */
		refreshCheckbox: function(type) {
			type = type || this.currentType;
			var values = this.values,
				treeObj = this._getCurrentTree(type);
			treeObj.checkAllNodes(false)
			for (var i = 0, len = values.length; i < len; i++) {
				this._checkNode(values[i], true);
			}
			return this
		},
		/**
		 * 创建列表项
		 * @method _createListItem
		 * @private
		 * @param  {Key-Value} data 列表项数据
		 * @return {Jquery}      列表项jq对象
		 */
		_createListItem: function(data) {
			var itemTpl,
				$item, 
				$input;
			itemTpl = '<li class="' + (data.online === '1' ? "online" : "offline") + '">' +
						'<label class="checkbox ">' +
							'<input type="checkbox" value="' + data.id + '"/>' +
							'<img src="' + data.imgUrl + '" />' + 
							'<span>' + data.text + '</span>' + 
						'</label>'+
					'</li>';
			$item = $(itemTpl);
			$input = $item.find("input").label();
			// 已经被选中时
			if ($.inArray(data.id, this.values) !== -1) {
				$input.label("check")
			}
			return $item;
		},
		/**
		 * 清空列表
		 * @method clearList
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		clearList: function() {
			var items = this.$list.find("li");
			items.each(function() {
				$(this).find("input").removeData().end().remove();
			});
			this.$checkbox.label("uncheck");
			return this
		},
		/**
		 * 修改当前选中值
		 * @method setValue
		 * @param  {String||Array} val 一个或一组有效值
		 * @return {Array}     已选中的值
		 */
		setValue: function(val) {
			this.values = $.isArray(val) ? val : [val];
			this.refreshList();
			this.refreshCheckbox();
			return this.values;
		},

		/**
		 * 增加选中值
		 * @method addValue
		 * @param  {String||Array} val 一个或一组有效值
		 * @return {Array}     已选中的值
		 */
		addValue: function(val) {
			// 若传入数组，则循环迭代
			if ($.isArray(val)) {
				for (var i = 0, len = val.length; i < len; i++) {
					this.addValue(val[i])
				}
			} else {
				// 如果 val 还未被增加 且 此前允许增加， 且推入values数组
				if ($.inArray(val, this.values) === -1) {
					// 验证是否超过选项最大长度，超过时替代最后一个值
					if(!this.options.maximumSelectionSize || this.values.length < this.options.maximumSelectionSize){
						this.values.push(val);
						this._checkNode(val, true);
					}else{
						this.values.splice(this.values.length - 1, 1, val);
						this._checkNode(val, true);
						this.refreshList();
					}
				}
			}
			return this.values;
		},
		/**
		 * 删除已选中值
		 * @method removeValue
		 * @param  {String||Array} val 一个或一组有效值
		 * @return {Array}     已选中的值
		 */
		removeValue: function(val) {
			var index;
			// 若传入数组，则循环迭代
			if ($.isArray(val)) {
				for (var i = 0, len = val.length; i < len; i++) {
					this.removeValue(val[i])
				}
			} else {
				index = $.inArray(val, this.values);
				if (index !== -1) {
					this.values.splice(index, 1);
					this._checkNode(val, false);
				}
			}
			return this.values;
		},
		/**
		 * 显示选人窗
		 * @method show
		 * @chainable
		 * @param  {Function} callback 回调
		 * @return {Object}            当前调用对象
		 */
		show: function(callback) {
			this.$element.show();
			// this.refreshList();
			callback && callback.call(this, this.$element);
		},
		/**
		 * 隐藏选人窗
		 * @method hide
		 * @chainable
		 * @param  {Function} callback 回调
		 * @return {Object}            当前调用对象
		 */
		hide: function(callback) {
			this.$element.hide();
			callback && callback.call(this, this.$element);
		},
		/**
		 * 执行options中定义的回调函数
		 * @param  {String} name 函数名
		 * @return {Object}      当前调用对象
		 */
		_trigger: function(name /*,...*/ ) {
			var argu = Array.prototype.slice.call(arguments, 1);
			if (this.options[name] && typeof this.options[name] === "function") {
				this.options[name].apply(this, argu);
			}
			return this;
		}
	}

	$.fn.selectBox = function(options) {
		var argu = Array.prototype.slice.call(arguments, 1);
		return this.each(function() {
			var $el = $(this),
				data = $el.data("selectBox");
			if (!data) {
				$el.data("selectBox", data = new SelectBox($el, options))
			} else {
				if (typeof options === "string" && $.isFunction(data[options])) {
					data[options].apply(data, argu)
				}
			}
		})
	}



	/**
	 * 用户选择
	 * @class UserSelect
	 * @uses $.fn.select2  select2插件
	 * @uses PinyinEngine  pinyinEngine插件
	 * @uses SelectBox     选择框弹窗的类
	 * @param  {Jquery}    $element     选择框对应jq对象
	 * @param  {Key-value} options      配置，具体参考Select2
	 *     @param  {Jquery}    options.box      弹窗对应jq对象
	 *     @param  {Array}     options.contacts 常用联系人数组
	 * @return {Object}                 UserSelect实例对象
	 */
	var UserSelect = function($element, options) {
		// @Debug:
		if (!Ibos || !Ibos.data) {
			throw new Error("(SelectBox): 未找到全局数据Ibos.data")
		}
		var initialValue = $element.val();

		this.$element = $element;
		if(!this.$element.get(0).id){
			this.$element.attr("id", "userselect_" + U.uniqid());
		}
		this.options = options;
		if(!this.options.box || !this.options.box.length) {
			this.options.box = $("#" + $element[0].id + "_box");
			if(!this.options.box.length) {
				this.options.box = $('<div id="' + $element[0].id + '_box"></div>').appendTo(document.body);
			}
		}
		this.btns = [];
		this.values = [];
		if ($.trim(initialValue)) {
			this.values = initialValue.split(",");
		}
		this.data = this._cleanData(this.options.data);
		this._init();
	}
	/**
	 * UserSelect默认配置
	 * @property defaults
	 * @type {Object}
	 */

	UserSelect.showAllBox = function(){
		$(".select-box").show();
		$(".operate-btn .glyphicon-user").parent().addClass("active");
		// $(".operate-btn").has("glyphicon-user").addClass("active");

	}
	UserSelect.hideAllBox = function(){
		$(".select-box").hide();
		$(".operate-btn.active .glyphicon-user").parent().removeClass("active");
	}

	UserSelect.prototype = {
		constructor: UserSelect,
		/**
		 * 初始化
		 * @method _init
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_init: function() {
			var boxSelector = "";

			this._createSelect();
			// 配置了box属性并拥有长度时，假设其为一个jq对象

			if(!this.options.box){
				boxSelector = this.$element.attr("data-box");
				this.options.box = $(boxSelector);
			}

			if (this.options.box && this.options.box.length) {
				this._createSelectBox();
			}
			return this
		},
		_cleanData: function(data){
			var ret = [];
			if(!data || !data.length) {
				return ret;
			} else {
				for(var i = 0; i < data.length; i++) {
					if(data[i] != null) {
						ret.push(data[i])
					}
				}
			}
			return ret;
		},
		/**
		 * 创建Select2实例
		 * @method _createSelect
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_createSelect: function() {
			var that = this,
				lang = UserSelect.lang,
				formatResult = function(data, $ct) {
					var $results = that.$element.data().select2.results,
						type = data.id.charAt(0), //类别，c => company, u => user, d => department, p => position;

						hasBuildTip = $results.find(".select2-tip").length > 0,
						tipTpl = '<li class="select2-tip">' + U.lang("US.INPUT_TIP") + '</li>',

						hasBuildCompany = $results.find(".select2-tip").length > 0,
						companyTpl = '<li class="select2-company">' + U.lang("COMPANY") + '</li>',

						hasBuildUser = $results.find(".select2-user").length > 0,
						userTpl = '<li class="select2-user">' + U.lang("STAFF") + '</li>',

						hasBuildDepartment = $results.find(".select2-department").length > 0,
						departmentTpl = '<li class="select2-department">' + L.DEPARTMENT + '</li>',

						hasBuildPosition = $results.find(".select2-position").length > 0,
						positionTpl = '<li class="select2-position">' + U.lang("POSITION") + '</li>';
					// Tips
					if (!hasBuildTip) {
						$results.append(tipTpl)
					}
					// Company
					if (!hasBuildCompany && type === "c") {
						$results.append(companyTpl);
					}
					// User
					if (!hasBuildUser && type === "u") {
						$results.append(userTpl);
					}
					// Department
					if (!hasBuildDepartment && type === "d") {
						$results.append(departmentTpl);
					}
					// Position
					if (!hasBuildPosition && type === "p") {
						$results.append(positionTpl);
					}
					return data.text
				},
				formatSelection = function(data, $ct) {
					var type = data.id.charAt(0),
						typeMap = {
							c: "company",
							d: "department",
							p: "position",
							u: "user"
						}
					text = '<i class="select2-icon-' + typeMap[type] + '"></i>' + data.text;
					return text
				},
				formatNoMatches = function() {
					return U.lang("US.NO_MATCH");
				},
				formatSelectionTooBig = function(limit){
					return U.lang("US.SELECTION_TO_BIG", { limit: limit});
				},
				initSelection = function(element, callback) {
					var data = [];
					$(element.val().split(",")).each(function() {
						// 将字符串对象转为原始类型
						var id = this + "",
							text = that._getText(id);
						data.push({
							id: id,
							text: text
						});
					});
					callback(data);
				},
				query = function(query) {
					var data = {
						results: []
					}, i;
					// 提供拼音搜索功能
					query.matcher = function(term, text) {
						var textArr = pinyinEngine.toPinyin(text, false)
						var termArr = term.split("");
						for (var i = 0; i < termArr.length; i++) {
							var inside = false;
							//假设使用首字母拼音搜索
							for (var j = 0; j < textArr.length; j++) {
								if (textArr[j][i] && textArr[j][i].charAt(0) == termArr[i]) {
									inside = true;
								}
							}
							//假设全拼或完全匹配
							if (!inside) {
								text += "," + pinyinEngine.toPinyin(text, false, ",");
								return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
							}
						}
						return true;
					};
					for (i = 0; i < that.data.length; i++) {
						if (that.data[i].enable) {
							var match = query.matcher(query.term, that.data[i].text);
							if (match) {
								data.results.push({
									id: that.data[i].id,
									text: that.data[i].text
								});
							}
						}
					}
					query.callback(data);
				},
				getPlaceholder = function(type){
					type = type || "all";
					return U.lang("US.PLACEHOLDER_" + (type ? type.toUpperCase() : ""));
				},
				select2Defaults = {
					width: "100%",
					formatResult: formatResult,
					formatSelection: formatSelection,
					formatSelectionTooBig: formatSelectionTooBig,
					formatNoMatches: formatNoMatches,
					initSelection: initSelection,
					placeholder: getPlaceholder(this.options.type),
					query: query
				},
				select2Options = $.extend({}, select2Defaults, this.options);

			this.$element.select2(select2Options).on("change", function(evt, data) {
				if(evt.added && evt.added.id) {
					that.addValue(evt.added.id);
				} else if(evt.removed && evt.removed.id) {
					that.removeValue(evt.removed.id);
				}
			});
			this.select = this.$element.data("select2")
			this._initSelectOperate()
		},

		/**
		 * 创建SelectBox实例
		 * @method _createSelectBox
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_createSelectBox: function() {
			var that = this,
				options = this.options;

			this.selectBox = new SelectBox(options.box, {
				contact: that.options.contact,
				data: that.data,
				values: [].concat(that.values),
				type: that.options.type,
				maximumSelectionSize: this.options.maximumSelectionSize
			});

			$(this.selectBox).on("slbchange", function(evt, data){
				if(data.checked) {
					that.addValue(data.id);
				} else {
					that.removeValue(data.id);
				}
			})

			this.selectBox.hide();
			return this;
		},
		/**
		 * 初始化操作层，默认会创建控件弹窗的按钮
		 * @method _initSelectOperate
		 * @private
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		_initSelectOperate: function() {
			var that = this,
				options  = this.options,
				$operateWrap = this._createSelectOperate(),
				setPosition = function($el) {
					var select2Obj = that.select,
						select2Container = select2Obj.container,
					// 当定义relative属性且指一个JQ对象时，则相对该JQ对象定位，否则相对select2Container;
						relative = (options.relative && options.relative.length) ? options.relative : select2Container;
					$el.position($.extend({
						of: relative
					}, options.position))
				},
				openBoxBtnOption = {
					handler: function($btn) {
						// 打开弹窗选择器时，关闭下拉列表
						that.$element.select2("close");
						if ($btn.hasClass("active")) {
							that.selectBox && that.selectBox.hide();
							$btn.removeClass("active")
						} else {
							UserSelect.hideAllBox();
							that.selectBox && that.selectBox.show(function($el) {
								setPosition($el);
							});
							$btn.addClass("active")
						}
					}
				},
				clearBtnOption = {
					cls: "operate-btn",
					iconCls: "glyphicon-trash",
					handler: function(){
						that.setValue();
					}
				}
				// 弹出框按钮
				$openBoxBtn = this._createOperateBtn(openBoxBtnOption);
				$clearBtn = this._createOperateBtn(clearBtnOption);
			$operateWrap.append($openBoxBtn);

			if(options.clearable) {
				$operateWrap.append($clearBtn)
			}
		},
		/**
		 * 创建一个操作按钮
		 * @method _createOperateBtn
		 * @private
		 * @param {Key-Value} options         按钮配置
		 * @param {String}    options.cls     按钮对应样式类名
		 * @param {String}    options.iconCls 按钮对应图标的样式类名
		 * @param {Function}  options.handler 按钮点击时的处理函数
		 * @return {Jquery}                   生成的Jq对象
		 */
		_createOperateBtn: function(options) {
			var that = this,
				defaults = {
					cls: "operate-btn",
					iconCls: "glyphicon-user"
				},
				opt = $.extend({}, defaults, options),
				$btn = $('<a href="javascript:;" class="' + opt.cls + '"></a>'),
				iconTpl = '<i class="' + opt.iconCls + '"></i>';
			$btn.html(iconTpl)
			if (typeof opt.handler === "function") {
				$btn.on("click", function(evt) {
					opt.handler.call(that, $btn);
				});
				// 阻止冒泡触发下拉菜单
				$btn.on("mousedown", function(evt) {
					evt.stopPropagation();
				})
			}
			that.btns.push($btn);
			return $btn;
		},
		/**
		 * 创建操作层
		 * @method _createSelectOperate
		 * @private
		 * @return {Jquery} 操作层对应jq对象
		 */
		_createSelectOperate: function() {
			var $selection = this.select.selection,
				$operateWrap = $('<li class="select2-operate"></li>');
			return $operateWrap.prependTo($selection);
		},
		/**
		 * 刷新对应SelectBox，选中或取消左侧的选中，并刷新右侧菜单
		 * @method refreshSelectBox
		 * @param  {String||Array} id     左侧树的要操作的一个或一组ID
		 * @param  {boolean} toCheck       true为选中，false为取消选中
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		refreshSelectBox: function(id, toCheck, slient) {
			if(this.selectBox){
				toCheck = typeof toCheck === "undefined" ? true : toCheck;
				// 若为数组，则迭代
				if ($.isArray(id)) {
					for (var i = 0, len = id.length; i < len; i++) {
						this.refreshSelectBox(id[i], toCheck, slient);
					}
				} else {
					if (this.selectBox) {
						this.selectBox.values = this.values;
						// 传入ID时, 更新左侧对应选择框选中状态
						if (!id) {
							this.selectBox.refreshCheckbox();
						} else {
							this.selectBox._checkNode(id, toCheck, slient);
						}
						// 更新右边列表
						this.selectBox.refreshList();
					}
				}
			}
		},

		/**
		 * 根据数据的ID获取其对应文本
		 * @param  {String} id 数据ID
		 * @return {String}    对应文本
		 */
		_getText: function(id) {
			var data = this.data;
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i].id === id) {
					return data[i].text;
				}
			}
		},

		/**
		 * 获取全局数据
		 * @method getData
		 * @return {Array} 全局数据
		 */
		getData: function() {
			return this.data;
		},

		getDataById: function(id) {
			return $.grep(this.data, function(d){ return d.id === id });
		},

		/**
		 * 修改已选中的值
		 * @method setValue
		 * @param  {String||Array} val 单个值或一组值
		 * @return {Array}             已选中值的数组
		 */
		setValue: function(val, slient) {
			this.removeValue([].concat(this.values), slient);
			if(val){
				this.addValue(val, slient);
			}
			this.select.close();
			return this.values;
		},
		/**
		 * 获取已选中的值
		 * @method getValue
		 * @return {Array}  已选中值的数组
		 */
		getValue: function() {
			return this.values;
		},
		/* 合并数组 */
		_mergeArray: function(source, val) {
			var that = this;
			if(!$.isArray(source)) {
				source = [];
			}
			if(!$.isArray(val)) {
				if($.inArray(val, source) == -1 ){
					source.push(val);
				}
			} else {
				$.each(val, function(i, v){
					that._mergeArray(source, v);
				});
			}
			return source;
		},

		/**
		 * 从源数组中删除部分值，该数组必须各值单一
		 * @method _resolveArray
		 * @private
		 * @param  {Array}	source 源数组
		 * @param  {Any}	val    要从数组中删除的值，当为数组时，将删除两个数组中共有的值
		 * @return {Array}         经过删除的源数组
		 */
		_resolveArray: function(source, val) {
			// 如果val为数组，进行迭代
			if ($.isArray(val)) {
				for (var i = 0, len = val.length; i < len; i++) {
					this._resolveArray(source, val[i])
				}
				return source;
			}
			// 将val从源数组中删除
			var index = $.inArray(val, source);
			if (index !== -1) {
				source.splice(index, 1);
			}
			return source;
		},
		/**
		 * 判断数组是否空数组，当是时，返回null
		 * @method _fixEmptyArray
		 * @private 
		 * @param  {Array} arr     源数组
		 * @return {Array||null}   源数组或null
		 */
		_fixEmptyArray: function(arr) {
			return (arr.length && arr.length > 0) ? arr : null;
		},
		/**
		 * 添加要选中的值
		 * @method addValue
		 * @param  {String||Array} val  一个或一组要选中的值
		 * @return {Array}              已选中的值
		 */
		addValue: function(val, slient) {
			if(typeof val !== "undefined"){
				if (!$.isArray(val)) {
					val = [val];
				}
				this.values = this._mergeArray(this.values, val);
				this.refreshSelectBox(val, true, true)
				this.select.val(this._fixEmptyArray(this.values));
				if(!slient){
					this.$element.trigger("uschange", { added: val, val: this.values })
				}
			}
			return this.values;
		},
		/**
		 * 移除已选中的值
		 * @method removeValue
		 * @param  {String||Array}  val  一个或一组要移除的值，当参数为空时，将清空已选中的值
		 * @return {Array}     已选中的值
		 */
		removeValue: function(val, slient) {
			if(typeof val !== "undefined"){
				if (!$.isArray(val)) {
					val = [val];
				}
				this._resolveArray(this.values, val)
				this.refreshSelectBox(val, false, true)
				this.select.val(this._fixEmptyArray(this.values));
				if(!slient) {
					this.$element.trigger("uschange", { removed: val, val: this.values })
				}
			}
			return this.values;
		},
		/**
		 * 启用选择框
		 * @method setEnabled
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		setEnabled: function() {
			this.select.enable();
			// 显示操作按钮
			this.btns[0].show();
			return this;
		},
		/**
		 * 禁用选择框
		 * @method setDisabled
		 * @chainable
		 * @return {Object} 当前调用对象
		 */
		setDisabled: function() {
			this.select.disable();
			// 隐藏操作按钮
			this.btns[0].hide();
			return this;
		},
		/**
		 * TODO:修正enabled,disabled,readonly的方法 
		 * @returns {_L1.UserSelect.prototype}
		 */
		setReadOnly: function() {
			this.select.disable();
			// 隐藏操作按钮
			this.btns[0].hide();
			this.btns[1].hide();
			return this;
		}
	}
	$.fn.userSelect = function(options) {
		if (!$ || !$.fn.select2) {
			// @Debug;
			throw new Error("($.fn.userSelect): 未定义 '$' 或 '$.fn.select2'");
		}
		var argu = Array.prototype.slice.call(arguments, 1);
		return this.each(function() {
			var $el = $(this),
				data = $el.data("userSelect");
			if (!data) {
				$el.data("userSelect", data = new UserSelect($el, $.extend({}, $.fn.userSelect.defaults, options)));
			} 

			if (typeof options === "string" && $.isFunction(data[options])) {
				data[options].apply(data, argu)
			}
		})
	}
	$.fn.userSelect.Constructor = UserSelect;
	$.fn.userSelect.defaults = {
		contact: $.parseJSON(G.contact),
		data: [],
		multiple: true,
		position: {
			my: "right top",
			at: "right bottom"
		},
		clearable: true
	}

	$(document).on("mousedown.userselect.hideall", function(){
		UserSelect.hideAllBox();
	});
})();