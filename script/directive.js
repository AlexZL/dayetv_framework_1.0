/**
 * Created by Administrator on 2015/4/1.
 */
dayetvAppDirective = angular.module("dayetvAppDirective",[]);
dayetvAppDirective.directive("btnCancel",function(){
    return{
        restrict:"A",
        scope:{
            enterImg:"@",
            leaveImg:"@",
            changeValue:"="
        },
        link:function(scope,element,attr){
            attr.$set("src",scope.leaveImg);
            element.bind("mouseenter",function(){
                attr.$set("src",scope.enterImg);
            });
            element.bind("mouseleave",function(){
                attr.$set("src",scope.leaveImg);
            });
        }
    }
}).directive("mailNoteHover",["$log","setMailNoteService",function($log,setMailNoteService){
    return{
        restrict:"A",
        scope:{
            enterImg:"@",
            leaveImg:"@",
            checkedImg:"@",
            tranScopeRef:"=",
            tranIndex:"@"
        },
        link:function(scope,element,attr){
            scope.$watch("tranScopeRef.urgent",function(){
                if(scope.tranIndex=="urgent"){
                    if(scope.tranScopeRef.urgent=="1"){
                        attr.$set("src",scope.checkedImg);
                    }else{
                        attr.$set("src",scope.leaveImg);
                    }
                }
            });
            scope.$watch("tranScopeRef.important",function(){
                if(scope.tranIndex=="important"){
                    if(scope.tranScopeRef.important=="1"){
                        attr.$set("src",scope.checkedImg);
                    }else{
                        attr.$set("src",scope.leaveImg);
                    }
                }
            });
            if(scope.tranIndex=="urgent"){
                if(scope.tranScopeRef.urgent==="1"){
                    attr.$set("src",scope.checkedImg);
                    element.bind("click",function(){
                        if(scope.tranScopeRef.chosen){
                            if(scope.tranScopeRef.urgent==="1"){
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_urgent",0).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.urgent="0";
                                        attr.$set("src",scope.leaveImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }else{
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_urgent",1).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.urgent="1";
                                        attr.$set("src",scope.checkedImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }

                        }
                    });
                }else{
                    attr.$set("src",scope.leaveImg);
                    element.bind("mouseenter",function(){
                        if(scope.tranScopeRef.chosen&&scope.tranScopeRef.urgent==="0"){
                            attr.$set("src",scope.enterImg)
                        }
                    });
                    element.bind("mouseleave",function(){
                        if(scope.tranScopeRef.chosen&&scope.tranScopeRef.urgent==="0"){
                            attr.$set("src",scope.leaveImg)
                        }
                    });
                    element.bind("click",function(){
                        if(scope.tranScopeRef.chosen){
                            if(scope.tranScopeRef.urgent==="1"){
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_urgent",0).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.urgent="0";
                                        attr.$set("src",scope.leaveImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }else{
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_urgent",1).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.urgent="1";
                                        attr.$set("src",scope.checkedImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }
                        }
                    });
                }
            }
            if(scope.tranIndex=="important") {
                if(scope.tranScopeRef.important==="1"){
                    attr.$set("src",scope.checkedImg);
                    element.bind("click",function(){
                        if(scope.tranScopeRef.chosen){
                            if(scope.tranScopeRef.important==="1"){
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_important",0).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.important="0";
                                        attr.$set("src",scope.leaveImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }else{
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_important",1).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.important="1";
                                        attr.$set("src",scope.checkedImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }

                        }
                    });
                }else{
                    attr.$set("src",scope.leaveImg);
                    element.bind("mouseenter",function(){
                        if(scope.tranScopeRef.chosen&&scope.tranScopeRef.important==="0"){
                            attr.$set("src",scope.enterImg)
                        }
                    });
                    element.bind("mouseleave",function(){
                        if(scope.tranScopeRef.chosen&&scope.tranScopeRef.important==="0"){
                            attr.$set("src",scope.leaveImg)
                        }
                    });
                    element.bind("click",function(){
                        if(scope.tranScopeRef.chosen){
                            if(scope.tranScopeRef.important==="1"){
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_important",0).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.important="0";
                                        attr.$set("src",scope.leaveImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }else{
                                setMailNoteService.set(scope.tranScopeRef.index,"mail_important",1).success(function(result){
                                    if(result.code===10){
                                        scope.tranScopeRef.important="1";
                                        attr.$set("src",scope.checkedImg)
                                    }else{
                                        alert("set note error");
                                        $log.log("url:"+"php/set_mail_note.php \n"+"service: setMailNoteService \n"+"result:");
                                        $log.log(result);
                                    }
                                })
                            }
                        }
                    });
                }
            }
        }
    }
}]).directive("mailNoteSelect",function(){
    return{
        restrict:"A",
        scope:{
            enterImg:"@",
            leaveImg:"@",
            checkedImg:"@",
            tranScopeRef:"="
        },
        link:function(scope,element,attr){
            attr.$set("src",scope.leaveImg);
            element.bind("mouseenter",function(){
                if(!scope.tranScopeRef.chosen){
                    attr.$set("src",scope.enterImg)
                }
            });
            element.bind("mouseleave",function(){
                if(!scope.tranScopeRef.chosen){
                    attr.$set("src",scope.leaveImg)
                }
            });
            element.bind("click",function(){
                scope.tranScopeRef.chosen=!scope.tranScopeRef.chosen;
                if(scope.tranScopeRef.chosen){
                    attr.$set("src",scope.checkedImg);
                    var index=scope.tranScopeRef.index;
                    scope.$parent.$parent.$parent.var.mail_chosen_arr.push(index);
                }else{
                    attr.$set("src",scope.leaveImg);
                    var index=scope.tranScopeRef.index;
                    scope.$parent.$parent.$parent.var.mail_chosen_arr=ArrayDelValue(scope.$parent.$parent.$parent.var.mail_chosen_arr,index);
                }
            });
            scope.$watch("tranScopeRef.chosen",function(){
                if(scope.tranScopeRef.chosen){
                    attr.$set("src",scope.checkedImg);
                }else{
                    attr.$set("src",scope.leaveImg);
                }
            })
        }
    }
}).directive("clickChangeBtn",function(){
    return{
        restrict:"A",
        scope:{
            originalImg:"@",
            changeImg:"@",
            hoverImg:"@",
            changeValueRef:"="
        },
        link:function(scope,element,attr){
            attr.$set("src",scope.originalImg);
            element.bind("click",function(){
                if(scope.changeValueRef){
                    attr.$set("src",scope.changeImg);
                }else{
                    attr.$set("src",scope.originalImg);
                }
            });
            element.bind("mouseenter",function(){
                if(!scope.changeValueRef){
                    attr.$set("src",scope.hoverImg);
                }
            });
            element.bind("mouseleave",function(){
                if(!scope.changeValueRef){
                    attr.$set("src",scope.originalImg);
                }
            })
        }
    }
}).directive("btnWithImg",function(){
    return{
        restrict:"A",
        scope:{
            originalImg:"@",
            changeImg:"@",
            imgTop:"@",
            imgLeft:"@",
            imgHeight:"@",
            imgWidth:"@"
        },
        link:function(scope,element,attr){
            var change="<img src='"+scope.changeImg+ "' style='position:absolute;height:"+scope.imgHeight+"px;width:"+scope.imgWidth+"px;top:"+scope.imgTop+"px;left:"+scope.imgLeft+"px;' />";
            var original="<img src='"+scope.originalImg+ "' style='position:absolute;height:"+scope.imgHeight+"px;width:"+scope.imgWidth+"px;top:"+scope.imgTop+"px;left:"+scope.imgLeft+"px;' />";
            element.append(original);
            element.bind("mouseenter",function(){
                element.html("");
                element.append(change)
            });
            element.bind("mouseleave",function(){
                element.html("");
                element.append(original)
            });
        }
    }
}).directive("mySelect",function(){
    return{
        restrict:"A",
        link:function(scope,element,attr){
            var mail=scope.$parent.mail;
            element.bind("mouseenter",function(){
                if(!mail.chosen){
                    mail.note.selected="media/img/icons/selected_dark.png";
                }
            });
            element.bind("mouseleave",function(){
                if(!mail.chosen){
                    mail.note.selected="media/img/icons/selected_grey.png";
                }
            });
            element.bind("click",function(){
                if(!mail.chosen){
                    mail.note.selected="media/img/icons/selected_green.png";
                }else{
                    mail.note.selected="media/img/icons/selected_grey.png";
                }
            })
        }
    }
}).directive("mailDirectory",["readMailContentService",function(readMailContentService){
    return{
        restrict:"A",
        scope:{
            mailType:"@",
            directoryNum:"@"
        },
        link:function(scope,element,attr){

        }
    }
}]).directive("ratioElement",[function(){
    return{
        restrict:"E",
        scope:{
            originalClass:"@",
            changeClass:"@",
            hoverClass:"@",
            ratioGroup:"@",
            ratioNum:"@"
        },
        link:function(scope,element,attr){
            var elements=document.getElementsByTagName("ratio-element");
            var ratios=[];
            for(var p=0;p!=elements.length;p++){
                if(elements[p].attributes["ratio-group"].nodeValue==scope.ratioGroup){
                    ratios.push(elements[p])
                }
            }
            if(ratios.length==scope.ratioNum){
                original_class[scope.ratioGroup]=ratios[scope.ratioNum-1].className;
                root_ratios[scope.ratioGroup]=ratios;
                for(var p in ratios){
                    ratios[p].className=original_class[scope.ratioGroup]+" "+scope.originalClass;
                    ratios[p].attributes["clicked"].nodeValue=0;
                }
                ratios[0].className=original_class[scope.ratioGroup]+" "+scope.changeClass;
                ratios[0].attributes["clicked"].nodeValue=1;
            }
            element.bind("click",function(){
                for(var p in root_ratios[scope.ratioGroup]){
                    root_ratios[scope.ratioGroup][p].className=original_class[scope.ratioGroup]+" "+scope.originalClass;
                    root_ratios[scope.ratioGroup][p].attributes["clicked"].nodeValue=0;
                }
                attr.$set("class",original_class[scope.ratioGroup]+" "+scope.changeClass);
                attr.$set("clicked",1)
            });
            element.bind("mouseenter",function(){
                if(element[0].attributes["clicked"].nodeValue==0){
                    attr.$set("class",original_class[scope.ratioGroup]+" "+scope.hoverClass)
                }
            });
            element.bind("mouseleave",function(){
                if(element[0].attributes["clicked"].nodeValue==0){
                    attr.$set("class",original_class[scope.ratioGroup]+" "+scope.originalClass)
                }
            })

        }
    }
}]);
