<?php 

use application\core\utils\String;

?>
<!-- private css -->
<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/workflow.css?<?php echo VERHASH; ?>">
<div class="mc clearfix">
	<!--sidebar-->
	<?php echo $this->widget( 'application\modules\workflow\widgets\ListSidebar', array(), true ); ?>
	<!--右栏 开始-->
	<div class="mcr">
		<div class="page-list clearfix">
			<!--右栏头部功能栏 开始-->
			<div class="page-list-header" id="cancel_attention">
				<button type="button" data-action="cancelFocus" class="btn pull-left cancel-attention"><?php echo $lang['Cancel focus']; ?></button>
				<form action="<?php echo $this->createUrl( 'focus/index', array( 'op' => 'search' ) ); ?>" method="post">
					<div class="search pull-right span4">
						<input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>" />
						<input type="text" name="keyword" id="mn_search" placeholder="<?php echo $lang['Search tip']; ?>" nofocus>
						<a href="javascript:;"></a>
					</div>
				</form>
			</div>
			<!--右栏头部功能栏 结束-->
			<!--右栏列表 开始-->
			<?php if ( !empty( $list ) ): ?>
				<div class="page-list-mainer xcm">
					<table class="table table-hover table-striped table-attention" id="table_attention">
						<thead>
							<tr>
								<th width="16">
									<label class="checkbox">
										<input type="checkbox" data-name="runid[]" />
									</label>
								</th>
								<th><?php echo $lang['Name']; ?></th>
								<th width="100"><?php echo $lang['Originator']; ?></th>
								<th width="202"><?php echo $lang['Steps and flow chart']; ?></th>
								<th width="20"></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( $list as $run ) : ?>
								<tr id="list_tr_<?php echo $run['runid']; ?>">
									<td>
										<label class="checkbox">
											<input type="checkbox" name="runid[]" value="<?php echo $run['runid']; ?>"/>
										</label>
									</td>
									<td>
										<div class="com-list-name">
											<em class="text-nowrap"><a class="xcm" title="<?php echo $run['runName']; ?>" target="_blank" href="<?php echo $this->createUrl( 'preview/print', array( 'key' => $run['key'] ) ); ?>"><?php echo String::cutStr( $run['runName'], 25 ); ?></a></em>
											<span class="fss tcm posa">[<?php echo $run['runid']; ?>]<?php echo $run['typeName']; ?></span>
										</div>
									</td>
									<td>
										<a data-toggle="usercard" data-param="uid=<?php echo $run['user']['uid']; ?>" href="<?php echo $run['user']['space_url']; ?>" class="avatar-circle" title="<?php echo $run['user']['realname']; ?>">
											<img src="<?php echo $run['user']['avatar_middle']; ?>" />
										</a>
										<span class="fss"><?php echo $run['user']['realname']; ?></span>
									</td>
									<td>
										<?php if ( $run['type'] == '1' ): ?>
											<span class="label"><?php echo $run['flowprocess']; ?></span>
											<span class="fss dib step-text-nowrap">
												<a href="javascript:void(0);" data-click="viewFlow" data-param="{&quot;key&quot;: &quot;<?php echo $run['key']; ?>&quot;}"><?php echo $run['stepname']; ?><?php if ( isset( $run['sign'] ) ): ?>(<span class="type-host"><?php echo $lang['Sign']; ?></span>)<?php endif; ?></a>
											</span>
										<?php else: ?>
											<?php echo $run['stepname']; ?>
										<?php endif; ?>
									</td>
									<td>
										<i class="o-mt-attention" data-param="<?php echo $run['runid']; ?>" data-click="focus"></i>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
				<!--右栏列表 结束-->
				<!--右栏底部功能栏 开始-->
				<div class="page-list-footer">
					<div class="page-num-select">
						<div class="btn-group dropup">
							<?php $pageSize = $pages->getPageSize(); ?>
							<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" id="page_num_ctrl">
								<i class="o-setup"></i><span><?php echo $lang['Each page']; ?> <?php echo $pageSize; ?></span><i class="caret"></i>
							</a>
							<ul class="dropdown-menu" id="page_num_menu" data-url="" >
								<li <?php if ( $pageSize == 10 ): ?>class="active"<?php endif; ?>>
									<a href="<?php echo $this->createUrl( 'focus/index', array('pagesize' => '10') ); ?>"><?php echo $lang['Each page']; ?> 10</a>
								</li>
								<li <?php if ( $pageSize == 20 ): ?>class="active"<?php endif; ?>>
									<a href="<?php echo $this->createUrl( 'focus/index', array('pagesize' => '20') ); ?>"><?php echo $lang['Each page']; ?> 20</a>
								</li>
								<li <?php if ( $pageSize == 30 ): ?>class="active"<?php endif; ?>>
									<a href="<?php echo $this->createUrl( 'focus/index', array('pagesize' => '30') ); ?>"><?php echo $lang['Each page']; ?> 30</a>
								</li>
								<li <?php if ( $pageSize == 40 ): ?>class="active"<?php endif; ?>>
									<a href="<?php echo $this->createUrl( 'focus/index', array('pagesize' => '40') ); ?>"><?php echo $lang['Each page']; ?> 40</a>
								</li>
								<li <?php if ( $pageSize == 50 ): ?>class="active"<?php endif; ?>>
									<a href="<?php echo $this->createUrl( 'focus/index', array('pagesize' => '50') ); ?>"><?php echo $lang['Each page']; ?> 50</a>
								</li>
							</ul>
						</div>
					</div>
					<div class="pull-right">
						<?php $this->widget( 'application\core\widgets\Page', array( 'pages' => $pages ) ); ?>
					</div>
				</div>
			<?php else: ?>
				<div class="no-data-tip"></div>
			<?php endif; ?>
		</div>
		<!--右栏 结束-->
	</div>
</div>
<script src='<?php echo $assetUrl; ?>/js/lang/zh-cn.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/wfcommon.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/workflow_focus_index.js?<?php echo VERHASH; ?>'></script>

