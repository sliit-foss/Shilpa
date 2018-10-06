/**
 * Created by nandunb on 9/22/17.
 */
'use strict';

angular.module('clms.content-mgt')

.directive('lectureMaterial', ['$timeout', 'FileUploader', 'ContentDataFactory', '$mdDialog', '$window', function($timeout, FileUploader, ContentDataFactory, $mdDialog, $window){
    return{
        restrict: 'E',
        scope:{
            classroomId: "@classroom"
        },
        replace: true,
        templateUrl: 'app/content-mgt/templates/lecture-material.html',
        link: (scope, element, attrs)=>{

            $(document).on('click', '#uploadButton', function () {
                $('#fileInput').click();
            });

            //get logged in user details
            scope.user_role = $window.sessionStorage.getItem('permission');

            /**
             * Uploader
             * @type {*}
             */

            scope.uploader = new FileUploader({
                url: 'http://localhost:9004/files'
            });

            // a sync filter
            scope.uploader.filters.push({
                name: 'syncFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    console.log('syncFilter');
                    return this.queue.length < 10;
                }
            });

            // an async filter
            scope.uploader.filters.push({
                name: 'asyncFilter',
                fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                    console.log('asyncFilter');
                    setTimeout(deferred.resolve, 1e3);
                }
            });

            // CALLBACKS

            scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            scope.uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            scope.uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            scope.uploader.onBeforeUploadItem = function(item) {
                item.file.name = "classes/"+scope.classroomId+"/"+item.file.name;
                console.info('onBeforeUploadItem', item);
            };
            scope.uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            scope.uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            scope.uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
                this.queue = [];
                scope.toggleUploadForm();
                scope.loadContent();
            };

            console.info('scope.uploader', scope.uploader);


            //Uploader end....

            scope.toggleUploadForm = ()=>{
                scope.isEnabledUploadForm = !scope.isEnabledUploadForm;
            };

            scope.loadContent = ()=>{
                scope.isLoading = true;
                ContentDataFactory.getAllObjects("classes/"+scope.classroomId+"/").then((data)=>{
                    scope.contents = data.data.Contents;
                    console.log('content: ',data);
                    scope.isLoading = false;
                })
            };

            scope.loadContent();

            scope.showRemoveFileDialog = (ev,key)=>{
                let confirm = $mdDialog.confirm()
                    .title('Delete File')
                    .textContent('Are you sure you want to delete '+key)
                    .ok('Delete')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(() => {
                    ContentDataFactory.removeFile(key).then((data)=>{
                        scope.loadContent();
                    })
                }, () => {});
            };
        }
    }
}])

