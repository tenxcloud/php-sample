var L = L || {};
L.WF = $.extend(L.WF, {
	// 我的关注
	"UNFOLLOW_CONFIRM": 			"确定要取消所选关注吗？",

	// 工作流管理
	"PROCESS_NOT_DONE":             "流程尚未完成",
	"PROCESS_RUNNING_WELL":         "流程运行良好",
	"PROCESS_ERROR":                "流程运行出错",
	"WORK_HANDOVER":                "工作移交",
	"DELETE_FLOW_CONFIRM":          "确认要删除选中流程吗？这将删除：<br/>1:流程描述与步骤设置 <br/> 2:依托于该流程的所有工作",
	"CLEAR_FLOW_CONFIRM":           "确认要清空依托于选中流程的工作数据吗？",
	"TRANSACTOR_CANT_BE_EMPTY":     "请选择原办理人",
	"TRANS_OBJECT_CANT_BE_EMPTY":   "请选择移交对象",


	// 工作流管理
	CONDITION_INVAILD:          "值中不能含有\'号",
	CONDITION_REPEAT:           "条件重复",
	CONDITION_INCOMPLETE:       "请补充完整条件",
	CONDITION_NEED:             "请先添加条件",
	CONDITION_CANNOT_EDIT:      "无法编辑已经存在关系的条件",
	CONDITION_FORMAT_ERROR:     "条件表达式书写错误,请检查括号匹配",
	FLOW_NAME_CANNOT_BE_EMPTY:  "流程名称不能为空",
	ENTER_FORM_NAME:            "请输入表单名字",
	
	SPECIFY_THE_IMPORT_FILE:    "请指定用于导入的xml文件",
	
	
	NEW_MANAGE_PRIV:            "新建管理权限",
	EDIT_MANAGE_PRIV:           "编辑管理权限",
	INVALID_AUTH_OBJECT:        "请选择授权对象",
	INVALID_CUSTOM_DEPT:        "请选择自定义部门",
	MANAGER_LIST:               "授权列表",
	TPLNAME_EXISTS:             "模板名称已存在",
	NEW_QUERY_TPL:              "新建查询模板",
	EDIT_QUERY_TPL:             "编辑查询模板",
	FLOW_QUERY_TPL:             "高级查询模板列表",
	NEW_FORM:                   "新建表单",
	EDIT_FORM:                  "编辑表单",
	IMPORT_FORM:                "导入表单",
	HISTORICAL_EDITION:         "历史版本",
	NO_HISTORICAL_EDITION:      "暂无历史版本",
	SELECT_HISTORICAL_EDITION:  "请选择历史版本",
	EDITION_RESTORE_CONFIRM:    "确认要将此版本恢复为应用版本吗？这将不可恢复！", //确定要还原该历史版本吗？这将覆盖当前使用版本
	EDITION_DELETE_CONFIRM:     "确认要删除选中的历史版本吗？这将不可恢复！",
	TPLNAME_CANNOT_BE_EMPTY:    "模板名称不能为空",
	SET_THE_TIMING_TASK:        "设置定时任务",
	
	PLEASE_SELECT_PROCESS:      "请选择流程",
	SAVE_AND_DESIGN:            "保存并设计",
	CONFIRM_DEL_FORM:           "确定要删除选中表单吗？",
	
	UNSAVE_FLOW_UNLOAD_TIP:     "尚未保存流程，如果离开您的数据会丢失",
	VERIFY_RESULT:              "校验结果",
	USING_STATE_TITLE:          "使用状态说明",
	USING_STATE_DESC:           "<strong>可见</strong>：所有用户都可以在前台新建工作里看到该流程，但无权限用户不能点击。<br/><strong>不可见</strong>：只有拥有权限的用户才能在前台新建工作中看到，并可点击。<br/><strong>锁定</strong>：无论用户有无权限，都不会在前台新建工作中显示。<br/><strong>注意</strong>：默认选择“可见”。",
	DELEGATE_TYPE_TITLE:        "委托类型说明",
	DELEGATE_TYPE_DESC:         "<strong>自由委托</strong>：用户可以在工作委托模块中设置委托规则,可以为委托给任何人。<br/><strong>按步骤设置的经办权限委托</strong>：仅能委托给流程步骤设置中经办权限范围内的人员。<br/><strong>按实际经办人委托</strong>：仅能委托给步骤实际经办人员。<br/><strong>禁止委托</strong>：办理过程中不能使用委托功能。<br/><strong>注意</strong>：只有自由委托才允许定义委托规则，委托后更新自己步骤为办理完毕，主办人变为经办人。",
	TYPE_FORM_CHANGE_TIP:       "尚未保存流程，如果离开您的数据会丢失！",
	
	// 流程设计器
	CLEAR_CONNECTION_CONFIRM:   "确认要清除所有链接吗？",
	PLEASE_SELECT_A_STEP:       "请选择要删除的步骤",
	DELETE_STEP_CONFIRM:        "确认要删除“<%=name%>”步骤吗？",
	OVERTIME_REMINDED:          "已催办超时步骤",
	EXISTING_CORRESPONDENCE:    "该对应关系已存在",
	PLUGIN_SELECT:              "选择插件",
	NO_PLUGIN_AVAILABLE:        "没有可用插件",
	ADD_STEP:                   "新建步骤",
	LOADING_PROCESS:            "正在加载步骤信息",
	REPEAT_STEP:                "步骤重复",
	STEP_EXISTS:                "步骤序号已存在",
	NOT_FROM_START_TO_END:      "连接不能从开始步骤直接指向结束步骤",
	EMPTY_STEP_NAME:            "请填写步骤名称",
	EMPTY_CHILD_FLOW:           "请选择子流程",

	// 工作流新建
	PREFIX_CANNOT_BE_EMPTY:     "请填写前缀",
	SUFFIX_CANNOT_BE_EMPTY:     "请填写后缀",
	RUNNAME_CANNOT_BE_EMPTY:    "请填写工作名称/文号",
	CONFIRM_ENTRUST:            "确认委托",
	SPECIFY_FREE_FLOW_NEW_USER: "指定自由流程新建人员",

	// 表单
	EMPTY_FORM_CONTENT:         "表单内容不能为空",
	SAVE_VERSION_SUCEESS:       "生成版本成功",
	INVALID_OPERATION:          "无效操作",
	FORM_CONTROL:               "表单控件",
	FAILED_TO_INITALIZE:        "初始化失败",
	CUSTOM_SCRIPT_ERROR:        "用户自定义脚本执行错误:",
	CONFIRM_END_FREE_PROCESS:   "本流程为自由流程，可以随时结束，确认要结束该工作流程吗？",
	FORCED_SIGN_OPINION:        "本步骤为强制会签，请填写会签意见",
	CONFIRM_FINISH_WORK:        "确认该工作已经办理完毕吗？",
	CONFIRM_UNSAVE_WORK:        "确认不保存此工作吗？",
	ATLEAST_SELECT_ONE_STEP:    "请至少选择一个步骤进行转交",
	AGENT:                      "经办人",
	NOT_ALL_FINISHED_DESC:      "尚未办理完毕，不能转交流程",
	CONFIRM_END_FLOW:           "确认要结束流程吗",
	NOTFINISHED_CONFIRM:        "尚未办理完毕，确认要转交下一步骤吗？",
	APPOINT_THE_HOST:           "请指定所选步骤的主办人",
	TRUN_SUCEESS:               "转交操作完成",
	COMPLETE_SUCEESS:           "流程顺利办理完毕",
	DESIGNATED_THE_PRINCIPAL:   "请指定委托人",
	DESIGNATED_THE_CLIENT:      "请指定被委托人",
	HOW_LONG_IS_THE_DELAY:       "要延期多久？",
	DELAY_CUSTOM_TIME_ERROR:     "自定义时间不能小于当前时间",
	CONFIRM_RESTORE:             "确认要恢复该工作流至办理中吗？",
	DELAY_OPT_SUCCESS:           "已成功将工作延期",
	RESTORE_SUCCESS:             "已恢复该工作流至办理中",
	CONFIRM_DEL_RUN:             "确定要删除该工作吗？",
	CONFIRM_DEL_SELECT_RUN:      "确定要删除选中工作吗？",
	CONFIRM_END_SELECT_RUN:      "确定要结束选中工作吗？",
	HAS_ENDED :                  "已结束",
	GROUPING_FIELD_CAN_NOT_HIDE: "分组字段不能隐藏",
	SELECT_FLOW_TYPE:            "请选择流程类型",
	
	// 表单设计器
	JS_EXT:                         "js脚本扩展",
	CSS_EXT:                        "css样式扩展",
	MACRO_EXT:                      "宏标记",
	SEND_TODO_REMIND:               "发送超时催办提醒",
	ALREADY_SEND_REMIND:            "已发送提醒",
	CONFIRM_REDO:                   "确定要让此经办人重新会签吗？",
	CONFIRM_DEL_FB:                 "确认要删除该条会签吗？这将会删除关联的附件及点评",
	CONFIRM_RESTORE_RUN:            "确认要恢复选中工作至办理中吗？",
	CONFIRM_DESTROY_RUN:            "确认要永久销毁选中工作吗？",
	CONFIRM_CALLBACK:               "下一步骤尚未接收时可收回至本步骤重新办理，确认要收回吗？",
	ALREADY_RECEIVED:               "对方已接收，不能收回",
	NO_ACCESS_TAKEBACK:             "抱歉，您没有权限收回工作流",
	EXAM_FLOW:                      "校验流程",
	ENTER_FALLBACK_REASON:          "回退至上一步骤，请输入回退原因",
	ADD_ENTRUST_RULE:               "添加委托记录",
	TIME_CANNOT_BE_EMPTY:           "请选择一个时间范围",
	CONFIRM_DEL_RULE:               "确认要删除选中规则吗?",
	PLEASE_ENTER_THE_PACKAGE_NAME:  "请输入方案名字",
	NEW_PLAN_EXAMPLE:               "新建方案一",
	SELECT_FALLBACK_STEP:           "选择回退步骤",


	"INTRO": {
		// 工作流主办
		"STEPS_PREVIEW":            "点这儿可以看到本条工作流具体的流程步骤",
		"TURN":                     "点击转交本工作流到下一步骤",
		"FALLBACK":                 "点击“回退”本工作流将返回给上一步骤的主办人",

		// 工作流预览
		"DISPLAY_PANEL":            "点这儿可以显示/隐藏“表单”、“公共附件区”、“会签意见区”、“流程图”",
		"QUICK_LINK":               "Hey! 点我们试试看~!"
	},

	"IC": {
		"LABEL":                    "标签文本",
		"TEXT":                     "单行输入框",
		"TEXTAREA":                 "多行输入框",
		"SELECT":                   "下拉菜单",
		"RADIO":                    "单选框",
		"CHECKBOX":                 "复选框",
		"USER":                     "部门人员控件",
		"DATE":                     "日历控件",
		"AUTO":                     "宏控件",
		"CALC":                     "计算控件",
		"LISTVIEW":                 "列表控件",
		"PROGRESSBAR":              "进度条控件",
		"IMGUPLOAD":                "图片上传控件",
		"SIGN":                     "签章控件",
		"QRCODE":                   "二维码控件",
	},

	"ICTIP": {
		"PLEASE_INPUT_TEXT":          "请输入文本",
		"PLEASE_INPUT_TITLE":         "请输入控件名称",
		"PLEASE_INPUT_OPTIONS":       "请输入选项",
		"PLEASE_INPUT_COLUMN_DATA":   "请填写至少一列数据",
		"PLEASE_INPUT_QRCODE_VALUE":  "请输入要生成二维码的内容"
	}
})