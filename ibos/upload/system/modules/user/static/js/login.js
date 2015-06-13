/**
 * 用户中心--登录页
 * User
 * @author 		inaki
 * @version 	$Id$
 */


$(function () {
	// 切换找回密码表格
	var lgPanel = $("#login_panel"),
			pswPanel = $("#get_password_panel");

	var togglePanel = function () {
		lgPanel.toggle();
		pswPanel.toggle();
	}

	Ui.focusForm(lgPanel);

	$("#to_get_password").on("click", function () {
		var userName;
		togglePanel();
		Ui.focusForm(pswPanel);
		// 同步登陆框用户名 至 找回密码面板 用户名
		userName = lgPanel.find("[name='username']").val();
		pswPanel.find("[name='username']").val(userName);
	}).tooltip();

	$("#to_login").on("click", function () {
		togglePanel();
		Ui.focusForm(lgPanel);
	});
	// 公告内容过多时自动滚动
	var $anc = $("#lg_anc_ct"),
			ANC_MAX_HEIGHT = 40, // 公告内容最大高度
			mgt = 0, // margin-top 公告内容当前上边距值
			ancHeight = $anc.outerHeight(),
			scrollSpeed = 2000, // 毫秒
			timer;

	var autoScroll = function () {
		timer = setInterval(function () {
			mgt -= 20;
			if (-mgt >= ancHeight) {
				mgt = ANC_MAX_HEIGHT;
				$anc.css({"margin-top": mgt});
			} else {
				$anc.animate({"margin-top": mgt});
			}
		}, scrollSpeed)
	};

	if (ancHeight > ANC_MAX_HEIGHT) {
		autoScroll();
		$anc.hover(function () {
			clearInterval(timer)
		}, autoScroll);
	}
	$("#lg_help").tooltip();
	var $ctrl = $("#lg_pattern"),
			$menu = $("#lg_pattern_menu");

	var sl = new P.PseudoSelect($ctrl, $menu, {
		template: " <%=text%> <i class='o-lg-select'></i>"
	});

	$ctrl.on("select", function (evt) {
		$("#lg_pattern_val").val(evt.selected);
		var types = {
			1: "account",
			2: "email",
			3: "jobnum",
			4: "mobile"
		}
		accountValidator[types[evt.selected]]();
	});

	// 登录背景
	var imgArr = Ibos.app.g("loginBg")

	// LoadImage and set Image fullscreen
	var bgNode = document.getElementById("bg"),
			bgWrap = bgNode.parentNode,
			index = Math.ceil(imgArr.length * Math.random()) - 1;

	$(document.body).waiting(null, "normal");

	U.loadImage(imgArr[index], function (img) {
		var imgRatio = img.width / img.height;
		img.style.width = "100%";
		img.style.height = "100%";
		var setWrapSize = function (width, height) {
			bgWrap.style.width = width + "px";
			bgWrap.style.height = height + "px";
		};
		var resize = function (ratio) {
			var $doc = $(document),
					docWidth = $doc.width(),
					docHeight = $doc.height(),
					ImgTotalWidth,
					ImgTotalHeight;

			setWrapSize(docWidth, $(window).height());

			if (docWidth / docHeight > ratio) {
				ImgTotalHeight = docWidth / ratio;
				// 适配宽度
				bgNode.style.width = docWidth + 'px';
				// 按图片比例放大高度，保持图片不变形
				bgNode.style.height = ImgTotalHeight + 'px';
				// 图片垂直居中
				bgNode.style.marginTop = (docHeight - ImgTotalHeight) / 2 + 'px';
				bgNode.style.marginLeft = 'auto';
			} else {
				ImgTotalWidth = docHeight * ratio;
				// 适配高度
				bgNode.style.height = docHeight + 'px';
				// bgNode.style.height = docHeight + 'px';
				// 按图片比例放大高度，保持图片不变形
				bgNode.style.width = ImgTotalWidth + 'px';
				// 图片水平居中
				bgNode.style.marginLeft = (docWidth - ImgTotalWidth) / 2 + 'px';
				bgNode.style.marginTop = 'auto';
			}
			$(document.body).stopWaiting();
			$(bgNode).fadeIn();
		};

		resize(imgRatio);
		window.onresize = function () {
			setWrapSize(0, 0);
			resize(imgRatio);
		};
		bgNode.appendChild(img);
	});

	// Op
	Ibos.evt.add({
		// 清除痕迹
		"clearCookie": function () {
			var result = window.confirm(U.lang("LOGIN.CLEAR_COOKIE_CONFIRM"));
			if (result) {
				U.clearCookie();
				Ui.tip(U.lang("LOGIN.CLEARED_COOKIE"))
			}
		},
		"switchLoginType": function (param, elem) {
			var $this = $(this),
					$curLi = $this.closest("li"),
					$lis = $this.closest("ul").find("li"),
					index = $curLi.index(),
					$conDiv = $("#login_type_content>div");
			$lis.removeClass("active");
			$curLi.addClass("active");
			$conDiv.hide();
			$conDiv.eq(index).show();
			$.formValidator.resetTipState();
		}
	});

	// 表单验证
	var getAccountSettings = function (focusMsg) {
		return {
			onFocus: function () {
				Ibosapp.formValidate.setGroupState("#account")
				return focusMsg
			},
			onCorrect: function () {
				Ibosapp.formValidate.setGroupState("#account", "correct");
			},
			relativeID: "account_wrap"
		}
	}
	var getAccountRegSettings = function (reg, msg) {
		return {
			regExp: reg,
			dataType: "enum",
			onError: function () {
				Ibosapp.formValidate.setGroupState("#account", "error");
				return msg;
			}
		}
	}
	var accountValidator = {
		account: function () {
			$("#account").formValidator(getAccountSettings(U.lang("V.INPUT_ACCOUNT")))
					.regexValidator(getAccountRegSettings("notempty", U.lang("V.INPUT_ACCOUNT")));
		},
		email: function () {
			$("#account").formValidator(getAccountSettings(U.lang("V.INPUT_EMAIL")))
					.regexValidator(getAccountRegSettings("email", U.lang("RULE.EMAIL_INVALID_FORMAT")));
		},
		jobnum: function () {
			$("#account").formValidator(getAccountSettings(U.lang("V.INPUT_JOBNUM")))
					.regexValidator(getAccountRegSettings("notempty", U.lang("V.INPUT_JOBNUM")));
		},
		mobile: function () {
			$("#account").formValidator(getAccountSettings(U.lang("V.INPUT_MOBILE")))
					.regexValidator(getAccountRegSettings("mobile", U.lang("RULE.MOBILE_INVALID_FORMAT")));
		}
	}

	$.formValidator.initConfig({formID: "login_form", errorFocus: true});

	accountValidator.account();

	$("#password").formValidator({
		onFocus: function () {
			Ibosapp.formValidate.setGroupState("#password")
			return U.lang("V.INPUT_POSSWORD");
		},
		onCorrect: function () {
			Ibosapp.formValidate.setGroupState("#password", "correct");
		}
	})
			.regexValidator({
				regExp: "notempty",
				dataType: "enum",
				onError: function () {
					Ibosapp.formValidate.setGroupState("#password", "error");
					return U.lang("V.INPUT_POSSWORD");
				}
			});

	// 根据 cookie 还原“自动登录” 的勾选状态
	if (U.getCookie("lastautologin") == 1) {
		$("[name='autologin']").label("check");
	}

	// 记住 “自动登录” 的勾选状态
	$("#login_form").on("submit", function () {
		if ($.formValidator.pageIsValid()) {
			U.setCookie("lastautologin", +$("[name='autologin']").prop('checked'));
		}
	});
});

