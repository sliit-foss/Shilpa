/**
 * Created by nandunb on 9/19/17.
 */

/*
 Controller:
 Use module name. Refer dashboard.
 */

'use strict';

angular.module('clms.content-mgt',['ngMessages'])

.controller('fileDetailsCtrl', function($scope){
    $scope.test = "test";

    let self = this;

    this.$watch('selectedFile', ()=>{
        console.log(self.selectedFile);
    })
})

.controller('newAssignmentCtrl', ['$mdDialog', 'AssignmentDataFactory','ToastBuilder', '$rootScope',  function($mdDialog, AssignmentDataFactory, ToastBuilder, $rootScope){
    let self = this;

    self.assignment = {};

    self.assignment.classroomId = "12-D";

    self.createNewAssignment = ()=>{
        AssignmentDataFactory.createNewAssignment(self.assignment).then((response)=>{
            if(response.data.success){
                ToastBuilder.showToast("success-toast", response.data.message);
                $rootScope.$emit("CallGetAllAssignmentsMethod",{});
                self.closeDialog();
            }else{
                ToastBuilder.showToast("error-toast", response.data.message);
            }
        });
    };

    self.closeDialog = ()=>{
        $mdDialog.cancel();
    };

}])

.controller('viewAssignmentCtrl', ['assignmentId','AssignmentDataFactory', 'SubmissionDataFactory', 'ToastBuilder', '$mdDialog', '$rootScope', '$window', 'FileUploader', 'ContentDataFactory',
    function(assignmentId, AssignmentDataFactory, SubmissionDataFactory, ToastBuilder, $mdDialog, $rootScope, $window, FileUploader, ContentDataFactory){

    let self = this;

    self.assignment = {};

    self.isEditMode = false;
    self.isEnabledUploadForm = false;

    self.assignmentId = assignmentId;
    self.availableSubmissions = [];

    self.loggedInUser = $window.sessionStorage.getItem('username');
    self.permission = $window.sessionStorage.getItem('permission');

    //Link events of button and file input field
    $(document).on('click', '#ps-submissionUploadBtn', function () {
        $('#ps-submissionInput').click();
    });

    //submission data object;
    self.submission = {
        assignment: self.assignmentId,
        username: self.loggedInUser,
        files: []
    };

    self.loadUserSubmissions = ()=>{
        self.isLoading = true;
        SubmissionDataFactory.getSubmissionByUsername(self.assignmentId, self.loggedInUser).then((response)=>{
            if(response.data.success){
                if(response.data.data.length > 0){
                    self.submission.files = response.data.data[0].files;
                    self.submissionId = response.data.data[0]._id;
                }
                self.isLoading = false;
            }else{
                ToastBuilder.showToast("error-toast", response.data.message);
                self.isLoading = false;
            }
        })
    };

    self.loadAllSubmissions = ()=>{
        self.isLoading = true;
        SubmissionDataFactory.getSubmissionsByAssignment(self.assignmentId).then((response)=>{
            if(response.data.success){
                self.allAvailableSubmissions = response.data.data;
                self.isLoading = false;
            }else{
                ToastBuilder.showToast("error-toast", response.data.message);
                self.isLoading = false;
            }
        })
    };

    if(self.permission == "teacher"){
        self.loadAllSubmissions();
    }else{
        self.loadUserSubmissions();
    }

    self.loadAssignment = ()=>{
        self.isLoading = true;
        AssignmentDataFactory.getAssignmentById(self.assignmentId).then((response)=>{
            if(response.data.success){
                response.data.data[0].submissionDate = new Date(response.data.data[0].submissionDate);
                self.assignment = response.data.data[0];
                self.isLoading = false;
            }else{
                ToastBuilder.showToast("error-toast", response.data.message);
            }
        })
    };

    self.loadAssignment();

    self.updateAssignment = ()=>{
        AssignmentDataFactory.updateAssignment(self.assignment).then((response)=>{
            if(response.data.success){
                ToastBuilder.showToast("success-toast", response.data.message);
                self.isEditMode = false;
                self.loadAssignment();
            }else{
                ToastBuilder.showToast("error-toast", response.data.message);
            }
        })
    };

    self.goToEditMode = ()=>{
        self.isEditMode = true;
    };

    self.cancel = ()=>{
        self.isEditMode = false;
        self.loadAssignment();
    };

    self.closeDialog = ()=>{
        $rootScope.$emit("CallGetAllAssignmentsMethod",{});
        $mdDialog.cancel();
    };

    self.showUploadForm = ()=>{
        self.isEnabledUploadForm = true;
    };

    self.hideUploadForm = ()=>{
        self.isEnabledUploadForm = false;
    };

    self.toggleFilesView = (item)=>{
        if(!item.viewFiles){
            item.viewFiles = true;
        }else{
            item.viewFiles = !item.viewFiles;
        }
    };

    self.removeFile = (ev, item)=>{
        var confirm = $mdDialog.confirm()
            .title('Remove File')
            .textContent('Removing this file will affect your submission. Do you want to proceed?')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(()=>{
            let tempFiles = [];
            angular.forEach(self.submission.files, (file)=>{
                if(item != file){
                    tempFiles.push(item);
                }
            });

            self.submission.files = tempFiles;

            self.submission.dateOfSubmission = new Date();

            SubmissionDataFactory.updateSubmission(self.submission).then((response)=>{
                if(response.data.success){
                    ToastBuilder.showToast("success-toast", response.data.message);
                    ContentDataFactory.removeFile(item).then((resp)=>{
                        if(resp.data.success){
                            ToastBuilder.showToast("success-toast", resp.data.message);
                            self.loadUserSubmissions();
                        }else{
                            ToastBuilder.showToast("error-toast", resp.data.message);
                        }
                    })
                }else{
                    ToastBuilder.showToast("error-toast", response.data.message);
                }
            })
        });
    }

    /**
     * Uploader
     * @type {*}
     */

    self.uploader = new FileUploader({
        url: 'http://localhost:9004/files'
    });

    // a sync filter
    self.uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });

    // an async filter
    self.uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    self.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    self.uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        console.log(this.queue);
    };
    self.uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    self.uploader.onBeforeUploadItem = function(item) {
        item.file.name = self.assignmentId+'/'+self.loggedInUser+'/'+ item.file.name;
        console.info('onBeforeUploadItem', item);
    };
    self.uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    self.uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    self.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    self.uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    self.uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    self.uploader.onCompleteAll = function() {

        let updatable = false;

        if(self.submission.files.length>0){
            updatable = true;
        }

        angular.forEach(this.queue, (file)=>{
            self.submission.files.push(file.file.name);
        });

        self.submission.dateOfSubmission = new Date();

        if(updatable){
            SubmissionDataFactory.updateSubmission(self.submission, self.submissionId).then((response)=>{
                if(response.data.success){
                    this.queue = [];
                    self.isEnabledUploadForm = false;
                    ToastBuilder.showToast("success-toast", response.data.message);
                    self.loadUserSubmissions();
                }else{
                    ToastBuilder.showToast("error-toast", response.data.message);
                }
            })
        }else{
            SubmissionDataFactory.addSubmission(self.submission).then((response)=>{
                if(response.data.success){
                    this.queue = [];
                    self.isEnabledUploadForm = false;
                    ToastBuilder.showToast("success-toast", response.data.message);
                    self.loadUserSubmissions();
                }else{
                    ToastBuilder.showToast("error-toast", response.data.message);
                }
            });
        }
        self.isEnabledUploadForm = false;
    };

    console.info('self.uploader', self.uploader);
}])

