<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/21
 * Time: 13:21
 */
require("include.php");
$mysql=new mysqli("localhost","weixiu","weixiu","www_dayetv_com");
$result=$mysql->query("select * from tb_position WHERE `index`=1");
$obj=$result->fetch_object();
$output["location"]=json_decode($obj->location,true);
$output["department"]=json_decode($obj->department,true);
$output["position"]=json_decode($obj->position,true);
echo json_encode($output,JSON_UNESCAPED_UNICODE);
