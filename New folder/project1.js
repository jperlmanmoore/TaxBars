$(function () {

  var config = {
    apiKey: "AIzaSyA_OTRPTqH6qlBHv6DgxXyZZROR5TYIQoc",
    authDomain: "team-project-6fc1b.firebaseapp.com",
    databaseURL: "https://team-project-6fc1b.firebaseio.com",
    projectId: "team-project-6fc1b",
    storageBucket: "team-project-6fc1b.appspot.com",
    messagingSenderId: "419635299308"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  let user = {};

  $("#submit").on("click", function (e) {

    e.preventDefault();

    //const firstName  = $("#first_name").val().trim();
    let tmp = $("#first_name").val().trim();

    if (tmp != "") {
      user.firstName = tmp;
    };

    tmp = $("#state").val().trim();

    if (tmp != "") {
      user.state = tmp;
    };

    tmp = $("#income").val().trim();

    if (tmp != "") {
      user.income = tmp;
    };

    writeUserData(user);

  }); //end submit on click

  function writeUserData(user) {
    database.ref('users/' + user.firstName).set(  //user.firstname on this line is an ID for the data
      user
    );
  }; //end write user data

  //initialize form
  $(document).ready(function () {
    M.updateTextFields();
    $('.carousel').carousel();
    $('.modal').modal();
  });

}); //end document
