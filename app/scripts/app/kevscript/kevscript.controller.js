/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # KevScriptCtrl
 * Controller of the browserApp kevscript editor page
 */
angular.module('browserApp')
  .controller('KevScriptCtrl', function ($scope, $state, $modal, $timeout, kCore, kScript) {
    $scope.isStarted = kCore.isStarted();
    $scope.processing = false;
    $scope.runtime = {
      nodeName: null
    };

    if (kCore.isStarted()) {
      try {
        $scope.kevscript =
          '// the current KevScript equivalent of your runtime state is:\n' +
          kScript.parseModel(kCore.getCurrentModel());
      } catch (err) {
        $scope.kevscript = '// wait for the runtime to complete its deployment';
      }
    } else {
      $scope.kevscript =
        '// write your kevscript here' + '\n' +
        'add node0: JavascriptNode' + '\n';
    }

    var editor = null;
    function saveFileCmd() {
      $modal
        .open({
          templateUrl: 'scripts/app/kevscript/kevscript.modal.html',
          size: 'sm',
          scope: $scope,
          controller: function ($scope, $modalInstance) {
            $modalInstance.opened.then(function () {
              $timeout(function () {
                angular.element('#filename').focus();
              }, 100);
            });

            var suffix = '.kevs';

            $scope.save = function () {
              var kevsAsBlob = new Blob([$scope.kevscript], {type: 'kevscript'});
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
          }
        })
        .result.finally(function () {
          if (editor) {
            editor.focus();
          }
        });
    }

    $scope.editorOptions = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'kevscript',
      styleActiveLine: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Ctrl-S': saveFileCmd
      },
      theme: 'kevscript'
    };

    $scope.editorLoaded = function (_editor) {
      editor = _editor;
    };

    $scope.uploadKevscript = function () {
      var kevscriptUpload = angular.element('#kevscript-upload');
      kevscriptUpload.on('change', function (event) {
        var reader = new FileReader();
        reader.onloadend = function () {
          $scope.kevscript = editor.setValue(reader.result);
        };
        reader.readAsBinaryString(event.target.files[0]);
      });
      kevscriptUpload.trigger('click');
    };

    $scope.closeParseError = function () {
      $scope.parseError = null;
    };

    $scope.closeRuntimeError = function () {
      $scope.runtimeError = null;
    };

    $scope.start = function () {
      if (!$scope.processing) {
        if ($scope.runtime.nodeName) {
          $scope.runtimeError = null;
          $scope.parseError = null;
          $scope.processing = true;
          kCore.start($scope.runtime.nodeName, function () {
            kScript.parse($scope.kevscript, function (err, model) {
              if (err) {
                console.log('KevScript parse error:', err.message);
                $scope.parseError = err.message;
                $scope.processing = false;
                $scope.$apply();

              } else {
                kCore.deploy(model);
                $state.go('logs');
              }
            });
          });
        } else {
          $scope.runtimeError = 'You must give a node name';
        }
      }
    };
  });

