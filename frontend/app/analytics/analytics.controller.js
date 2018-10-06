'use strict'
angular.module('clms.analytics')

    .controller('analyticsCtrl',function ($mdDialog,$mdToast,Analytics,$window) {

        const self = this;


        let user_role = $window.sessionStorage.getItem('permission');

        if(user_role == 'student'){
            self.isStudent = true;
            self.isTeacher = false;
        }else if(user_role == 'teacher'){
            self.isStudent = false;
            self.isTeacher = true;
        }

        // -----student-view marks and student-viewgrades----

        //form details
        self.marksGraphForm = {
            term:"",
            className:"",
            subject:"",
            graphType:""
        };

        //avalability of button/fileds
        self.showSubjects = false;
        self.showGraphGenarate = false;
        self.showTeacherTPGraphsShow = false;

        //store field values
        self.classes = [];
        self.classes = [];
        self.terms = [];
        self.GraphTypes = [
            {typeName:"Marks"},
            {typeName:"Grade"}
        ];
        self.subjects = [];
        self.temSubjects = [];
        self.availableStudents = [];

        //to store init details
        self.initDetails;
        //to store all marks
        self.marks = [];

        //store avarage marks for track performance
        self.currentUserAvg= 85.52;
        self.currentNormalStudentAvg= 45.32;

        //to store grpahs Data
        self.studentName = [];
        self.studentMarks = [];
        self.studentGrade = [];
        self.graphTopic='';

        //store selected values
        self.selectedClass;
        self.selectedTerm;
        self.selectedSubject;
        self.selectedType;


        //get logged user name
        self.logedUser = sessionStorage.getItem('username');

        //set visibility of subjects
        self.setTypeOfGraph = function (type) {

            if(type == "Marks"){

                self.showSubjects = true;
                self.selectedType = type;
                self.graphTopic = 'Marks Details'
            }
            else{

                self.showSubjects = false;
                self.selectedType = type;
                self.setAllGrades();
                self.graphTopic = 'Grade Details'

            }
        };

        //set classes
        self.setClassNames = function () {
            self.classes=[];
            Analytics.getclassNames(self.logedUser).then(function (res) {

                //save init user data
                self.initDetails = res.data.message;

             var avalability=false;

                for(var i=0; i<res.data.message.length; i++){

                    avalability=false;
                   //check and insert into classes
                   for(var j=0; j<(i+1);j++){

                       if(self.classes[j] == res.data.message[i].sClass){

                           avalability = true;
                       }
                   }

                   //check availability
                   if(!avalability){

                       self.classes.push(res.data.message[i].sClass);
                   }
                }
            })
        };
        self.setClassNames();

        //set available terms for a given class
        self.setTerms = function (className) {

            var avalability=false;
            self.terms=[];
            //set selected class
            self.selectedClass = className;

            for(var i=0;i<self.initDetails.length;i++){

                //check and insert into terms
                for(var j=0;j<(i+1);j++){

                    if(self.terms[j] == self.initDetails[i].cTerm){
                        avalability = true;
                    }
                }

                //check availability
                if(!avalability){
                    self.terms.push(self.initDetails[i].cTerm);
                }

            }
        }

        //set available subjects for a given class
        self.setSubjects = function (term) {

            //set term
            self.selectedTerm = term;

            self.subjects = [];


            for(var i=0;i<self.initDetails.length;i++){

                //filter by class
                if(self.initDetails[i].sClass == self.selectedClass){

                    //filter by term
                    if(self.initDetails[i].cTerm == term){

                        self.temSubjects.push(self.initDetails[i].sGrades[0]);

                        self.subjects = $.map(self.temSubjects[0], function (value, key) {
                            return [key];
                        });

                    }
                }
            }
        }

        //set marks of all students
        self.setAllMarks = function(subject){

            self.selectedSubject = subject;
            self.marks = [];

            var marksDetails = {

                "class":self.selectedClass,
                "term":self.selectedTerm
            }

            //get all marks and student details
            Analytics.getAllMarks(marksDetails).then(function (res) {

                var temp={};

                for(var i=0;i<res.data.message.length;i++){

                    temp={};

                    temp = {
                        "sId" : res.data.message[i].sID,
                        "marks" : res.data.message[i].sGrades[0][subject]
                    }

                    self.marks.push(temp);
                }

                self.returnMarksDetails();
            })

            //show generate button
            self.showGraphGenarate = true;
        }

        //set grade of all students
        self.setAllGrades = function () {

            self.marks = [];

            var marksDetails = {
                "class":self.selectedClass,
                "term":self.selectedTerm
            }

            //get all marks and student details
            Analytics.getAllMarks(marksDetails).then(function (res) {

                var temp={};
                self.marks = [];

                for(var i=0;i<res.data.message.length;i++){

                    temp={};

                    temp = {
                        "sId" : res.data.message[i].sID,
                        "marks" : res.data.message[i].sGrades[0]
                    }

                    self.marks.push(temp);
                }
                self.returnGradeDetails();

            })
            //show generate button
            self.showGraphGenarate = true;

        }

        //separate marks
        self.returnMarksDetails = function () {

            self.studentName = [];
            self.studentMarks = [];

            for(var i=0;i<self.marks.length;i++){

                //add the values into graphs data
                self.studentName.push(self.marks[i]["sId"]);
                self.studentMarks.push(self.marks[i]["marks"]);
            }
        }

        //separate grades
        self.returnGradeDetails = function () {

            self.studentName = [];
            self.studentGrade = [];
            var temStoreMarks = [];


            for(var i=0;i<self.marks.length;i++){

                //get all
                self.studentName.push(self.marks[i]["sId"]);
                temStoreMarks = Object.values(self.marks[i]["marks"]);

                self.studentGrade.push(self.getAvarage(temStoreMarks));
            }
        }

        //get avarage
        self.getAvarage = function (values) {

            var i;
            var sum=0;

                for(i=0;i<values.length;i++){
                    sum += values[i];
                }

            return (sum/i);
        }

        //show  marks on graph
        self.showOnGraph = function() {

            if(self.selectedType == 'Marks'){

                $mdDialog
                    .show({

                        controller: studentMarksController,
                        templateUrl: 'app/analytics/templates/graph.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true

                    })
                    .then(function() {

                    })
            }
            else{

                $mdDialog
                    .show({

                        controller: studentGradeController,
                        templateUrl: 'app/analytics/templates/graph.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true

                    })
                    .then(function() {

                    })

            }


        };

        //controller for manage student Marks-graphs
        function studentMarksController ($scope) {

            //set topic
            $scope.graphTopic =   self.graphTopic;

            //set delay for grpah loading
            setTimeout(function(){
                var ctx = document.getElementById("graph").getContext("2d");
                var myChart = new Chart(ctx, {

                    type: 'bar',
                    data: {
                        labels: self.studentName,
                        datasets: [{
                            label: 'Marks Graph',
                            data: self.studentMarks,

                            backgroundColor: [
                                'rgba(260, 50, 132, 0.6)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(199, 159, 64, 0.2)',
                                'rgba(255, 50, 132, 0.2)',
                                'rgba(54, 162, 200, 0.2)',
                                'rgba(255, 206, 75, 0.4)',
                                'rgba(75, 192, 192, 0.8)',
                            ],

                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(199, 159, 64, 0.4)',
                                'rgba(255, 50, 130, 0.4)',
                                'rgba(54, 162, 180, 0.0)',
                                'rgba(255, 206, 75, 0.2)',
                                'rgba(75, 192, 192, 0.4)',
                            ],

                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }, 250);

        }

        //controller for manage student grade graphs
        function studentGradeController ($scope) {

            //set delay for grpah loading
            setTimeout(function(){

                //set topic
                $scope.graphTopic =   self.graphTopic;

                var ctx = document.getElementById("graph").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: self.studentName,

                        datasets: [{
                            label: 'Grade Graph',
                            data:  self.studentGrade,

                            backgroundColor: [
                                'rgba(260, 50, 132, 0.6)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(199, 159, 64, 0.2)',
                                'rgba(255, 50, 132, 0.2)',
                                'rgba(54, 162, 200, 0.2)',
                                'rgba(255, 206, 75, 0.4)',
                                'rgba(75, 192, 192, 0.8)',
                            ],

                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(199, 159, 64, 0.4)',
                                'rgba(255, 50, 130, 0.4)',
                                'rgba(54, 162, 180, 0.0)',
                                'rgba(255, 206, 75, 0.2)',
                                'rgba(75, 192, 192, 0.4)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }, 250);

        }




        // -----student-track-performance----

        self.userAverage=[];
        self.classAverage = [];


        //calcualator user avarage marks
        self.calculateAvarage = function (collection) {

            self.userGradeHistory=[];
            var tem ={};


            for(var i=0;i<collection.length;i++){
                var sum=0;
                var avg=0;
                var j;

                for(j=0;j<(Object.values(collection[i]["marks"]).length);j++){
                   // console.log(Object.values(collection[i]["marks"])[j]);
                    sum += Object.values(collection[i]["marks"])[j];
                }
                avg = sum/j;

                tem = {
                    "class":collection[i]["class"],
                    "averageOfUser":avg,
                    "classAverage":collection[i]["classAverage"]
                }

                self.userGradeHistory.push(tem);
            }

        }

        self.getUserAvarageGrade = function () {

            var tempMarksCollection = [];
            var temp;

           Analytics.getclassNames(self.logedUser).then(function (res) {
               //console.log(res.data.message);

               for(var i=0;i<res.data.message.length;i++){
                   temp = {};

                   temp = {
                       "class" : res.data.message[i].sClass,
                       "marks" : res.data.message[i].sGrades[0],
                       "classAverage" : res.data.message[i].sAverage
                   }

                   tempMarksCollection.push(temp);
               }
               //console.log(Object.values(tempMarksCollection[0]["marks"]));
               self.calculateAvarage(tempMarksCollection);
               self.genaratePerfomanceData(self.userGradeHistory);
           })

        }
        self.getUserAvarageGrade();

        self.genaratePerfomanceData = function (collection) {
             self.trackPClassNames = [];
             self.trackPUserAvg = [];
             self.trackPAvg = [];

             for(var i=0;i<collection.length; i++){

                 self.trackPClassNames.push(collection[i]["class"]);
                 self.trackPUserAvg.push(collection[i]["averageOfUser"]);
                 self.trackPAvg.push(collection[i]["classAverage"]);
             }
        };

        //show  marks on graph
        self.studentViewShowOnTrachPerformanceGraph = function() {

            $mdDialog
                .show({

                    controller: studentPerformanceController,
                    templateUrl: 'app/analytics/templates/graph.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen:true

                })
                .then(function() {

                })
        };

        //controller for manage student Marks-graphs
        function studentPerformanceController ($scope) {

            //set topic
            $scope.graphTopic =   "Track performance";

            //set delay for grpah loading
            setTimeout(function(){
                var ctx = document.getElementById('graph').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: self.trackPClassNames,
                        datasets: [{
                            label: 'Your Avarage',
                            data: self.trackPUserAvg,
                            backgroundColor: "rgba(153,255,51,0.4)"
                        }, {
                            label: 'Normal Student Avarage',
                            data: self.trackPAvg,
                            backgroundColor: "rgba(255,153,0,0.4)"
                        }]
                    }
                });
            }, 250);

        }




        //----teacher view controlling

        self.teacherViewClasses=[];
        self.teacherViewStudents=[];
        self.teacherViewSelectedStudentDetails=[];
        self.teacherViewTerms=[];
        self.teacherViewShowSubjects = false;


        //set classes
        self.teacherViewSetAllClass = function () {

            self.teacherViewClasses=[];

            Analytics.getAllClass().then(function (res) {

                var classAvalability = false;
                self.teacherViewAllClassDetails = res.data.message;

                for(var i=0; i<res.data.message.length; i++){

                    classAvalability=false;
                    //check and insert into classes
                    for(var j=0; j<(i+1);j++){

                        if(self.teacherViewClasses[j] == res.data.message[i].sClass){

                            classAvalability = true;
                        }
                    }

                    //check availability
                    if(!classAvalability){
                        self.teacherViewClasses.push(res.data.message[i].sClass);
                    }
                }
            })
        };
        self.teacherViewSetAllClass();

        //set available terms for a given class
        self.teacherViewSetTerms = function (className) {

            var termAvalability=false;
            self.teacherViewTerms=[];
            self.teacherViewMarks=[];
            self.teacherViewSelectedClass = className;


            for(var i=0;i<self.teacherViewAllClassDetails.length;i++){

                //check and insert into terms
                for(var j=0;j<(i+1);j++){

                    if(self.teacherViewTerms[j] == self.teacherViewAllClassDetails[i].cTerm){
                        termAvalability = true;
                    }
                }

                //check availability
                if(!termAvalability){
                    self.teacherViewTerms.push(self.teacherViewAllClassDetails[i].cTerm);
                }

            }
        }

        //set available subjects for a given class
        self.teacherViewSetRelaventSubjects = function (term) {

            //set term
            self.teacherViewSelectedTerm = term;
            self.teacherViewSubjects = [];

            for(var i=0;i<self.teacherViewAllClassDetails.length;i++){

                //filter by class
                if(self.teacherViewAllClassDetails[i].sClass == self.teacherViewSelectedClass){

                    //filter by term
                    if(self.teacherViewAllClassDetails[i].cTerm == term){

                        self.temSubjects.push(self.teacherViewAllClassDetails[i].sGrades[0]);

                        self.teacherViewSubjects = $.map(self.temSubjects[0], function (value, key) {
                            return [key];
                        });

                    }
                }
            }
        }

        //set marks of all students
        self.teacherViewSetRelevantMarks = function(subject){

            self.teacherViewSelectedSubject = subject;
            self.teacherViewMarks = [];

            var marksDetails = {

                "class":self.teacherViewSelectedClass,
                "term":self.teacherViewSelectedTerm
            }

            //get all marks and student details
            Analytics.getAllMarks(marksDetails).then(function (res) {

                var temp={};

                for(var i=0;i<res.data.message.length;i++){

                    temp={};

                    temp = {
                        "sId" : res.data.message[i].sID,
                        "marks" : res.data.message[i].sGrades[0][subject]
                    }

                    self.teacherViewMarks.push(temp);
                }

                self.teacherViewReturnMarksDetails();
            })

            //show generate button
            self.teacherViewShowGraphGenarate = true;
        }

        //separate marks
        self.teacherViewReturnMarksDetails = function () {

            self.teacherViewStudentName = [];
            self.teacherViewStudentMarks = [];

            for(var i=0;i<self.teacherViewMarks.length;i++){

                //add the values into graphs data
                self.teacherViewStudentName.push(self.teacherViewMarks[i]["sId"]);
                self.teacherViewStudentMarks.push(self.teacherViewMarks[i]["marks"]);
            }
        };

        //separate grades
        self.teacherViewReturnGradeDetails = function () {

            self.teacherViewStudentName = [];
            self.teacherViewStudentGrade = [];
            var temStoreMarks = [];


            for(var i=0;i<self.teacherViewMarks.length;i++){

                //get all
                self.teacherViewStudentName.push(self.teacherViewMarks[i]["sId"]);
                temStoreMarks = Object.values(self.teacherViewMarks[i]["marks"]);

                self.teacherViewStudentGrade.push(self.getAvarage(temStoreMarks));
            }
        }

        //set visibility of subjects
        self.teacherViewSetTypeOfGraph = function (type) {

            if(type == "Marks"){

                self.teacherViewShowSubjects = true;
                self.teacherViewShowSelectedType = type;
                self.teacherViewShowGraphTopic = 'Marks Details'
            }
            else{

                self.teacherViewShowSubjects = false;
                self.teacherViewShowSelectedType = type;
                self.teacherViewSetAllGrades();
                self.teacherViewShowGraphTopic = 'Grade Details'

            }
        };

        //set grade of all students
        self.teacherViewSetAllGrades = function () {

            self.teacherViewMarks = [];

            var marksDetails = {
                "class":self.teacherViewSelectedClass,
                "term":self.teacherViewSelectedTerm
            }

            //get all marks and student details
            Analytics.getAllMarks(marksDetails).then(function (res) {

                var temp={};
                self.teacherViewMarks = [];

                for(var i=0;i<res.data.message.length;i++){

                    temp={};

                    temp = {
                        "sId" : res.data.message[i].sID,
                        "marks" : res.data.message[i].sGrades[0]
                    }

                    self.teacherViewMarks.push(temp);
                }
                self.teacherViewReturnGradeDetails();

            })
            //show generate button
            self.teacherViewShowGraphGenarate = true;

        }

        //show  marks on graph
        self.teacherViewShowOnGraph = function() {

            if(self.teacherViewShowSelectedType == 'Marks'){

                $mdDialog
                    .show({

                        controller: teacherMarksController,
                        templateUrl: 'app/analytics/templates/graph.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true

                    })
                    .then(function() {

                    })
            }
            else{

                $mdDialog
                    .show({

                        controller: teacherGradeController,
                        templateUrl: 'app/analytics/templates/graph.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                        fullscreen:true

                    })
                    .then(function() {

                    })

            }


        };

        //controller for manage student Marks-graphs
        function teacherMarksController ($scope) {

            //set topic
            $scope.graphTopic =   self.graphTopic;

            //set delay for grpah loading
            setTimeout(function(){
                var ctx = document.getElementById("graph").getContext("2d");
                var myChart = new Chart(ctx, {

                    type: 'bar',
                    data: {
                        labels: self.teacherViewStudentName,
                        datasets: [{
                            label: 'Marks Graph',
                            data: self.teacherViewStudentMarks,

                            backgroundColor: [
                                'rgba(260, 50, 132, 0.6)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(199, 159, 64, 0.2)',
                                'rgba(255, 50, 132, 0.2)',
                                'rgba(54, 162, 200, 0.2)',
                                'rgba(255, 206, 75, 0.4)',
                                'rgba(75, 192, 192, 0.8)',
                            ],

                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(199, 159, 64, 0.4)',
                                'rgba(255, 50, 130, 0.4)',
                                'rgba(54, 162, 180, 0.0)',
                                'rgba(255, 206, 75, 0.2)',
                                'rgba(75, 192, 192, 0.4)',
                            ],

                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }, 250);

        }

        //controller for manage student grade graphs
        function teacherGradeController ($scope) {

            //set delay for grpah loading
            setTimeout(function(){

                //set topic
                $scope.graphTopic =   self.graphTopic;

                var ctx = document.getElementById("graph").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: self.teacherViewStudentName,

                        datasets: [{
                            label: 'Grade Graph',
                            data:  self.teacherViewStudentGrade,

                            backgroundColor: [
                                'rgba(260, 50, 132, 0.6)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(199, 159, 64, 0.2)',
                                'rgba(255, 50, 132, 0.2)',
                                'rgba(54, 162, 200, 0.2)',
                                'rgba(255, 206, 75, 0.4)',
                                'rgba(75, 192, 192, 0.8)',
                            ],

                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(199, 159, 64, 0.4)',
                                'rgba(255, 50, 130, 0.4)',
                                'rgba(54, 162, 180, 0.0)',
                                'rgba(255, 206, 75, 0.2)',
                                'rgba(75, 192, 192, 0.4)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }, 250);

        }


        //----------teacher-view-track-performance

        self.teacherViewUserAverage=[];
        self.teacherViewClassAverage = [];
        self.teacherViewStudents = [];


        //show available students
        self.teacherViewShowStudents = function () {

            self.teacherViewStudents = [];

            Analytics.getAllStudentNames().then(function (res) {

                var avalability=false;

                for(var i=0;i<res.data.message.length; i++){

                    avalability=false;

                    if(i == 0){

                        self.teacherViewStudents.push(res.data.message[i]);
                    }
                    else{

                        for(var j=0;j<i;j++){

                            if(self.teacherViewStudents[j]['sID'] == res.data.message[i]['sID']){
                                avalability = true;
                            }
                        }
                        if(!avalability){
                            self.teacherViewStudents.push(res.data.message[i]);
                        }
                   }


                }
            })
        }
        self.teacherViewShowStudents();

        //calcualator user avarage marks
        self.teacherViewCalculateAvarage = function (collection) {

            self.teacherViewUserGradeHistory=[];
            var tem ={};


            for(var i=0;i<collection.length;i++){
                var sum=0;
                var avg=0;
                var j;

                for(j=0;j<(Object.values(collection[i]["marks"]).length);j++){

                    sum += Object.values(collection[i]["marks"])[j];
                }
                avg = sum/j;

                tem = {
                    "class":collection[i]["class"],
                    "averageOfUser":avg,
                    "classAverage":collection[i]["classAverage"]
                }

                self.teacherViewUserGradeHistory.push(tem);
            }

        }

        self.teacherViewGetStudentAvarageGrade = function (studentId) {

            var tempMarksCollection = [];
            var temp;
            var studentId;
            self.showTeacherTPGraphsShow = true;


            //get selected student's class names
            Analytics.getSelectedStudentHistory(studentId).then(function (res) {

                for(var i=0;i<res.data.message.length;i++){

                    temp = {};

                    temp = {
                        "class" : res.data.message[i].sClass,
                        "marks" : res.data.message[i].sGrades[0],
                        "classAverage" : res.data.message[i].sAverage
                    }

                    tempMarksCollection.push(temp);
                }

                self.teacherViewCalculateAvarage(tempMarksCollection);
                self.teacherViewGenaratePerfomanceData(self.teacherViewUserGradeHistory);
            })

        }

        self.teacherViewGenaratePerfomanceData = function (collection) {
            self.teacherViewTrackPClassNames = [];
            self.teacherViewTrackPUserAvg = [];
            self.teacherViewTrackPAvg = [];

            for(var i=0;i<collection.length; i++){

                self.teacherViewTrackPClassNames.push(collection[i]["class"]);
                self.teacherViewTrackPUserAvg.push(collection[i]["averageOfUser"]);
                self.teacherViewTrackPAvg.push(collection[i]["classAverage"]);
            }

        };

        //show  marks on graph
        self.teacherViewShowOnTrackPerformanceGraph = function() {

            $mdDialog
                .show({

                    controller: teacherPerformanceController,
                    templateUrl: 'app/analytics/templates/graph.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen:true

                })
                .then(function() {

                })
        };

        //controller for manage student Marks-graphs
        function teacherPerformanceController ($scope) {

            //set topic
            $scope.graphTopic =   "Track performance";

            //set delay for grpah loading
            setTimeout(function(){
                var ctx = document.getElementById('graph').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: self.teacherViewTrackPClassNames,
                        datasets: [{
                            label: 'Your Avarage',
                            data: self.teacherViewTrackPUserAvg,
                            backgroundColor: "rgba(153,255,51,0.4)"
                        }, {
                            label: 'Normal Student Avarage',
                            data: self.teacherViewTrackPAvg,
                            backgroundColor: "rgba(255,153,0,0.4)"
                        }]
                    }
                });
            }, 250);

        }


        //-----------student-view-attendance

        self.currentStudentClass='';
        self.currentStudentName='';
        self.allAttendance=[];
        self.currentAttendance=[];
        self.attendanceGraphsDataSetLabel=['Present','Absent'];
        self.attendanceGraphsDataData=[];

        self.fillAttendanceForm = function () {
            Analytics.getStudentClass(self.logedUser).then(function (res) {

                self.currentStudentClass = res.data.message[0]["class"];
                self.currentStudentName = res.data.message[0]["name"];
            })
        }
        self.fillAttendanceForm();

        self.studentViewShowOnAttendanceGraph = function () {

            //get all attendance details
            Analytics.getAttendance().then(function (res) {
                self.allAttendance=res.data.message;
                self.getAttendanceOfStudentClass();
            });



        }

        self.getAttendanceOfStudentClass = function() {
            var tem={};
            self.currentAttendance=[];
            for(var i=0;i<self.allAttendance.length;i++){

                tem={};
               if(self.allAttendance[i]['sClass'] == self.currentStudentClass){

                   for(var j=0;j<self.allAttendance[i]['attendanceRecodes'].length;j++){

                        if(self.allAttendance[i]['attendanceRecodes'][j]['sName'] == self.currentStudentName){

                              tem = {
                             'date':self.allAttendance[i]['aDate'],
                             'status':self.allAttendance[i]['attendanceRecodes'][j]['aStatus']
                             }
                            self.currentAttendance.push(tem);
                        }
                   }

               }
            }
            self.returnAttendanceGraphsDataSet();
        }

        self.returnAttendanceGraphsDataSet = function () {

            var present=0;
            var absunt=0;
            self.attendanceGraphsDataData =[];

            for(var i=0;i<self.currentAttendance.length;i++){

                if(self.currentAttendance[i]['status'] == 1){

                    present++;

                }else{

                    absunt++;
                }
            }
            self.attendanceGraphsDataData.push(present);
            self.attendanceGraphsDataData.push(absunt);
            self.ShowOnAttendanceGraph();
        }

        //show  attendance on graph
        self.ShowOnAttendanceGraph = function() {


            $mdDialog
                .show({

                    controller: attendanceController,
                    templateUrl: 'app/analytics/templates/graph.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen:true

                })
                .then(function() {

                })

        };

        //controller for manage student attendence-graphs
        function attendanceController ($scope) {

                $scope.graphTopic = 'Attendance Graph';
            //set delay for grpah loading
            setTimeout(function(){
                var ctx = document.getElementById("graph").getContext("2d");
                var myChart = new Chart(ctx, {

                    type: 'pie',
                    data: {
                        labels: self.attendanceGraphsDataSetLabel,
                        datasets: [{
                            label: "Population (millions)",
                            backgroundColor: ["#3e95cd","#c45850"],
                            data: self.attendanceGraphsDataData
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Attendance Graph From From 2017.01.01 To '+new Date().getFullYear()+'.'+new Date().getMonth()+'.'+new Date().getDate()
                        }
                    }
                });
            }, 250);

        }






    })


    
