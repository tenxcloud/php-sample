/**
 * 工作流--添加工作委托
 * Workflow
 * @author 		inaki
 * @version 	$Id$
 */

 $(function() {
 	var $select = $("#flow_select_input"),
 		$dateBegin = $('#entrust_date_begin'),
 		$dateEnd = $('#entrust_date_end'),
 		$user = $('#be_entrust_user');
 		
 	function postCheck() {
 		if ($select.val() == "") {
 			Ui.tip('@WF.PLEASE_SELECT_PROCESS', 'danger');
 			return false;
 		}
 		if ($user.val() == "") {
 			Ui.tip('@WF.DESIGNATED_THE_CLIENT', 'danger');
 			return false;
 		}
 		var beginDateVal = $dateBegin.find('input').val();
 		var endDateVal = $dateEnd.find('input').val();
 		if ($('#always_effected').prop('checked') == false) {
 			if (beginDateVal !== '' && endDateVal !== '') {
 				var beginDate = Date.parse(beginDateVal);
 				var endDate = Date.parse(endDateVal);
 				if (beginDate > endDate) {
 					Ui.tip('@BEGIN_GREATER_THAN_END', 'danger');
 					return false;
 				}
 			} else if (beginDateVal == '' && endDateVal == '') {
 				Ui.tip('@WF.TIME_CANNOT_BE_EMPTY', 'danger');
 				return false;
 			}
 		}
 		return true
 	}

 	$select.ibosSelect({
 		data: Ibos.app.g("flowlist"),
 		width: '100%',
 		multiple: false
 	});
 	$user.userSelect({
 		data: Ibos.data.get("user"),
 		type: "user",
 		maximumSelectionSize: "1",
 	});

 	$dateBegin.datepicker({target: $dateEnd});
 	$('#always_effected').iSwitch().on('change', function() {
 		if (this.checked) {
 			$dateBegin.datepicker("destroy").find('input').val('').addClass('readonly');
 			$dateEnd.datepicker("destroy").find('input').val('').addClass('readonly');
 		} else {
 			$dateBegin.find('input').val('').removeClass('readonly');
 			$dateEnd.find('input').val('').removeClass('readonly');
 			$dateBegin.datepicker({target: $dateEnd});
 		}
 	});
 });