/**
 * 主线 -- 邮件
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_email.js 4948 2015-03-27 10:37:00Z gzljj $
 */
define([
	"datatables"
	], function() {

	return function(){
		var emailData = Ibos.app.g("emailData");

		var emailTable = $("#thrd_email_table").show().DataTable($.extend({}, Ibos.settings.dataTable, {
			// --- Data
			data: emailData,

			serverSide: false,

			order: [0, "desc"],

			columns: [
				// ID
				{
					"data": "id",
					"visible": false
				},
				{
					"data": "isReaded",
					"sortable": false,
					"render": function(data, type, row){
						return row.isReaded ?
							'<i class="o-th-email-readed"></i>' :
							'<i class="o-th-email-unread"></i>';
					}
				},
				// 发件人
				{
					"data": "from",
					"render": function(data, type, row){
						return row.isReaded ?
							'<span class="xcm">' + data + '</span>' :
							'<strong class="xcbu">' + data + '</strong>';
					}
				},
				// 主题
				{ 
					"data": "subject",
					"render": function(data, type, row){
						return row.isReaded ?
							'<a href="' + Ibos.app.url('email/content/show', { id: row.id }) + '" class="xcm" target="_blank">' + data + '</a>' :
							'<a href="' + Ibos.app.url('email/content/show', { id: row.id }) +'" class="xwb xcbu" target="_blank">' + data + '</a>';
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