.directive('fileManager', ['ContentDataFactory','FileUploader','$mdDialog', 'ToastBuilder', '$window', '$mdMenu',  function(ContentDataFactory, FileUploader, $mdDialog, ToastBuilder, $window, $mdMenu){
    return {
        restrict: 'E',
        scope: {
            viewMode: "@viewMode"
        },
        templateUrl:'app/content-mgt/templates/file-manager.html',
        link: (scope)=>{
            console.log('file manager called');

            //Link events of button and file input field
            $(document).on('click', '#ps-UploadButton', function () {
                $('#ps-FileInput').click();
            });

            /**
             * File Manager Context
             */

            let loggedInUser = $window.sessionStorage.getItem('username');

            scope.fileManagerContext = {
                rootFolder: "personal-storage/"+loggedInUser+"/",
                currentFolder: "personal-storage/"+loggedInUser+"/",
                currentDir: loggedInUser+"/",
                navigationHistory: [{absolute: loggedInUser, relative:loggedInUser}]
            };

            //Change current folder
            // scope.changeDirectory = (folderName, back)=>{
            //     if(!back){
            //         if(folderName!=loggedInUser)
            //             scope.fileManagerContext.currentFolder = scope.fileManagerContext.currentFolder + folderName;
            //         else
            //             scope.fileManagerContext.currentFolder = loggedInUser+"/";
            //     }else{
            //         if(folderName!=loggedInUser)
            //             scope.fileManagerContext.currentFolder = folderName;
            //         else{
            //             scope.fileManagerContext.currentFolder = loggedInUser+"/";
            //             scope.fileManagerContext.navigationHistory.push({absolute: scope.fileManagerContext.currentFolder, relative:folderName});
            //         }
            //     }
            // };

            scope.changeDirectory = (folderName, back)=>{
                if(!back){
                    if(folderName!=loggedInUser){
                        scope.fileManagerContext.currentFolder = scope.fileManagerContext.currentFolder + folderName;
                        scope.fileManagerContext.currentDir = folderName;
                    }else {
                        scope.fileManagerContext.currentFolder = "personal-storage/"+loggedInUser+"/";
                        scope.fileManagerContext.currentDir = loggedInUser+"/";
                    }
                }else{
                    if(folderName!=loggedInUser)
                        scope.fileManagerContext.currentFolder = folderName;
                    else{
                        scope.fileManagerContext.currentFolder = "personal-storage/"+loggedInUser+"/";
                        scope.fileManagerContext.currentDir = loggedInUser+"/";
                        scope.fileManagerContext.navigationHistory.push({absolute: scope.fileManagerContext.currentFolder, relative:folderName});
                    }
                }
                console.log("current directory: ", scope.fileManagerContext.currentFolder);
            };

            scope.goToDirectory = (folderName) => {
                let folderNameTemp = folderName.replace(scope.fileManagerContext.currentFolder,"");
                scope.changeDirectory(folderNameTemp);
                scope.fileManagerContext.navigationHistory.push({absolute: scope.fileManagerContext.currentFolder, relative:folderNameTemp});
                scope.loadFiles();
                scope.isSelected = false;
            };

            scope.goBack = () => {
                scope.fileManagerContext.navigationHistory.pop();
                let previousPostion = scope.fileManagerContext.navigationHistory.pop().absolute;
                if(previousPostion=="personal-storage/"+loggedInUser+"/"){
                    scope.navigationHistory = [{absolute: loggedInUser, relative: loggedInUser}];
                }
                scope.changeDirectory(previousPostion, true);
                scope.loadFiles();
                scope.isSelected = false;
            };

            let originatorEvent;

            scope.viewOptions = ($mdMenu, ev)=>{
                originatorEvent = ev;
                $mdMenu.open(ev);
              console.log("view options - right click event");
            };

            scope.shareFile = (event)=>{
                $mdDialog.show({
                    controller: "fileShareCtrl as fileShare",
                    templateUrl: "app/content-mgt/templates/share-file.html",
                    parent: angular.element(document.body),
                    locals:{
                        selectedFile: scope.selectedFile
                    },
                    targetEvent: event,
                    clickOutsideToClose: true
                })
            };

            scope.searchFiles = ()=>{
                scope.isLoading = true;
                ContentDataFactory.searchFiles(document.getElementById('fileManagerSearch').value, loggedInUser).then((response)=>{
                    scope.contents = response.data.response;
                    scope.isLoading = false;
                })
            };

            scope.getStorageStatistics = ()=>{
                ContentDataFactory.getStorageStatistics(loggedInUser, 'total').then((response)=>{

                    if(response.status == 501){
                        ContentDataFactory.setStorageRecord(loggedInUser).then((response)=>{
                            if(response.data.success){
                                scope.getStorageStatistics();
                                return;
                            }
                        })
                    }else{
                        if(response.data.success){
                            scope.total_storage = response.data.response;
                        }

                        ContentDataFactory.getStorageStatistics(loggedInUser, 'used').then((response)=>{
                            if(response.data.success){
                                scope.used_storage = response.data.response;
                            }

                            scope.used_percentage = (scope.used_storage/scope.total_storage)*100;
                        });
                    }
                });
            };

            scope.getStorageStatistics();

            scope.deleteFile = ()=>{
                let confirm = $mdDialog.confirm()
                    .title('Delete File')
                    .textContent('Are you sure you want to delete '+scope.selectedFile.key)
                    .ok('Delete')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(() => {
                    ContentDataFactory.deleteFile(scope.selectedFile.key).then((response)=>{
                        if(response.data.success){
                            ToastBuilder.showToast('success-toast', response.data.message);
                            scope.loadFiles();
                        }else{
                            ToastBuilder.showToast('error-toast', response.data.message);
                        }
                    })
                }, () => {});

            };

            scope.renameFile = ()=>{
                let confirm = $mdDialog.prompt()
                    .title('Rename File/Directory')
                    .placeholder('New Name')
                    .ok('Rename')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then((result) => {
                    ContentDataFactory.renameFile(scope.selectedFile._id, scope.selectedFile.key, result).then((response)=>{
                        if(response.data.success){
                            ToastBuilder.showToast('success-toast',response.data.message);
                            scope.loadFiles();
                        }else{
                            ToastBuilder.showToast('error-toast', response.data.message);
                        }
                    })
                }, () => {});
            };

            /**
             * Uploader
             * @type {*}
             */

            scope.uploader = new FileUploader({
                url: 'http://localhost:9004/storage/users/'+loggedInUser+'/files',
                headers:{
                    directory: scope.fileManagerContext.currentDir
                }
            });

            scope.$watch('fileManagerContext.currentFolder', ()=>{
                scope.uploader.headers = {
                    directory: scope.fileManagerContext.currentDir
                }
            });

            // a sync filter
            scope.uploader.filters.push({
                name: 'syncFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    console.log('syncFilter');
                    return this.queue.length < 10;
                }
            });

            // an async filter
            scope.uploader.filters.push({
                name: 'asyncFilter',
                fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                    console.log('asyncFilter');
                    setTimeout(deferred.resolve, 1e3);
                }
            });

            // CALLBACKS

            scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            scope.uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            scope.uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            scope.uploader.onBeforeUploadItem = function(item) {
                if(scope.fileManagerContext.currentFolder != "/"){
                    item.file.name = scope.fileManagerContext.currentFolder + item.file.name;
                }
                item.directory = scope.fileManagerContext.currentFolder;
                console.info('onBeforeUploadItem', item);
            };
            scope.uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            scope.uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            scope.uploader.onCompleteAll = function() {
                scope.loadFiles();
                ToastBuilder.showToast("success-toast", "Files uploaded!");
                this.queue = [];
                scope.isEnabledUploadForm = false;
            };

            console.info('scope.uploader', scope.uploader);


            //Uploader end....

            scope.toggleUploadForm = ()=>{
                scope.isEnabledUploadForm = !scope.isEnabledUploadForm;
            };

            scope.loadFiles = ()=>{
                scope.isLoading = true;
                ContentDataFactory.getAllFiles(scope.fileManagerContext.currentDir, loggedInUser).then((data)=>{
                    scope.contents = data.data.response;
                    scope.getStorageStatistics();
                    scope.isSelected = false;
                    scope.isLoading = false;
                })
            };

            scope.loadFiles();

            scope.showNewDirectoryDialog = (ev)=>{
                let confirm = $mdDialog.prompt()
                    .title('New Directory')
                    .placeholder('Directory Name')
                    .ok('Create')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then((result) => {
                    ContentDataFactory.createDirectory({key:result, directory:scope.fileManagerContext.currentFolder,
                        parent: scope.fileManagerContext.currentDir}, loggedInUser).then((response)=>{
                        if(response.data.success){
                            scope.loadFiles();
                            ToastBuilder.showToast("success-toast", response.data.message);
                        }else{
                            ToastBuilder.showToast("error-toast", response.data.message);
                        }
                    })
                }, () => {});
            };

            scope.showFileDetailsDialog = (ev)=>{
                $mdDialog.show({
                    templateUrl: 'app/content-mgt/templates/file-details.html',
                    controller: 'FileDetailsCtrl as fileDetails',
                    locals:{
                      selectedFile: scope.selectedFile
                    },
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
            };

            scope.viewFileDetails = (item, event)=>{
                scope.selectedFile = item;
                scope.showFileDetailsDialog(event);
            };

            scope.isSelected = false;

            scope.selectFile = (item) =>{
                // let item = scope.contents.files[index];
                scope.clearSelected(item);
                //toggle selected
                item.selected = !item.selected;
                //copy selected file to local
                if(item.selected){
                    scope.selectedFile = item;
                }else{
                    scope.selectedFile = undefined;
                }
                scope.isSelected = (scope.isSelected || item.selected) && item.selected;
            };

            scope.clearSelected = (item)=>{
                angular.forEach(scope.contents, (file)=>{
                    if(item === file)
                        file.selected = file.selected;
                    else
                        file.selected = false;
                })

                angular.forEach(scope.contents.directories, (file)=>{
                    if(item === file)
                        file.selected = file.selected;
                    else
                        file.selected = false;
                })
            };

            // scope.deleteFile = (ev)=>{
            //
            //     var confirm = $mdDialog.confirm()
            //         .title('Delete File/Directory')
            //         .textContent('Deleting this file/folder will result in permanent loss of your data. Are you sure you want to continue?')
            //         .targetEvent(ev)
            //         .ok('Yes')
            //         .cancel('No');
            //
            //     $mdDialog.show(confirm).then(()=>{
            //         if(scope.selectedFile){
            //             scope.isLoading = true;
            //             ContentDataFactory.removeFile(scope.selectedFile.Key).then((response)=>{
            //
            //                 if(response.data.success){
            //                     scope.loadFiles();
            //                     ToastBuilder.showToast("success-toast", response.data.message);
            //                 }else{
            //                     ToastBuilder.showToast("error-toast", response.data.message);
            //                 }
            //
            //             })
            //         }
            //     });
            // }
        }
    }
}])

