$(function(){
	$("#user_supervisor").userSelect({
		data: Ibos.data.get("user"),
		type: "user",
		maximumSelectionSize: "1"
	});

	$("#sub_subordinate").userSelect({
		data: Ibos.data.get("user"),
		type: "user"
	});

	$("#user_department").userSelect({
		data: Ibos.data.get("department"),
		type: "department",
		maximumSelectionSize: "1"
	});

	$("#auxiliary_department").userSelect({
		data: Ibos.data.get("department"),
		type: "department"
	});

	$("#user_position").userSelect({
		data: Ibos.data.get("position"),
		type: "position",
		maximumSelectionSize: "1"
	});

	$("#auxiliary_position").userSelect({
		data: Ibos.data.get("position"),
		type: "position"
	});

	$("#sub_position").userSelect({
		data: Ibos.data.get("position"),
		type: "user"
	});

	$.formValidator.initConfig({ formID:"user_form", errorFocus:true });

	// 密码
	var pwdSettings = Ibos.app.g("password"),
		pwdErrorTip = U.lang("V.PASSWORD_LENGTH_RULE", { 
			min: pwdSettings.minLength, 
			max: pwdSettings.maxLength
		})
	$("#password")
	.formValidator({ 
		onFocus: pwdErrorTip, 
		empty: true
	})
	.inputValidator({
		min: pwdSettings.minLength,
		max: pwdSettings.maxLength,
		onError: pwdErrorTip
	})
	.regexValidator({
		regExp: pwdSettings.regex,
		dataType:"string",
		onError: U.lang("RULE.CONTAIN_NUM_AND_LETTER")
	});
	
	// 真实姓名
	$("#realname").formValidator()
	.regexValidator({
		regExp:"notempty",
		dataType:"enum",
		onError: U.lang("RULE.REALNAME_CANNOT_BE_EMPTY")
	});
	
	$("#mobile").formValidator()
	.regexValidator({
		regExp:"mobile",
		dataType:"enum",
		onError: U.lang("RULE.MOBILE_INVALID_FORMAT")
	});
	
	$("#email").formValidator()
	.regexValidator({
		regExp:"email",
		dataType:"enum",
		onError: U.lang("RULE.EMAIL_INVALID_FORMAT")
	});

	$(".toggle-btn").on("click", function(){
		var target = $(this).data("target");
		$(target).toggle();
	});
});