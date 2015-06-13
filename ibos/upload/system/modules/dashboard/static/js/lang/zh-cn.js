/**
 * 后台模块中文语言包
 * 
 */

var L = L || {};
L.DB = {
	"TIP": "提示",
	// Index
	"SHUTDOWN_SYSTEM_FAILED": "关闭系统失败",
	"LOAD_SECURITY_INFO_FAILED": "载入提示失败",
	"LICENSE_KEY": "授权KEY",
	"ENTER_LICENSEKEY": "请输入授权码...",

	// 全局 -- 积分设置
	"CREDIT_RULE_NUM_OVER": "已经超过新增规则指定条数",
	"CREDIT_TIP": "总积分是衡量用户级别的唯一标准，您可以在此设定用户的总积分计算公式，公式中可使用包括 + - * / () 在内的运算符号",

	// 全局 -- 性能优化
	"SPHINX_PORT_TIP": "例如，9312，主机名填写 socket 地址的，则此处不需要设置",
	"SPHINX_HOST_TIP": "本地主机填写“localhost”，或者填写 Sphinx 服务 socket 地址，必须是绝对地址：例如，/tmp/sphinx.sock",

	// 全局 -- 即时通讯绑定
	"BIND_USER": "绑定用户",
	"BIND_SUCCESS": "绑定成功", 
	"BIND_FAILED": "未知错误，绑定失败", 

	"RTX_SYNC_CONFIRM": "确认要开始同步吗？该操作不可恢复！", 
	"RTX_SYNC_TITLE": "同步组织架构",
	"RTX_SYNC_CONTENT": "同步中，请稍等……", 
	"RTX_SYNC_SUCCESS": "同步成功完成",

	// 界面 -- 快捷导航设置
	"REMOVE_QUICKNAV_CONFIRM" :"确定要删除该快捷导航吗？",

	//界面 -- 后台导航设置
	"REMOVE_CHILD_NAVIGATION" :"请先将子导航移除!",

	//界面 -- 导航设置
	"SINGLE_PAGE" : "单页图文",
	"PREVIEW" : "预览",

	//界面 -- 权限设置
	"POSITION_NAME_CANNOT_BE_EMPTY": "岗位名称不能为空",
	"POWERLESS": "无权限",
	"ME": "本人",
	"AND_SUBORDINATE": "本人及下属",
	"CURRENT_BRANCH": "当前分支机构",
	"ALL": "全部",
	"ADD_LIMIT": "添加权限",
	"EDIT_LIMIT": "编辑权限",
	"DELET_LIMIT": "确定删除该权限?"
}
L.ORG = {
	POSITION_NAME_CANNOT_BE_EMPTY: "岗位名称不能为空",
	POWERLESS: "无权限",
	ME: "本人",
	AND_SUBORDINATE: "本人及下属",
	CURRENT_BRANCH: "当前分支机构",
	ALL: "全部",

	// 部门管理
	WRONG_PARENT_DEPARTMENT: "当前部门不能与上级部门相同",
	MOVEUP_FAILED: "向上移动部门失败",
	MOVEDOWN_FAILED: "向下移动部门失败",
	DELETE_DEPARTMENT_CONFIRM: "确认删除部门吗？该操作无法恢复",

	// 用户管理
	SYNC_USER: "同步用户",

	// 岗位管理
	DELETE_POSITIONS_CONFIRM: "确认删除选中岗位吗?该操作无法恢复",

	INTRO: {
		BRANCH: "总部下可创建多个分支机构，分支机构可以再创建分支机构，部门不允许创建分支机构。分支机构与部门的图标不一样哦！",
		SUPERVISOR: "设置该职员的直属领导后，直属领导在各个模块的下属栏目中可直接查阅职员的工作日志、日程总结计划等模块数据。",
		AUXILIARY_DEPT: "如果职员兼任多个部门工作，可在此设置辅助部门。",
		POSITION: "岗位角色的设置决定职员的系统使用权限，可在岗位角色管理中添加新岗位角色！",
		ACCOUNT_STATUS: "在这儿，你可以选择账号状态，区别如下：<br /> 1. 启用，允许登录并使用；<br /> 2. 锁定，禁止登录但仍然接收系统数据；<br /> 3. 禁用，禁止登录并不接收任何数据。",
		POSITION_ADD: "点这儿可添加岗位角色成员，添加后的成员即拥有该岗位角色的所有访问及使用权限！"
	}
}