<?php


?>
<div class="ct">
	<div class="clearfix">
		<h1 class="mt">部门人员管理</h1>
	</div>
	<div>
		<!-- 部门信息 start -->
		<div class="ctb">
			<h2 class="st">编辑总公司</h2>
			<div class="">
				<form action="#" method="post" class="department-info-form form-horizontal" id="edit_corption_form">
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Enterprise fullname']; ?></label>
						<div class="controls">
							<input type="text" value="<?php echo $unit['fullname']; ?>" name="fullname" <?php if ( !empty( $license ) ): ?>disabled<?php endif; ?> placeholder="请输入企业全称" id="full_name" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Enterprise shortname']; ?></label>
						<div class="controls">
							<input type="text" name="shortname" value="<?php echo $unit['shortname']; ?>" placeholder="请输入企业简称" id="short_name" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Phone']; ?></label>
						<div class="controls">
							<input type="text" name="phone" id="phone" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Fax']; ?></label>
						<div class="controls">
							<input type="text" name="fax" id="fax" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label"><?php echo $lang['Zipcode']; ?></label>
						<div class="controls">
							<input type="text" name="zipcode" id="zipcode" />
						</div>
					</div>
					<div class="control-group">
						<label for="" class="control-label"><?php echo $lang['Admin email']; ?></label>
						<div class="controls">
							<input type="text" name="adminemail" id="adminemail" />
						</div>
					</div>
					<div class="control-group">
						<label for="" class="control-label"><?php echo $lang['Address']; ?></label>
						<div class="controls">
							<input type="text" name="address" id="address">
						</div>
					</div>
					<div class="control-group">
						<label class="control-label"></label>
						<div class="controls">
							<button type="submit" class="btn btn-primary btn-large btn-submit">保存</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<script src='<?php echo STATICURL; ?>/js/lib/formValidator/formValidator.packaged.js?<?php echo VERHASH; ?>'></script>