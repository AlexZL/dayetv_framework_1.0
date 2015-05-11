<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/5/1
 * Time: 14:48
 */
include("include.php");
$UID=$my_session->UID;
if(is_numeric($UID)){
    $mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
    $result=$mysql->query("select mail_directory from tb_user_info WHERE `user_ID`='$UID'");
    $obj=$result->fetch_object();
    $result=json_decode($obj->mail_directory);
    $output["code"]=10;
    $output["content"]=$result;
}else{
    $output["code"]=2;
}
echo json_encode($output,JSON_UNESCAPED_UNICODE);