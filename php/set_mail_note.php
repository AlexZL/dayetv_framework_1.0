<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/18
 * Time: 19:44
 */
require("include.php");
$params = json_decode(file_get_contents('php://input'));
$UID=$my_session->UID;
$index=$params->index;
$key=$params->key;
$value=$params->value;
if(!is_numeric($value)||!is_numeric($UID)||!is_string($key)){
    $output["code"]=2;
    echo json_encode($output);
    exit;
}
$table_name="tb_mail_".$UID;
$mysql=new mysqli("localhost","mail","111111","mail");
$mysql->query("update $table_name set `$key`='$value' where `mail_index` in ($index)") or die($mysql->error);
$output["code"]=10;
echo json_encode($output);
