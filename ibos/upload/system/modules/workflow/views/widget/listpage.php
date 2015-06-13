<?php

use application\core\utils\Ibos;

?>
<div class="page-list-footer">
	<div class="page-num-select">
		<div class="btn-group dropup">
			<?php $pageSize = $pages->getPageSize(); ?>
			<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" id="page_num_ctrl" data-selected="<?php echo $pageSize; ?>" data-url="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => 'list', 'type' => $type, 'sort' => $sort ) ); ?>">
				<i class="o-setup"></i><span><?php echo $lang['Each page']; ?> <?php echo $pageSize; ?></span><i class="caret"></i>
			</a>
			<ul class="dropdown-menu" id="page_num_menu" data-url="" >
				<li <?php if ( $pageSize == 10 ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => $op, 'type' => $type, 'sort' => $sort, 'pagesize' => 10 ) ); ?>"><?php echo $lang['Each page']; ?> 10</a>
				</li>
				<li <?php if ( $pageSize == 20 ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => $op, 'type' => $type, 'sort' => $sort, 'pagesize' => 20 ) ); ?>"><?php echo $lang['Each page']; ?> 20</a>
				</li>
				<li <?php if ( $pageSize == 30 ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => $op, 'type' => $type, 'sort' => $sort, 'pagesize' => 30 ) ); ?>"><?php echo $lang['Each page']; ?> 30</a>
				</li>
				<li <?php if ( $pageSize == 40 ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => $op, 'type' => $type, 'sort' => $sort, 'pagesize' => 40 ) ); ?>"><?php echo $lang['Each page']; ?> 40</a>
				</li>
				<li <?php if ( $pageSize == 50 ): ?>class="active"<?php endif; ?>>
					<a href="<?php echo Ibos::app()->createUrl( 'workflow/list/index', array( 'op' => $op, 'type' => $type, 'sort' => $sort, 'pagesize' => 50 ) ); ?>"><?php echo $lang['Each page']; ?> 50</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="pull-right">
		<?php $this->widget( 'application\core\widgets\Page', array( 'pages' => $pages ) ); ?>
	</div>
</div>