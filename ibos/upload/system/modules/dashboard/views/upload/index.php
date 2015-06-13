<?php 
use application\core\utils\Convert;
?>
<div class="ct">
	<div class="clearfix">
		<h1 class="mt"><?php echo $lang['Upload setting']; ?></h1>
	</div>
	<div>
		<form action="" method="post" class="form-horizontal">
			<!-- 上传设置 start -->
			<div class="ctb">
				<h2 class="st"><?php echo $lang['Upload setting']; ?></h2>
				<div class="ctbw">
					<div class="control-group">
						<label for="" class="control-label"><?php echo $lang['Local attachment dir']; ?></label>
						<div class="controls">
							<input type="text" name="attachdir" value="<?php echo $upload['attachdir']; ?>" />
						</div>
					</div>
					<div class="control-group">
						<label  class="control-label"><?php echo $lang['Local attachment url']; ?></label>
						<div class="controls">
							<input type="text" name="attachurl" value="<?php echo $upload['attachurl']; ?>">
						</div>
					</div>
					<!-- @Todo: php -->
					<div class="control-group">
						<label  class="control-label"><?php echo $lang['File type']; ?></label>
						<div class="controls">
							<input type="text" name="filetype" value="<?php echo $upload['filetype']; ?>" />
						</div>
					</div>
					<div class="control-group">
						<label  class="control-label"><?php echo $lang['File size limit']; ?></label>
						<div class="controls">
							<div class="row">
								<div class="span6">
									<div class="input-group">
										<input type="text" name="attachsize" value="<?php echo $upload['attachsize']; ?>" />
										<span class="input-group-addon">MB</span>		
										
									</div>
								</div>
							</div>
							环境最大限制：
										<?php 
											
											echo $size;
										?>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Thumb quality']; ?></label>
						<div class="controls" data-toggle="tooltip">
							<div id="thumbnail" data-value="<?php echo $upload['thumbquality']; ?>"></div>
							<input type="hidden" id="thumbquality" name="thumbquality" value="<?php echo $upload['thumbquality']; ?>">
						</div>
					</div>
				</div>
			</div>
			<!-- 水印设置 start -->
			<div class="ctb">
				<h2 class="st"><?php echo $lang['Watermark setup']; ?></h2>
				<div class="ctbw">
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Image watermark']; ?></label>
						<div class="controls">
							<input type="checkbox" name="watermarkstatus" value='1' id="watermark_enable" data-toggle="switch" class="visi-hidden" <?php if ( $waterMark['watermarkstatus'] == '1' ): ?>checked<?php endif; ?>>
						</div>
					</div>
					<div id="watermark_setup" <?php if ( $waterMark['watermarkstatus'] == '0' ): ?>style="display: none;"<?php endif; ?>>
						<div class="control-group">
							<label  class="control-label"><?php echo $lang['Watermark type']; ?></label>
							<div class="controls" id="watermark_type">
								<label class="radio" data-target="#watermark_type_photo">
									<input type="radio" value='image' name="watermarktype" <?php if ( $waterMark['watermarktype'] == 'image' ): ?>checked<?php endif; ?>/>
									<?php echo $lang['Watermark to image']; ?>
								</label>
								<label class="radio" data-target="#watermark_type_text">
									<input type="radio" value='text' name="watermarktype" <?php if ( $waterMark['watermarktype'] == 'text' ): ?>checked<?php endif; ?>>
									<?php echo $lang['Watermark to text']; ?>
								</label>
							</div>
						</div>
						<div class="control-group">
							<label  class="control-label"><?php echo $lang['Watermark position']; ?></label>
							<div class="controls">
								<div class="watermark" id="watermark_position">
									<label class="radius-tl"><input type="radio" <?php if ( $waterMark['watermarkposition'] == '1' ): ?>checked<?php endif; ?> value='1' name="watermarkposition" /></label>
									<label><input type="radio" value='2' <?php if ( $waterMark['watermarkposition'] == '2' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
									<label class="radius-tr"><input type="radio" value='3' <?php if ( $waterMark['watermarkposition'] == '3' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
									<label><input type="radio" value='4' <?php if ( $waterMark['watermarkposition'] == '4' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
									<label><input type="radio" value='5' <?php if ( $waterMark['watermarkposition'] == '5' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
									<label><input type="radio" value='6' <?php if ( $waterMark['watermarkposition'] == '6' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
									<label class="radius-bl"><input type="radio" value='7' <?php if ( $waterMark['watermarkposition'] == '7' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
									<label><input type="radio" value='8' name="watermarkposition" <?php if ( $waterMark['watermarkposition'] == '8' ): ?>checked<?php endif; ?> /></label>
									<label class="radius-br"><input type="radio" value='9' <?php if ( $waterMark['watermarkposition'] == '9' ): ?>checked<?php endif; ?> name="watermarkposition" /></label>
								</div>
							</div>
						</div>
						<div class="control-group">
							<label  class="control-label"><?php echo $lang['Watermark limit']; ?></label>
							<div class="controls">
								<div class="row">
									<div class="span6">
										<div class="input-group">
											<span class="input-group-addon"><?php echo $lang['Height']; ?></span>
											<input type="text" name="watermarkminheight" value='<?php echo $waterMark['watermarkminheight']; ?>'/>
											<span class="input-group-addon">px</span>
										</div>	
									</div>
									<div class="span6">
										<div class="input-group">
											<span class="input-group-addon"><?php echo $lang['Width']; ?></span>
											<input type="text" name="watermarkminwidth" value='<?php echo $waterMark['watermarkminwidth']; ?>' />
											<span class="input-group-addon">px</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div id="watermark_type_content">
							<!-- 图片水印 start -->
							<div id="watermark_type_photo" <?php if ( $waterMark['watermarktype'] !== 'image' ): ?>style="display: none;"<?php endif; ?>>
								<div class="control-group">
									<label  class="control-label"><?php echo $lang['Watermark image']; ?></label>
									<div class="controls">
										<div class="pull-left posr" id="upload_img_wrap">
											<img src="<?php echo $waterMark['watermarkimg']; ?>" class="custom-logo" id="upload_img">
										</div>
										<div class="pull-right">
											<span id="upload_btn"></span>
										</div>
										<div id="file_target"></div>
										<input type="hidden" name="watermarkimg" id="watermark_img" value="<?php echo $waterMark['watermarkimg']; ?>">
									</div>
								</div>
							</div>
							<!-- 图片水印 end -->
							<!-- 文字水印 start -->
							<?php $waterMark['watermarktext'] = unserialize( $waterMark['watermarktext'] ); ?>
							<div id="watermark_type_text" <?php if ( $waterMark['watermarktype'] !== 'text' ): ?>style="display: none;"<?php endif; ?>>
								<div class="control-group">
									<label  class="control-label"><?php echo $lang['Watermark fontpath']; ?></label>
									<div class="controls">
										<select id='watermark_fontpath' name='watermarktext[fontpath]'>
											<?php foreach ( $fontPath as $font ): ?>
												<option <?php if ( $waterMark['watermarktext']['fontpath'] === $font ): ?>selected<?php endif; ?> value='<?php echo $font; ?>'><?php echo $font; ?></option>
											<?php endforeach; ?>
										</select>
										<p class='help-block'>
											<?php echo $lang['Watermark font tip']; ?>
										</p>
									</div>
								</div>
								<div class="control-group">
									<label class="control-label"><?php echo $lang['Watermark text']; ?></label>
									<div class="controls">
										<input type="text" id="watermark_text" name="watermarktext[text]" value="<?php echo $waterMark['watermarktext']['text']; ?>">
									</div>
								</div>
								<div class="control-group">
									<label class="control-label"><?php echo $lang['Watermark text size']; ?></label>
									<div class="controls">
										<div class="input-group">
											<input type="text" id="watermark_text_size" name="watermarktext[size]" value="<?php echo $waterMark['watermarktext']['size']; ?>">
											<span class="input-group-addon">px</span>
										</div>
									</div>
								</div>
								<div class="control-group">
									<label  class="control-label"><?php echo $lang['Watermark text color']; ?></label>
									<div class="controls">
										<input type="hidden" name='watermarktext[color]' id="watermark_color_value" value="<?php echo $waterMark['watermarktext']['color']; ?>">
										<div class="input-group">
											<button type="button" href="javascript:;" id="watermark_color_ctrl" class="btn btn-fix" style="background-color: rgb(<?php echo implode( ',', Convert::hexColorToRGB( $waterMark['watermarktext']['color'] ) ); ?>)"></button>
										</div>
									</div>
								</div>
							</div>
							<!-- 文字水印 end -->
						</div>
						<div class="control-group">
							<label  class="control-label"><?php echo $lang['Watermark transparency']; ?></label>
							<div class="controls">
								<div id="watermark_opacity" data-value="<?php echo $waterMark['watermarktrans']; ?>"></div>
								<input type="hidden" id="watermarktrans" name="watermarktrans" value="<?php echo $waterMark['watermarktrans']; ?>">
							</div>
						</div>
						<div class="control-group">
							<label  class="control-label"><?php echo $lang['Image quality']; ?></label>
							<div class="controls">
								<div id="photo_quality" data-value="<?php echo $waterMark['watermarkquality']; ?>"></div>
								<input type="hidden" id="watermarkquality" name="watermarkquality" value="<?php echo $waterMark['watermarkquality']; ?>">
							</div>
						</div>
						<div class="control-group">
							<label  class="control-label"><?php echo $lang['Watermark review']; ?></label>
							<div class="controls">
								<button class="btn" data-type="watermark-review" type="button"><?php echo $lang['Click to review']; ?></button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label"></label>
				<div class="controls">
					<button type="submit" name="uploadSubmit" class="btn btn-primary btn-large btn-submit"><?php echo $lang['Submit']; ?></button>
				</div>
			</div>
		</form>
	</div>
</div>
<script src="<?php echo STATICURL; ?>/js/lib/SWFUpload/swfupload.packaged.js?<?php echo VERHASH; ?>"></script>
<script src="<?php echo STATICURL; ?>/js/lib/SWFUpload/handlers.js?<?php echo VERHASH; ?>"></script>
<!-- Todo:代码抽取到 js 文件中 -->
<script>
	$(document).ready(function() {
		var logoUpload = Ibos.upload.image({
			// Backend Settings
			upload_url: 			Ibos.app.url("dashboard/upload/index", { op: "upload"}),
			file_post_name: 		'watermark',
			file_types: 			"*.jpg; *.jpeg; *.png",
			custom_settings: {
				//图片显示节点
				success: function(file, data){
					Dom.byId("upload_img").src = Dom.byId("watermark_img").value = data.url;
				},
				progressId: 'upload_img_wrap'
			}
		});
		$("#thumbnail, #watermark_opacity, #photo_quality").each(function() {
			$(this).ibosSlider({
				range: 'min',
				scale: 5,
				tip: true,
				target: "next"
			});
		});

		new P.Tab($("#watermark_type"), "label");

		// 水印开关
		$("#watermark_enable").on("change", function() {
			$("#watermark_setup").toggle();
		});

		// 图片水印位置选择
		$("#watermark_position").on("click", "label", function(){
			$(this).addClass("active").siblings().removeClass("active");
		});

		// 水印颜色选择
		var $watermarkColorCtrl = $("#watermark_color_ctrl"),
				$watermarkColorValue = $('#watermark_color_value');
		$watermarkColorValue.colorPicker({
			ctrl: $watermarkColorCtrl,
			mode: 'simple',
			onPick: function(hex, title) {
				$watermarkColorCtrl.css('background-color', hex);
				$watermarkColorValue.val(hex);
			}
		});
		// 水印预览
		$('[data-type="watermark-review"]').on('click', function() {
			var waterMarkType = $('input[name="watermarktype"]:checked').val(),
				$imgTarget = $('#watermark_img'),
				$textTarget = $('#watermark_text'),
				params = {
					trans: $('#watermarktrans').val(),
					quality: $('#watermarkquality').val(),
					type: '',
					val: '',
					pos: $('input[name="watermarkposition"]:checked').val(),
					textcolor: $('#watermark_color_value').val(),
					size: $('#watermark_text_size').val(),
					fontpath: $('#watermark_fontpath').val()
				};

			if (waterMarkType === 'image') {
				params.val = $imgTarget.val();
				if ($.trim(params.val) === '') {
					Ui.tip('<?php echo $lang['Upload picture first']; ?>', 'danger');
					return false;
				}
				params.type = 'image';
			} else if (waterMarkType === 'text') {
				params.val = $textTarget.val();
				if ($.trim(params.val) === '') {
					$textTarget.blink();
					return false;
				}
				params.type = 'text';
			}
			var dialog = Ui.dialog({
				id: 'review_box',
				title: '<?php echo $lang['Watermark preview']; ?>',
				width: '500px',
				cancel: true
			});
			// 加载对话框内容
			$.ajax({
				url: Ibos.app.url("dashboard/upload/index", { op: "waterpreview" }),
				data: $.param(params),
				success: function(data) {
					dialog.content(data);
				},
				cache: false
			});
		});

		$('input[name="watermarkposition"]:checked').parent().addClass('active');
	});
</script>