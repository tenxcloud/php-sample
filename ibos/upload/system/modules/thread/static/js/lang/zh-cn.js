/**
 * 语言包：主线模块
 * Thread
 * @author 		inaki
 * @version 	$Id: zh-cn.js 4703 2014-12-03 02:00:23Z gzzcs $
 */

(function(L){
	L.THREAD = {

		INPUT_SUBJECT: 					            "请填写主线名称",
		SELECT_CHARGE: 					            "请选择负责人",
		SELECT_ENDTIME:                             "请选择结束时间",

		CHARCOUNT_TPL: 				                "填写主线名称，还可以输入 <strong><%=count%></strong> 字",
		CHARCOUNT_WARNING_TPL: 		                "已经超过 <strong><%=count%></strong> 字",
		CHARGER:                                    "负责人",
		REMOVE_THREAD_CONFIRM:                      "确定删除该主线吗？",

		EDIT_THREAD: 								"编辑工作主线",

		INCHARGE:                                   "负责",
		ARRANGE:                                    "安排"
	};

	define(L);

})(typeof L !== "undefined" ? L : {});
