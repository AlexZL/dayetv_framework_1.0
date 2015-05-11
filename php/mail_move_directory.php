<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/5/3
 * Time: 18:57
 */
include("include.php");
$UID=$my_session->UID;
$params = json_decode(file_get_contents('php://input'));
$mail_type=$params->type;
$directory_index=$params->directory_index;
$mail_index=$params->mail_index;
if(!is_string($mail_index)||!is_numeric($directory_index)||!is_numeric($mail_type)){
    $output["code"]=2;
    echo json_encode($output,JSON_UNESCAPED_UNICODE);
    exit;
}
if(!isset($mail_type)||empty($directory_index)||empty($mail_index)){
    $output["code"]=3;
    echo json_encode($output,JSON_UNESCAPED_UNICODE);
    exit;
}
$table_name="tb_mail_".$UID;
$mysql=new mysqli("localhost","mail","111111","mail");
$mysql->query("update $table_name set `mail_directory`='$directory_index' WHERE `mail_type`='$mail_type' and `mail_index` in ($mail_index)") or die($mysql->error);
$output["code"]=10;
echo json_encode($output,JSON_UNESCAPED_UNICODE);

