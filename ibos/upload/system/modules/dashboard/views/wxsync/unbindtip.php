<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/home.css?<?php echo VERHASH; ?>">
<link href="<?php echo $this->getAssetUrl(); ?>/css/weixin.css" type="text/css" rel="stylesheet" />
<div class="ct sp-ct">
	<div class="clearfix">
		<h1 class="mt">微信企业号</h1>
	</div>
	<div class="ctb ps-type-title">
		<h2 class="st">已开启的应用</h2>
	</div>
	<div class="xac unbinding-warning-wrap">
		<div class="dib">
			<i class="o-unbinding-warning"></i>
		</div>
		<div class="dib wraning-opt-tip">
			<p class="fsl xcm mb">哎呀，<?php echo $msg; ?>哦！</p>
			<p class="mb xal">你还可以:</p>
			<p class="xal">
				<a href="javascript:;" id="callback_btn" class="btn">返回绑定页面</a>
			</p>
		</div>
	</div>
</div>
<script>
	$(function() {
		$("#callback_btn").on("click", function() {
			var url = "<?php echo $this->createUrl( 'wxbinding/index', array( 'refer' => '?r=dashboard/wxbinding/index' ) ); ?>";
			window.location.href = url;
		});

	});
</script>