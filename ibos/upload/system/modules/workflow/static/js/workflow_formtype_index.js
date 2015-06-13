/**
 * 工作流-表单库管理-首页
 * @author 		inaki
 * @version 	$Id$
 */
 $(function() {
 	//搜索
 	$("#mn_search").search();

	// 保存成功提示
	if (U.getCookie('form_save_success') == 1) {
		Ui.tip(U.lang('SAVE_SUCEESS'), 'success');
		U.setCookie('form_save_success', '', -1);
	}
	// 保存并设计，弹出设计窗口
	if (U.getCookie('form_save_success') == 2) {
		Wfs.formItem.design({formid: U.getCookie('formid')});
		U.setCookie('form_save_success', '', -1);
		U.setCookie('formid', '', -1);
	}
	
	// 列表加载数据
	$('.page-list-mainer').waiting(Ibos.l('READ_INFO'), "mini");

	$.get(Ibos.app.url("workflow/formtype/index", Ibos.app.g("pageParam")), function(data) {
		$('.page-list-mainer').waiting(false);
		if (data.count > 0) {
			$('#page').show();
			Wfs.formList.addItem(data.list);
		} else {
			$('#page').hide();
			$('.page-list-mainer').html('<div class="no-data-tip"></div>');
		}
	}, 'json');
 });