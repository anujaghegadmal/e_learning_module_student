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
        $rootScope.display=true;
    } else {
        $rootScope.display = false;
    }
});
app.controller("base_controller",function($scope, $state, $http){
    console.log($state.current.name);
    var state= $state.current.name;

    var token = localStorage.getItem("token")
    
    var host = "http://localhost:8080"

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
                // console.log();
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
                // console.log(res.data.payload);
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
                // console.log(res.data.payload);
                $scope.favourites = res.data.payload;
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
            url: host+"/users/login_std",
            method: "POST",
            data: $httpParamSerializer($scope.login_c),
            headers:{
                Authorization : "Bearer "+token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(res){
            console.log(res.data.payload);
            // $scope.my_profile = res.data.payload;
            localStorage.setItem("token", res.data.payload);
            location.href="http://localhost:8580/"
        },function(error){
            console.log(error);
        })
    }
})