.controller('fileShareCtrl', ['selectedFile', '$window', 'User', 'ContentDataFactory', 'ToastBuilder',  function(selectedFile, $window, User, ContentDataFactory, ToastBuilder){
    let self = this;
    let loggedInUser = $window.sessionStorage.getItem('username');
    self.COMMON_PATH = 'personal-storage/'+loggedInUser;
    self.file = selectedFile;

    //get all users
    User.getAllUsers().then((response)=>{
       self.users = response.data;
    });

    self.querySearch = (criteria)=>{
        return criteria ? self.users.filter(createFilterFor(criteria)) : [];
    };

    let createFilterFor = (query)=>{

        let lowercaseQuery = angular.lowercase(query);

        return (user)=>{
            return (user.username.indexOf(lowercaseQuery) != -1);
        };
    };

    if(!selectedFile.shared_users) {
        self.file.shared_with = [];
    }

    self.closeDialog = ()=>{
        $rootScope.$emit("CallGetAllAssignmentsMethod",{});
        $mdDialog.cancel();
    };

    self.shareFile = ()=>{
        ContentDataFactory.shareFile(self.file.shared_with, loggedInUser, self.file._id).then((response)=>{
            if(response.data.success){
                ToastBuilder.showToast('success-toast', response.data.message);
                self.closeDialog();
            }else{
                ToastBuilder.showToast('error-toast', response.data.message);
            }
        })
    };

}]);

