<?php

/**
 * 翻译语言
 * @param string $langKey
 * @param boolean $force
 * @return string
 */
function lang( $langKey, $force = true ) {
	return isset( $GLOBALS['lang'][$langKey] ) ? $GLOBALS['lang'][$langKey] : ($force ? $langKey : '');
}

/**
 * 环境检测
 * @param array $envItems 要检测的环境数组
 * @return array 返回检测后处理过的数组
 */
function envCheck( $envItems ) {
	$envCheckRes = 1;
	foreach ( $envItems as $key => $item ) {
		if ( $key == 'php' ) {
			$envItems[$key]['current'] = PHP_VERSION;
		} elseif ( $key == 'attachmentupload' ) {
			$envItems[$key]['current'] = @ini_get( 'file_uploads' ) ? ini_get( 'upload_max_filesize' ) : 'unknow';
		} elseif ( $key == 'gdversion' ) {
			$tmp = function_exists( 'gd_info' ) ? gd_info() : array();
			$envItems[$key]['current'] = empty( $tmp['GD Version'] ) ? 'noext' : $tmp['GD Version'];
			unset( $tmp );
		} elseif ( $key == 'diskspace' ) {
			if ( function_exists( 'disk_free_space' ) ) {
				$envItems[$key]['current'] = floor( disk_free_space( PATH_ROOT ) / (1024 * 1024) ) . 'M';
			} else {
				$envItems[$key]['current'] = 'unknow';
			}
		} elseif ( $key == 'Zend Guard Loader' ) {
			if ( zendCheck( $item ) ) {
				$envItems[$key]['current'] = 'installed';
			} else {
				$envItems[$key]['current'] = 'uninstalled';
			}
		} elseif ( isset( $item['c'] ) ) {
			$envItems[$key]['current'] = constant( $item['c'] );
		}

		$envItems[$key]['status'] = 1;
		$funCheckName = $key . 'Check';
		if ( $item['r'] != 'notset' && function_exists( $funCheckName ) ) {
			if ( !$funCheckName( $envItems[$key] ) ) {
				$envItems[$key]['status'] = 0;
				$envCheckRes = 0;
			}
		}
	}
	return array( 'envItems' => $envItems, 'envCheckRes' => $envCheckRes );
}

/**
 * php版本检测
 * @param array $item php版本信息，在installVal文件定义
 * @return boolean
 */
function phpCheck( $evnItem ) {
	if ( version_compare( PHP_VERSION, $evnItem['r'] ) < 0 ) {
		return false;
	} else {
		return true;
	}
}

/**
 * 上传配置检测
 * @param array $evnItem 上传配置信息，在installVal文件定义
 * @return boolean
 */
function attachmentuploadCheck( $evnItem ) {
	if ( intval( $evnItem['current'] ) < intval( $evnItem['r'] ) ) {
		return false;
	} else {
		return true;
	}
}

/**
 * GD库版本检测
 * @param array $evnItem gd版本信息，在installVal文件定义
 * @return boolean
 */
function gdversionCheck( $evnItem ) {
	if ( strcmp( $evnItem['current'], $evnItem['r'] ) < 0 ) {
		return false;
	} else {
		return true;
	}
}

/**
 * 文件夹剩余空间检测
 * @param array $evnItem 文件夹空间信息，在installVal文件定义
 * @return boolean
 */
function diskspaceCheck( $evnItem ) {
	if ( intval( $evnItem['current'] ) > intval( $evnItem['r'] ) || $evnItem['current'] == 'unknow' ) {
		return true;
	} else {
		return false;
	}
}

/**
 * 检测zend环境和版本
 */
function zendCheck( $zendItem ) {
	if ( extension_loaded( 'Zend Guard Loader' ) || get_cfg_var( "zend_extension" ) || get_cfg_var( "zend_extension_ts" ) ) {
		return true;
	} else {
		return false;
	}
}

/**
 * 检测函数依懒性
 * @param array $funcItems 要检测的函数
 */
function funcCheck( $funcItems ) {
	global $lang;
	$funcCheckRes = 1;
	foreach ( $funcItems as $item => $value ) {
		if ( !function_exists( $item ) ) {
			$funcItems[$item]['status'] = 0;
			$funcCheckRes = 0;
			$funcItems[$item]['advice'] = $lang['Advice_' . $item];
		} else {
			$funcItems[$item]['advice'] = $lang['None'];
		}
	}
	return array( 'funcItems' => $funcItems, 'funcCheckRes' => $funcCheckRes );
}

