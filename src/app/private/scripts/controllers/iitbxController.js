/*Contributed By Pradip Karnavat

Email: karnavatpradip12345@gmail.com

*/

angular.module('playerApp').controller('iitbxCtrl', ['$scope','$http', function($scope,$http) {
    $scope.resdata = "Utkarsh";
    

    // $http.get('/').then(function(response) {

    //     $scope.resdata = response.data;
    //     console.log(response.data);
    // });

    $scope.courselist = [{thumb:'../../myimages/test.png',title:'Computer Science'},
                         {thumb:'../../myimages/test.png',title:'Physics'},
                         {thumb:'../../myimages/test.png',title:'Algorithms'},
                         {thumb:'../../myimages/test.png',title:'Data Structure'},
                         {thumb:'../../myimages/test.png',title:'Web Development'},
                         {thumb:'../../myimages/test.png',title:'Android Development'},
                         {thumb:'../../myimages/test.png',title:'Networking'} ]

    $scope.coursedetails = {};

    $http({
          method: 'GET',
          url: 'http://10.129.103.85:5000/v1/course/iitbx/view'
	   }).then(function success(response) {

	       $scope.courselist = response.data;
           console.log(response.data);

    }, function error(response) {
          	console.log("Error ! Error ! Error !");
            console.log(response.data);
    });


    $scope.opencontainer = function(item){
       // alert(item)

window.location.href="#!/iitbx/"+item;
                //  $http({
                //         method: 'GET',
                //         url: 'http://10.129.103.85:5000/v1/course/iitbx/'+item
                //  }).then(function success(response) {

                //         $scope.coursedetails = response.data;
                //         console.log(response.data);
                        

                //  }, function error(response) {
                //          alert("Error ! Error ! Error !");
                //          console.log(response.data);
                // });

    }

}]);
