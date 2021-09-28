(function(ng){
    'use strict';
    var app= ng.module("ngLoadScript",[]);
    app.directive("script",function(){
        return {
            restrict:'E',
            scope: false,
            link:function(scope,element,attr){
                if(attr.type === "text/javascript-lazy"){var sc = document.createElement("script");
                sc.type = "text/javascript";
                var src_obj = element.attr("src");
                if (src_obj !== undefined){
                    sc.src = src_obj;
                }
                else{
                    var code = element.text();
                    sc.text = code;
                }
                // console.log(sc);
                document.body.appendChild(sc);
                element.remove();}
            }
        };
    })
}(angular));
var app = angular.module("e_learning",["ui.router","ngLoadScript","oc.lazyLoad"]).run(function($rootScope){
    if (localStorage.getItem("token") != null){
        $rootScope.displayin = true;
        $rootScope.displayout = false;
    } else {
        $rootScope.displayin = false;
        $rootScope.displayout = true;
    }
});

app.controller("base_controller",function($scope, $state, $http, $httpParamSerializer){
    console.log($state.current.name);
    var state= $state.current.name;

    var token = localStorage.getItem("token");
    
    var host = "http://localhost:8080";

    $scope.fav = function(c_id){
        
        var favourites = {
            course_id : c_id
        }
        console.log(favourites)
        $http({
            url: host+"/favourites/create",
            method: "POST",
            data: $httpParamSerializer(favourites),
            headers: {
                "Authorization":"Bearer "+token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(res){
            console.log(res);
            swal("Good job!", "Course Enrolled Successfully!", "success")
            .then(function(){
                location.reload();
            });
        },function(error){
            console.log(error);
        })
    }

    $scope.enroll = function(c_id){
        
        var enrollments = {
            course_id : c_id
        }
        console.log(enrollments)
        $http({
            url: host+"/enrollments/create",
            method: "POST",
            data: $httpParamSerializer(enrollments),
            headers: {
                "Authorization":"Bearer "+token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(res){
            console.log(res);
            swal("Good job!", "Course Enrolled Successfully!", "success")
            .then(function(){
                location.reload();
            });
        },function(error){
            console.log(error);
        })
    }

    $scope.fav_enroll = function(e_id){
        $http({
            url: host+"/enrollments/update/"+e_id,
            type: "GET",
            headers: {
                "Authorization":"Bearer "+token
            },
        }).then(function(res){
            console.log(res.data);
            // swal("Good job!", "Course Enrolled Successfully!", "success")
            // .then(function(){
            //     location.reload();
            // });
        },function(error){
            console.log(error);
        })
    }

    $scope.search_v = {

    }
    $scope.search = function(){
        $http({
            url: host+"/courses/search_course/"+$scope.search_v.search,
            type: "GET",
            headers: {
                "Authorization":"Bearer "+token
            },
        }).then(function(res){
            console.log(res.data.payload);
            $scope.courses = res.data.payload;
        },function(error){
            console.log(error);
        })
        console.log($scope.search_v.search);
    }

    var params = new URLSearchParams(window.location.search);
    $scope.course_id = params.get("c_id");

    $scope.states={
        home:function(){
            // $http({
            //     url: host+"/courses/search_course/c ",
            //     method: "GET",
            // }).then(function(res){
            //     console.log(res.data.payload);
            //     $scope.search = res.data.payload.course_name;
            // },function(error){
            //     console.log(error);
            // });

            // search DATA TABLE (filtering)
            
            $http({
                url: host+"/courses/read",
                method: "GET"
            }).then(function(res){
                // console.log(res.data.payload);
                $scope.courses = res.data.payload;
            },function(error){
                console.log(error);
            })
        },
        course:function(){
            $http({
                url: host+"/courses/read",
                method: "GET",
            }).then(function(res){
                console.log(res.data.payload);
                $scope.courses = res.data.payload;
            },function(error){
                console.log(error);
            })
        },
        course_img:function(){
            $http({
                url: host+"/courses/read",
                method: "GET",
            }).then(function(res){
                console.log(res);
                $scope.courses = res.data.payload;
            },function(error){
                console.log(error);
            })
        },
        my_learning:function(){
            $http({
                url: host+"/enrollments/my_enrollments",
                method: "GET",
                headers:{
                    Authorization : "Bearer "+token,
                }
            }).then(function(res){
                console.log(res.data.payload);
                $scope.my_learning = res.data.payload;
            },function(error){
                console.log(error);
            })
        },
        favourites:function(){
            $http({
                url: host+"/enrollments/show_fav",
                method: "GET",
                headers:{
                    Authorization : "Bearer "+token,
                }
            }).then(function(res){
                console.log(res.data.payload);
                $scope.favourites = res.data.payload;
            },function(error){
                console.log(error);
            })
        },
        videos:function(){
            $http({
                url: host+"/videos/course_videos/"+$scope.course_id,
                method: "GET",
                headers:{
                    Authorization : "Bearer "+token
                }
            }).then(function(res){
                console.log(res.data.payload);
                $scope.videos = res.data.payload;
            },function(error){
                console.log(error);
            })
        },
        my_profile:function(){
            $http({
                url: host+"/users/get_single_user_details",
                method: "GET",
                headers:{
                    Authorization : "Bearer "+token,
                }
            }).then(function(res){
                // console.log(res.data.payload[0]);
                $scope.my_profile = res.data.payload[0];
            },function(error){
                console.log(error);
            })
        }
    }

    $scope.states[state]();
})


app.controller("login_ctrl",function($scope, $state, $http, $httpParamSerializer){

    var host = "http://localhost:8080"

    var token = localStorage.getItem("token")

    $scope.login_c = {
        
    }

    $scope.login = function(){
        console.log($scope.login_c);
        $http({
            url: host+"/users/login",
            method: "POST",
            data: $httpParamSerializer($scope.login_c),
            headers:{
                Authorization : "Bearer "+token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(res){
            // console.log(res.data.payload);
            var role = res.data.role;
            localStorage.setItem("token", res.data.payload);
            if (role == "std"){
                location.href="http://localhost:8580/"
            }  
            else{
                location.href="http://localhost:8585/login"
            }

        },function(error){
            console.log(error);
        })
    }

    $scope.logout = function(){
        localStorage.clear();
        location.href="http://localhost:8580/login";
    }

    $scope.add_file = function(){
        var file_input = document.getElementById("f_upload");
        console.log(file_input.files[0]);
        var fd = new FormData();
        fd.append("file",file_input.files[0]);
        $http({
            url: host+"/courses/upload_thumbnail",
            method: "POST",
            data: fd,
            headers:{
                "Content-Type": undefined
            }
        }).then(function(res){
            console.log(res.data.filename);
            $scope.register_c.img_path = res.data.filename;
            // console.log();
        },function(error){
            console.log(error);
        })
    }

    $scope.register_c = {

    }

    $scope.register = function(){
        $http({
            url: host+"/users/create_std",
            method: "POST",
            data: $httpParamSerializer($scope.register_c),
            headers:{
                Authorization : "Bearer "+token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(res){
            console.log(res);
            location.href="http://localhost:8580/"
        },function(error){
            console.log(error);
        })
    }
})
