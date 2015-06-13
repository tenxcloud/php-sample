<?php

use application\core\utils\Ibos;
use application\core\utils\String;
use application\modules\dashboard\utils\Wx;
?>
<link rel="stylesheet" href="<?php echo $assetUrl; ?>/css/home.css?<?php echo VERHASH; ?>">
<div class="ct">
    <div class="clearfix">
        <h1 class="mt"><?php echo $license['fullname']; ?></h1>
    </div>
    <div>
        <!-- 系统信息 start -->
        <div class="ctb ctbp <?php if ( $appClosed ): ?>card-flip<?php endif; ?>">
            <h2 class="st"><?php echo $lang['System information']; ?></h2>
            <div class="clearfix system-info-wrap" id="switch_status">
                <div class="card-circle card-circle-success pull-left">
                    <i class="card-circle-icon"></i>
                    <p><?php echo $lang['Feels good']; ?></p>
                </div>
                <div class="card-circle card-circle-danger pull-left">
                    <i class="card-circle-icon"></i>
                    <p><?php echo $lang['Not open']; ?></p>
                </div>
                <div class="system-info">
                    <div class="b">
                        <strong>IBOS <?php echo VERSION; ?></strong>
                        <span class="system-info-date"><?php echo VERSION_DATE; ?></span>
                        <?php if ( $newVersion ): ?>
                            <a href="<?php echo $this->createUrl( 'upgrade/index' ); ?>"><span class="label label-warning">NEW！</span></a>
                        <?php endif; ?>
                    </div>
                    <div>
                        <div class="pull-left">
                            <div>
                                <input id="system_switch" type="checkbox" <?php if ( $appClosed == 0 ): ?>checked<?php endif; ?> value="1" data-toggle="switch">
                            </div>
                        </div>
                        <div class="pull-left">
                            <span class="pull-left"><?php echo $lang['Has stable operation for']; ?></span>
                            <div id="tally" class="date-tally" data-date="365"></div>
                            <?php echo $lang['Day']; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 服务器 start -->
        <div class="ctb ctbp">
            <h2 class="st"><?php echo $lang['Server']; ?></h2>
            <div class="clearfix">
                <ul class="card-list">
                    <li>
                        <div class="card-radius">
                            <?php list( $osImg ) = explode( ' ', $sys['operating_system'] ); ?>
                            <img src="<?php echo $assetUrl; ?>/image/env/<?php echo strtolower( $osImg ); ?>.png" alt="<?php echo $sys['operating_system']; ?>" title="<?php echo $sys['operating_system']; ?>">
                            <p>
                                <strong title="<?php echo $sys['operating_system']; ?>"><?php echo $sys['operating_system']; ?></strong>
                            </p>
                            <p><?php echo $lang['System']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="card-radius">
                            <?php
                            list( $servers) = explode( ' ', $sys['runtime_environment'] );
                            if ( strpos( $servers, '/' ) === false ) {
                                $servers .= '/';
                            }
                            list( $server, $version) = explode( '/', $servers );
                            $server = strtolower( $server );
                            ?>
                            <img src="<?php echo $assetUrl ?>/image/env/<?php echo $server; ?>.png" alt="<?php echo $server; ?>" title="<?php echo $server; ?>">
                            <p>
                                <strong title="<?php echo $version; ?>"><?php echo $version; ?></strong>
                            </p>
                            <p>WEB<?php echo $lang['Server']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="card-radius">
                            <img src="<?php echo $assetUrl; ?>/image/env/php.png" alt="PHP" title="PHP">
                            <p>
                                <strong title="<?php echo PHP_VERSION; ?>"><?php echo PHP_VERSION; ?></strong>
                            </p>
                            <p><?php echo $lang['Script engine']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="card-radius">
                            <?php $driverName = Ibos::app()->db->getDriverName(); ?>
                            <img src="<?php echo $assetUrl ?>/image/env/<?php echo $driverName; ?>.png" alt="<?php echo $driverName; ?>" title="<?php echo $driverName; ?>">
                            <p>
                                <strong title="<?php echo Ibos::app()->db->getServerVersion(); ?>"><?php echo Ibos::app()->db->getServerVersion(); ?></strong>
                            </p>
                            <p><?php echo $lang['Database']; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="card-radius">
                            <img src="<?php echo $assetUrl ?>/image/env/upload.png" alt="<?php echo $lang['Upload max filesize']; ?>" title="<?php echo $lang['Upload max filesize']; ?>">
                            <p>
                                <strong title="<?php echo $sys['upload_size']; ?>"><?php echo $sys['upload_size']; ?></strong>
                            </p>
                            <p><?php echo $lang['Upload max filesize']; ?></p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 容量大小 start -->
        <div class="ctb ctbp">
            <h2 class="st"><?php echo $lang['Size']; ?></h2>
            <div class="clearfix">
                <ul class="card-list">
                    <li>
                        <div class="card-circle">
                            <p><?php echo $lang['Database']; ?></p>
                            <p>
                                <strong><?php echo $dataSize; ?></strong>
                            </p>
                            <p><?php echo $dataUnit; ?></p>
                        </div>
                    </li>
                    <li>
                        <div class="card-circle">
                            <p><?php echo $lang['Attachment']; ?></p>
                            <?php if ( empty( $attachSize ) ): ?>
                                <p><a href="<?php echo $this->createUrl( 'index/index', array( 'attachsize' => 1 ) ) ?>">点击查看</a></p>
                            <?php else: ?>
                                <?php list($attachSize, $sizeUnit) = explode( ' ', $attachSize ); ?>
                                <p><strong><?php echo $attachSize; ?></strong></p>
                                <p><?php echo $sizeUnit; ?></p>
                            <?php endif; ?>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 授权信息 start -->
        <div class="ctb ctbp">
            <h2 class="st"><?php echo $lang['License information']; ?></h2>
            <?php if ( !defined( 'LICENCE_VER' ) ): ?>
                <div class="license">
                    <?php
                    if ( defined( 'LICENCE_ERR' ) ):echo LICENCE_ERR;
                    else:
                        ?>该系统还没授权<?php endif; ?>，您可以
                    <a href="javascript:;" class="b-anchor" data-click="inputAuthCode">输入授权码</a>
                    或
                    <a href='http://ibos.com.cn/product' class="o-anchor" target="_blank">立即申请授权码</a>
                </div>
            <?php else: ?>
                <div class="license licensed" data-click="showAuthInfo">
                    <span>授权企业：</span>
                    <!-- 公司全称 -->
                    <strong title="<?php echo LICENCE_FULLNAME; ?>"><?php echo String::cutStr( LICENCE_FULLNAME, 30 ); ?></strong>
                    &nbsp;
                    <span><?php echo $lang['The number of users']; ?></span>
                    <em><?php echo LICENCE_LIMIT; ?></em>
                    <?php if ( LICENCE_VER == 'Standard' ): ?>
                        <span class="label pull-right"><?php echo LICENCE_VERNAME; ?></span>
                    <?php elseif ( LICENCE_VER == 'Enterprise' ): ?>
                        <span class="label label-inverse pull-right"><?php echo LICENCE_VERNAME; ?></span>
                    <?php elseif ( LICENCE_VER == 'Group' ): ?>
                        <span class="label label-warning pull-right"><?php echo LICENCE_VERNAME; ?></span>
                    <?php elseif ( LICENCE_VER == 'Project' ): ?>
                        <span class="label label-danger pull-right"><?php echo LICENCE_VERNAME; ?></span>
                    <?php else: ?>
                        <span class="label label-danger pull-right"><?php echo LICENCE_VERNAME; ?></span>
                    <?php endif; ?>
                </div>
                <a href="javascript:;" class="xcp" style=" display: block; margin:10px 0 -20px 545px ;" data-click="inputAuthCode"><?php echo $lang['Edit']; ?><?php echo $lang['License key']; ?></a>
            <?php endif; ?>
        </div>
        <!-- 联系我们 start -->
        <div class="ctb ctbp">
            <h2 class="st"><?php echo $lang['Contact us']; ?></h2>
            <div id="securityTips"></div>
        </div>
    </div>
