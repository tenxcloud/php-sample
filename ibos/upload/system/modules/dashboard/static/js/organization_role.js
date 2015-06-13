$(function(){
	Ibos.evt.add({
		"delRole": function(param, elem){
			var $li = $(this).closest("li"),
				id = $li.data("id"),
				param = {id: id},
				url = Ibos.app.url('dashboard/role/del');
			Ui.confirm("确定删除该项?", function(){
				$.post(url, param, function(res){
					if(res.isSuccess){
						$li.remove();
						Ui.tip("操作成功");
					}else{
						Ui.tip("操作失败", "danger");
					}
				}); 
			});
		}
	});
});