/**
 * Created by Administrator on 2015/3/26.
 */
var indexPageController = angular.module("indexPageController",[
]);

indexPageController.controller("headDivController",[
    "$scope",
    "$http",
    "$location",
    '$timeout',
    'checkDuplicateService',
    'loginStatusCheckService',
    'loginCheckService',
function($scope,$http,$location,$timeout,checkDuplicateService,loginStatusCheckService,loginCheckService){
    var login=function(){
        this.kick_out=false;                            //该变量决定是否踢出别处登录的用户
    };
    $scope.var={};
    $scope.var.login={};
    $scope.fn={};
    $scope.timeout={};
    loginStatusCheckService.check($scope);
    $scope.fn.toUserPage=function(){
        loginStatusCheckService.check($scope);
        $location.path("/user");                                //ng-view   跳转到用户设置页面
    };
    $scope.fn.toLoginPage = function(){
        $scope.var.hidden_login_page_visible=!$scope.var.hidden_login_page_visible;
    };
    $scope.fn.LoginPageQuit = function(){
        $scope.var.hidden_login_page_visible=false;
        $scope.var.login=new login();
    };
    $scope.fn.toRegisterPage = function(){
        $location.path("/register");
        $scope.var.hidden_login_page_visible=false;
    };
    $scope.fn.LoginSubmit=function(){
        if($scope.login_form.$valid){
            loginCheckService.check($scope);
            $scope.var.hidden_login_page_visible=false;
            $scope.var.login=new login();
        }
    };
    $scope.fn.logout=function(){
        var logoutConfirm=confirm("确定退出？");
        if(logoutConfirm){
            $http({
                method:"POST",
                url:"php/logout.php"
            }).success(function(result){
                $scope.var.user=result;
                user=result;
            });
        }
        $location.path("/main");
    };
    $scope.fn.login_form_enter=function(){
        $timeout.cancel($scope.timeout.login_show)
    };
    $scope.fn.login_form_leave=function(){
        $scope.timeout.login_show=$timeout(function(){
            $scope.fn.LoginPageQuit();
        },3000)
    };
}]).controller('navigatorDivController',['$scope','$http','$location','$timeout',function($scope,$http,$location,$timeout){
    $http.get("json/navigator.json").success(function(result){
        $scope.var=result;
    });
    $scope.fn={};$scope.timeout={};
    $scope.fn.subTitleShow=function(){
        $scope.timeout.navigator_subtitle=$timeout(function(){
        $scope.var.sub_title_visible=true;
        $scope.var.highLightBar.col[0].visible=true;
        },500);
    };
    $scope.fn.subTitleHide=function(){
        $scope.var.sub_title_visible=false;
        $timeout.cancel($scope.timeout.navigator_subtitle)
    };
    $scope.fn.showBar=function(dom){
        var row_num=dom.row;
        var col_num=dom.col;
        $scope.var.highLightBar.row[row_num].visible=true;
        $scope.var.highLightBar.col[col_num].visible=true;
    };
    $scope.fn.hideBar=function(dom){
        var row_num=dom.row;
        var col_num=dom.col;
        $scope.var.highLightBar.row[row_num].visible=false;
        $scope.var.highLightBar.col[col_num].visible=false;
        $timeout.cancel($scope.timeout.navigator_subtitle)
    };
    $scope.fn.navigatorSwitch=function(obj){
        $scope.var.sub_title_visible=false;
        var locat="/"+obj.id;
        if(obj.need_login){
            if(user.loged_in){
                if(obj.need_priority!=""){
                    for(var key in user.priority){
                        if(key==obj.need_priority){
                            if(user.priority[key]==1){
                                $location.path(locat);
                                return;
                            }
                        }
                    }
                    alert("没有权限！");
                }else{
                    $location.path(locat);
                }
            }else{
                alert("未登录，请先登录。")
            }
        }else{
            $location.path(locat);
        }
    };
}]);
var registerPageController=angular.module("registerPageController",[]);
registerPageController.controller("registerController",[
    "$scope",
    "$http",
    "$location",
    "$window",
    "$timeout",
    "$log",
    "checkDuplicateService",
    'loginStatusCheckService',
    'loginCheckService',
function($scope,$http,$location,$window,$timeout,$log,checkDuplicateService,loginStatusCheckService,loginCheckService){

    $http.get("json/register_page.json").success(function(result){
        $scope.var=result;
    });
    $scope.fn={};
    $scope.fn.RegisterPageHide = function(){
        $location.path("/main");
    };
    $scope.fn.RegisterPageBtnChange=function(){
        $scope.var.quit_div_src="media/img/icons/cancel_orange.png";
    };
    $scope.fn.RegisterPageBtnRestore=function(){
        $scope.var.quit_div_src="media/img/icons/cancel_blue.png";
    };
    $scope.fn.RegisterSubmit=function(){
        $scope.var.submitted=true;
        $scope.var.password_same=true;
        $scope.var.account_duplicate=false;
        $scope.var.name_duplicate=false;
        $scope.var.phone_number_duplicate=false;
        if($scope.var.password!=$scope.var.password2){
            $scope.var.password_same=false;
            alert("两次密码输入不一致");
            return;
        }
        if($scope.register_form.$invalid){
            return;
        }
        var upload_data={
            "user_account":$scope.var.account,
            //"user_name":$scope.var.name,                               //if need to check user name duplication,uncomment it.
            "user_phone_number":$scope.var.phone_number
        };
        checkDuplicateService.check(upload_data).success(function(result){          //check account duplicate
            if(result.code===2){
                alert("duplicate check params wrong");
                $log.log("url:php/duplicate_check.php\n service:checkDuplicateService. \n result: \n");
                $log.log(result);
                return;
            }
            $scope.var.account_duplicate=result.account_duplicate;
            //$scope.var.name_duplicate=data.name_duplicate;            //if need to check user name duplication,uncomment it.
            $scope.var.phone_number_duplicate=result.phone_number_duplicate;
            $scope.var.error=($scope.var.account_duplicate/*---||$scope.var.name_duplicate---*/||$scope.var.phone_number_duplicate||$scope.register_form.$invalid||(!$scope.var.password_same));
            if(!$scope.var.error){
                $http({
                    method:"POST",
                    url:"php/register_check.php",
                    data:$scope.var
                }).success(function(result){
                    if(result.code===3){
                        alert("帐号和密码不能为空");
                        return;
                    }
                    if(result.code===2){
                        alert("帐号或密码格式不匹配");
                        return;
                    }
                    if(result.code===10){
                        $scope.var.login={};
                        $scope.var.login.account=$scope.var.account;
                        $scope.var.login.password=$scope.var.password;
                        loginCheckService.check($scope);
                        $timeout(function(){
                            $location.path("/main");
                            $window.location.reload();
                        },1000);
                    }
                })
            }
        })
    };
}]);

