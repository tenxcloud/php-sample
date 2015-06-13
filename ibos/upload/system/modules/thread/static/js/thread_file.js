/**
 * 主线 -- 文件
 * Thread
 * @author 		inaki
 * @version 	$Id: thread_file.js 4655 2014-11-27 09:13:33Z gzhzh $
 */
define([
	"datatables"
], function() {

	return function() {
		var app = Ibos.app;
		var fileData = app.g("fileData");

		//@Debug: 转换数据格式，应该由后端处理
		fileData = $.map(fileData, function(v, k) {
			return v.id = k, v;
		});

		var fileTable = $("#thrd_file_table").show().DataTable($.extend({}, Ibos.settings.dataTable, {
			// --- Data
			data: fileData,
			serverSide: false,
			columns: [
				// ID
				{
					"data": "id",
					"visible": false
				},
				// 格式
				{
					"data": "iconsmall",
					"orderable": false,
					"render": function(data, type, row) {
						return '<img width="44" height="44" src="' + data + '"/>';
					}
				},
				// 名称
				{
					"data": "filename",
					"className": "xcm"
				},
				// 上传者
				{
					"data": "uploader",
					"className": "fss"
				},
				// 来源
				{
					"data": "from",
					"className": "fss"
				},
				// 文件大小
				{
					"data": "filesize",
					"className": "fss"
				},
				// 更新时间
				{
					"data": "date",
					"render": function(data, type, row) {
						var tmpl = '<div class="row-opbar">' +
								(row && row.href ? '<a href="<%= href %>" class="o-chain" target="_blank"></a>' : '') +
								'<a href="<%= downurl %>" class="o-download mls"></a>' +
								'</div>' +
								'<span class="row-date fss"><%= date %></span>';

						return $.template(tmpl, row);
					}
				}
			]
		}));

		// 若安装了文件柜模块，则提供从文件柜选择的功能
		if (app.getAssetUrl('file')) {
			require([
				app.getAssetUrl("file", "/js/cabinet_file_selector.js")
			], function(template) {

				$("#thrd_select_file").on("click", function() {
					var addFilesFromFileSelector = function(files) {
						var threadid = U.getUrlParam().id;
						var fids = $.map(files, function(file) {
							return file.fid;
						}).join(",");

						// @Todo: 路由替换
						$.post(app.url("thread/detail/show", {id: threadid, tab: 'file', op: 'select'}), {fids: fids}, $.noop, "json")
								.done(function(res) {
									if (res.isSuccess) {
										$('[href="#thread_file"]').trigger("shown");
									} else {
										Ui.tip(res.msg, "danger")
									}
								});

					}
					Ibos.openFileSelector(addFilesFromFileSelector);
				});

			});
		}
	};
});