</div>
<!-- 输入授权 -->
<div id="input_auth_code_dialog" style="display: none">
    <form action="<?php echo $this->createUrl( 'index/license' ); ?>" method="post" class="license-form form-horizontal form-compact license-info" target="main">
        <textarea name="licensekey" rows="4" style="width: 360px;" placeholder="<?php echo $lang['Enter licensekey']; ?>" id="license_key"></textarea>
        <input type="hidden" name="formhash" value="<?php echo FORMHASH; ?>" />
    </form>
</div>
<!-- 查看授权 -->
<div id="show_auth_info_dialog" class="license-cert">
    <a href="javascript:;" class="license-cert-close" data-click="hideAuthInfo"></a>
    <?php if ( defined( 'LICENCE_VER' ) ): ?>
        <table>
            <tr>
                <th><?php echo $lang['License ver']; ?></th>
                <td><?php echo LICENCE_VERNAME; ?></td>
            </tr>
            <tr>
                <th><?php echo $lang['Company name']; ?></th>
                <td><?php echo LICENCE_FULLNAME; ?></td>
            </tr>
            <tr>
                <th><?php echo $lang['Company shortname']; ?></th>
                <td><?php echo LICENCE_NAME; ?></td>
            </tr>
            <tr>
                <th><?php echo $lang['The number of users']; ?></th>
                <td><?php echo LICENCE_LIMIT; ?></td>
            </tr>
            <tr>
                <th><?php echo $lang['License time']; ?></th>
                <td><?php echo date( 'Y-m-d', LICENCE_STIME ); ?> <?php echo $lang['To']; ?> <?php echo date( 'Y-m-d', LICENCE_ETIME ); ?></td>
            </tr>
            <tr>
                <th><?php echo $lang['License url']; ?></th>
                <td><?php echo LICENCE_URL; ?></td>
            </tr>
        </table>
    <?php endif; ?>
</div>
<script>
    var _ib = _ib || [];
    _ib.push(['authkey', '<?php echo Ibos::app()->setting->get( 'config/security/authkey' ); ?>']);
    _ib.push(['datasize', '<?php echo $dataSize . $dataUnit; ?>']);
    _ib.push(['system', '<?php echo $sys['operating_system']; ?>']);
    _ib.push(['server', '<?php echo $server; ?>']);
    _ib.push(['type', 'dashboardlogin']);
    (function () {
        var ib = document.createElement('script');
        ib.type = 'text/javascript';
        ib.async = true;
        ib.src = 'http://www.ibos.com.cn/Public/static/ib.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ib, s);
    })();
</script>
<script>
    Ibos.app.s({
        "installTime": <?php echo $installDate; ?>,
        "nowTime": <?php echo TIMESTAMP; ?>,
        "assetUrl": '<?php echo $assetUrl; ?>'
    });
</script>
<script src='<?php echo STATICURL; ?>/js/lib/formValidator/formValidator.packaged.js?<?php echo VERHASH; ?>'></script>
<script src="<?php echo $assetUrl; ?>/js/db_index.js?<?php echo VERHASH; ?>"></script>