.directive('assignmentManager', ['$mdDialog', 'AssignmentDataFactory','$rootScope','ToastBuilder','$window',function($mdDialog, AssignmentDataFactory, $rootScope, ToastBuilder, $window){
    return{
        restrict: 'E',
        scope:{
            classroomId: "@class"
        },
        templateUrl: 'app/content-mgt/templates/assignment-viewer.html',
        link: (scope)=>{

            scope.user_role = $window.sessionStorage.getItem('permission');

            scope.openNewAssignmentDialog = (event)=>{
                $mdDialog.show({
                    controller: "newAssignmentCtrl as newAssignment",
                    templateUrl: "app/content-mgt/templates/new-assignment.html",
                    parent: angular.element(document.body),
                    locals:{
                      classroomId: scope.classroomId
                    },
                    targetEvent: event,
                    clickOutsideToClose: true
                })
            };

            scope.openViewAssignmentDialog = (event, assignmentId)=>{
                $mdDialog.show({
                    controller: "viewAssignmentCtrl as viewAssignment",
                    templateUrl: "app/content-mgt/templates/view-assignment.html",
                    parent: angular.element(document.body),
                    locals:{
                      assignmentId: assignmentId
                    },
                    targetEvent: event,
                    clickOutsideToClose: true
                })
            }

            //TODO: add watch to get assignments on class id change

            $rootScope.$on("CallGetAllAssignmentsMethod", ()=>{
                scope.getAssignments();
            });

            scope.getAssignments = ()=>{
                scope.isLoading = true;
                AssignmentDataFactory.getAllAssignments().then((response)=>{
                    if(response.data.success){
                        scope.availableAssignments = response.data.data;
                        scope.isLoading = false;
                    }else{
                        //todo: show error message
                    }
                })
            };

            scope.getAssignments();

            scope.deleteAssignment = (ev, assignmentId)=>{
                var confirm = $mdDialog.confirm()
                    .title('Remove Assignment')
                    .textContent('Removing this assignment will result in permanent removal of it from the view. Are you sure you want to continue?')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(()=>{
                    AssignmentDataFactory.deleteAssignment(assignmentId).then((response)=>{
                        if(response.data.success){
                            ToastBuilder.showToast("success-toast", response.data.message);
                            scope.getAssignments();
                        }else{
                            ToastBuilder.showToast("error-toast", response.data.message);
                        }
                    })
                });
            }
        }
    }
}])

