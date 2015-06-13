DROP TABLE IF EXISTS `{{thread}}`;
CREATE TABLE IF NOT EXISTS `{{thread}}` (
	`threadid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主线id',
	`subject` varchar(255) NOT NULL DEFAULT '' COMMENT '主题',
	`description` text NOT NULL COMMENT '描述',
	`designeeuid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '指派人uid',
	`chargeuid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '负责人uid',
	`participantuid` text NOT NULL COMMENT '参与者uid串',
	`attachmentid` text NOT NULL COMMENT '附件id',
	`addtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '添加时间',
	`updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
	`starttime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '开始时间',
	`endtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '到期时间',
	`status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '任务状态(0:进行中,1:已结束)',
	`finishtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '完成时间（结束时间）',
	`stamp` tinyint(3) unsigned NOT NULL DEFAULT '0'COMMENT '图章',
	`commentcount` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '评论数量',
	PRIMARY KEY (`threadid`),
	KEY `SUBJECT` (`subject`) USING BTREE,
	KEY `FINISHTIME` (`finishtime`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `{{thread_attention}}`;
CREATE TABLE IF NOT EXISTS `{{thread_attention}}` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '流水id',
	`threadid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主线id',
	`uid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户uid',
	PRIMARY KEY (`id`),
	KEY `UID` (`uid`) USING BTREE
)ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `{{thread_relation}}`;
CREATE TABLE IF NOT EXISTS `{{thread_relation}}` (
  `id` int(11) unsigned NOT NULL auto_increment COMMENT '流水id',
  `threadid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主线id',
  `table` varchar(100) NOT NULL DEFAULT '' COMMENT '关联的表',
  `relativeid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '关联id',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

DROP TABLE IF EXISTS `{{thread_reader}}`;
CREATE TABLE IF NOT EXISTS `{{thread_reader}}` (
  `id` int(11) unsigned NOT NULL auto_increment COMMENT '流水id',
  `threadid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主线id',
  `uid` mediumint(100) NOT NULL DEFAULT '0' COMMENT '用户id',
  `time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '关联id',
  PRIMARY KEY  (`id`),
  KEY `THREADID` (`threadid`) USING BTREE,
  KEY `UID` (`uid`) USING BTREE
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

INSERT INTO `{{nav}}`(`pid`, `name`, `url`, `targetnew`, `system`, `disabled`, `sort`, `module`) VALUES ('5','工作主线','thread/list/index','0','1','0','2','thread');
INSERT INTO `{{menu_common}}`( `module`, `name`, `url`, `description`, `sort`, `iscommon`) VALUES ('thread','工作主线','thread/list/index','提供企业工作主题线索','14','0');
INSERT INTO `{{menu}}`(`name`, `pid`, `m`, `c`, `a`, `param`, `sort`, `disabled`) VALUES ('工作主线','0','thread','dashboard','index','','0','0');
REPLACE INTO `{{setting}}`(`skey`, `svalue`) VALUES('threadconfig', 'a:7:{s:4:"edit";a:2:{s:14:"participantuid";s:1:"1";s:9:"chargeuid";s:1:"2";}s:3:"end";a:2:{s:14:"participantuid";s:1:"1";s:9:"chargeuid";s:1:"1";}s:7:"restart";a:2:{s:14:"participantuid";s:1:"1";s:9:"chargeuid";s:1:"1";}s:3:"del";a:1:{s:9:"chargeuid";s:1:"1";}s:13:"addAttentions";a:2:{s:14:"participantuid";s:1:"1";s:9:"chargeuid";s:1:"1";}s:14:"relativeModule";a:2:{s:5:"email";s:1:"1";s:4:"flow";s:1:"1";}s:14:"designeeBecome";s:11:"participant";}');