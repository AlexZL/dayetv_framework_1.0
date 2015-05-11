<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/15
 * Time: 15:46
 */
require("include.php");
$params = json_decode(file_get_contents('php://input'));
$type=$params->type;
$page_index=$params->page_index;
$mail_directory=$params->mail_directory;
if(!is_numeric($mail_directory)||!is_numeric($type)||!is_numeric($page_index)){
    $output["code"]=2;
    echo json_encode($output,JSON_UNESCAPED_UNICODE);
    exit;
}
$mail_num=20;
$start_num=($page_index-1)*$mail_num;
$UID=$my_session->UID;
$mail_count=0;
$output["mail"]=array();
$mysql1=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
$result=$mysql1->query("select * from tb_position WHERE `index`=1");
$obj=$result->fetch_object();
$result->close();
class mail{
    public $index;
    public $type;
    public $important;
    public $urgent;
    public $title;
    public $content;
    public $create_time;
    public $creator_index;
    public $receiver;
    public $sub_receiver;
    public $read;
    public $directory;
    function __construct($obj){
        $this->index=$obj->mail_index;
        $this->type=$obj->mail_type;
        $this->important=$obj->mail_important;
        $this->urgent=$obj->mail_urgent;
        $this->title=$obj->mail_title;
        $this->content=$obj->mail_content;
        $this->create_time=$obj->mail_create_time;
        $this->creator_index=$obj->mail_creator_index;
        $this->receiver=json_decode($obj->mail_receiver);
        $this->sub_receiver=$obj->mail_sub_receiver;
        $this->read=$obj->mail_read;
        $this->directory=$obj->mail_directory;
    }
}
$mysql=new mysqli("localhost","mail","111111","mail");
$table_name="tb_mail_".$UID;

if($mail_directory==0){
    $result=$mysql->query("select count(*) from $table_name WHERE `mail_type`='$type'");
    $row=$result->fetch_row();
    $mail_count=$row[0];
    $result->close();
    $result=$mysql->query("select * from $table_name WHERE `mail_type`='$type' ORDER by `mail_create_time` DESC limit $mail_num offset $start_num");
}else{
    if($mail_directory==1){
        $result=$mysql->query("select count(*) from $table_name WHERE `mail_type`='$type' AND `mail_important`=1");
        $row=$result->fetch_row();
        $mail_count=$row[0];
        $result->close();
        $result=$mysql->query("select * from $table_name WHERE `mail_type`='$type' AND `mail_important`=1 ORDER by `mail_create_time` DESC limit $mail_num offset $start_num");
    }else{
        if($mail_directory==2){
            $result=$mysql->query("select count(*) from $table_name WHERE `mail_type`='$type' AND `mail_urgent`=1");
            $row=$result->fetch_row();
            $mail_count=$row[0];
            $result->close();
            $result=$mysql->query("select * from $table_name WHERE `mail_type`='$type' AND `mail_urgent`=1 ORDER by `mail_create_time` DESC limit $mail_num offset $start_num");
        }else{
            $result=$mysql->query("select count(*) from $table_name WHERE `mail_type`='$type' AND `mail_directory`='$mail_directory'");
            $row=$result->fetch_row();
            $mail_count=$row[0];
            $result->close();
            $result=$mysql->query("select * from $table_name WHERE `mail_type`='$type' AND `mail_directory`='$mail_directory' ORDER by `mail_create_time` DESC limit $mail_num offset $start_num");
        }
    }
}
while($obj=$result->fetch_object()){
    $mail=new mail($obj);
    array_push($output["mail"],$mail);
}
$output["mail_count"]=$mail_count;
$output["code"]=10;
echo json_encode($output,JSON_UNESCAPED_UNICODE);