var userPageController=angular.module("userPageController",[]);
userPageController.controller("userPageController",["$scope","$http","readMailContentService","userInfoCacheService",function($scope,$http,readMailContentService,userInfoCacheService){
    $scope.fn={};
    $scope.var={};
    $http.get("json/user_main_page.json").success(function(result){
        $scope.var=result;
    });
    $scope.fn.navigatorLiClick=function(subtitle){
        for(var i=0;i!=$scope.var.subtitles.length;i++){
            $scope.var.subtitles[i].selected=false;
            $scope.var.subtitles[i].css_class="user_page_navigator_origin";
        }
        subtitle.selected=true;
        subtitle.css_class="user_page_navigator_change";
        if(subtitle.id=="console"){
            $scope.var.user_info_set_selected=true;
        }
    };
}]);

var mailPageController=angular.module("mailPageController",[]);
mailPageController.controller("mailPageController",["$scope","$http","$log","$timeout","$location","readMailContentService","userInfoCacheService","setMailNoteService","setMailDirectoryService",function($scope,$http,$log,$timeout,$location,readMailContentService,userInfoCacheService,setMailNoteService,setMailDirectoryService){
    $scope.fn={};$scope.var={};
    if(!user.loged_in){
        $location.path("/main");
        alert("未登录");
        return;
    }
    $scope.var.mail_directory_index=0;
    $scope.var.mail_type=0;
    $scope.var.mail_page_index=1;
    $http.get("json/mail_page_controller.json").success(function(result){
        $scope.var=result;
    });
    $http.get("php/get_directory.php").success(function(result){
        $scope.var.mail_directory=result.content;
        for(var p in $scope.var.mail_directory.income){
            $scope.var.mail_directory.income[p].chosen=false
        }
        for(var p in $scope.var.mail_directory.outcome){
            $scope.var.mail_directory.outcome[p].chosen=false
        }
    });
    $scope.fn.readMailContent=function(type,page_index,mail_directory){               //type区分邮件类型 0：收件箱；1：发件箱;
        $scope.var.mail_content_visible=false;
        $scope.var.set_directory_visible=false;
        readMailContentService.read(type,page_index,mail_directory).success(function(result){
            if(result.code!==10){
                alert("read mail content error");
                $log.log("url:php/read_mail.php.\n service:readMailContentService.\n result: \n");
                $log.log(result);
                return;
            }
            $scope.var.mails=result.mail;
            $scope.var.mail_count=result.mail_count;
            $scope.var.mail_page_count=Math.ceil(result.mail_count/20);
            var user_info=userInfoCacheService.cache.get(0);
            if(!user_info){
                userInfoCacheService.updata(0).success(function(result2){
                    if(result2.code!=10){
                        alert("read user info error");
                        $log.log("url: php/user_info.php.\n service:userInfoCacheService.\n result:\n");
                        $log.log(result2);
                        return;
                    }
                    user_info=result2.content;
                    userInfoCacheService.cache.put(0,result2.content);
                    for(var p in $scope.var.mails){
                        var creator_index=$scope.var.mails[p].creator_index;
                        $scope.var.mails[p].creator=user_info[creator_index-1];
                        $scope.var.mails[p].receiver_info=[];
                        for(var q in $scope.var.mails[p].receiver){
                            var receiver_index=$scope.var.mails[p].receiver[q];
                            var receiver_info=user_info[receiver_index-1];
                            $scope.var.mails[p].receiver_info.push(receiver_info)
                        }
                        if(typeof($scope.var.mails[p].note)=="undefined"){
                            $scope.var.mails[p].note={};
                        }
                        if($scope.var.mails[p].important=="1"){
                            $scope.var.mails[p].note.important="media/img/icons/important_red.png";
                        }else{
                            $scope.var.mails[p].note.important="media/img/icons/important_grey.png";
                        }
                        if($scope.var.mails[p].urgent=="1"){
                            $scope.var.mails[p].note.urgent="media/img/icons/urgent_yellow.png";
                        }else{
                            $scope.var.mails[p].note.urgent="media/img/icons/urgent_grey.png";
                        }
                        $scope.var.mails[p].note.selected="media/img/icons/selected_grey.png";
                    }
                })
            }else{
                for(var p in $scope.var.mails){
                    var creator_index=$scope.var.mails[p].creator_index;
                    $scope.var.mails[p].creator=user_info[creator_index-1];
                    $scope.var.mails[p].receiver_info=[];
                    for(var q in $scope.var.mails[p].receiver){
                        var receiver_index=$scope.var.mails[p].receiver[q];
                        var receiver_info=user_info[receiver_index-1];
                        $scope.var.mails[p].receiver_info.push(receiver_info)
                    }
                    if(typeof($scope.var.mails[p].note)=="undefined"){
                        $scope.var.mails[p].note={};
                    }
                    if($scope.var.mails[p].important=="1"){
                        $scope.var.mails[p].note.important="media/img/icons/important_red.png";
                    }else{
                        $scope.var.mails[p].note.important="media/img/icons/important_grey.png";
                    }
                    if($scope.var.mails[p].urgent=="1"){
                        $scope.var.mails[p].note.urgent="media/img/icons/urgent_yellow.png";
                    }else{
                        $scope.var.mails[p].note.urgent="media/img/icons/urgent_grey.png";
                    }
                    $scope.var.mails[p].note.selected="media/img/icons/selected_grey.png";
                }
            }
        });
    };
    $scope.fn.readMailContent(0,1,$scope.var.mail_directory_index);
    $scope.fn.writeMail=function(){
        $scope.var.write_page_visible=!$scope.var.write_page_visible;
        $scope.set_directory_visible=false
    };
    $scope.fn.allMailChosen=function(){
        var mails=$scope.var.mails;
        $scope.var.mail_chosen_arr=[];
        if(!$scope.var.all_mail_chosen){
            for(var p in mails){
                $scope.var.mail_chosen_arr.push(mails[p].index);
                mails[p].chosen=true;
            }
        }else{
            for(var p in mails){
                mails[p].chosen=false;
            }
        }
        $scope.var.all_mail_chosen=!$scope.var.all_mail_chosen;
    };
    $scope.fn.noteImportant=function(){
        setMailNoteService.set($scope.var.mail_chosen_arr,"mail_important",1).success(function(result){
            if(result.code!=10){
                alert("set note error");
                $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                $log.log(result);
                return;
            }
            for(var p=0;p!=$scope.var.mail_chosen_arr.length;p++){
                var index=$scope.var.mail_chosen_arr[p];
                for(var x in $scope.var.mails){
                    if($scope.var.mails[x].index==index){
                        $scope.var.mails[x].important="1"
                    }
                }
            }
        })
    };
    $scope.fn.noteUrgent=function(){
        setMailNoteService.set($scope.var.mail_chosen_arr,"mail_urgent",1).success(function(result){
            if(result.code!=10){
                alert("set note error");
                $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                $log.log(result);
                return;
            }
            for(var p=0;p!=$scope.var.mail_chosen_arr.length;p++){
                var index=$scope.var.mail_chosen_arr[p];
                for(var x in $scope.var.mails){
                    if($scope.var.mails[x].index==index){
                        $scope.var.mails[x].urgent="1"
                    }
                }
            }
        })
    };
    $scope.fn.noteRead=function(){
        setMailNoteService.set($scope.var.mail_chosen_arr,"mail_read",1).success(function(result){
            if(result.code!=10){
                alert("set note error");
                $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                $log.log(result);
                return;
            }
            for(var p=0;p!=$scope.var.mail_chosen_arr.length;p++){
                var index=$scope.var.mail_chosen_arr[p];
                for(var x in $scope.var.mails){
                    if($scope.var.mails[x].index==index){
                        $scope.var.mails[x].read="1"
                    }
                }
            }
        })
    };
    $scope.fn.mailToTrash=function(){
        var cf=confirm("确定删除邮件？");
        if(!cf){
            $scope.var.mail_chosen_arr=[];
            for(var p in $scope.var.mails){
                $scope.var.mails[p].chosen=false;
            }
            return;
        }
        var data={};
        var mail_index_arr=$scope.var.mail_chosen_arr;
        data.index=mail_index_arr.join();
        console.log(mail_index_arr);
        $http({
            method:"POST",
            url:"php/delete_mail.php",
            data:data
        }).success(function(result){
            if(result.code!=10){
                alert("delete mail error");
                $log.log("url:delete_mail.php \n function:fn.mailToTrash \n result:");
                $log.log(result);
            }
            $scope.var.mail_content_visible=false;
            for(var p in $scope.var.mails){
                for(var q in mail_index_arr){
                    if($scope.var.mails[p].index==mail_index_arr[q]){
                        $scope.var.mails=ArrayDelValue($scope.var.mails,$scope.var.mails[p])
                    }
                }
            }
        })
    };
    $scope.fn.backToMail=function(){
        $scope.var.mail_content_visible=false;
        $scope.var.set_directory_visible=false;
        $scope.var.mail_chosen_arr=[];
        for(var p in $scope.var.mails){
            $scope.var.mails[p].chosen=false
        }
    };
    $scope.fn.toPage=function(){
        $scope.fn.readMailContent($scope.var.mail_type,$scope.var.mail_page_index,$scope.var.mail_directory_index);
    };
    $scope.fn.toIncomeBox=function(){
        if($scope.var.mail_type==0&&!$scope.var.set_directory_visible&&!$scope.var.mail_content_visible){
            return;
        }
        $scope.var.mail_type=0;
        $scope.fn.readMailContent($scope.var.mail_type,1,0);
    };
    $scope.fn.toOutcomeBox=function(){
        if($scope.var.mail_type==1&&!$scope.var.set_directory_visible&&!$scope.var.mail_content_visible){
            return;
        }
        $scope.var.mail_type=1;
        $scope.fn.readMailContent($scope.var.mail_type,1,0);
    };
    $scope.fn.mailToDirectory=function(index){
        var data=function(){
            this.directory_index=index;
            this.type=$scope.var.mail_type;
            this.mail_index=$scope.var.mail_chosen_arr.join();
        };
        input=new data;
        $http({
            method:"POST",
            url:"php/mail_move_directory.php",
            data:input
        }).success(function(result){
            if(result.code!=10){
                alert("add move directory error");
                $log.log("url:"+"php/mail_move_directory.php \n"+"function: fn.moveToDirectory \n"+"result:");
                $log.log(result);
                return;
            }
        })
    };
    $scope.fn.toggleDirectoryInput=function(){
        $scope.var.set_directory_visible=!$scope.var.set_directory_visible;
    };
    $scope.fn.changeMailDirectory=function(type,page_index,mail_directory){
        $scope.fn.readMailContent(type,page_index,mail_directory);
        $scope.var.mail_directory_index=mail_directory;
    };
    $scope.fn.addMailDirectory=function(key){
        var directory_item=function(index,name){
            this.index=index;
            this.name=name;
        };
        var max_index=0;
        if(key=="income"){
            for(var p in $scope.var.mail_directory.income){
                if($scope.var.mail_directory.income[p].index>max_index){
                    max_index=$scope.var.mail_directory.income[p].index;
                }
            }
            var plus_directory=new directory_item(max_index+1,$scope.var.add_directory_name_income);
            $scope.var.mail_directory.income.push(plus_directory);
        }
        if(key=="outcome"){
            for(var p in $scope.var.mail_directory.outcome){
                if($scope.var.mail_directory.outcome[p].index>max_index){
                    max_index=$scope.var.mail_directory.outcome[p].index;
                }
            }
            var plus_directory=new directory_item(max_index+1,$scope.var.add_directory_name_outcome);
            $scope.var.mail_directory.outcome.push(plus_directory);
        }
        setMailDirectoryService.set($scope.var.mail_directory).success(function(result){
            if(result.code!=10){
                alert("add mail directory error");
                $log.log("url:"+"php/set_user_mail_directory.php \n"+"function: fn.addMailDirectory \n"+"result:");
                $log.log(result);
                return;
            }
            if(result.code===10){
                alert("添加成功");
            }
        });
        $scope.fn.addMailDirectoryCancel();

    };
    $scope.fn.addMailDirectoryCancel=function(){
        $scope.var.add_directory_name_outcome="";
        $scope.var.add_directory_name_income="";
        $scope.var.add_outcome_directory_clicked=false;
        $scope.var.add_income_directory_clicked=false;
    };
    $scope.fn.mailDirectoryChosen=function(obj){
        if(obj.index==0||obj.index==1||obj.index==2){
            return;
        }
        obj.chosen=!obj.chosen;
    };

    $scope.fn.directoryToTrash=function(){
        var cf=confirm("确定要删除么？");
        if(!cf){
            for(var p in $scope.var.mail_directory.income){
                $scope.var.mail_directory.income[p].chosen=false
            }
            for(var p in $scope.var.mail_directory.outcome){
                $scope.var.mail_directory.outcome[p].chosen=false
            }
            return;
        }
        var income=[];
        var outcome=[];
        for(var p in $scope.var.mail_directory.income){
            if(!$scope.var.mail_directory.income[p].chosen){
                income.push($scope.var.mail_directory.income[p])
            }
        }
        for(var p in $scope.var.mail_directory.outcome){
            if(!$scope.var.mail_directory.outcome[p].chosen){
                outcome.push($scope.var.mail_directory.outcome[p])
            }
        }
        $scope.var.mail_directory.income=income;
        $scope.var.mail_directory.outcome=outcome;
        setMailDirectoryService.set($scope.var.mail_directory).success(function(result){
            if(result.code!=10){
                alert("add mail directory error");
                $log.log("url:"+"php/set_user_mail_directory.php \n"+"function: fn.addMailDirectory \n"+"result:");
                $log.log(result);
                return;
            }
            if(result.code===10){
                alert("删除成功");
            }
        });
    };
    $scope.fn.thisDirectoryToTrash=function(key,item){
        var cf=confirm("确定删除该文件夹？");
        if(cf){
            if(key=="income"){
                var income=[];
                for(var p in $scope.var.mail_directory.income){
                    if(item.index!=$scope.var.mail_directory.income[p].index){
                        income.push($scope.var.mail_directory.income[p]);
                    }
                }
                $scope.var.mail_directory.income=income;
            }
            if(key=="outcome"){
                var outcome=[];
                for(var p in $scope.var.mail_directory.outcome){
                    if(item.index!=$scope.var.mail_directory.outcome[p].index){
                        outcome.push($scope.var.mail_directory.outcome[p]);
                    }
                }
                $scope.var.mail_directory.outcome=outcome;
            }
            setMailDirectoryService.set($scope.var.mail_directory).success(function(result){
                if(result.code!=10){
                    alert("add mail directory error");
                    $log.log("url:"+"php/set_user_mail_directory.php \n"+"function: fn.addMailDirectory \n"+"result:");
                    $log.log(result);
                    return;
                }
                if(result.code===10){
                    alert("删除成功");
                }
            });
        }
    };
    $scope.fn.thisDirectoryEdit=function(key,item){
        if(key=="income"){
            for(var p in $scope.var.mail_directory.income){
                if(item.index==$scope.var.mail_directory.income[p].index){
                    $scope.var.mail_directory.income[p].name=item.tmp_name;
                }
            }
        }
        if(key=="outcome"){
            for(var p in $scope.var.mail_directory.outcome){
                if(item.index==$scope.var.mail_directory.outcome[p].index){
                    $scope.var.mail_directory.outcome[p].name=item.tmp_name;
                }
            }
        }

        setMailDirectoryService.set($scope.var.mail_directory).success(function(result){
            if(result.code!=10){
                alert("add mail directory error");
                $log.log("url:"+"php/set_user_mail_directory.php \n"+"function: fn.addMailDirectory \n"+"result:");
                $log.log(result);
            }
        })
    };
    $scope.fn.thisDirectoryEditCancel=function(item){
      item.change_name=false;
        item.tmp_name="";
        return item;
    };
    $scope.$watch("var.mail_chosen_arr.length",function(newval){
        newval==0?$scope.var.mail_set_btn_visible=false:$scope.var.mail_set_btn_visible=true;
    });
}]).controller("oneMailController",["$scope","$http","$log","noteService",function($scope,$http,$log,noteService){
    $scope.$parent.mail.chosen=false;
    $scope.$parent.mail.checked_img="media/img/icons/selected_green.png";
    $scope.$parent.mail.leave_img="media/img/icons/selected_grey.png";
    $scope.fn.mailCreatorClick=function(scope){
        scope.creator_visible=!scope.creator_visible;
    };
    $scope.fn.hideCreatorDiv=function(scope){
        scope.creator_visible=false;
    };
    $scope.fn.showMailContent=function(mail){
        $scope.$parent.$parent.var.mail_content={};
        $scope.$parent.$parent.var.mail_content_visible=true;
        $scope.$parent.$parent.var.mail_content.content=mail.content;
        $scope.$parent.$parent.var.mail_content.title=mail.title;
        $scope.$parent.$parent.var.mail_content.receiver=mail.receiver_info;
        $scope.$parent.$parent.var.mail_content.creator=mail.creator.user_name;
        $scope.$parent.$parent.var.mail_content.important=mail.important;
        $scope.$parent.$parent.var.mail_content.urgent=mail.urgent;
        $scope.$parent.mail.chosen=true;
        $scope.$parent.$parent.var.mail_chosen_arr=[];
        $scope.$parent.$parent.var.mail_chosen_arr.push(mail.index);
        $http({
            method:"POST",
            url:"php/set_mail_read.php",
            data:mail.index
        }).success(function(result){
            if(result.code!=10){
                alert("set mail read error");
                $log.log("url:php/set_mail_read.php; \n function:fn.showMailContent() \n result:");
                $log.log(result);
            }
            mail.read=1;
        })
    };
    $scope.fn.selectEnter=function(mail){
        noteService.set(mail,"select","enter")
    };
    $scope.fn.selectLeave=function(mail){
        noteService.set(mail,"select","leave")
    };
    $scope.fn.selectClick=function(mail){
        noteService.set(mail,"select","click");
        if(mail.chosen){
            $scope.$parent.$parent.var.mail_chosen_arr.push(mail.index)
        }else{
            $scope.$parent.$parent.var.mail_chosen_arr=ArrayDelValue($scope.$parent.$parent.var.mail_chosen_arr,mail.index)
        }
    };
    $scope.fn.noteEnter=function(mail,index){
        noteService.set(mail,index,"enter");
    };
    $scope.fn.noteLeave=function(mail,index){
        noteService.set(mail,index,"leave");
    };
    $scope.fn.noteClick=function(mail,index){
        noteService.set(mail,index,"click")
    };
    $scope.$watch("$parent.mail.chosen",function(){
        if(typeof($scope.$parent.mail.note)!="undefined"){
            if($scope.$parent.mail.chosen){
                if($scope.$parent.mail.note.selected){
                    $scope.$parent.mail.note.selected="media/img/icons/selected_green.png";
                }
            }else{
                if($scope.$parent.mail.note.selected){
                    $scope.$parent.mail.note.selected="media/img/icons/selected_grey.png";
                }
            }
        }
    });
    $scope.$watch("$parent.mail.urgent",function(){
        if(typeof($scope.$parent.mail.note)!="undefined"){
            if($scope.$parent.mail.urgent=="1"){
                $scope.$parent.mail.note.urgent="media/img/icons/urgent_yellow.png";
            }else{
                $scope.$parent.mail.note.urgent="media/img/icons/urgent_grey.png";
            }
        }
    });
    $scope.$watch("$parent.mail.important",function(){
        if(typeof($scope.$parent.mail.note)!="undefined"){
            if($scope.$parent.mail.important=="1"){
                $scope.$parent.mail.note.important="media/img/icons/important_red.png";
            }else{
                $scope.$parent.mail.note.important="media/img/icons/important_grey.png";
            }
        }
    });
}]).controller("writeMailController",["$scope","$http","$timeout","$log","userInfoCacheService","LDPInfoCacheService",function($scope,$http,$timeout,$log,userInfoCacheService,LDPInfoCacheService){
    $scope.var={};
    $scope.fn={};
    $scope.LDP={};
    $scope.receiver_key={};
    $scope.receiver_key.page_index=1;
    $scope.receiver_selected=[];
    $scope.timeout={};
    $scope.style={};
    $scope.input_width=530;
    $scope.receiver_element_style={};
    $scope.receiver_stuff_style={};
    $scope.receiver_input_style={};
    $scope.title_style={};
    $scope.content_style={};
    $scope.receiver_style={};
    $scope.mail_send={};
    $scope.mail_send.urgent=0;
    $scope.mail_send.important=0;

    $scope.LDP=LDPInfoCacheService.cache.get(0);
    if(!$scope.LDP){
        LDPInfoCacheService.updata(0).success(function(result){
            $scope.LDP=result;
            LDPInfoCacheService.cache.put(0,result)
        })
    }
    //$scope.all_users=userInfoCacheService.cache.get(0);
    //if(!$scope.all_users){
    //    userInfoCacheService.updata(0).success(function(result){
    //        if(result.code!=10){
    //            alert("read user_info error");
    //            $log.log("url:"+"php/user_info.php \n"+"service: userInfoCacheService \n"+"result:");
    //            $log.log(result);
    //            return;
    //        }
    //        $scope.all_users=result.content;
    //        userInfoCacheService.cache.put(0,result.content)
    //    });
    //}
    $scope.fn.searchReceiverShow=function(){
        $scope.var.search_page_visible=!$scope.var.search_page_visible;
    };
    $scope.fn.selectAllReceiver=function(){
        for(var p in $scope.receivers){
            $scope.receiver_selected.push($scope.receivers[p])
        }
        $scope.var.receiver_element_num=$scope.receiver_selected.length;
    };
    $scope.fn.searchReceiverHide=function(){
        $scope.var.search_page_visible=false;
    };
    $scope.fn.getReceiverInfo=function(){
        $http({
            method:"POST",
            url:"php/receiver_info.php",
            data:$scope.receiver_key
        }).success(function(result){
            if(result.code!=10){
                alert("get receiver_info error");
                $log.log("url:"+"php/receiver_info.php \n"+"function: fn.getReceiverInfo \n"+"result:");
                $log.log(result);
                return;
            }
            $scope.receivers=result.content;
            $scope.var.receiver_count=result.num;
            $scope.var.receiver_page_count=Math.ceil(result.num/8);
        })
    };
    $scope.fn.getReceiverInfo();
    $scope.fn.writePageInputClick=function(){
        $scope.var.search_page_visible=true;
    };
    $scope.fn.writePageCancel=function(){
        var mail_send=function(){
            this.important=0;
            this.urgent=0;
            this.title="";
            this.content=""
        };
        $scope.$parent.var.write_page_visible=false;
        $scope.var.search_page_visible=false;
        $scope.receiver_selected=[];
        $scope.mail_send=new mail_send
        console.log($scope)
    };
    $scope.$watch("receiver_key.location",function(){
        if(typeof($scope.receiver_key.location)!="undefined"){
            $scope.fn.getReceiverInfo()
        }
    });
    $scope.$watch("receiver_key.department",function(){
        if(typeof($scope.receiver_key.department)!="undefined"){
            $scope.fn.getReceiverInfo()
        }
    });
    $scope.$watch("receiver_key.position",function(){
        if(typeof($scope.receiver_key.position)!="undefined"){
            $scope.fn.getReceiverInfo()
        }
    });

    $scope.timeout.receiverName=$timeout(function(){
        $scope.fn.getReceiverInfo()
    },1000);
    $scope.$watch("receiver_key.name",function(){
        $timeout.cancel($scope.timeout.receiverName);
        if(typeof($scope.receiver_key.name)!="undefined"){
            $scope.timeout.receiverName=$timeout(function(){
                $scope.fn.getReceiverInfo()
            },1000);
        }
    });
    $scope.$watch("receiver_selected.length",function(){
        $scope.var.receiver_element_num=$scope.receiver_selected.length;
    });
    $scope.fn.choseReceiver=function(obj){
        $scope.receiver_selected.push(obj);
        console.log(obj)
    };
    $scope.fn.removeReceiver=function(obj){
        $scope.receiver_selected=ArrayDelValue($scope.receiver_selected,obj)
    };
    $scope.fn.send_mail=function(){
        var mail_send=function(){
            this.urgent=0;
            this.important=0
        };
        var arr=[];
        for(var i=0;i!=$scope.receiver_selected.length;i++){
            var index=parseInt($scope.receiver_selected[i].user_ID);
            arr.push(index);
        }
        $scope.mail_send.receiver=ArrayDelDuplication(arr);                        //收件人数组去重
        if($scope.mail_send.receiver.length==0||$scope.mail_send.title==""||$scope.mail_send.content==""||typeof($scope.mail_send.title)=="undefined"||typeof($scope.mail_send.content)=="undefined"){
            alert("收件人、标题及内容不能为空");
            return;
        }
        $http({
            method:"POST",
            url:"php/send_mail.php",
            data:$scope.mail_send
        }).success(function(result){
            if(result.code!=10){
                alert("send mail error");
                $log.log("url:"+"php/send_mail.php \n"+"function: fn.send_mail \n"+"result:");
                $log.log(result);
                return;
            }
            $scope.mail_send=new mail_send;
            $scope.receiver_selected=[];
        }).error(function(result,status){
            $log.log("result:"+result+" status:"+status)
        })
    };
    $scope.$watch("var.receiver_element_num",function(){
        if($scope.var.receiver_element_num<6||typeof($scope.var.receiver_element_num)=="undefined"){
            $scope.receiver_style.height=40;
            $scope.title_style.top=80;
            $scope.content_style.top=120;
            $scope.content_style.height=240;
        }else{
            $scope.receiver_style.height=80;
            $scope.title_style.top=120;
            $scope.content_style.top=160;
            $scope.content_style.height=200;
            if($scope.var.receiver_element_num>11){
                document.getElementById("write_page_receiver_stuff").scrollTop=Math.ceil(($scope.var.receiver_element_num-11)/6)*39;
                console.log(Math.ceil(($scope.var.receiver_element_num-11)/6)*39);
            }
        }
        if(typeof($scope.var.receiver_element_num)=="undefined"){
            $scope.receiver_input_style.width=500;
        }else{
            $scope.receiver_input_style.width=500-$scope.var.receiver_element_num%6*80;
        }
        $scope.receiver_stuff_style.height=$scope.receiver_style.height;
    });
    $scope.style.receiverInput=function(){
        return{
            "width":$scope.receiver_input_style.width+"px"
        }
    };
    $scope.style.receiverElement=function(){

    };
    $scope.style.receiverStuff=function(){
        return {
            "height":$scope.receiver_stuff_style.height+"px",
            "width":$scope.receiver_stuff_style.width+"px"
        }
    };
    $scope.style.title=function(){
        return{
            "top":$scope.title_style.top+"px"
        }
    };
    $scope.style.content=function(){
        return{
            "top":$scope.content_style.top+"px",
            "height":$scope.content_style.height+"px"
        }
    };
    $scope.style.receiver=function(){
        return{
            "height":$scope.receiver_style.height+"px"
        }
    }
}]);

