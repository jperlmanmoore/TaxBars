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

    // if (temp == [0-9]) {
    //   display a note to tell them no numbers
    // }

    tmp = $("#state").val().trim();

    if (tmp != "") {
      user.state = tmp;
    };

    // if (temp == [0-9]) {
    //   display a note to tell them no numbers
    // }

    tmp = $("#income").val().trim();

    if (tmp != "") {
      user.income = tmp;
    };

    // if(tmp == [A-Za-z]) {
    //   say no letters
    // };

    writeUserData(user);

  }); //end submit on click


  //slider
  // var slider2 = document.getElementById("#slider2");
  // var val = document.getElementById("value");
  // val.innerHTML = slider2.value;
  // slider2.oninput = function() {
  //     val.innerHTML=this.value;
  // };
  
  //source = https://wallethacks.com/average-household-spending-budget/
  function populateTable(income){
      const food = 12.87;
      const housing = 33.12;
      const transportation = 15.94;
      const healthcare = 8.20;
      const entertainment = 5.33;
  };



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

}); 

//end document
