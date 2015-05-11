<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/16
 * Time: 16:29
 */
require("include.php");
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
$index = json_decode(file_get_contents('php://input'));
if($index==0){
    $result=$mysql->query("select `user_ID`,`register_time`,`user_name`,`user_phone_number`,`location`,`priority`,`department`,`position`,`mail_directory`,`online`,`last_online_time`,`user_words`,`user_portrait_url`
                        from tb_user_info");
    $output["content"]=array();
    while($obj=$result->fetch_object()){
        array_push($output["content"],$obj);
    }
}else{
    if(!is_numeric($index)){
        $output["code"]=2;
        echo json_encode($output,JSON_UNESCAPED_UNICODE);
        exit;
    }
    $result=$mysql->query("select `user_ID`,`register_time`,`user_name`,`user_phone_number`,`location`,`priority`,`department`,`position`,`mail_directory`,`online`,`last_online_time`,`user_words`,`user_portrait_url`
                        from tb_user_info WHERE `user_ID`='$index'");
    $obj=$result->fetch_object();
    $output["content"]=$obj;
}
$output["code"]=10;
echo json_encode($output,JSON_UNESCAPED_UNICODE);