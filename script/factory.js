/**
 * Created by Administrator on 2015/4/5.
 */
var registerPageService=angular.module("registerPageService",[]);
registerPageService.factory("checkDuplicateService",['$http',function($http){
    var duplicateCheckUrl='php/duplicate_check.php';
    var checkDuplicate=function(obj){
        return $http({
            method:"POST",
            url:duplicateCheckUrl,
            data:obj
        });
    };
    return {
        check:function(obj){
            return checkDuplicate(obj);
        }
    }
}]).factory("loginCheckService",['$http','$location','loginStatusCheckService',function($http,$location,loginStatusCheckService){
    var login_check_url='php/login_check.php';
    var user={};
    var login=function(){
        this.kick_out=false;
    };
    var loginCheck=function(scope){
        return $http({
            method:"POST",
            url:login_check_url,
            data:scope.var.login
        }).success(function(result){
            scope.var.user=result;
            if(result.code===3){
                alert("用户名和密码不能为空");
                return;
            }
            if(result.code===2){
                alert("用户名密码不合规，请重新输入");
                return;
            }
            if(result.code===4){
                alert("没有该用户!");
                return;
            }
            if(result.code===5){
                alert("密码错误!");
                return;
            }
            if(result.code===6){
                var kick_conf=confirm("帐号已在别处登录，是否将其踢下线？");
                if(kick_conf){
                    scope.var.login.kick_out=true;
                    loginCheck(scope);
                    return;
                }else{
                    scope.var.hidden_login_page.visible=false;
                    scope.var.login=new login();
                    return
                }
            }
            loginStatusCheckService.check(scope);
            $location.path('/main')
        });
    };
    return{
        check:function(scope){
            return loginCheck(scope)
        },
        user:user
    }
}]).factory("loginStatusCheckService",['$http',function($http){
    var URL='php/login_status_check.php';
    var callback;
    var loginStatusCheck=function(scope){
        $http({
            method:"POST",
            url:URL
        }).success(function(result){
            scope.var.user=result;
            if(scope.var.user.remote_login==1){
                scope.var.user.remote_login=0;
                user={};
                scope.var.user={};
                callback=false;
                alert("该帐号已在别处登录,您被迫下线。");
            }else{
                callback=true;
                user=result;
            }
        })
    };
    return{
        check:function(scope){
            return loginStatusCheck(scope)
        },
        user:user
    }
}]);

