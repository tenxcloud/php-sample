<?php

header( "Content-type:text/html;charset=utf-8" );
define( 'IC_VERNAME', '中文版' );
$lang = array(
	'Install guide' => 'IBOS 安装引导',
	'None' => '无',
	'Env check' => '环境检查',
	'Env test' => '环境检测',
	'Icenter required' => '所需配置',
	'Recommended' => '推荐配置',
	'Curr server' => '当前服务器',
	'Priv check' => '目录、文件权限检查',
	'Writeable' => '可写',
	'Unwriteable' => '不可写',
	'Nodir' => '目录不存在',
	'Directory file' => '目录文件',
	'Required state' => '所需状态',
	'Current status' => '当前状态',
	'Func depend' => '函数依赖性检查',
	'Failed to pass' => '未能通过！',
	'Func name' => '函数名称',
	'Check result' => '检查结果',
	'Suggestion' => '建议',
	'Supportted' => '支持',
	'Unsupportted' => '不支持',
	'Check again' => '重新检测',
	'Pack up' => '收起',
	'Open up' => '展开',
	'os' => '操作系统',
	'php' => 'PHP 版本',
	'attachmentupload' => '附件上传',
	'unlimit' => '不限制',
	'version' => '版本',
	'gdversion' => 'GD 库',
	'allow' => '允许 ',
	'unix' => '类Unix',
	'diskspace' => '磁盘空间',
	'notset' => '不限制',
	'install' => '安装',
	'installed' => '已安装',
	'uninstalled' => '未安装',
	'Db info' => '数据库信息',
	'Db username' => '数据库用户名',
	'Db password' => '数据库密码',
	'Password not empty' => '密码不能为空！',
	'Show more' => '显示更多信息',
	'Db host' => '数据库服务器',
	'Db host tip' => '数据库服务器：地址，一般为localhost',
	'Db name' => '数据库名',
	'Db pre' => '数据表前缀',
	'Db pre tip' => '修改前缀与其他数据库区分',
	'Admin info' => '管理员信息',
	'Admin account' => '管理员账号',
	'Admin account tip' => '管理员账号不能为空！',
	'Password' => '密码',
	'Password tip' => '请填写6到32位数字或者字母！',
	'I have read and agree' => '我已阅读并同意',
	'Ibos agreement' => '《IBOS协同办公平台用户协议》',
	'Custom module' => '自定义模块',
	'Install now' => '立即安装',
	'Advice_mysql_connect' => '请检查 mysql 模块是否正确加载',
	'Advice_gethostbyname' => '是否 PHP 配置中禁止了 gethostbyname 函数。请联系空间商，确定开启了此项功能',
	'Advice_file_get_contents' => '该函数需要 php.ini 中 allow_url_fopen 选项开启。请联系空间商，确定开启了此项功能',
	'Advice_bcmul' => '该函数需要 php.ini 中 bcmath 选项开启。请联系空间商，确定开启了此项功能',
	'Advice_xml_parser_create' => '该函数需要 PHP 支持 XML。请联系空间商，确定开启了此项功能',
	'Advice_fsockopen' => '该函数需要 php.ini 中 allow_url_fopen 选项开启。请联系空间商，确定开启了此项功能',
	'Advice_pfsockopen' => '该函数需要 php.ini 中 allow_url_fopen 选项开启。请联系空间商，确定开启了此项功能',
	'Advice_stream_socket_client' => '是否 PHP 配置中禁止了 stream_socket_client 函数',
	'Advice_curl_init' => '是否 PHP 配置中禁止了 curl_init 函数',
	'Advice_mysql' => '是否配置中禁止了php_mysql扩展。请联系空间商，确定开启了此项功能',
	'Advice_pdo_mysql' => '是否配置中禁止了php_pdo_mysql扩展。请联系空间商，确定开启了此项功能',
	'Advice_mbstring' => '是否配置中禁止了php_mbstring扩展。请联系空间商，确定开启了此项功能',
	'Dbaccount not empty' => '数据库用户名不能为空',
	'Dbpassword not empty' => '数据库密码不能为空',
	'Adminaccount not empty' => '管理员账号不能为空',
	'Adminpassword incorrect format' => '密码格式不正确！请填写6到32位数字或者字母',
	'Database errno 1045' => '无法连接数据库，请检查数据库用户名或者密码是否正确',
	'Database errno 2003' => '无法连接数据库，请检查数据库是否启动，数据库服务器地址是否正确',
	'Database errno 1049' => '数据库不存在',
	'Database connect error' => '数据库连接错误',
	'Database errno 1044' => '无法创建新的数据库，请检查数据库名称填写是否正确',
	'Database error info' => "<br />数据库连接错误信息：",
	'func not exist' => '方法不存在',
	'Dbinfo forceinstall invalid' => '当前数据库当中已经含有同样表前缀的数据表，您可以修改“表名前缀”来避免删除旧的数据，或者选择强制安装。强制安装会删除旧数据，且无法恢复',
	'Install module failed' => '模块安装失败',
	'Install failed message' => '安装失败信息：',
	'Install locked' => '安装锁定，已经安装过了，如果您确定要重新安装，请到服务器上删除<br /> ',
	'Suc tip' => '使用演示数据体验',
	'Return' => '返回',
	'Previous' => '上一步',
	'Next' => '下一步',
	'Sys module' => '系统模块',
	'Fun module' => '功能模块',
	'Installing' => '正在安装...',
	'Installing info' => '正在安装 "<span id="mod_name"></span>" ,请稍等...',
	'Installing tip' => '<p class="mbs fsm">启用全新系统核心架构，IBOS2.0现已全面升级，</p>
						<p class="fsm">更高效、更健壮、更便捷。</p>',
	'Complete' => '安装完成，登录IBOS',
	'Install complete' => '模块安装完成，正在初始化系统...',
	'Mandatory installation' => '强制安装',
	'Del data' => '我要删除数据，强制安装 !!!',
	'UpdateSQL locked' => '升级数据库锁定，已经升级过了，如果您确定要重新升级，请到服务器上删除<br /> ',
	'convertUser' => '用户数据',
	'convertDept' => '部门数据',
	'convertPosition' => '岗位数据',
	'convertMail' => '邮件数据',
	'convertDiary' => '日志数据',
	'convertAtt' => '附件数据',
	'convertCal' => '日程数据',
	'convertNews' => '新闻数据',
	'Sure modify' => '确认修改',
	'Modify table prefix' => '我要修改ibos1数据表前缀 !!!',
	'Modify table prefix tip' => '本操作将会把以前的数据库所有表前缀改为"old_"，为了安全起见，请确保将原来数据库备份再选中此项继续安装',
	'Modify old table prefix' => '修改旧数据库表前缀',
	'New db pre tip' => '请输入新数据表前缀',
	'Continue' => '继续',
	'Request tainting' => '非法请求',
);