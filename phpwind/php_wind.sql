/*
Navicat MySQL Data Transfer

Source Server         : link
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : php_wind

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-05-16 15:21:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `adv_pic`
-- ----------------------------
DROP TABLE IF EXISTS `adv_pic`;
CREATE TABLE `adv_pic` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pic` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `date_time` varchar(255) DEFAULT NULL,
  `e_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of adv_pic
-- ----------------------------

-- ----------------------------
-- Table structure for `adv_write`
-- ----------------------------
DROP TABLE IF EXISTS `adv_write`;
CREATE TABLE `adv_write` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `date_time` varchar(255) DEFAULT NULL,
  `e_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of adv_write
-- ----------------------------

-- ----------------------------
-- Table structure for `card`
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `ctime` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `prisenum` int(11) NOT NULL,
  `clicknum` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of card
-- ----------------------------

-- ----------------------------
-- Table structure for `card_state`
-- ----------------------------
DROP TABLE IF EXISTS `card_state`;
CREATE TABLE `card_state` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `is_show` int(11) NOT NULL,
  `is_hot` int(11) NOT NULL,
  `is_top` int(11) NOT NULL,
  `is_check` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of card_state
-- ----------------------------

-- ----------------------------
-- Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `ctime` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for `draft`
-- ----------------------------
DROP TABLE IF EXISTS `draft`;
CREATE TABLE `draft` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `ctime` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of draft
-- ----------------------------

-- ----------------------------
-- Table structure for `focus`
-- ----------------------------
DROP TABLE IF EXISTS `focus`;
CREATE TABLE `focus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of focus
-- ----------------------------

-- ----------------------------
-- Table structure for `friend`
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of friend
-- ----------------------------

-- ----------------------------
-- Table structure for `link`
-- ----------------------------
DROP TABLE IF EXISTS `link`;
CREATE TABLE `link` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `wname` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `data_time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of link
-- ----------------------------

-- ----------------------------
-- Table structure for `medal`
-- ----------------------------
DROP TABLE IF EXISTS `medal`;
CREATE TABLE `medal` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `point` int(11) NOT NULL,
  `descript` int(11) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of medal
-- ----------------------------

-- ----------------------------
-- Table structure for `nav`
-- ----------------------------
DROP TABLE IF EXISTS `nav`;
CREATE TABLE `nav` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `num` int(11) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of nav
-- ----------------------------

-- ----------------------------
-- Table structure for `notice`
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `ctime` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of notice
-- ----------------------------

-- ----------------------------
-- Table structure for `plate`
-- ----------------------------
DROP TABLE IF EXISTS `plate`;
CREATE TABLE `plate` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `uid` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of plate
-- ----------------------------
INSERT INTO `plate` VALUES ('1', '0', '0,', '1', 'phpwind官方动态');
INSERT INTO `plate` VALUES ('2', '1', '0,1,', '1', 'phpwind黑板报');
INSERT INTO `plate` VALUES ('3', '0', '0,', '2', 'phpwind移动版');
INSERT INTO `plate` VALUES ('4', '1', '0,1,', '3', 'phpwind官方推荐');

-- ----------------------------
-- Table structure for `report`
-- ----------------------------
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `buid` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of report
-- ----------------------------

-- ----------------------------
-- Table structure for `sensitive_words`
-- ----------------------------
DROP TABLE IF EXISTS `sensitive_words`;
CREATE TABLE `sensitive_words` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `wrod` varchar(255) NOT NULL,
  `grade` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of sensitive_words
-- ----------------------------

-- ----------------------------
-- Table structure for `user_group`
-- ----------------------------
DROP TABLE IF EXISTS `user_group`;
CREATE TABLE `user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_group
-- ----------------------------

-- ----------------------------
-- Table structure for `user_group_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_group_info`;
CREATE TABLE `user_group_info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `group_type` varchar(255) NOT NULL,
  `group_pic` varchar(255) DEFAULT NULL,
  `point` int(11) NOT NULL,
  `report` tinyint(4) NOT NULL,
  `look_ip` tinyint(4) NOT NULL,
  `look_card` tinyint(4) NOT NULL,
  `sent_card` tinyint(4) NOT NULL,
  `reply_card` tinyint(4) NOT NULL,
  `shen_card` tinyint(4) NOT NULL,
  `num_card` int(11) NOT NULL,
  `words_card` int(11) NOT NULL,
  `rwords_card` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_group_info
-- ----------------------------
