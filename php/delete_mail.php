<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/5/6
 * Time: 0:00
 */
include("include.php");
$params = json_decode(file_get_contents('php://input'));
$index=$params->index;
$mysql=new mysqli("localhost","mail","111111","mail");
$UID=$my_session->UID;
$table_name="tb_mail_".$UID;
$mysql->query("delete from $table_name WHERE `mail_index` in ($index)");
$output["code"]=10;
echo json_encode($output);