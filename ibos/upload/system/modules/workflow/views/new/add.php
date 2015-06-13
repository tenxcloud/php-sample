<form class="form-horizontal form-compact" id="new_form" action="javascript:;">

	<?php if ( in_array( $flow['autoedit'], array( 2, 4 ) ) ): ?>
		<div class="control-group">
			<label for="runPrefix" class="control-label"><?php echo $lang['Prefix']; ?></label>
			<div class="controls">
				<input type="text" name="prefix" id="runPrefix"/>
			</div>
		</div>
	<?php endif; ?>

	<div class="control-group">
		<label for="runName" class="control-label"><?php echo $lang['Num slash name']; ?></label>
		<div class="controls">
			<input type="text" name="name" value="<?php echo $runName; ?>" <?php if ( $flow['autoedit'] !== '1' ): ?>readonly class="disabled"<?php endif; ?> id="runName" />
		</div>
	</div>

	<?php if ( in_array( $flow['autoedit'], array( 3, 4 ) ) ): ?>
		<div class="control-group">
			<label for="runSuffix" class="control-label"><?php echo $lang['Suffix']; ?></label>
			<div class="controls">
				<input type="text" name="suffix" id="runSuffix"/>
			</div>
		</div>
	<?php endif; ?>
	
	<!-- 关联主线 -->
	<?php if($isInstallThread): ?>
		<div class="control-group mbz">
			<label for="thread_select" class="control-label"><?php echo $lang['Associated with the thread']; ?></label>
			<div class="controls">
				<select name="threadid" id="thread_select">
					<option value="0"><?php echo $lang['Not associated']; ?></option>
					<?php foreach ( $threadList as $thread ): ?>
                    <option value="<?php echo $thread['threadid'] ?>" <?php if ( $threadid == $thread['threadid'] ): ?>selected<?php endif; ?>><?php echo $thread['subject']; ?></option>
					<?php endforeach; ?>
				</select>
			</div>
		</div>
	<?php endif; ?>
	<input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>" />
</form>
<script>
	function newFlowSubmitCheck() {
		<?php if ( $flow['forcepreset'] == '1' ): ?>
			var $prefix = $('#runPrefix'), $suffix = $('#runSuffix');
			if ($prefix.is('input')) {
				if ($prefix.val() === '') {
					Ui.tip(Ibos.l('WF.PREFIX_CANNOT_BE_EMPTY'), 'danger');
					$prefix.blink();
					return false;
				}
			}
			if ($suffix.is('input')) {
				if ($suffix.val() === '') {
					Ui.tip(Ibos.l('WF.SUFFIX_CANNOT_BE_EMPTY'), 'danger');
					$suffix.blink();
					return false;
				}
			}
		<?php endif; ?>
		var $runname = $('#runName');
		if ($runname.val() === '') {
			Ui.tip(Ibos.l('WF.RUNNAME_CANNOT_BE_EMPTY'), 'danger');
			$runname.blink();
			return false;
		}
		return true;
	}
	$('#new_form').find('input').eq(0).focus();

	// 如果安装了主线模块，则初始化关联主线功能 
	if(Ibos.app.g('mods').thread) {
		$('#thread_select').ibosSelect({ width: '100%' })
	}

</script>
