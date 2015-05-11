<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/5/2
 * Time: 23:26
 */
include("include.php");
$UID=$my_session->UID;
if(is_numeric($UID)){
    $params = json_decode(file_get_contents('php://input'));
    $directory=json_encode($params,JSON_UNESCAPED_UNICODE);
    $mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
    $mysql->query("update tb_user_info set `mail_directory` = '$directory' WHERE `user_ID`='$UID'");
    $output["code"]=10;
}else{
    $output["code"]=2;
}
echo json_encode($output);