(function(){
	// renderQrCode(Ibos.app.s('loginQrcode'))
	var Comet = {
		renderQrCode: (function() {
			var render;
			try {
			    document.createElement('canvas').getContext('2d');
			    render = 'canvas'
			} catch(e) {
			    render = 'table';
			}

			return function(text) {
			    if(!text) return;
			    $('#login_qrcode').empty().qrcode({
			        text: text,
			        width: 160,
			        height: 160,
			        render: render
			    });
			}
		})(),

		cancel: false,
		"connect": function (opts) {
			var defaults = {
				type: "POST",
				url: "",
				dataType: "json",
				timeout: 30000,
				data: {}
			};

			return $.ajax($.extend(true, {}, defaults, opts));
		},
		// 扫描二维码
		"scanCode": function () {
			var _this = this;
			return this.connect({
				url: 'static.php?type=checklogincode&code='+Ibos.app.g('loginQrcode')
			})
			.done(function (res, textStatus) {
				if (res.isSuccess) {
					_this.sureLogin(res.code);
					$("#login_tip_wrap").removeClass("tcm").addClass("xcm").html("扫描成功,请在企业号中点击确认链接。");
				} else {
					//扫描失败, 重新返回二维码图片地址
					Ibos.app.s('loginQrcode', res.code);
					$("#login_tip_wrap").removeClass("tcm").addClass("xcm").html("扫描超时,请重新扫描。");
					_this.renderQrCode(res.code);
					_this.scanCode();
				}
			})
			.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				!_this.cancel && _this.scanCode();
			});
		},
		// 微信页面确定登录
		"sureLogin": function (code) {
			var _this = this;
			return this.connect({
				url: 'static.php?type=checklogin&code='+code
			}).done(function (res, textStatus) {
				if (res.isSuccess) {
					window.location.reload();
				} else {
					_this.scanCode();
				}
			})
			.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				!_this.cancel && _this.scanCode();
			});
		}
	};

	// 如果绑定了微信，进入页面后开始二维码变化
	if(Ibos.app.g('wxbinding')) {
		$(window).on('load', function () {
			// 进入页面后，发起ajax请求
			var promise = Comet.scanCode();
			window.onbeforeunload = function () {
				Comet.cancel = true;
				promise.abort();
			};
		});
		Comet.renderQrCode(Ibos.app.g('loginQrcode'));
	}

})();
