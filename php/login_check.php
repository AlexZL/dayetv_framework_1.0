<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/3/1
 * Time: 20:45
 */
session_start();
$params = json_decode(file_get_contents('php://input'));
if(empty($params->account)||empty($params->password)){
    $output["code"]=3;
    echo json_encode($output);
    exit;
}
$account=$params->account;
$password=$params->password;
$kick_out=$params->kick_out;
$password_preg=preg_match("/^[a-zA-Z0-9\#\~\!\@\-\%\^\&\*\.,:;\\\$]{6,22}$/",trim($password));
$account_preg1=preg_match("/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/",trim($account));
$account_preg2=preg_match("/^[0-9]{11}$/",trim($account));
if(!($password_preg&&($account_preg1||$account_preg2))){
    $output["code"]=2;
    echo json_encode($output);
    exit;
}
$account=trim($account);
$account=addslashes($account);
$account=htmlspecialchars($account);
$password=trim($password);
$password=addslashes($password);
$password=htmlspecialchars($password);
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
if($account_preg1){
    $result=$mysql->query("select count(*) from tb_user_info WHERE `user_account`='$account'");
}
if($account_preg2){
    $result=$mysql->query("select count(*) from tb_user_info WHERE `user_phone_number`='$account'");
}
$row=$result->fetch_row();
if($row[0]==0){
    $output["code"]=4;
    echo json_encode($output);
    exit;
}
$result->close();
if($account_preg1){
    $result=$mysql->query("select `user_password`,`user_ID`,`priority`,`register_time`,`user_name`,`online` from tb_user_info where `user_account`='$account'");
}
if($account_preg2){
    $result=$mysql->query("select `user_password`,`user_ID`,`priority`,`register_time`,`user_name`,`online` from tb_user_info where `user_phone_number`='$account'");
}
$obj=$result->fetch_object();
$sql_password=$obj->user_password;
$sql_ID=$obj->user_ID;
$priority=$obj->priority;
$sql_register_time=$obj->register_time;
$sql_name=$obj->user_name;
$sql_online=$obj->online;
if(sha1($password.$sql_register_time)!=$sql_password){
    $output["code"]=5;
    echo json_encode($output);
    exit;
}
$date=date("YmdHis");
$session_id=mt_rand(1,1000);
if($sql_online==1){
    if($kick_out){
        $session_output["UID"]=$sql_ID;
        $session_output["name"]=$sql_name;
        $session_output["session_id"]=$session_id;
        $session_output["priority"]=json_decode($priority);             //把$output["priority"]由字符串转换成对象，避免前端页面使用eval()
        $_SESSION["dayetv"]=json_encode($session_output,JSON_UNESCAPED_UNICODE);
        $mysql->query("update tb_user_info set `last_online_time`='$date',`session_id`='$session_id' WHERE `user_ID`='$sql_ID'");
        $output["code"]=10;
        echo json_encode($output,JSON_UNESCAPED_UNICODE);
    }else{
        $output["code"]=6;
        echo json_encode($output);
    }
}else{
    $session_output["UID"]=$sql_ID;
    $session_output["name"]=$sql_name;
    $session_output["session_id"]=$session_id;
    $session_output["priority"]=json_decode($priority);             //把$output["priority"]由字符串转换成对象，避免前端页面使用eval()
    $_SESSION["dayetv"]=json_encode($session_output,JSON_UNESCAPED_UNICODE);
    $mysql->query("update tb_user_info set `online`='1',`last_online_time`='$date',`session_id`='$session_id' WHERE `user_ID`='$sql_ID'");
    $output["code"]=10;
    echo json_encode($output,JSON_UNESCAPED_UNICODE);
}
//if($sql_online==1&&$kick_out){
//    $mysql->query("update tb_user_info set `online`=1,`last_online_time`='$date' WHERE `user_ID`='$sql_ID'");
//}else{
//    $output["wrong_code"]=6;
//}

