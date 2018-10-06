/**
 * Created by nandunb on 9/19/17.
 */

/*
 Helper:
 Create your services and factories that would help you in
 data retrieval here.
 Note: * Use your function module name
 */

angular.module('clms.content-mgt')

.factory('ContentDataFactory', ($http)=>{
    let cdFac = {};

    /**
     * Get all files in the bucket
     * @returns {HttpPromise}
     */
    cdFac.getAllObjects = (currentFolder)=>{
        console.log("current folder: ", currentFolder);
        if(currentFolder != "/"){
            return $http.get('http://localhost:9004/files', {
                params: { directory: currentFolder }
            }, (data)=>{
                return data;
            })
        }else{
            return $http.get('http://localhost:9004/files', (data)=>{
                return data;
            })
        }
    };

    cdFac.getAllFiles = (currentFolder, loggedInUser)=>{
        return $http.get('http://localhost:9004/storage/users/'.concat(loggedInUser),{
            params: {
                directory: currentFolder
            }
        }).then((response)=>{
            return response;
        })
    };

    /**
     * Get all directories in the bucket
     * @returns {HttpPromise}
     */
    cdFac.getAllDirectories = (currentFolder)=>{
        console.log('current folder (directories): ', currentFolder);
        if(currentFolder != "/"){
            return $http.get('http://localhost:9004/directories',{
                params: { directory: currentFolder }
            }, (data)=>{
                return data;
            })
        }else{
            return $http.get('http://localhost:9004/directories', (data)=>{
                return data;
            })
        }
    };

    cdFac.createDirectory = (directoryObject, loggedInUser)=>{
        return $http.post('http://localhost:9004/storage/users/'.concat(loggedInUser+'/directories'), directoryObject).then((data)=>{
            return data;
        })
    };

    //used for both directories and files
    cdFac.removeFile = (file)=>{
        let type = "";
        if(file.indexOf('/')==-1)
            type = "file";
        else
            type = "dir";

        return $http.delete('http://localhost:9004/objects'.concat('/'+type), {
            params:{
                key: file
            }
        }).then((data)=>{
            return data;
        })
    };

    cdFac.deleteFile = (filename)=>{
        return $http.delete('http://localhost:9004/storage/files',{
            params:{
                key:filename
            }
        }).then((response)=>{
            return response;
        })
    };

    cdFac.renameFile = (id, oldKey, key)=>{
        return $http.put('http://localhost:9004/storage/files/'.concat(id), { key: scope.fileManagerContext.currentFolder+key, oldKey:oldKey })
            .then((response)=>{
                return response;
            })
    };

    // cdFac.removeDirectory = (directoryObject)=>{
    //     return $http.delete('http://localhost:9004/directories',directoryObject).then((data)=>{
    //         return data;
    //     })
    // };

    cdFac.shareFile = (users,username, fileId)=>{
        return $http.put('http://localhost:9004/storage/users/'.concat(username+'/files/').concat(fileId+'/shared'), { shared_with: users })
            .then((response)=>{
                return response;
            })
    };

    cdFac.searchFiles = (query, username)=>{
        console.log('query: ', query);
        return $http.get('http://localhost:9004/storage/users/'.concat(username+'/files/search'), {
            params:{
                query: query
            }
        }).then((response)=>{
            return response;
        })
    };

    cdFac.getStorageStatistics = (username, option)=>{
        return $http.get('http://localhost:9004/storage/users/'.concat(username+'/statistics'),{
            params:{
                option: option
            }
        }).then((response)=>{
            return response;
        })
    };

    cdFac.setStorageRecord = (username)=>{
        return $http.post('http://localhost:9004/storage/users/'.concat(username), { username: username, size: 52428800})
            .then((response)=>{
                return response;
            })
    };

    cdFac.updateStorageRecord = (username, size)=>{
        return $http.put('http://localhost:9004/storage/users/'.concat(username), { size:size })
            .then((response)=>{
                return response;
            })
    };

    cdFac.getStorageRecords = ()=>{
        return $http.get('http://localhost:9004/storage').then((response)=>{
            return response;
        })
    };

    return cdFac;
})

.factory('AssignmentDataFactory', ($http)=>{
    let assignmentFac = {};

    assignmentFac.createNewAssignment = (assignmentObject)=>{
        return $http.post('http://localhost:9004/assignments', assignmentObject).then((response)=>{
            return response;
        })
    };

    assignmentFac.getAllAssignments = ()=>{
        return $http.get('http://localhost:9004/assignments').then((response)=>{
            return response;
        })
    };

    assignmentFac.getAssignmentsByClassId = (classroomId)=>{
        return $http.get('http://localhost:9004/assignments',{
            params:{
                id: classroomId
            }
        }).then((response)=>{
            return response;
        })
    };

    assignmentFac.getAssignmentById = (assignmentId)=>{
        return $http.get('http://localhost:9004/assignments/'.concat(assignmentId)).then((response)=>{
            return response;
        })
    };

    assignmentFac.updateAssignment = (assignmentObject)=>{
        return $http.put('http://localhost:9004/assignments/'.concat(assignmentObject._id), assignmentObject).then((response)=>{
            return response;
        })
    };

    assignmentFac.deleteAssignment = (assignmentId)=>{
        return $http.delete('http://localhost:9004/assignments/'.concat(assignmentId)).then((response)=>{
            return response;
        })
    };

    return assignmentFac;

})

.factory('SubmissionDataFactory', ($http)=>{
    this.subFac = {};

    subFac.getSubmissionsByAssignment = (assignmentId)=>{
        return $http.get('http://localhost:9004/assignments/'.concat(assignmentId).concat('/submissions')).then((response)=>{
            return response;
        })
    };

    subFac.getSubmissionByUsername = (assignmentId, username)=>{
        return $http.get('http://localhost:9004/assignments/'.concat(assignmentId+"/").concat("submissions/users/"+username)).then((response)=>{
            return response;
        })
    };

    subFac.addSubmission = (submissionObject)=>{
        return $http.post('http://localhost:9004/assignments/'.concat(submissionObject.assignment).concat('/submissions'), submissionObject)
            .then((response)=>{
                return response;
            })
    };

    subFac.updateSubmission = (submissionObject,id)=>{
        return $http.put('http://localhost:9004/assignments/'.concat(submissionObject.assignment).concat('/submissions/'+id), submissionObject)
            .then((response)=>{
                return response;
            })
    };

    return subFac;
})


//toast service
.factory('ToastBuilder', ($mdToast)=>{

    let toastFactory = {};

    toastFactory.showToast = (type, message)=>{
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom')
                .theme(type)
                .hideDelay(1500)
        );
    };

    return toastFactory;
});