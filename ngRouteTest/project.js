angular.module('project', ['ngRoute'])
.service('Projects', function($q) {
	var self = this;
	this.fetch = function () {
			var deferred = $q.defer();
			self.projects = [
			{
				name: 'test',
				description: 'testtesttest',
				$id: 1 
			}
			];
			deferred.resolve(self.projects);

			return deferred.promise;
	};
})

.config(function($routeProvider) {
	var resolveProjects = {
		projects: function (Projects) {
			return Projects.fetch();
		}
	};

	$routeProvider
		.when('/', {
			controller:'ProjectListController as projectList',
			templateUrl:'list.html',
			resolve: resolveProjects
		})
	.when('/edit/:projectId', {
		controller:'EditProjectController as editProject',
		templateUrl:'detail.html',
		resolve: resolveProjects
	})
	.when('/new', {
		controller:'NewProjectController as editProject',
		templateUrl:'detail.html',
		resolve: resolveProjects
	})
	.otherwise({
		redirectTo:'/'
	});
})

.controller('ProjectListController', function(projects) {
	var projectList = this;
	projectList.projects = projects;
})

.controller('NewProjectController', function($location, projects) {
	var editProject = this;
	editProject.save = function() {
		projects.push().then(function(data) {
			$location.path('/');
		});
	};
})

.controller('EditProjectController',
		function($location, $routeParams, projects) {
			var editProject = this;
			var projectId = $routeParams.projectId,
			projectIndex;

			editProject.projects = projects;
			projectIndex = editProject.projects.$indexFor(projectId);
			editProject.project = editProject.projects[projectIndex];

			editProject.destroy = function() {
				editProject.projects.remove(editProject.project).then(function(data) {
					$location.path('/');
				});
			};

			editProject.save = function() {
				editProject.projects.save(editProject.project).then(function(data) {
					$location.path('/');
				});
			};
		});
