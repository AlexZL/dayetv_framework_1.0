<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/10
 * Time: 9:50
 * check mysql data duplication. need one object argument;and key is sql col name; value is sql value.
 * 该服务提供数据库中数据重复检测。需要传入一个对象作为参数，对象键为数据库字段名，对象值为数据库值。
 */
$params = json_decode(file_get_contents('php://input'),true);   //   convert to array;
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
foreach($params as $key=>$value){
    if($key=="user_account"){
        if(!preg_match("/^[a-zA-Z0-9_]{4,20}$/",$value)){
            $output["code"]=2;
            echo json_encode($output);
            exit;
        }
        $result=$mysql->query("select count(*) from tb_user_info WHERE `$key`='$value'");
        $row=$result->fetch_row();
        if($row[0]>0){
            $output["account_duplicate"]=true;
        }else{
            $output["account_duplicate"]=false;
        }
        continue;
    }
    if($key=="user_name"){
        if(!preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",$value)){
            $output["code"]=2;
            echo json_encode($output);
            exit;
        }
        $result=$mysql->query("select count(*) from tb_user_info WHERE `$key`='$value'");
        $row=$result->fetch_row();
        if($row[0]>0){
            $output["name_duplicate"]=true;
        }else{
            $output["name_duplicate"]=false;
        }
        continue;
    }
    if($key=="user_phone_number"){
        if(!preg_match("/^[0-9]{11}$/",$value)){
            $output["code"]=2;
            echo json_encode($output);
            exit;
        }
        $result=$mysql->query("select count(*) from tb_user_info WHERE `$key`='$value'");
        $row=$result->fetch_row();
        if($row[0]>0){
            $output["phone_number_duplicate"]=true;
        }else{
            $output["phone_number_duplicate"]=false;
        }
        continue;
    }
}
echo json_encode($output);
