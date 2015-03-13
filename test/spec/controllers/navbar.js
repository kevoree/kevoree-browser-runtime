'use strict';

describe('Controller: NavBar', function () {

  // load the controller's module
  beforeEach(module('browserApp'));

  var NavBar,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavBar = $controller('NavBar', {
      $scope: scope
    });
  }));

  //it('should attach a list of awesomeThings to the scope', function () {
  //  expect(scope.awesomeThings.length).toBe(3);
  //});
});
