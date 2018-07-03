/*Contributed by : 
IITBOMBAYX
Shreya Shambhawi Singh 
Chandrani Kar
*/

angular.module('playerApp').controller('bookmarkController',['$scope','$rootScope','$stateParams','telemetryService', function ($scope,$rootScope,$stateParams, telemetryService) {
	$scope.bookmarked = false;
         	$scope.bookmarkBtnClick = function() {
				console.log("bookmark st");
				if($scope.bookmarked==false){
					$scope.bookmarked = true;
				    telemetryService.bookmark_addedTelemetryData('course', $stateParams.courseId, 'course',
          									$rootScope.version, 'bookmark-added', $scope.$parent.item.identifier)
				}
				else{
					$scope.bookmarked = false;
				    telemetryService.bookmark_removedTelemetryData('course', $stateParams.courseId, 'course',
          									$rootScope.version, 'bookmark-removed', $scope.$parent.item.identifier)
                               }				
				console.log("bookmark end");
			}  
}])
