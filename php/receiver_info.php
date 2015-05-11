<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/21
 * Time: 23:36
 */
require("include.php");
$params = json_decode(file_get_contents('php://input'));
if(!isset($params->page_index)){
    $page_index=1;
}else{
    $page_index=$params->page_index;
}
$start_num=($page_index-1)*8;
$content_arr=array();
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
if(empty($params->name)){
    if(empty($params->location)){
        if(empty($params->department)){
            if(empty($params->position)){
                // name: null;   location: null;    department: null;    position: null
                $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info limit 8 offset $start_num");
                $result2=$mysql->query("select count(*) from tb_user_info");
            }else{
                // name: null;   location: null;    department: null;    position: not null
                if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))){
                    $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `position`='$params->position' limit 8 offset $start_num");
                    $result2=$mysql->query("select count(*) from tb_user_info WHERE `position`='$params->position'");
                }else{
                    $output["code"]="2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }else {
            if (empty($params->position)) {
                // name: null;   location: null;    department: not null;    position: null
                if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->department))) {
                    $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `department`='$params->department' limit 8 offset $start_num");
                    $result2 = $mysql->query("select count(*) from tb_user_info WHERE `department`='$params->department'");
                } else {
                    $output["code"] = "2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            } else {
                // name: null;   location: null;    department: not null;    position: not null
                if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->department))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))) {
                    $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `department`='$params->department' and `position`='$params->position' limit 8 offset $start_num");
                    $result2 = $mysql->query("select count(*) from tb_user_info WHERE `department`='$params->department' and `position`='$params->position'");
                } else {
                    $output["code"] = "2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }
    }else{
        if(empty($params->department)){
            if(empty($params->position)){
                // name: null;   location:not null;    department: null;    position: null
                if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->location))){
                    $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `location`='$params->location' limit 8 offset $start_num");
                    $result2=$mysql->query("select count(*) from tb_user_info WHERE `location`='$params->location'");
                }else{
                    $output["code"] = "2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }else{
                // name: null;   location:not null;    department: null;    position: not null
                if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))){
                    $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `location`='$params->location' and `position`='$params->position' limit 8 offset $start_num");
                    $result2=$mysql->query("select count(*) from tb_user_info WHERE `location`='$params->location' and `position`='$params->position'");
                }else{
                    $output["code"]="2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }else {
            if (empty($params->position)) {
                // name: null;   location:not null;    department: not null;    position: null
                if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->department))) {
                    $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `location`='$params->location' and `department`='$params->department' limit 8 offset $start_num");
                    $result2 = $mysql->query("select count(*) from tb_user_info WHERE `location`='$params->location' and `department`='$params->department'");
                } else {
                    $output["code"] = "2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            } else {
                // name: null;   location:not null;    department: not null;    position: not null
                if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->department))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->position))) {
                    $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `location`='$params->location' and `department`='$params->department' and `position`='$params->position' limit 8 offset $start_num");
                    $result2 = $mysql->query("select count(*) from tb_user_info WHERE `location`='$params->location' and `department`='$params->department' and `position`='$params->position'");
                } else {
                    $output["code"] = "2";
                    echo json_encode($output,JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }
    }
}else{
    if(preg_match("/^[0-9]+$/",trim($params->name))){
        if(empty($params->location)){
            if(empty($params->department)){
                if(empty($params->position)){
                    // name: number,not null;   location: null;    department: null;    position: null
                    $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info where `user_phone_number` regexp '$params->name' limit 8 offset $start_num");
                    $result2=$mysql->query("select count(*) from tb_user_info where `user_phone_number` regexp '$params->name'");
                }else{
                    // name: number,not null;   location: null;    department: null;    position: not null
                    if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))){
                        $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and `position`='$params->position' limit 8 offset $start_num");
                        $result2=$mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and `position`='$params->position'");
                    }else{
                        $output["code"]="2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }else {
                if (empty($params->position)) {
                    // name: number,not null;   location: null;    department: not null;    position: null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->department))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `department`='$params->department' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `department`='$params->department'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                } else {
                    // name: number,not null;   location: null;    department: not null;    position: not null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->department))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `department`='$params->department' and `position`='$params->position' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `department`='$params->department' and `position`='$params->position'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }
        }else{
            if(empty($params->department)){
                if(empty($params->position)){
                    // name: number,not null;   location:not null;    department: null;    position: null
                    if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->location))){
                        $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' limit 8 offset $start_num");
                        $result2=$mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location'");
                    }else{
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }else{
                    // name: number,not null;   location:not null;    department: null;    position: not null
                    if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))){
                        $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' and `position`='$params->position' limit 8 offset $start_num");
                        $result2=$mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' and `position`='$params->position'");
                    }else{
                        $output["code"]="2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }else {
                if (empty($params->position)) {
                    // name: number,not null;   location:not null;    department: not null;    position: null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->department))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                } else {
                    // name: number,not null;   location:not null;    department: not null;    position: not null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->department))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->position))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department' and `position`='$params->position' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_phone_number` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department' and `position`='$params->position'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }
        }
    }else{
        if(empty($params->location)){
            if(empty($params->department)){
                if(empty($params->position)){
                    // name: string,not null;   location: null;    department: null;    position: null
                    $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info where `user_name` regexp '$params->name' limit 8 offset $start_num");
                    $result2=$mysql->query("select count(*) from tb_user_info where `user_name` regexp '$params->name'");
                }else{
                    // name: string,not null;   location: null;    department: null;    position: not null
                    if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))){
                        $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and `position`='$params->position' limit 8 offset $start_num");
                        $result2=$mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and `position`='$params->position'");
                    }else{
                        $output["code"]="2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }else {
                if (empty($params->position)) {
                    // name: string,not null;   location: null;    department: not null;    position: null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->department))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and  `department`='$params->department' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and  `department`='$params->department'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                } else {
                    // name: string,not null;   location: null;    department: not null;    position: not null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->department))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and  `department`='$params->department' and `position`='$params->position' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and  `department`='$params->department' and `position`='$params->position'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }
        }else{
            if(empty($params->department)){
                if(empty($params->position)){
                    // name: string,not null;   location:not null;    department: null;    position: null
                    if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->location))){
                        $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' limit 8 offset $start_num");
                        $result2=$mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location'");
                    }else{
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }else{
                    // name: string,not null;   location:not null;    department: null;    position: not null
                    if(preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",trim($params->position))){
                        $result=$mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' and `position`='$params->position' limit 8 offset $start_num");
                        $result2=$mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' and `position`='$params->position'");
                    }else{
                        $output["code"]="2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }else {
                if (empty($params->position)) {
                    // name: string,not null;   location:not null;    department: not null;    position: null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->department))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                } else {
                    // name: string,not null;   location:not null;    department: not null;    position: not null
                    if (preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->location))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->department))&&preg_match("/^[\x{4e00}-\x{9fa5}]+$/u", trim($params->position))) {
                        $result = $mysql->query("select `user_ID`,`user_name`,`location`,`department`,`position`,`user_phone_number` from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department' and `position`='$params->position' limit 8 offset $start_num");
                        $result2 = $mysql->query("select count(*) from tb_user_info WHERE `user_name` regexp '$params->name' and  `location`='$params->location' and `department`='$params->department' and `position`='$params->position'");
                    } else {
                        $output["code"] = "2";
                        echo json_encode($output,JSON_UNESCAPED_UNICODE);
                        exit;
                    }
                }
            }
        }
    }

}
while ($obj = $result->fetch_object()) {
    array_push($content_arr, $obj);
}
$row=$result2->fetch_row();
$receiver_num=$row[0];
$result->close();
$result2->close();
$output["code"]=10;
$output["content"]=$content_arr;
$output["num"]=$receiver_num;
echo json_encode($output,JSON_UNESCAPED_UNICODE);
