/**
 * 主线 -- 审批
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_flow.js 4492 2014-10-31 00:52:22Z gzzcs $
 */
define([
	"datatables"
	], function() {

	return function(){
		var flowData = Ibos.app.g("flowData");

		var flowTable = $("#thrd_flow_table").show().DataTable($.extend({}, Ibos.settings.dataTable, {
			// --- Data
			data: flowData,

			serverSide: false,
			
			order: [0, "desc"],
			
			columns: [
				// ID
				{
					"data": "id",
					"visible": false
				},
				// 名称
				{ 
					"data": "name",
					"render": function(data, type, row){
						return row.isReaded ?
							'<a href="' + row.url + '" title="' + row.title + '" class="xcm" target="_blank">' + row.name + '</a>' :
							'<a href="' + row.url + '" title="' + row.title + '" class="xwb xcbu" target="_blank">' + row.name + '</a>';
					}
				},
				// 发起人
				{
					"data": "sponsor",
					"render": function(data, type, row){
						return row.isReaded ?
							'<span class="fss">' + data + '</span>' :
							'<strong class="fss xcbu">' + data + '</strong>';
					}
				},
				// 状态
				{ 
					"data": "status",
					"render": function(data, type, row){
						return row.status == "1" ?
							'<span class="xcgn fss">' + row.statusText + '</span>' :
							'<span class="tcm fss">' + row.statusText + '</span>';
					}
				},
				// 是否有附件
				{ 
					"data": "hasAttach",
					"sortable": false,
					"className": "cell-has-att",
					"render": function(data){
						return data ? '<i class="o-th-clip"></i>' : ""
					}
				},
				// 发起时间
				{ 
					"data": "date",
					"className": "fss"
				}
			]
		}));
	};
});
