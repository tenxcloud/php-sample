<?php

use application\core\utils\File;
use application\core\utils\Ibos;
use application\modules\dashboard\model\LoginTemplate;
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset=<?php echo CHARSET; ?> />
        <title><?php echo Ibos::app()->setting->get( 'title' ); ?></title>
        <link rel="shortcut icon" href="<?php echo STATICURL; ?>/image/favicon.ico">
        <meta name="generator" content="IBOS <?php echo VERSION; ?>" />
        <meta name="author" content="IBOS Team" />
        <meta name="copyright" content="2013 IBOS Inc." />
        <!-- load css -->
        <link rel="stylesheet" type="text/css" rev="stylesheet" href="<?php echo STATICURL; ?>/css/base.css?<?php echo VERHASH; ?>" />
        <link rel="stylesheet" type="text/css" rev="stylesheet" href="<?php echo STATICURL; ?>/css/common.css?<?php echo VERHASH; ?>">
        <link rel="stylesheet" href="<?php echo STATICURL; ?>/js/lib/artDialog/skins/ibos.css?<?php echo VERHASH; ?>" />
        <link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/login.css?<?php echo VERHASH; ?>">
        <!-- load css end -->
        <!-- IE8 fixed -->
        <!--[if lt IE 9]>
            <link rel="stylesheet" href="<?php echo STATICURL; ?>/css/iefix.css?<?php echo VERHASH; ?>">
        <![endif]-->
    </head>
    <body>
        <!-- Header -->
        <div class="header affix">
            <div class="wrap">      
                <div class="logo">
                    <img src="<?php
					if ( !empty( $unit['logourl'] ) ): echo $unit['logourl'];
					else:
						?><?php echo STATICURL; ?>/image/logo.png<?php endif; ?>?<?php echo VERHASH; ?>" alt="IBOS">
                    <h1><?php echo $unit['shortname']; ?></h1>
                </div>
                <div class="lg-sign pull-right"></div>
            </div>
        </div>
        <div id="bgwrap"><div id="bg"></div></div>
        <!-- Mainer -->
        <div class="wrap clearfix">
            <div class="login-panel radius pull-right">
                <!-- Login Form -->
				<?php if ( $wxbinding ): ?>
					<div class="login-type-nav">
						<ul class="nav nav-skid">
							<li class="active">
								<a href="javascript:;" data-action="switchLoginType">快速登录</a>
							</li>
							<li>
								<a href="javascript:;" data-action="switchLoginType">账号密码登录</a>
							</li>
						</ul>
					</div>
				<?php endif; ?>
                <div class="login-type-content" id="login_type_content">
					<?php if ( $wxbinding ): ?>
						<div class="wx-login-content xac">
							<div class="fill-sn attend-wx-wrap xal">
								<i class="on-scan-opt"></i>
								<span class="scan-tip">扫一扫关注微信号</span>
								<a href="javascript:;" data-action="followWx" class="scan-link xcbu">查看详情</a>
							</div>
							<div class="mbm wx-code-wrap">
								<div id="login_qrcode"></div>
							</div>
							<span class="fss tcm" id="login_tip_wrap">使用微信企业号的“安全小助手”扫描二维码登录IBOS</span>
						</div>
					<?php endif; ?>
                    <div class="normal-login-content"<?php if ( $wxbinding ): ?> style="display:none;"<?php endif; ?>>
                        <form method="post" id="login_form" action="<?php echo $this->createUrl( 'default/login' ); ?>">
							<?php if ( $wxbinding ): ?>
								<div class="fill-sn attend-wx-wrap xal">
									<i class="on-scan-opt"></i>
									<span class="scan-tip">扫一扫关注微信号</span>
									<a href="javascript:;" data-action="followWx" class="scan-link xcbu">查看详情</a>
								</div>
							<?php endif; ?>
                            <div class="fill" id="login_panel">
                                <div class="login-item">
                                    <div class="input-group" id="account_wrap">
                                        <span class="input-group-addon addon-icon input-large">
                                            <i class="o-lg-user"></i>
                                        </span>
                                        <input type="text" tabIndex="101" id="account" class="input-large lg-acc-input" name="username" />
                                        <!-- 作为背景的input -->
                                        <input type="text" class="input-large input-acc-bg" onfocus="this.blur()">
                                    </div>
                                    <div class="input-operate">
                                        <a href="javascript:;" class="operate-btn operate-btn-large" tabIndex="105" data-toggle="dropdown" id="lg_pattern" data-selected="1">
											<?php echo $lang['Account']; ?>
                                            <i class="o-lg-select"></i>
                                        </a>
                                        <ul class="dropdown-menu" role="menu" id="lg_pattern_menu">
                                            <li class="active" data-value="1" data-text="<?php echo $lang['Account']; ?>">
                                                <a href="javascript:;"><?php echo $lang['Account']; ?></a>
                                            </li>
                                            <li data-value="2" data-value="<?php echo $lang['Email']; ?>">
                                                <a href="javascript:;" ><?php echo $lang['Email']; ?></a>
                                            </li>
                                            <li data-value="3" data-value="<?php echo $lang['Job number']; ?>">
                                                <a href="javascript:;"><?php echo $lang['Job number']; ?></a>
                                            </li>
                                            <li data-value="4" data-value="<?php echo $lang['Cell phone']; ?>">
                                                <a href="javascript:;"><?php echo $lang['Cell phone']; ?></a>
                                            </li>
                                        </ul>
                                        <input type="hidden" value="1" name="logintype" id="lg_pattern_val" />
                                    </div>
                                </div>
                                <div class="login-item">
                                    <!-- <a href="#" class="o-lg-help" id="to_get_password" tabIndex="106" title="<?php echo $lang['Find pass']; ?>"></a> -->
                                    <div class="input-group mbs">
                                        <span class="input-group-addon addon-icon input-large">
                                            <i class="o-lg-lock"></i>
                                        </span>
                                        <input type="password" id="password" tabIndex="102" class="input-large" name="password"/>
                                    </div>
                                    <div>
										<?php if ( $account['autologin'] !== '-1' ): ?>
											<label class="checkbox checkbox-inline mbz">
												<input type="checkbox" name="autologin" tabIndex="103"/><?php echo $lang['Auto login']; ?>
											</label>
										<?php endif; ?>
                                    </div>
                                </div>
                                <div>
                                    <input type="submit" name="loginsubmit" value="<?php echo $lang['Login']; ?>" tabIndex="104" class="btn btn-primary btn-large btn-block">
                                    <input type="hidden" name="cookietime" value="<?php echo $cookietime; ?>" />
                                    <input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>" />
                                    <input type="hidden" name="refer" value="<?php echo Ibos::app()->user->getReturnUrl(); ?>" />
                                </div>
                            </div>
                            <div class="fill" id="get_password_panel" style="display: none;" >
                                <div>
                                    <label for="">Email（用于找回密码）</label>
                                    <input type="text" class="mb" name="find_email">
                                </div>
                                <div>
                                    <label for="">用户名</label>
                                    <input type="text" class="mb" name="find_username">
                                </div>
                                <div>
                                    <input type="submit" value="提交" class="btn btn-primary btn-widen">
                                    <button type="button" class="btn btn-widen pull-right" id="to_login">返回</button>
                                </div>
                            </div>
                        </form>   
                    </div>
                </div>
                <div class="login-panel-footer fill bglg bdrb">
					<?php if ( !empty( $announcement ) ): ?>
						<div class="media">
							<i class="pull-left o-lg-info"></i>
							<div class="media-body">
								<h5 class="lg-anc-title"><?php echo $announcement['subject']; ?></h5>
								<div class="lg-anc-content">
									<p class="fss" id="lg_anc_ct"><?php echo $announcement['message']; ?></p>
								</div>
							</div>
						</div>
					<?php endif; ?>
                </div>
            </div>
        </div>
        <!-- Footer -->
        <div class="footer">
            <div class="wrap">
                <!-- Quick link -->
                <div class="copyright">
                    <div class="quick-link">
                        <a target="_blank" href="http://www.ibos.com.cn"><?php echo Ibos::lang( 'Ibos help', 'default' ); ?></a>
                        <span class="ilsep">|</span>
                        <a target="_blank" href="http://www.ibos.com.cn"><?php echo Ibos::lang( 'Ibos feedback', 'default' ); ?></a>
                        <span class="ilsep">|</span>
                        <a target="_blank" href="<?php echo Ibos::app()->urlManager->createUrl( 'dashboard/' ); ?>" ><?php echo Ibos::lang( 'Control center', 'default' ); ?></a>
                        <span class="ilsep">|</span>
                        <a href="javascript:;" data-action="showCert"><?php echo Ibos::lang( 'Certificate of authorization', 'default' ); ?></a>
                        <span class="ilsep">|</span>
                        <a target="_blank" href="http://www.google.com/chromeframe/thankyou.html?extra=betachannel&hl=zh-CN&prefersystemlevel=true&statcb"><?php echo Ibos::lang( 'Chrome frame', 'default' ); ?></a>
                    </div>
                    Powered by <strong>IBOS <?php echo VERSION; ?> <?php echo VERSION_DATE; ?></strong>
					<?php if ( YII_DEBUG ): ?>
						Processed in <code><?php echo Ibos::app()->performance->endClockAndGet(); ?></code> second(s).
						<code><?php echo Ibos::app()->performance->getDbstats(); ?></code> queries. 
					<?php endif; ?>
                </div>
            </div>
        </div>
        <!-- load script  -->
        <script>
			var G = {
				VERHASH: '<?php echo VERHASH; ?>',
				SITE_URL: '<?php echo Ibos::app()->setting->get( 'siteurl' ); ?>',
				STATIC_URL: '<?php echo STATICURL; ?>',
				formHash: '<?php echo FORMHASH ?>',
				page: "login",
				"loginBg": [
<?php
$image = '';
foreach ( $loginBg as $bg ):
	$image .= '"' . File::fileName( LoginTemplate::BG_PATH . $bg['image'] ) . '"' . ',';
endforeach;
echo trim( $image, ',' );
?>
				]
			};

        </script>
        <script src='<?php echo STATICURL; ?>/js/lang/zh-cn.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/src/core.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/src/base.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/lib/artDialog/artDialog.min.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/lib/formValidator/formValidator.packaged.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/lib/qrcode/jquery.qrcode.min.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/src/common.js?<?php echo VERHASH; ?>'></script>
        <script src='<?php echo STATICURL; ?>/js/src/application.js?<?php echo VERHASH; ?>'></script>
        <!-- load script end -->
        <script>
			<?php if ( !empty( $qrcode ) ) { ?>
				var qrcode = '<?php echo $qrcode; ?>';
				Ibos.app.s("followWxUrl", 'http://www.ibos.com.cn/api/show/qrcode?qrcode=' + qrcode);
			<?php } ?>
				Ibos.app.s('loginQrcode', '<?php echo $randomcode; ?>');
				Ibos.app.s('wxbinding', '<?php echo $wxbinding; ?>');
	        </script>
	        <script src='<?php echo $assetUrl; ?>/js/login.js?<?php echo VERHASH; ?>'></script>
    </body>
</html>