.directive('storageManager', ['ContentDataFactory', 'ToastBuilder', '$mdDialog', '$rootScope', function(ContentDataFactory, ToastBuilder, $mdDialog, $rootScope){
    return{
        restrict: 'E',
        scope:{

        },
        templateUrl: 'app/content-mgt/templates/storage-manager.html',
        link: (scope)=>{

            scope.openViewAssignmentDialog = (event, assignmentId)=>{
                $mdDialog.show({
                    controller: "viewAssignmentCtrl as viewAssignment",
                    templateUrl: "app/content-mgt/templates/view-assignment.html",
                    parent: angular.element(document.body),
                    locals:{
                        assignmentId: assignmentId
                    },
                    targetEvent: event,
                    clickOutsideToClose: true
                })
            };

            $rootScope.$on("CallGetStorageRecordsMethod", ()=>{
                scope.getStorageRecords();
            });

            scope.getStorageRecords = ()=>{
                scope.isLoading = true;
                ContentDataFactory.getStorageRecords().then((response)=>{
                    if(response.data.success){
                        scope.availableRecords = response.data.response;
                        scope.isLoading = false;
                    }else{
                        ToastBuilder.showToast('error-toast', response.data.message);
                    }
                })
            };

            scope.getStorageRecords();

            scope.updateStorageRecord = (item)=>{
                let confirm = $mdDialog.prompt()
                    .title('Expand Storage')
                    .placeholder('Size in MB')
                    .ok('Expand')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then((result) => {

                    ContentDataFactory.updateStorageRecord(item.username, result*1024*1024).then((response)=>{
                        if(response.data.success){
                            ToastBuilder.showToast("success-toast", response.data.message);
                            scope.getStorageRecords();
                        }else{
                            ToastBuilder.showToast("error-toast", response.data.message);
                        }
                    })
                }, () => {});
            };
        }
    }
}])