function filesorkCheck( $filesockItems ) {
	global $lang;
	$filesockDisabled = 0;
	$filesorkCheckRes = 1;
	foreach ( $filesockItems as $item => $value ) {
		if ( !function_exists( $item ) ) {
			$filesockItems[$item]['status'] = 0;
			$filesockItems[$item]['advice'] = $lang['Advice_' . $item];
			$filesockDisabled++;
		} else {
			$filesockItems[$item]['advice'] = $lang['None'];
		}
	}
	if ( $filesockDisabled == count( $filesockItems ) ) {
		$filesorkCheckRes = 0;
	}
	if ( !function_exists( "curl_init" ) ) {
		$filesorkCheckRes = 0;
	}
	return array( 'filesockItems' => $filesockItems, 'filesorkCheckRes' => $filesorkCheckRes );
}

/**
 * 函数扩展检测
 * @param array $extLoadedItems 要检测的拓展函数
 * @return array
 */
function extLoadedCheck( $extLoadedItems ) {
	global $lang;
	$extLoadedCheckRes = 1;
	foreach ( $extLoadedItems as $item => $value ) {
		if ( !extension_loaded( $item ) ) {
			$extLoadedItems[$item]['status'] = 0;
			$extLoadedItems[$item]['advice'] = $lang['Advice_' . $item];
			$extLoadedCheckRes = 0;
		} else {
			$extLoadedItems[$item]['advice'] = $lang['None'];
		}
	}
	return array( 'extLoadedItems' => $extLoadedItems, 'extLoadedCheckRes' => $extLoadedCheckRes );
}

/**
 * 目录、文件权限检查
 * @param type $dirfileItems
 */
function dirfileCheck( $dirfileItems ) {
	global $lang;
	$dirfileCheckRes = 1;
	foreach ( $dirfileItems as $key => $item ) {
		$dirfileItems[$key]['msg'] = $lang['Writeable'];
		$item_path = $item['path'];
		if ( $item['type'] == 'dir' ) {
			if ( !dirWriteable( PATH_ROOT . $item_path ) ) {
				if ( is_dir( PATH_ROOT . $item_path ) ) {
					$dirfileItems[$key]['msg'] = $lang['Unwriteable'];
					$dirfileItems[$key]['status'] = 0;
					$dirfileItems[$key]['current'] = '+r';
					$dirfileCheckRes = 0;
				} else {
					$dirfileItems[$key]['msg'] = $lang['Nodir'];
					$dirfileItems[$key]['status'] = -1;
					$dirfileItems[$key]['current'] = 'nodir';
					$dirfileCheckRes = 0;
				}
			} else {
				$dirfileItems[$key]['status'] = 1;
				$dirfileItems[$key]['current'] = '+r+w';
			}
		} else {
			if ( file_exists( PATH_ROOT . $item_path ) ) {
				if ( is_writable( PATH_ROOT . $item_path ) ) {
					$dirfileItems[$key]['status'] = 1;
					$dirfileItems[$key]['current'] = '+r+w';
				} else {
					$dirfileItems[$key]['msg'] = $lang['Unwriteable'];
					$dirfileItems[$key]['status'] = 0;
					$dirfileItems[$key]['current'] = '+r';
					$dirfileCheckRes = 0;
				}
			} else {
				if ( dirWriteable( dirname( PATH_ROOT . $item_path ) ) ) {
					$dirfileItems[$key]['status'] = 1;
					$dirfileItems[$key]['current'] = '+r+w';
				} else {
					$dirfileItems[$key]['msg'] = $lang['Unwriteable'];
					$dirfileItems[$key]['status'] = -1;
					$dirfileItems[$key]['current'] = 'nofile';
					$dirfileCheckRes = 0;
				}
			}
		}
	}
	return array( 'dirfileItems' => $dirfileItems, 'dirfileCheckRes' => $dirfileCheckRes );
}

/**
 * 判断文件或目录是否可写
 * @param string $dir 文件或目录路径
 * @return boolean
 */
function dirWriteable( $dir ) {
	$writeable = 0;
	if ( !is_dir( $dir ) ) {
		@mkdir( $dir, 0777 );
	}
	if ( is_dir( $dir ) ) {
		if ( $fp = @fopen( "$dir/test.txt", 'w' ) ) {
			@fclose( $fp );
			@unlink( "$dir/test.txt" );
			$writeable = 1;
		} else {
			$writeable = 0;
		}
	}
	return $writeable;
}

/**
 * 产生随机码
 * @param integer $length 要多长
 * @param integer $numberic 数字还是字符串
 * @return string $hash 返回字符串
 */
