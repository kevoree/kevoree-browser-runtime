/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # KevScriptCtrl
 * Controller of the browserApp kevscript editor page
 */
angular.module('browserApp')
  .controller('KevScriptCtrl', function ($scope, $state, $modal, $timeout, kCore, kScript, KevoreeResolver) {
    $scope.isStarted = kCore.isStarted();
    $scope.isDestroyed = kCore.isDestroyed();
    $scope.processing = false;
    $scope.runtime = {
      nodeName: KevoreeResolver.getDevMode() ? 'browser':'node0'
    };

    $scope.runtimeNodeNameEvents = {
      focus: function () {
        $scope.runtime.nodeName = null;
      },
      blur: function () {
        if (!$scope.runtime.nodeName) {
          if (KevoreeResolver.getDevMode()) {
            $scope.runtime.nodeName = 'browser';
          } else {
            $scope.runtime.nodeName = 'node0';
          }
        }
      }
    };

    if (!kCore.isDestroyed()) {
      if (kCore.isStarted()) {
        try {
          $scope.kevscript =
            '// this KevScript reflects the current state of your runtime\n' +
            kScript.parseModel(kCore.getCurrentModel()) + '\n' +
            '// you can add some more kevscript to be merged locally:\n';
        } catch (err) {
          $scope.kevscript = '// wait for the runtime to complete its deployment';
        }
      } else {
        $scope.kevscript =
          '// runtime is stopped';
      }
    } else {
      if (KevoreeResolver.getDevMode()) {
        $scope.kevscript =
          '//==========================================//' + '\n' +
          '// Default dev-mode KevScript file          //' + '\n' +
          '// Feel free to edit it to suit your needs  //' + '\n' +
          '//==========================================//' + '\n' +
          '\n' +
          'add node0, browser: JavascriptNode' + '\n' +
          'add sync: WSGroup' + '\n' +
          '\n' +
          'attach node0, browser sync'+ '\n' +
          'set sync.master = "node0"' + '\n' +
          '\n' +
          'network node0.ip.lo 127.0.0.1' + '\n';
      } else {
        $scope.kevscript =
          '//==========================================//' + '\n' +
          '// This is a default KevScript file         //' + '\n' +
          '// Feel free to edit it to suit your needs  //' + '\n' +
          '//==========================================//' + '\n' +
          '\n' +
          '// this node platform' + '\n' +
          'add node0: JavascriptNode' + '\n' +
          '// add a RemoteWSGroup to be able to manipulate the model from external tools' + '\n' +
          'add sync: RemoteWSGroup' + '\n' +
          '\n' +
          '// add this node to the group' + '\n' +
          'attach node0 sync' + '\n' +
          '\n' +
          '// use a public WebSocket broker' + '\n' +
          'set sync.host = "ws.braindead.fr"' + '\n' +
          '// use a randomly generated ID to prevent conflicts with others' + '\n' +
          'set sync.path = "' + $scope.APP_ID + '"\n';
      }
    }

    var editor = null;
    //var changeTimeout = null;
    //var cachedModel = null;

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
      //editor.on('change', function (editor) {
      //  $scope.processing = true;
      //  $scope.parseError = null;
      //  $scope.runtimeError = null;
      //  clearTimeout(changeTimeout);
      //  changeTimeout = setTimeout(function () {
      //    var start = new Date().getTime();
      //    console.log('processing content...');
      //    kScript.parse(editor.getValue(), function (err, model) {
      //      if (err) {
      //        cachedModel = null;
      //        console.log('KevScript parse error:', err.message);
      //        $scope.parseError = err.message;
      //      } else {
      //        if (model.findNodesByID($scope.runtime.nodeName)) {
      //          cachedModel = model;
      //          console.log('done');
      //        } else {
      //          cachedModel = null;
      //          $scope.runtimeError = 'Unable to find node "'+$scope.runtime.nodeName+'" in your model';
      //          console.log('error');
      //        }
      //      }
      //      console.log((new Date().getTime() - start)+'ms');
      //      $scope.processing = false;
      //      $scope.$apply();
      //    });
      //  }, 1000);
      //});
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
          if (!$scope.runtime.nodeName.match(/\s/g)) { // prevent spaces in nodeName
            $scope.runtimeError = null;
            $scope.parseError = null;
            $scope.processing = true;
            kScript.parse($scope.kevscript, function (err, model) {
              if (err) {
                console.log('KevScript parse error:', err.message);
                $scope.parseError = err.message;
                $scope.processing = false;
                if (!$scope.$$phase) {
                  $scope.$apply();
                }

              } else {
                if (model.findNodesByID($scope.runtime.nodeName)) {
                  kCore.start($scope.runtime.nodeName, function () {
                    kCore.deploy(model);
                    $state.go('logs');
                  });
                } else {
                  $scope.runtimeError = 'Unable to find node "'+$scope.runtime.nodeName+'" in your model';
                  $scope.processing = false;
                  if (!$scope.$$phase) {
                    $scope.$apply();
                  }
                }
              }
            });
          } else {
            $scope.runtimeError = 'Invalid node name (spaces forbidden)'
          }
        } else {
          $scope.runtimeError = 'You must give a node name';
        }
      }
    };

    $scope.merge = function () {
      if (!$scope.processing) {
        $scope.processing = true;
        kScript.parse($scope.kevscript, kCore.getCurrentModel(), function (err, model) {
          if (err) {
            console.log('KevScript parse error:', err.message);
            $scope.parseError = err.message;
            $scope.processing = false;
            if (!$scope.$$phase) {
              $scope.$apply();
            }

          } else {
            kCore.deploy(model);
            $state.go('logs');
          }
        });
      }
    };
  });

