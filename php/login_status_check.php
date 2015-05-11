<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/5
 * Time: 18:10
 */
session_start();
class output{
    var $loged_in=false;
}
$output=new output();
if(isset($_SESSION["dayetv"])){
    $session=json_decode($_SESSION["dayetv"],true);
    $UID=$session["UID"];
    $session_id=$session["session_id"];
    $mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
    $resutl=$mysql->query("select `session_id` from tb_user_info WHERE `user_ID`='$UID'");
    $row=$resutl->fetch_row();
    if($row[0]!=$session_id){
        $output->remote_login=1;
        $output->loged_in=false;
        $output->name="";
        $output->UID="";
        $output->priority="";
        $output->session_id="";
        unset($_SESSION["dayetv"]);
    }else{
        $output->remote_login=0;
        $output->loged_in=true;
        $output->name=$session["name"];
        $output->UID=$session["UID"];
        $output->priority=$session["priority"];
        $output->session_id=$session["session_id"];
    }
}else{
    $output->loged_in=false;
    $output->name="";
    $output->UID="";
    $output->priority="";
    $output->session_id="";
}
echo json_encode($output,JSON_UNESCAPED_UNICODE);