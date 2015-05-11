<?php
session_start();
if(!isset($_SESSION["dayetv"])){
    $output["code"]=1;
    echo json_encode($output);
    exit;
}else{
    $my_session=json_decode($_SESSION["dayetv"]);
}
?>