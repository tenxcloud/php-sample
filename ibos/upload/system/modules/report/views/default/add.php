<!-- private css -->
<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/report.css?<?php echo VERHASH; ?>">
<!-- Mainer -->
<div class="wrap">
	<div class="mc clearfix">
		<!-- Sidebar -->
		<?php echo $this->getSidebar(); ?>
		<!-- Mainer right -->
		<form action="<?php echo $this->createUrl( 'default/add' , array( 'op' => 'save' ) ); ?>" id="report_form" method="post">
			<div class="mcr">
				<div class="page-list">
					<div class="ctform">
						<div class="mb">
							<input type="text" name="subject" id="" value="<?php echo $subject; ?>">
						</div>
						<div>
							<label><?php echo $lang['Reporting to'] ?></label>
							<input type="text" name="toid" id="rp_to" value="<?php if($upUid): echo $upUid; endif; ?>">
							<div id="rp_to_box"></div>
						</div>
					</div>
					<div class="page-list-mainer">
						<table class="rp-detail-table">
							<!-- 工作小结 -->
							<tbody id="rp_complete">
								<tr>
									<td colspan="3">
										<div class="fill-ss">
											<!-- 计划时间 -->
											<div class="pull-right">
												<div class="calendar-group pull-left">
													<div class="datepicker form_datetime" id="date_summary_start" data-value="<?php echo $summaryAndPlanDate['summaryBegin']; ?>">
														<a href="javascript:;" class="datepicker-btn" ></a>
														<input type="text" class="datepicker-input" id="summary_start_time" name="begindate" value="<?php echo $summaryAndPlanDate['summaryBegin']; ?>">
													</div>
													<span class="sep"><?php echo $lang['To']; ?></span>
													<div class="datepicker form_datetime" id="date_summary_end">
														<a href="javascript:;" class="datepicker-btn"></a>
														<input type="text" class="datepicker-input" id="summary_end_time" name="enddate" value="<?php echo $summaryAndPlanDate['summaryEnd']; ?>">
													</div>
												</div>
												<div class="btn-group ml">
													<button type="button" class="btn" id="date_summary_prev" data-action="prevSummaryDate" data-param='{"type": "<?php echo $intervaltype; ?>", "intervals": "<?php echo $intervals; ?>" }'>
														<i class="glyphicon-chevron-left"></i>
													</button>
													<button type="button" class="btn" id="date_summary_next" data-action="nextSummaryDate" data-param='{"type": "<?php echo $intervaltype; ?>", "intervals": "<?php echo $intervals; ?>" }'>
														<i class="glyphicon-chevron-right"></i>
													</button>
												</div>
											</div>
											<h4><?php echo $lang['Work summary']; ?></h4>
										</div>
									</td>
								</tr>
								<!-- 原计划 -->
								<?php if(!empty($orgPlanList)): ?>
								<tr>
									<th width="68" class="sep"><?php echo $lang['Original plan']; ?></th>
									<td width="3" class="sep"></td>
									<td>
										<ul class="np-list" id="rp_in_plan_list">
											<?php foreach($orgPlanList as $k => $orgPlan): ?>
											<li class="np-list-row">
												<div class="bamboo-pgb pull-right">
													<span class="pull-left xcn fss" id="processbar_info_<?php echo $orgPlan['recordid'] ?>">100%</span>
													<span  data-toggle="bamboo-pgb" data-id="<?php echo $orgPlan['recordid'] ?>"></span>
													<input type="hidden" id="processinput_<?php echo $orgPlan['recordid'] ?>" name="orgPlan[<?php echo $orgPlan['recordid'] ?>][process]" value="10">
												</div>
												<span class="rp-detail-num" data-toggle="badge"><?php echo $k+1 ?>.</span> <?php echo $orgPlan['content']; ?>
												<div class="rp-exec-status">
													<input type="text" name="orgPlan[<?php echo $orgPlan['recordid'] ?>][exedetail]" class="input-small span7" placeholder="<?php echo $lang['Implementation for click typing']; ?>">
												</div>
											</li>
											<?php endforeach; ?>
										</ul>
									</td>
								</tr>
								<?php endif; ?>
								<!-- 计划外 -->
								<tr>
									<th width="68" class="sep"><?php echo $lang['Outside plan']; ?></th>
									<td width="3" class="sep"></td>
									<td>
										<ul class="np-list bdbs" id="rp_out_plan_list"></ul>
										<div class="fill-sn">
											<a href="javascript:;" class="add-one" id="rp_report_add">
												<i class="cbtn o-plus"></i>
												<?php echo $lang['Add one item']; ?>
											</a>
										</div>
									</td>
								</tr>
							</tbody>
							<tbody>
								<!-- 工作总结 -->
								<tr>
									<th class="sep" width="68"><?php echo $lang['Work']; ?><br /><?php echo $lang['Summary']; ?></th>
									<td class="sep" width="3"></td>
									<td>
										<div style="min-height: 375px">
											<script type="text/plain" name="content" id="editor"></script>
										</div>
									</td>
								</tr>
								<!-- 附件 -->
								<tr>
									<th class="sep" width="68"><?php echo $lang['Attachement']; ?></th>
									<td class="sep" width="3"></td>
									<td>
										<div class="att">
										<div class="attb">
											<span id="upload_btn"></span>
											<button type="button" class="btn btn-icon vat" data-action="selectFile" data-param='{"target": "#file_target", "input": "#attachmentid"}'>
                                                <i class="o-folder-close"></i>
                                            </button>
										</div>
										<div>
											<div class="attl" id="file_target"></div>
										</div>
									</div>
									</td>
									<input type="hidden" name="attachmentid" id="attachmentid" />
								</tr>
							</tbody>
							<!-- 计划 -->
							<tbody id="rp_plan">
								<tr>
									<td colspan="3">
										<div class="fill-ss">
											<div class="pull-right">
												<div class="calendar-group pull-left">
													<div class="datepicker form_datetime" id="date_plan_start" data-value="<?php echo $summaryAndPlanDate['planBegin']; ?>">
														<a href="javascript:;" class="datepicker-btn" ></a>
														<input type="text" class="datepicker-input" id="plan_start_time" name="planBegindate" value="<?php echo $summaryAndPlanDate['planBegin']; ?>">
													</div>
													<span class="sep"><?php echo $lang['To']; ?></span>
													<div class="datepicker form_datetime" id="date_plan_end">
														<a href="javascript:;" class="datepicker-btn" ></a>
														<input type="text" class="datepicker-input" id="plan_end_time" name="planEnddate" value="<?php echo $summaryAndPlanDate['planEnd']; ?>">
													</div>
												</div>
												<div class="btn-group ml">
													<button type="button" class="btn" id="date_plan_prev" data-action="prevPlanDate" data-param='{"type": "<?php echo $intervaltype; ?>", "intervals": "<?php echo $intervals; ?>" }'>
														<i class="glyphicon-chevron-left"></i>
													</button>
													<button type="button" class="btn" id="date_plan_next" data-action="nextPlanDate" data-param='{"type": "<?php echo $intervaltype; ?>", "intervals": "<?php echo $intervals; ?>" }'>
														<i class="glyphicon-chevron-right"></i>
													</button>
												</div>
											</div>
											<h4><?php echo $lang['Work plan']; ?></h4>
										</div>
									</td>
								</tr>
								<tr>
									<th width="68" class="sep"><?php echo $lang['Work']; ?><br /><?php echo $lang['Plan'] ?></th>
									<td width="3" class="sep"></td>
									<td>
										<ul class="np-list bdbs" id="rp_new_plan_list">
										</ul>
										<div class="fill-sn">
											<a href="javascript:;" class="add-one" id="rp_plan_add">
												<i class="cbtn o-plus"></i>
												<?php echo $lang['Add one item']; ?>
											</a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<div class="fill-sn">
							<button type="button" class="btn btn-large btn-submit" onclick="history.back();"><?php echo $lang['Return']; ?></button>
							<button type="submit" class="btn btn-large btn-submit btn-primary pull-right"><?php echo $lang['Save']; ?></button>
						</div>
					</div>
				</div>
				<!-- Mainer content -->
			</div>
			<input type="hidden" name="typeid" value="<?php echo $typeid; ?>" />
			<input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>" />
		</form>
	</div>