function random( $length, $numeric = 0 ) {
	$seed = base_convert( md5( microtime() . $_SERVER['DOCUMENT_ROOT'] ), 16, $numeric ? 10 : 35  );
	$seed = $numeric ? (str_replace( '0', '', $seed ) . '012340567890') : ($seed . 'zZ' . strtoupper( $seed ));
	$hash = '';
	$max = strlen( $seed ) - 1;
	for ( $index = 0; $index < $length; $index++ ) {
		$hash .= $seed{mt_rand( 0, $max )};
	}
	return $hash;
}

/**
 * 获取所有模块目录(也是所有模块名)
 * @return array
 */
function getModuleDirs() {
	$modulePath = MODULE_PATH;
	$dirs = (array) glob( $modulePath . '*' );
	$moduleDirs = array();
	foreach ( $dirs as $dir ) {
		if ( is_dir( $dir ) ) {
			$d = basename( $dir );
			$moduleDirs[] = $d;
		}
	}
	return $moduleDirs;
}

/**
 * 初始化多个模块配置文件 - 参数部分,用于列表
 * @param array $moduleDirs
 * @return array
 */
function initModuleParameters( array $moduleDirs ) {
	$modules = array();

	foreach ( $moduleDirs as $moduleName ) {
		$param = initModuleParameter( $moduleName );
		if ( !empty( $param ) ) {
			$modules[$moduleName] = $param;
		}
	}
	return $modules;
}

/**
 * 初始化模块配置文件 - 参数部分
 * @param string $moduleName 模块名称
 * @return array
 */
function initModuleParameter( $moduleName ) {
	defined( 'IN_MODULE_ACTION' ) or define( 'IN_MODULE_ACTION', true );
	$param = array();

	$installPath = getInstallPath( $moduleName );
	if ( is_dir( $installPath ) ) {
		$file = $installPath . 'config.php';
		if ( is_file( $file ) && is_readable( $file ) ) {

			$config = include_once $file;
		}
		if ( isset( $config ) && is_array( $config ) ) {
			$param = (array) $config['param'];
		}
	}
	return $param;
}

/**
 * 获取模块安装文件夹路径
 * @param string $module 模块名
 * @return string 
 */
function getInstallPath( $module ) {
	return MODULE_PATH . $module . '/install/';
}

/**
 * 获取模块中文名
 * @param string $module
 * @return string 返回模块中文名
 */
function getModuleName( $module ) {
	$allModules = getModuleDirs();
	$allModulesParam = initModuleParameters( $allModules );
	$nextModuleName = $allModulesParam[$module]['name'];
	return $nextModuleName;
}

/**
 * 执行模块安装
 * @param string $moduleName 模块名
 * @return boolean 安装成功与否
 */
function install( $moduleName ) {
	global $coreModules, $sysDependModule;
	defined( 'IN_MODULE_ACTION' ) or define( 'IN_MODULE_ACTION', true );
	$installPath = getInstallPath( $moduleName );
	// 安装模块模型(如果有)
	$modelSqlFile = $installPath . 'model.sql';
	if ( file_exists( $modelSqlFile ) ) {
		$modelSql = file_get_contents( $modelSqlFile );
		executeSql( $modelSql );
	}
	// 处理模块配置，写入数据
	$config = require $installPath . 'config.php';
	$icon = MODULE_PATH . $moduleName . '/static/image/icon.png';
	if ( is_file( $icon ) ) {
		$config['param']['icon'] = 1;
	} else {
		$config['param']['icon'] = 0;
	}
	if ( !isset( $config['param']['category'] ) ) {
		$config['param']['category'] = '';
	}
	if ( isset( $config['param']['indexShow'] ) && isset( $config['param']['indexShow']['link'] ) ) {
		$config['param']['url'] = $config['param']['indexShow']['link'];
	} else {
		$config['param']['url'] = '';
	}
	$configs = json_encode( $config );
	$record = array(
		'module' => $moduleName,
		'name' => $config['param']['name'],
		'url' => $config['param']['url'],
		'category' => $config['param']['category'],
		'version' => $config['param']['version'],
		'description' => $config['param']['description'],
		'icon' => $config['param']['icon'],
		'config' => $configs,
		'installdate' => time()
	);
	if ( in_array( $moduleName, $coreModules ) ) {
		$record['iscore'] = 1;
	} elseif ( in_array( $moduleName, $sysDependModule ) ) {
		$record['iscore'] = 2;
	} else {
		$record['iscore'] = 0;
	}
	$insertStatus = Yii::app()->db->createCommand()
			->insert( '{{module}}', $record );
	return $insertStatus;
}

/**
 * 执行mysql.sql文件，创建数据表等
 * @param string $sql sql语句
 */
