# HeidiSQL Dump 
#
# --------------------------------------------------------
# Host:                         127.0.0.1
# Database:                     chat
# Server version:               5.0.67-community-nt
# Server OS:                    Win32
# Target compatibility:         HeidiSQL w/ MySQL Server 5.0
# Target max_allowed_packet:    1048576
# HeidiSQL version:             4.0
# Date/time:                    2009-11-18 20:15:16
# --------------------------------------------------------

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;*/


#
# Database structure for database 'chat'
#

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `chat` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `chat`;


#
# Table structure for table 'messages'
#

CREATE TABLE /*!32312 IF NOT EXISTS*/ `messages` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `uid` varchar(255) default NULL,
  `cid` varchar(255) default NULL,
  `body` text,
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;



#
# Dumping data for table 'messages'
#

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS;*/
REPLACE INTO `messages` (`id`, `uid`, `cid`, `body`, `created`, `modified`) VALUES
	('1','qwer1','qwer2','first 11','2009-11-18 14:59:14','2009-11-18 15:00:23'),
	('2','qwer3','qwer3','sdf dsfe','2009-11-18 15:15:38','2009-11-18 15:15:38');
/*!40000 ALTER TABLE `messages` ENABLE KEYS;*/
UNLOCK TABLES;


#
# Table structure for table 'users'
#

CREATE TABLE /*!32312 IF NOT EXISTS*/ `users` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `username` varchar(255) default '',
  `password` varchar(255) NOT NULL default '',
  `key` varchar(255) default NULL,
  `email` varchar(100) character set utf8 collate utf8_unicode_ci NOT NULL default '',
  `active` tinyint(1) unsigned NOT NULL default '0',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



#
# Dumping data for table 'users'
#

# No data found.

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;*/
