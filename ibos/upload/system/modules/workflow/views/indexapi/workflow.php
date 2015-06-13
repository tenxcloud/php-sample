<?php 

use application\core\utils\Ibos;

?>
<link rel="stylesheet" href="<?php echo $assetUrl . '/css/index_workflow.css'; ?>">
<!-- IE 8 Hack 加入空script标签延迟html加载，为了让空值图片能正常显示 -->
<script></script>
<?php if ( !empty( $todo ) ): ?>
	<table class="table table-striped">
		<tbody>
			<?php foreach ( $todo as $run ): ?>
				<tr>
					<td>
						<div class="wk-text-nowrap">
							<a class="<?php if ( $run['flag'] == '1' ): ?>xwb xcbu<?php else: ?>xcm<?php endif; ?>" href="<?php echo Ibos::app()->createUrl( 'workflow/form/index', array( 'key' => $run['key'] ) ); ?>" target="_blank"><?php echo $run['runName']; ?></a> 
						</div>
					</td>
					<td width="120">
						<span class="label"><?php echo $run['flowprocess']; ?></span>
						<span class="fss">
							<a data-action="viewFlow" data-param="{&quot;key&quot;: &quot;<?php echo $run['key']; ?>&quot;}" href="javascript:void(0);"><?php echo $run['stepname']; ?></a>
						</span>
					</td>
					<td width="20">
						<?php if ( $run['focus'] ): ?><span class="o-yw-attention"></span><?php endif; ?>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<div class="mbox-base">
		<div class="fill-hn xac">
			<a href="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => 'list', 'type' => 'todo', 'sort' => 'all' ) ); ?>" class="link-more">
				<i class="cbtn o-more"></i>
				<span class="ilsep">查看更多待办工作</span>
			</a>
		</div>
	</div>
	<script>
		Ibos.evt.add({
			'viewFlow': function(param, $elem) {
				window.open(Ibos.app.url('workflow/preview/flow', param), "viewFlow");
			}
		});
	</script>
<?php else: ?>
	<div class="in-wf-empty"></div>
<?php endif; ?>