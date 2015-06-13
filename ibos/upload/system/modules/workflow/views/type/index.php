<!-- private css -->
<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/workflow.css?<?php echo VERHASH; ?>">
<div class="mc clearfix">
    <?php echo $this->widget( 'application\modules\workflow\widgets\ListSidebar', array( 'category' => $category, 'catId' => $catId ), true ); ?>
    <!-- Mainer right -->
    <div class="mcr">
        <div class="page-list">
            <div class="page-list-header">
                <div class="btn-toolbar pull-left">
                    <div class="btn-group">
                        <a href="<?php echo $this->createUrl( 'type/add', array( 'catid' => $this->catid ) ); ?>" class="btn btn-primary"><?php echo $lang['New']; ?></a>
                    </div>
                    <div class="btn-group">
                        <a href="javascript:;" data-action="del" class="btn"><?php echo $lang['Delete']; ?></a>
                    </div>
                    <div class="btn-group">
                        <a href="javascript:;" class="btn dropdown-toggle" data-toggle="dropdown"><?php echo $lang['More operation']; ?><i class="caret"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="javascript:;" data-action="handover"><?php echo $lang['Work handover']; ?></a></li>
                            <li><a href="javascript:;" data-action="clear"><?php echo $lang['Work clear']; ?></a></li>
                        </ul>
                    </div>
                </div>
                <form action="<?php echo $this->createUrl( 'type/index' ); ?>" id="search_form" method="get">
                    <div class="search pull-right span4">
                        <input type="hidden" name="r" value="workflow/type/index" />
                        <input type="text" placeholder="<?php echo $lang['Search tip']; ?>" name="keyword" id="mn_search" nofocus />
                        <input type="hidden" name="catid" value="<?php echo $this->catid; ?>" />
                        <a href="javascript:;"></a>
                    </div>
                </form>
            </div>
            <div class="page-list-mainer ovh" id="wf_manage_mn">
                <?php if ( !empty( $list ) ): ?>
                    <table class="table table-hover wf-manage-table" id="wf_manage_table">
                        <thead>
                            <tr>
                                <th width="20">
                                    <label class="checkbox"><input type="checkbox" data-name="work"></label>
                                </th>
                                <th><?php echo $lang['Flow name']; ?></th>
                                <th><?php echo $lang['Form']; ?></th>
                                <th width="80"><?php echo $lang['Flow type']; ?></th>
                                <th width="180"><?php echo $lang['Work nums']; ?>（<?php echo $lang['All']; ?>/<?php echo $lang['Deleted']; ?>）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $flowTypeDesc = array( '1' => $lang['Fixed flow'], '2' => $lang['Free flow'] ); ?>
                            <?php foreach ( $list as $flow ): ?>
                                <tr id="flow_tr_<?php echo $flow['flowid']; ?>" data-type="<?php echo $flow['type']; ?>" data-formid="<?php echo $flow['formid']; ?>" data-id="<?php echo $flow['flowid']; ?>">
                                    <td>
                                        <label class="checkbox">
                                            <input type="checkbox" value="<?php echo $flow['flowid']; ?>" name="work" />
                                        </label>
                                    </td>
                                    <td><span class="fss"><?php echo $flow['name']; ?></span></td>
                                    <td><span class="fss"><?php echo $flow['formname']; ?></span></td>
                                    <td><span class="fss"><?php echo $flowTypeDesc[$flow['type']]; ?></span></td>
                                    <td><span class="fss counter"><?php echo $flow['flowcount']; ?> / <?php echo $flow['delcount']; ?></span></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else : ?>
                    <div class="no-data-tip"></div>
                <?php endif; ?>
            </div>
            <?php if ( !empty( $list ) ): ?>
                <div class="page-list-footer">
                    <div class="page-num-select">
                        <div class="btn-group dropup">
                            <a class="btn btn-small dropdown-toggle" data-toggle="dropdown" id="page_num_ctrl" data-selected="<?php echo $pageSize; ?>">
                                <i class="o-setup"></i> <?php echo $lang['Each page']; ?> <?php echo $pageSize; ?> <i class="caret"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li <?php if ( $pageSize == 10 ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'type/index', array( 'catid' => $this->catid ) ); ?>&pagesize=10"><?php echo $lang['Each page']; ?> 10</a></li>
                                <li <?php if ( $pageSize == 20 ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'type/index', array( 'catid' => $this->catid ) ); ?>&pagesize=20"><?php echo $lang['Each page']; ?> 20</a></li>
                                <li <?php if ( $pageSize == 30 ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'type/index', array( 'catid' => $this->catid ) ); ?>&pagesize=30"><?php echo $lang['Each page']; ?> 30</a></li>
                                <li <?php if ( $pageSize == 40 ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'type/index', array( 'catid' => $this->catid ) ); ?>&pagesize=40"><?php echo $lang['Each page']; ?> 40</a></li>
                                <li <?php if ( $pageSize == 50 ): ?>class="active"<?php endif; ?>><a href="<?php echo $this->createUrl( 'type/index', array( 'catid' => $this->catid ) ); ?>&pagesize=50"><?php echo $lang['Each page']; ?> 50</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="pull-right"><?php $this->widget( 'application\core\widgets\Page', array( 'pages' => $pages ) ); ?></div>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <div id="wf_slide" class="slide-window" style="display:none;">
        <a href="javascript:;" id="wf_slide_ctrl" class="slide-window-ctrl"></a>
        <div class="wf-guide" id="wf_guide">
            <div class="wf-guide-header" id="wf_guide_header">
                <i class="cbtn"></i>
                <h4><?php echo $lang['Flow name']; ?></h4>
                <span><?php echo $lang['Flow status']; ?></span>
            </div>
            <div class="shadow">
                <ul class="wf-guide-list" id="wf_guide_list">
                    <li class="active">
                        <div class="wf-guide-bk">
                            <h5>1、<?php echo $lang['Define the process']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="editFlow"><i class="cbtn o-edit"></i><?php echo $lang['Edit']; ?></a>
                                <a href="javascript:;" data-guide="importFlow"><i class="cbtn o-import"></i><?php echo $lang['Import']; ?></a>
                                <a href="javascript:;" data-guide="exportFlow"><i class="cbtn o-export"></i><?php echo $lang['Export']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide step1 desc']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="wf-guide-bk">
                            <h5>2、<?php echo $lang['Form design']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="designForm"><i class="cbtn o-form-design"></i><?php echo $lang['Design']; ?></a>
                                <a href="javascript:;" data-guide="previewForm"><i class="cbtn o-view"></i><?php echo $lang['Review']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide step2 desc']; ?></p>
                        </div>
                    </li>
                    <li class="bdbs" id="fixed_opt">
                        <div class="wf-guide-bk">
                            <h5>3、<?php echo $lang['Flow design']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="designFlow"><i class="cbtn o-flow-design"></i><?php echo $lang['Design']; ?></a>
                                <a href="javascript:;" data-guide="verifyFlow"><i class="cbtn o-validate"></i><?php echo $lang['Check']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide step3 desc']; ?></p>
                        </div>
                    </li>
                    <li class="bdbs" id="free_opt" style="display:none;">
                        <div class="wf-guide-bk">
                            <h5>3、<?php echo $lang['New permissions']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="freeNew"><i class="cbtn o-plus"></i><?php echo $lang['New']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide free desc']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="wf-guide-bk">
                            <h5>■&nbsp;&nbsp;&nbsp;&nbsp;<?php echo $lang['Manage process permissions']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="addPermission"><i class="cbtn o-plus"></i><?php echo $lang['New']; ?></a>
                                <a href="javascript:;" data-guide="showManagerPermissionList"><i class="cbtn o-list"></i><?php echo $lang['List']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide step4 desc']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="wf-guide-bk">
                            <h5>■&nbsp;&nbsp;&nbsp;&nbsp;<?php echo $lang['Configure advanced query']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="addSearchTemplate"><i class="cbtn o-plus"></i><?php echo $lang['New']; ?></a>
                                <a href="javascript:;" data-guide="showSearchTemplateList"><i class="cbtn o-list"></i><?php echo $lang['List']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide step5 desc']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="wf-guide-bk">
                            <h5>■&nbsp;&nbsp;&nbsp;&nbsp;<?php echo $lang['Set timing task']; ?></h5>
                            <div class="wf-guide-op">
                                <a href="javascript:;" data-guide="showTimerList"><i class="cbtn o-plus"></i><?php echo $lang['New']; ?></a>
                                <a href="javascript:;" data-guide="showTimerList"><i class="cbtn o-list"></i><?php echo $lang['List']; ?></a>
                            </div>
                            <p><?php echo $lang['Guide step6 desc']; ?></p>
                        </div>
                    </li>
                </ul>
            </div> <!-- end shadow -->
        </div><!-- end guide -->
    </div><!-- end slide -->
</div>
<script>
    Ibos.app.setPageParam({
        flowid: <?php echo $this->flowid ?>,
        catid: <?php echo $this->catid ?>
    })
</script>
<script src='<?php echo $assetUrl; ?>/js/lang/zh-cn.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/wfsetup.js?<?php echo VERHASH; ?>'></script>
<script src='<?php echo $assetUrl; ?>/js/workflow_type_index.js?<?php echo VERHASH; ?>'></script>