function executeSql( $sql ) {
	$sqls = splitSql( $sql );
	$command = Yii::app()->db->createCommand();
	if ( is_array( $sqls ) ) {
		foreach ( $sqls as $sql ) {
			if ( trim( $sql ) != '' ) {
				$command->setText( $sql )->execute();
			}
		}
	} else {
		$command->setText( $sqls )->execute();
	}
	return true;
}

/**
 * 处理sql语句
 * @param string $sql 原始的sql
 * @return array 
 */
function splitSql( $sql ) {
	$sql = str_replace( "\r", "\n", $sql );
	$ret = array();
	$num = 0;
	$queriesArr = explode( ";\n", trim( $sql ) );
	unset( $sql );
	foreach ( $queriesArr as $querys ) {
		$queries = explode( "\n", trim( $querys ) );
		foreach ( $queries as $query ) {
			$val = substr( trim( $query ), 0, 1 ) == "#" ? null : $query;
			if ( isset( $ret[$num] ) ) {
				$ret[$num] .= $val;
			} else {
				$ret[$num] = $val;
			}
		}
		$num++;
	}
	return $ret;
}

/**
 * 判断是否安装某个模块
 * @param string $module 模块名
 * @return boolean
 */
function getIsInstall( $module ) {
	$rs = Yii::app()->db->createCommand()
			->select( 'module' )
			->from( '{{module}}' )
			->where( "`module` = '{$module}'" )
			->queryScalar();
	return !!$rs;
}

/**
 * 获取主机路径，兼容多层目录
 */
function getHostInfo() {
	$phpself = getScriptUrl();
	$installPath = substr( $phpself, 0, strrpos( $phpself, '/' ) );
	$sitePath = str_replace('/install', '', $installPath);
	$isHTTPS = (isset( $_SERVER['HTTPS'] ) && strtolower( $_SERVER['HTTPS'] ) != 'off') ? true : false;
	if ( $secure = getIsSecureConnection() ) {
 		$http = 'https';
 	} else {
 		$http = 'http';
 	}
	if ( isset( $_SERVER['HTTP_HOST'] ) ) {
 		$hostInfo = $http . '://' . $_SERVER['HTTP_HOST'];
 	} else {
 		$hostInfo = $http . '://' . $_SERVER['SERVER_NAME'];
 		$port = $secure ? getSecurePort() : getPort();
 		if ( ($port !== 80 && !$secure) || ($port !== 443 && $secure) ) {
 			$hostInfo.=':' . $port;
 		}
 	}
	$siteurl = $hostInfo . $sitePath;
	return $siteurl;
}

function getIsSecureConnection() {
	return isset( $_SERVER['HTTPS'] ) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) || isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https';
}

function getPort() {
	return !getIsSecureConnection() && isset( $_SERVER['SERVER_PORT'] ) ? (int) $_SERVER['SERVER_PORT'] : 80;
}

function getSecurePort() {
	return getIsSecureConnection() && isset( $_SERVER['SERVER_PORT'] ) ? (int) $_SERVER['SERVER_PORT'] : 443;
}

/**
 * 获取文本执行路径
 * @return string
 * @throws CException
 */
function getScriptUrl() {
	global $lang;
	$phpSelf = '';
	$scriptName = basename( $_SERVER['SCRIPT_FILENAME'] );
	if ( basename( $_SERVER['SCRIPT_NAME'] ) === $scriptName ) {
		$phpSelf = $_SERVER['SCRIPT_NAME'];
	} else if ( basename( $_SERVER['PHP_SELF'] ) === $scriptName ) {
		$phpSelf = $_SERVER['PHP_SELF'];
	} else if ( isset( $_SERVER['ORIG_SCRIPT_NAME'] ) && basename( $_SERVER['ORIG_SCRIPT_NAME'] ) === $scriptName ) {
		$phpSelf = $_SERVER['ORIG_SCRIPT_NAME'];
	} else if ( ($pos = strpos( $_SERVER['PHP_SELF'], '/' . $scriptName )) !== false ) {
		$phpSelf = substr( $_SERVER['SCRIPT_NAME'], 0, $pos ) . '/' . $scriptName;
	} else if ( isset( $_SERVER['DOCUMENT_ROOT'] ) && strpos( $_SERVER['SCRIPT_FILENAME'], $_SERVER['DOCUMENT_ROOT'] ) === 0 ) {
		$phpSelf = str_replace( '\\', '/', str_replace( $_SERVER['DOCUMENT_ROOT'], '', $_SERVER['SCRIPT_FILENAME'] ) );
		$phpSelf[0] != '/' && $phpSelf = '/' . $phpSelf;
	} else {
		throw new CException( $lang['Request tainting'] );
	}
	return $phpSelf;
}