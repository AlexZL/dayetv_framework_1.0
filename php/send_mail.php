<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/25
 * Time: 16:36
 */
require("include.php");
$params = json_decode(file_get_contents('php://input'));
$mysql=new mysqli("localhost","mail","111111","mail");
$creator_index=$my_session->UID;
$time=date("Y-m-d H:i:s");
$content=$params->content;
$title=$params->title;
$receiver=$params->receiver;
$urgent=$params->urgent;
$important=$params->important;
$receiver_x=json_encode($receiver);
$receiver_num=count($receiver);
if(empty($content)||empty($title)||$receiver_num==0){
    $output["code"]=3;
    echo json_encode($output,JSON_UNESCAPED_UNICODE);
    exit;
}
if(!is_numeric($urgent)||!is_numeric($important)){
    $output["code"]=2;
    echo json_encode($output,JSON_UNESCAPED_UNICODE);
    exit;
}
for($i=0;$i!=$receiver_num;$i++){
    $table_name="tb_mail_".$receiver[$i];
    $mysql->query("insert into $table_name (`mail_title`,`mail_content`,`mail_receiver`,`mail_create_time`,`mail_creator_index`,`mail_urgent`,`mail_important`)
        values
         ('$title','$content','$receiver_x','$time','$creator_index','$urgent','$important')");
}
$table_name_2="tb_mail_".$creator_index;
$mysql->query("insert into $table_name_2 (`mail_title`,`mail_content`,`mail_receiver`,`mail_create_time`,`mail_creator_index`,`mail_urgent`,`mail_important`,`mail_type`,`mail_read`)
        values
         ('$title','$content','$receiver_x','$time','$creator_index','$urgent','$important','1','1')");
$output["code"]=10;
echo json_encode($output,JSON_UNESCAPED_UNICODE);
