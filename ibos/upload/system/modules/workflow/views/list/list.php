<?php 

use application\core\utils\Ibos;

?>
<!-- private css -->
<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/workflow.css?<?php echo VERHASH; ?>">
<div class="mc clearfix">
	<!--sidebar-->
	<?php echo $this->widget( 'application\modules\workflow\widgets\ListSidebar', array(), true ); ?>
	<div class="mcr">
		<div class="mc-header">
			<ul class="mnv clearfix">
				<li <?php if ( $type == 'todo' ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => 'todo', 'sort' => $sort ) ); ?>">
						<i class="o-nav-works"></i>
						<?php echo $lang['Todo work']; ?>
						<?php if($new != 0): ?><span class="bubble"><?php echo $new;?></span><?php endif; ?>
					</a>
				</li>
				<li <?php if ( $type == 'trans' ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => 'trans', 'sort' => $sort ) ); ?>">
						<i class="o-nav-finish"></i>
						<?php echo $lang['Have been transferred']; ?>
					</a>
				</li>
				<li <?php if ( $type == 'done' ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => 'done', 'sort' => $sort ) ); ?>">
						<i class="o-nav-over"></i>
						<?php echo $lang['Has been completed']; ?>
					</a>
				</li>
				<li <?php if ( $type == 'delay' ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => 'delay', 'sort' => $sort ) ); ?>">
						<i class="o-nav-stop"></i>
						<?php echo $lang['Has been postponed']; ?>
						<?php if($countDelay != 0): ?><span class="bubble"><?php echo $countDelay;?></span><?php endif; ?>
					</a>
				</li>
			</ul>
		</div>
		<div class="page-list clearfix">
			<div class="page-list-header">
				<button type="button" data-click="export" class="btn export-btn pull-left"><?php echo $lang['Export']; ?></button>
				<div class="btn-toolbar pull-right span7 posr">
					<div class="btn-group">
						<button type="button" class="btn dropdown-toggle toggle-all-btn" data-toggle="dropdown">
							<?php echo $sortText; ?> <span class="caret"></span>
						</button>
						<ul class="dropdown-menu" role="menu">
                            <li <?php if ( $sort == 'all' ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => $type, 'sort' => 'all' ) ); ?>"><?php echo $lang['All of it']; ?></a></li>
                            <li <?php if ( $sort == 'host' ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => $type, 'sort' => 'host' ) ); ?>"><?php echo $lang['Host work']; ?></a></li>
                            <li <?php if ( $sort == 'sign' ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => $type, 'sort' => 'sign' ) ); ?>"><?php echo $lang['Sign']; ?></a></li>
                            <li <?php if ( $sort == 'rollback' ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => $type, 'sort' => 'rollback' ) ); ?>"><?php echo $lang['Rollback']; ?></a></li>
						</ul>
					</div>
					<div class="btn-group">
						<a title="<?php echo $lang['List view']; ?>" class="btn btn-display-list <?php if ( $op == 'list' ): ?>active<?php endif; ?>" href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'list', 'type' => $type, 'sort' => $sort ) ); ?>"><i class="o-display-list"></i></a>
						<a title="<?php echo $lang['Category view']; ?>" class="btn btn-display-classity <?php if ( $op == 'category' ): ?>active<?php endif; ?>" href="<?php echo $this->createUrl( 'list/index', array( 'op' => 'category', 'type' => $type, 'sort' => $sort ) ); ?>"><i class="o-display-category"></i></a>
					</div>
					<form action="#" method="post" id="search_form">
						<div class="search span7 posa" style="top:0px; left:185px;">
							<input type="text" placeholder="<?php echo $lang['Search tip']; ?>" name="keyword" id="mn_search" nofocus />
							<a href="javascript:;">search</a>
							<input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>" />
							<input type="hidden" name="op" value="<?php echo $op; ?>" />
							<input type="hidden" name="type" value="<?php echo $type; ?>" />
							<input type="hidden" name="sort" value="<?php echo $sort; ?>" />
						</div>
					</form>
				</div>
			</div>
			<?php
			echo $this->widget( 'application\modules\workflow\widgets\ListView', array(
				'type' => $type,
				'sort' => $sort,
				'op' => 'list',
				'flowid' => $flowId,
				'uid' => Ibos::app()->user->uid,
				'keyword' => $keyword,
				'pageSize' => $this->getListPageSize(),
				'flag' => $flag ), true
			);
			?>
		</div><!-- end pagelist-->
	</div><!-- end mcr-->
</div><!-- end mc-->
<div id="dialog_delay">
	<ul>
		<li>
			<label class="radio">
				<input type="radio" name="delay-time" checked value="1" />明天
			</label>
		</li>
		<li>
			<label class="radio">
				<input type="radio" name="delay-time" value="2" />后天
			</label>
		</li>
		<li>
			<label class="radio">
				<input type="radio" name="delay-time" value="3" />下周 (<?php echo date( 'Y-m-d', strtotime( '+1 week' ) ); ?>)
			</label>
		</li>
		<li>
			<label class="radio">
				<input type="radio" name="delay-time" value="4" />自定义
			</label>
		</li>
		<li>
			<div class="datepicker delay-time" id="custom_time_datepicker">
				<input type="text" id="custom_time" class="datepicker-input custom-time" value="<?php echo date( 'Y-m-d', strtotime( '+1 day' ) ); ?>" readonly>	
				<a href="javascript:;" class="datepicker-btn"></a>
			</div>
		</li>
	</ul>
</div>

<script src='<?php echo $assetUrl; ?>/js/lang/zh-cn.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/wfcommon.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/wfmywork.js?<?php echo VERHASH; ?>'></script>
