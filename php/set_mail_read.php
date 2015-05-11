<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/5/5
 * Time: 22:49
 */
include("include.php");
$params=json_decode(file_get_contents("php://input"));
if(!is_numeric($params)){
    $output["code"]=2;
    echo json_encode($output);
    exit;
}
$UID=$my_session->UID;
$table_name="tb_mail_".$UID;
$mysql=new mysqli("localhost","mail","111111","mail");
$mysql->query("update $table_name set `mail_read`=1 WHERE `mail_index`='$params'");
$output["code"]=10;
echo json_encode($output);
