/**
 * Created by Administrator on 2015/4/26.
 */
var ArrayDelDuplication = function(arr){
    var res = [];
    var json = {};
    for(var i = 0; i < arr.length; i++){
        if(!json[arr[i]]){
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
};
var ArrayDelValue=function(arr,value){
    var res=[];
    for(var i=0;i!=arr.length;i++){
        if(arr[i]!=value){
            res.push(arr[i])
        }
    }
    return res;
};
var toggleValue=function(value){
    return !value;
};
var user={};