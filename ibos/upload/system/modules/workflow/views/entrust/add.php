<div>
	<form class="form-horizontal form-compact" id="entrust_form" method="post" action="<?php echo $this->createUrl( 'entrust/add' ); ?>">
		<div class="step-content">
			<div class="control-group"> 
				<label class="control-label"><?php echo $lang['Select process']; ?></label>
				<div class="controls">
					<input type="hidden" name="flowid" id="flow_select_input">
				</div>
			</div>
			<div class="control-group"> 
				<label class="control-label"><?php echo $lang['Be entrust user']; ?></label>
				<div class="controls">
					<input type="text" name="uid" id="be_entrust_user" />
				</div>
			</div>
			<div class="control-group"> 
				<label class="control-label"><?php echo $lang['Effective date']; ?></label>
				<div class="controls">
					<div class="datepicker" id="entrust_date_begin">
						<input type="text" class="datepicker-input" name="begindate">
						<a href="javascript:;" class="datepicker-btn"></a>
					</div>
				</div>
			</div>
			<div class="control-group"> 
				<label class="control-label"><?php echo $lang['End date']; ?></label>
				<div class="controls">
					<div class="datepicker" id="entrust_date_end">
						<input type="text" class="datepicker-input" name="enddate">
						<a href="javascript:;" class="datepicker-btn"></a>
					</div>
				</div>
			</div>
			<div class="control-group"> 
				<label class="control-label"><?php echo $lang['Always effective']; ?></label>
				<div class="controls">
					<input id="always_effected" type="checkbox" value="1" data-toggle="switch" />
				</div>
			</div>
		</div>
        <input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>">
	</form>
</div>
<script>
	Ibos.app.setPageParam("flowlist", $.parseJSON('<?php echo addslashes( json_encode( $flowlist ) ); ?>'));
	$.getScript(Ibos.app.getAssetUrl("workflow", "/js/workflow_entrust_add.js"));
</script>