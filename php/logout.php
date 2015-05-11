<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/8
 * Time: 16:14
 */
session_start();
class output{

}
$output=new output();
$mysession=json_decode($_SESSION["dayetv"],true);
$UID=$mysession["UID"];
unset($_SESSION["dayetv"]);
$output->loged_in=false;
$output->name="";
$output->UID="";
$output->priority="";
$output->session_id="";
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
$mysql->query("update tb_user_info set `online`='0',`session_id`='0',`last_online_time`='0' WHERE `user_ID`='$UID'");
echo json_encode($output,JSON_UNESCAPED_UNICODE);
