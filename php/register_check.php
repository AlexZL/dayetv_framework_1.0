<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/10
 * Time: 16:07
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
$user_name=$params->name;
$user_number=$params->phone_number;
if(!preg_match("/^[a-zA-Z0-9\#\~\!\@\-\%\^\&\*\.,:;\\\$]{6,22}$/",trim($password))||!preg_match("/^[a-zA-Z0-9_]{4,20}$/",trim($account))){
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
$register_date=date("Y-m-d H:i:s");
$user_passowrd=sha1($password.$register_date);
$priority='{"upload_drawing":0,"edit_drawing":0,"view_drawing":1}';
$mail_directory='{"outcome":[{"index":0,"name":"所有邮件"},{"index":1,"name":"重要邮件"},{"index":2,"name":"紧急邮件"}],"income":[{"index":0,"name":"所有邮件"},{"index":1,"name":"重要邮件"},{"index":2,"name":"紧急邮件"}]}';
$location='未分配';
$department='未分配';
$position='未分配';
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
$mysql->query("insert into tb_user_info (`user_account`,`user_password`,`register_time`,`user_name`,`priority`,`user_phone_number`,`mail_directory`,`location`,`department`,`position`) values ('$account','$user_passowrd','$register_date','$user_name','$priority','$user_number','$mail_directory','$location','$department','$position')");
$result=$mysql->query("select `user_ID` from tb_user_info order by `user_ID` desc limit 1");
$row=$result->fetch_row();
$UID=intval($row[0]);
$mail_table_name="tb_mail_".$UID;
$sent_table_name="tb_sent_".$UID;
$mysql2=new mysqli("localhost","mail","111111","mail");
$mysql2->query("create table $mail_table_name (
  mail_index smallint(6) not null auto_increment,
  mail_type smallint(6) not null DEFAULT 0,
  mail_important tinyint(4) not null DEFAULT 0,
  mail_urgent tinyint(4) not null DEFAULT 0,
  mail_title varchar(255) not null,
  mail_content text not null,
  mail_create_time varchar(255) not null,
  mail_creator_index SMALLINT(6) not null,
  mail_remote_index smallint(6) not null,
  mail_receiver varchar(255) not null,
  mail_sub_receiver varchar(2000) not null,
  mail_read tinyint(4) not null DEFAULT 0,
  mail_directory tinyint(4) not null,
  PRIMARY KEY (mail_index)
)") or die($mysql2->error);
$output["code"]=10;
echo json_encode($output);


