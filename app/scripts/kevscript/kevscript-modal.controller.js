'use strict';

/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # KevScriptCtrl
 * Controller of the browserApp kevscript editor page
 */
angular.module('browserApp')
  .controller('KevScriptModalCtrl', function ($scope, $modalInstance, kevscript) {
    $scope.filename = null;

    var suffix = '.kevs';

    $scope.save = function () {
      var kevsAsBlob = new Blob([kevscript], {type: 'kevscript'});
      var filename = $scope.filename;
      if (!filename || filename.length === 0) {
        filename = Date.now()+suffix;
      } else if (!endsWith(filename, suffix)) {
        filename = filename+suffix;
      }

      var downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.innerHTML = 'Download Kevoree KevScript';
      if (window.webkitURL !== null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(kevsAsBlob);
      } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(kevsAsBlob);
        downloadLink.onclick = function (e) {
          document.body.removeChild(e.target);
        };
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
      }

      downloadLink.click();
      $modalInstance.close();
    };

    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
  });

