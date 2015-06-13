<?php
use application\core\utils\Ibos;
use application\modules\dashboard\utils\Wx;
?>
<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/home.css?<?php echo VERHASH; ?>">
<link href="<?php echo $this->getAssetUrl(); ?>/css/weixin.css" type="text/css" rel="stylesheet" />
<div class="ct sp-ct">
	<div class="clearfix">
		<h1 class="mt">绑定微信企业号， 体验IBOS微办公！</h1>
	</div>
	<div class="ctb ps-type-title">
		<h2 class="st">企业号绑定流程引导</h2>
	</div>
	<div class="conpamy-info-wrap binding-info-wrap">
		<iframe src="<?php echo Wx::getInstance()->getBindingSrc(); ?>" name="<?php echo Ibos::app()->setting->get( 'siteurl' ) . '?r=dashboard'; ?>" class="setting-bind-iframe">
			<div class="fill-nn step-tip-content" id="bind_apply_content">

			</div>
		</iframe>
	</div>
</div>