</div>

<!-- @Template: 新建工作小结模板 -->
<script type="text/template" id="tpl_rp_out_plan">
	<li class="np-list-row" data-id="<%= id %>">
		<div class="bamboo-pgb pull-right">
			<a href="javascript:;" class="o-trash cbtn pull-right ml" title="<%= Ibos.l('DELETE') %>" data-id="<%= id %>"></a>
			<span class="pull-left fss xcn" id="processbar_info_<%= id %>">100%</span>
			<span data-toggle="bamboo-pgb" data-id="<%= id %>"></span>
			<input type="hidden" id="processinput_<%= id %>" name="outSidePlan[<%= id %>][process]" value="10" />
		</div>
		<span class="rp-detail-num" data-toggle="badge"><%= index %>.</span>
		<input type="text" name="outSidePlan[<%= id %>][content]" data-id="<%= id %>" class="rp-input span7" placeholder="<%= Ibos.l('RP.CLICK_TO_WRITE_RECORD') %>">
	</li>
</script>

<!-- @Template: 新建工作计划模板 -->
<script type="text/template" id="tpl_rp_new_plan">
	<li class="np-list-row" data-id="<%= id %>">
		<div class="vernier rp-vernier-item"></div>
		<input type="hidden" name="nextPlan[<%= id %>][reminddate]" class="remind-value" nofocus>
		<div class ="rp-vernier-size"></div>
		<div class="posr">
			<div class="pull-right">
				<% if(Ibos.app.g("isInstallCalendar") == 1){ %>
					<div class="rp-remind-bar">
						<i class="o-clock"></i>
						<span class="remind-time"></span> 
						<a href="javascript:;" class="o-close-small"></a>
					</div>
					<a href="javascript:;" class="co-clock remind-time-btn" title="<%= Ibos.l('RP.SETUP_REMIND') %>"></a>
				<% } %>
				<a href="javascript:;" class="cbtn o-trash mlm" data-id="<%= id %>" title="<%= Ibos.l('DELETE') %>"></a>
			</div>
			<span class="rp-detail-num" data-toggle="badge"><%= index %></span>
			<input type="text" name="nextPlan[<%= id %>][content]" class="rp-input span7" data-id="<%= id %>" placeholder="<%= Ibos.l('RP.CLICK_TO_WRITE_PLAN') %>" >
		</div>
	</li>
</script>
<script>
	Ibos.app.s({
		"isInstallCalendar": "<?php echo $isInstallCalendar ?>"
	});
</script>

<script src='<?php echo STATICURL; ?>/js/lib/ueditor/editor_config.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo STATICURL; ?>/js/lib/ueditor/editor_all_min.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo STATICURL; ?>/js/lib/SWFUpload/swfupload.packaged.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo STATICURL; ?>/js/lib/SWFUpload/handlers.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo STATICURL; ?>/js/lib/moment.min.js?<?php echo VERHASH; ?>'></script>

<script src='<?php echo $assetUrl; ?>/js/lang/zh-cn.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/report.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/reportcm.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/report_type.js?<?php echo VERHASH; ?>'></script>
