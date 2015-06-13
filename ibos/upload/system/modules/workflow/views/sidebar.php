<!-- Sidebar -->
<div class="aside">
	<div class="sbb sbbf sbbl">
		<ul class="nav nav-strip nav-stacked">
			<li<?php if ( $op == 'type' ): ?> class="active"<?php endif; ?>>
				<a href="<?php echo $this->createUrl( 'type/index' ); ?>">
					<i class="o-wf-manage"></i>
					<?php echo $lang['Workflow manager']; ?>
				</a>
				<?php if ( $op == 'type' ): ?>
					<ul class="sbb-list">
						<?php foreach ( $category as $cat ): ?>
							<li <?php if ( $catid == $cat['catid'] ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'type/index', array( 'catid' => $cat['catid'] ) ); ?>"><?php echo $cat['name']; ?></a></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</li>
			<li<?php if ( $op == 'form' ): ?> class="active"<?php endif; ?>>
				<a href="<?php echo $this->createUrl( 'formtype/index' ); ?>">
					<i class="o-wf-form"></i>
					<?php echo $lang['Form library manager']; ?>
				</a>
				<?php if ( $op == 'form' ): ?>
					<ul class="sbb-list">
						<?php foreach ( $category as $cat ): ?>
							<li <?php if ( $catid == $cat['catid'] ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'formtype/index', array( 'catid' => $cat['catid'] ) ); ?>"><?php echo $cat['name']; ?></a></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</li>
		</ul>
	</div>
</div>