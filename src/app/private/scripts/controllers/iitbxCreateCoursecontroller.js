/*
Contributed by Pradip Karnavat
Email: karnavatpradip12345@gmail.com
*/
angular.module('playerApp').directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);


angular.module('playerApp').service('multipartForm', ['$http',function($http){
     
      
      this.post = function(uploadUrl, data){
        var fd = new FormData();
        fd.append('title',data.coursetitle);
        fd.append('description',data.description);
        // fd.append('myFile',data.myFile);
        var len = data.topics.length;
        for(var i=0;i<len;i++){
          console.log(data.topics[i].subtopic.name);
          fd.append('myFile'+i,data.topics[i].subtopic);
        }
       
        $http.post(uploadUrl, fd, {
          transformRequest: angular.indentity,
          headers: { 'Content-Type': undefined }
        }).then(function(response) {
            console.log(response.data);
            $("#successmsg").show();
        }, function(response) {
            console.log(response.data);
            $("#errormsg").show();
        });
      }
     }])



angular.module('playerApp').controller('iitbxCreateCourseCtrl', ['$scope','multipartForm',function($scope,multipartForm) {
  
	
  $scope.newtopic = {};
  $scope.showaddform = false;
  $scope.formdata = {};
  $scope.formdata.topics = [];

   $("#successmsg").hide();
   $("#errormsg").hide();
      $scope.submit = function(){
        var uploadUrl = 'http://10.129.103.85:5000/v1/course/iitbx/createcourse';
       $("#successmsg").hide();
       $("#errormsg").hide();
        multipartForm.post(uploadUrl, $scope.formdata);
    }

    $scope.removeTopic = function(item){
      var index = $scope.formdata.topics.indexOf(item);
      if (index > -1) {
          $scope.formdata.topics.splice(index, 1);
      }
    }

    $scope.addtopic = function(){
      $scope.showaddform = true;
      $scope.newtopic = {};
    }
    $scope.add = function(){
      var newtopictemp = {};
      newtopictemp.subtopic = $scope.newtopic.subtopic;
      $scope.formdata.topics.push(newtopictemp);
      $scope.showaddform = false;
    }


}]);
