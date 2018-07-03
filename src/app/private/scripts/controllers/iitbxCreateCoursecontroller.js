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


angular.module('playerApp').service('multipartForm', ['$http', function($http){
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
        // fd.append('topics',data.topics);
        // for(var key in data){
        //  fd.append(key, data[key]);
        //   console.log(key + " " + data[key])
        // }
        $http.post(uploadUrl, fd, {
          transformRequest: angular.indentity,
          headers: { 'Content-Type': undefined }
        });
      }
     }])



angular.module('playerApp').controller('iitbxCreateCourseCtrl', ['$scope','multipartForm',function($scope,multipartForm) {
  
	
  $scope.newtopic = {};
  $scope.showaddform = false;
  $scope.formdata = {};
  $scope.formdata.topics = [];
      $scope.submit = function(){
        var uploadUrl = 'http://10.129.103.85:5000/v1/course/iitbx/createcourse';
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

// $scope.submitCourse = function(){


// 				var file = $scope.myFile;
               
//                // console.log('file is ' );
//                // console.dir(file);

//             var filepdf = $scope.myFilepdf;


//             var coursedataform = new FormData();
//                coursedataform.append('coursetitle', $scope.coursetitle);
//                coursedataform.append('coursedescription', $scope.description);
//                coursedataform.append('thumbnail', file);
//                coursedataform.append('filepdf',filepdf);


//             var coursedata = {
//                'coursetitle':$scope.coursetitle,
//                'coursedescription':$scope.description,
//                'thumbnail':file,
//                'filepdf':filepdf
//             }




			      

//          //       console.log(coursedata);

//                console.log(coursedataform.get('filepdf'));
               

            
//             $http({
//                         method: 'POST',
//                         url: 'http://10.129.103.85:5000/v1/course/iitbx',
//                         headers: {'Content-Type': undefined},
//                         data: coursedataform
//                  }).then(function success(response) {

//                         // $scope.coursedetails = response.data;
//                         console.log(response.data);
                        

//                  }, function error(response) {
//                          alert("Error ! Error ! Error !");
//                          console.log(response.data);
//                 });
//                // $https:.post(, fd, {
//                //    transformRequest: angular.identity,
//                //    headers: {'Content-Type': undefined}
//                // })
            
//                // .success(function(){
//                // })
            
//                // .error(function(){
//                // });


			
// 	// alert($scope.coursetitle +" "+$scope.description);


// }

}]);