var mailPageService=angular.module("mailPageService",[]);
mailPageService.factory("readMailCacheService",["$http","$cacheFactory",function($http,$cacheFactory){
    var cache=$cacheFactory("readMailCache");
    var updata=function(type){
        return $http({
            method:"POST",
            url:"php/read_mail.php",
            data:type,
            cache:cache
        })
    };
    return{
        cache:cache,
        updata:updata
    }
}]).factory("userInfoCacheService",["$http","$cacheFactory",function($http,$cacheFactory){
    var cache=$cacheFactory("userInfoCache");
    var updata=function(user_ID){
        return $http({
            method:"POST",
            url:"php/user_info.php",
            data:user_ID,
            cache:cache
        })
    };
    return{
        cache:cache,
        updata:updata
    }
}]).factory("LDPInfoCacheService",["$http","$cacheFactory",function($http,$cacheFactory){
    var cache=$cacheFactory("LDPInfoCache");
    var updata=function(key){
        return $http({
            method:"POST",
            url:"php/LDP.php",
            cache:cache
        })
    };
    return{
        cache:cache,
        updata:updata
    }
}]).factory("getLDPInfoService",["$http","LDPInfoCacheService",function($http,LDPInfoCacheService){
    var getInfoFn=function(key,scope){
        var backData=LDPInfoCacheService.get(key);
        if(!backData){
            $http({
                method:"POST",
                url:"php/LDP.php",
                cache:LDPInfoCacheService
            }).success(function(result){
                LDPInfoCacheService.put(key,result);
                scope.info=result;
            })
        }else{
            scope.info=backData;
        }
    };
    return{
        getInfo:function(key,scope){
            return getInfoFn(key,scope);
        }
    }
}]).factory("noteService",["$http","$log","setMailNoteService",function($http,$log,setMailNoteService){
    var url="php/set_mail_note.php";
    var icon_select_active="media/img/icons/selected_green.png";
    var icon_select_enter="media/img/icons/selected_dark.png";
    var icon_select_leave="media/img/icons/selected_grey.png";
    var icon_urgent_active="media/img/icons/urgent_yellow.png";
    var icon_urgent_enter="media/img/icons/urgent_dark.png";
    var icon_urgent_leave="media/img/icons/urgent_grey.png";
    var icon_important_active="media/img/icons/important_red.png";
    var icon_important_enter="media/img/icons/important_dark.png";
    var icon_important_leave="media/img/icons/important_grey.png";
    var setNote=function(mail,index,type){
        if(index=='select'){
            if(type=="enter"){
                if(!mail.chosen){
                    mail.note.selected=icon_select_enter;
                }
            }
            if(type=="leave"){
                if(!mail.chosen){
                    mail.note.selected=icon_select_leave;
                }
            }
            if(type=="click"){
                mail.chosen=!mail.chosen;
                if(mail.chosen){
                    mail.note.selected=icon_select_active;
                }else{
                    mail.note.selected=icon_select_leave;
                }
            }
        }
        if(index=="urgent"){
            if(type=="enter"){
                if(mail.chosen&&mail.urgent=="0"){
                    mail.note.urgent=icon_urgent_enter
                }
            }
            if(type=="leave"){
                if(mail.chosen&&mail.urgent=="0"){
                    mail.note.urgent=icon_urgent_leave
                }
            }
            if(type=="click"){
                if(mail.chosen&&mail.urgent=="1"){
                    setMailNoteService.set(mail.index,"mail_urgent",0).success(function(result){
                        if(result.code!=10){
                            alert("set mail note error");
                            $log.log("url:"+"php/set_mail_note.php \n"+"service: noteService \n"+"result:");
                            $log.log(result);
                            return;
                        }
                        mail.urgent="0";
                        mail.note.urgent=icon_urgent_leave;
                    });
                }
                if(mail.chosen&&mail.urgent=="0"){
                    setMailNoteService.set(mail.index,"mail_urgent",1).success(function(result){
                        if(result.code!=10){
                            alert("read user_info error");
                            $log.log("url:"+"php/user_info.php \n"+"service: userInfoCacheService \n"+"result:");
                            $log.log(result);
                            return;
                        }
                        mail.urgent="1";
                        mail.note.urgent=icon_urgent_active;
                    });
                }
            }
        }
        if(index=="important"){
            if(type=="enter"){
                if(mail.chosen&&mail.important=="0"){
                    mail.note.important=icon_important_enter
                }
            }
            if(type=="leave"){
                if(mail.chosen&&mail.important=="0"){
                    mail.note.important=icon_important_leave
                }
            }
            if(type=="click"){
                if(mail.chosen&&mail.important=="1"){
                    setMailNoteService.set(mail.index,"mail_important",0).success(function(result){
                        if(result.code!=10){
                            alert("read user_info error");
                            $log.log("url:"+"php/user_info.php \n"+"service: userInfoCacheService \n"+"result:");
                            $log.log(result);
                            return;
                        }
                        mail.important="0";
                        mail.note.important=icon_important_leave;
                    });
                }
                if(mail.chosen&&mail.important=="0"){
                    setMailNoteService.set(mail.index,"mail_important",1).success(function(result){
                        if(result.code!=10){
                            alert("read user_info error");
                            $log.log("url:"+"php/user_info.php \n"+"service: userInfoCacheService \n"+"result:");
                            $log.log(result);
                            return;
                        }
                        mail.important="1";
                        mail.note.important=icon_important_active;
                    });
                }
            }
        }
    };
    return{
        set:setNote
    }
}]).factory("mailCreatorCacheService",["$cacheFactory",function($cacheFactory){
    return $cacheFactory("mailCreatorCache")
}]).factory("setMailNoteService",["$http",function($http){
    var url="php/set_mail_note.php";
    var setNote=function(index,key,value){
        var data={};
        if(Array.isArray(index)){
           var mail_index=index.join();
        }else{
            mail_index=index;
        }
        data.index=mail_index;data.key=key;data.value=value;
        return  $http({
                method:"POST",
                url:url,
                data:data
            })
    };
    return{
        set:function(index,key,value){
            return setNote(index,key,value)
        }
    }
}]).factory("readMailContentService",["$http",function($http){
    var read=function(type,page_index,mail_directory){
        var params={};
        params.type=type;params.page_index=page_index;params.mail_directory=mail_directory;
        return $http({
            method:"POST",
            url:"php/read_mail.php",
            data:params
        })
    };
    return{
        read:read
    }
}]).factory("setMailDirectoryService",["$http",function($http){
    var set=function(directory_obj){
        for(var p in directory_obj.income){
            delete directory_obj.income[p].chosen;
            delete directory_obj.income[p].tmp_name;
            delete directory_obj.income[p].change_name;
        }
        for(var p in directory_obj.outcome){
            delete directory_obj.outcome[p].chosen;
            delete directory_obj.outcome[p].tmp_name;
            delete directory_obj.outcome[p].change_name;
        }
        console.log(directory_obj);
        return $http({
            method:"POST",
            url:"php/set_user_mail_directory.php",
            data:directory_obj
        })
    };
    return{
        set:set
    }
}]);