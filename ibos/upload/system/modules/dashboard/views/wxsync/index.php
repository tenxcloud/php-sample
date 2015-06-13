<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/home.css?<?php echo VERHASH; ?>">
<link href="<?php echo $this->getAssetUrl(); ?>/css/weixin.css" type="text/css" rel="stylesheet" />
<div class="ct sp-ct">
	<div class="clearfix">
		<h1 class="mt">企业号绑定设置</h1>
	</div>
	<div>
		<div class="ctb ps-type-title">
			<h2 class="st">同步数据</h2>
			<div class="alert trick-tip">
				<div class="trick-tip-title">
					<i></i>
					<strong>技巧提示</strong>
				</div>
				<div class="trick-tip-content">
					<ul class="trick-tip-list">
						<li>
							<span>点击“开始同步”后即可将微信企业号组织架构和所有人员的数据同步到IBOS</span>
						</li>
						<li>
							<span>IBOS未同步企业号指：OA用户由于某些个人信息不完善，导致没有将该类型用户同步至微信企业号后台的人数</span>
						</li>
						<li>
							<span>企业号未绑定IBOS是指：在微信企业号后台添加的新用户，但在OA没有对应添加该新用户的人数</span>
						</li>
					</ul>					
				</div>
			</div>
		</div>
		<div class="conpamy-info-wrap">
			<div class="clearfix" id="sync_opt_wrap">
				<div class="pull-left ml">
					<div class="bind-info-wrap mb">
						<div class="wrap-body fill-nn" id="wrap_body">
							<div>
								<ul class="list-inline">
									<li>
										<i class="o-weixin-tip"></i>
									</li>
									<li class="mlm">
										<i class="o-transport-right mbm"></i>
										<p class="mbs">同步组织架构与人员</p>
										<i class="o-transport-left mbm"></i>
									</li>
									<li class="mlm">
										<i class="o-ibos-tip"></i>
									</li>
								</ul>
							</div>
							<div>
								<p>
									<span>已绑定</span>
									<span class="fsl xwb"><?php echo $bindingCount; ?></span>
									<span>人</span>
								</p>
								<hr class="sync-hr"/>
								<div class="clearfix">
									<div class="pull-left xac">
										<p class="mbs">
											<span>IBOS未同步企业号</span>
											<span class="fsl xwb xcbu"><?php echo count( $oaUnbind ); ?></span>
											<span>人</span>
										</p>
										<div>
											<select multiple size="10" class="sync-data-select">
												<?php foreach ( $oaUnbind as $row ): ?>
													<option><?php echo $row['realname']; ?></option>
												<?php endforeach; ?>
											</select>
										</div>
									</div>
									<div class="pull-right xac">
										<p class="mbs">
											<span>企业号未绑定IBOS</span>
											<span class="fsl xwb xcbu"><?php echo count( $wxUnbind ); ?></span>
											<span>人</span>
										</p>
										<div>
											<select multiple size="10" class="sync-data-select">
												<?php foreach ( $wxUnbind as $row ): ?>
													<option><?php echo $row['name']; ?></option>
												<?php endforeach; ?>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="wrap-footer fill-nn xac" id="wrap_footer">
							<label class="checkbox mbs mls">
								<input type="checkbox" id="send_email" checked />
								<span>同步成功后自动向员工的邮箱发起关注邀请</span>
							</label>
							<button class="btn btn-primary strat-sync-btn" type="button" data-loading-text="同步数据中" data-action="syncData" data-url="<?php echo $this->createUrl( 'wxsync/synacdata' ); ?>" id="sync_data_btn">开始同步</button>
						</div>

					</div>
				</div>
			</div>
		</div>
		<script type="text/template" id="result_syncing_tpl">
			<div class="xac syncing-info-wrap">
			<ul class="list-inline mb">
			<li>
			<i class="o-weixin-tip"></i>
			</li>
			<li class="mlm">
			<i class="o-transport-right mbm"></i>
			<p class="mbs">同步组织架构与人员</p>
			<i class="o-transport-left mbm"></i>
			</li>
			<li class="mlm">
			<i class="o-ibos-tip"></i>
			</li>
			</ul>
			<p class="mbs">
			<span class="fsm xcbu"><%= data.msg %></span>
			</p>
			<div class="progress">
			<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="<%= data.percentage %>" aria-valuemin="0" aria-valuemax="100" style="width: <%= data.percentage %>%">
			</div>
			</div>
			</div>
		</script>
		<script type="text/template" id="result_success_tpl">
			<div class="xac result-info-wrap">
			<i class="o-opt-success mb"></i>
			<p class="mbm">
			<span class="fsl">成功同步</span>
			<span class="fsl xcbu"><%= data.successCount %></span>
			<span class="fsl">个员工信息</span>
			</p>
			</div>
		</script>
		<script type="text/template" id="result_sending_tpl">
			<div class="xac result-info-wrap">
			<i class="o-opt-success mb"></i>
			<p class="mbm">
			<span class="fsl">成功邀请关注</span>
			</p>
			</div>
		</script>
		<script type="text/template" id="result_half_tpl">
			<div class="xac result-info-wrap">
			<i class="o-opt-success mb"></i>
			<p class="mbm">
			<span class="fsl">成功同步</span>
			<span class="fsl xcbu"><%= data.successCount %></span>
			<span class="fsl">个员工信息</span>
			</p>
			<p class="mbs">
			<span class="fsl xcr"><%= data.errorCount %></span>
			<span class="fsl">个联系人无法同步</span>
			</p>
			<p class="mbs">
			<span>请根据错误信息修正并重新同步。</span>
			</p>
			<p>
			<a href="<%= data.downUrl %>" class="btn">下载错误信息</a>
			</p>
			</div>
		</script>
		<script type="text/template" id="result_error_tpl">
			<div class="xac result-info-wrap">
			<i class="o-opt-faliue mb"></i>
			<p class="mbs">
			<span class="fsl xcr"><%= data.errorCount %></span>
			<span class="fsl">个联系人无法同步</span>
			</p>
			<p class="mbs">
			<span>请根据错误信息修正并重新同步。</span>
			</p>
			<p>
			<a href="<%= data.downUrl %>" class="btn">下载错误信息</a>
			</p>
			</div>
		</script>
	</div>
</div>
<script type="text/javascript" src="<?php echo $this->getAssetUrl(); ?>/js/syncdata.js"></script>
<script type="text/javascript">
	$(function() {
		// 绑定的开关操作
		$("#bind_opt_checkbox").on("change", function() {
			var isbind = $(this).prop("checked"),
					status = isbind ? 1 : 0,
					param = {status: status},
			url = Ibos.app.url('dashboard/wxbinding/toggleSwitch');
			$.post(url, param, function(res) {
				if (res.isSuccess) {
					Ui.tip(res.msg);
					$("#sync_opt_wrap").toggle(isbind);
				} else {
					Ui.tip(res.msg, 'danger');
				}
			});
		});
	});
</script>