////////// DataBase //////////
const config = {
  apiKey: "AIzaSyA_OTRPTqH6qlBHv6DgxXyZZROR5TYIQoc",
  authDomain: "team-project-6fc1b.firebaseapp.com",
  databaseURL: "https://team-project-6fc1b.firebaseio.com",
  projectId: "team-project-6fc1b",
  storageBucket: "team-project-6fc1b.appspot.com",
  messagingSenderId: "419635299308"
};
firebase.initializeApp(config);

const database = firebase.database();

function writeUserData(user) {
  database.ref('users/' + user.firstName).set(  //user.firstname on this line is an ID for the data
    user
  ); //end write user data
}

let income = 0;
function submitUserToDataBase() {
  // *** get rid of any dollar sign or any other special character -- or put static text -JM
  //const firstName  = $("#first_name").val().trim();
  let tmp = $("#first_name").val().trim();
  let user = {};
  if (tmp != "") {
    user.firstName = tmp;
  }

  tmp = $('.dropdown2').formSelect('getSelectedValues');

  if (tmp != "") {
    user.state = tmp;
  }

  tmp = $("#income").val().trim();

  if (tmp != "") {
    user.income = tmp;
    income = tmp; //For later use.
  }

  writeUserData(user);

  $("input").val("");
  
}

////////// APIs //////////
// Taxee
// apikey: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElfS0VZX01BTkFHRVIiLCJodHRwOi8vdGF4ZWUuaW8vdXNlcl9pZCI6IjVjYjEzZWE0Y2YwN2JkNDJjY2UyMjc0MCIsImh0dHA6Ly90YXhlZS5pby9zY29wZXMiOlsiYXBpIl0sImlhdCI6MTU1NTExOTc4MH0.DS4jUCTf1099rMvn_VY_PxUhCqFqG5MhPnH7qxlb0S4
// Data format
// data.single, data.married, data.married_separately, head_of_household
// up.deductions[""0""].deduction_amount
// up.exemptions[""0""].exemption_amount
// up.income_tax_brackets[x].ammount (Taxes owed from previous brackets), bracket (ammount this bracket kicks in), marginal_rate (rate within this bracket)
let taxeeFedData;
let taxeeBracketCount; // Only need to get this once.
function getFedTaxes(income, filingType = "single") {
  let taxesOwed = 0;
  const stdDeduction = taxeeFedData[filingType].deductions[0].deduction_amount;
  const evaluatedIncome = income - stdDeduction;
  if ((taxeeFedData != undefined) && evaluatedIncome > 0) {
    for (let i = 0; i < taxeeBracketCount; i++) {
      //No need to evaluate if you aren't in this bracket.
      if (evaluatedIncome > taxeeFedData[filingType].income_tax_brackets[i].bracket) {
        //Taxes from previous brackets combined
        const previousTotal = taxeeFedData[filingType].income_tax_brackets[i].amount;
        //Subtract out the previous bracket and multiple times the rate.
        const thisBracket = (evaluatedIncome - taxeeFedData[filingType].income_tax_brackets[i].bracket) * taxeeFedData[filingType].income_tax_brackets[i].marginal_rate / 100;

        taxesOwed = previousTotal + thisBracket;
      } //We will overwrite the Taxes owed until we hit the appropriate Tax rate.
    }
  }
  return taxesOwed;
}

function fetchTaxeeData() {
  $.ajax({
    url: 'https://taxee.io/api/v2/federal/2019',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElfS0VZX01BTkFHRVIiLCJodHRwOi8vdGF4ZWUuaW8vdXNlcl9pZCI6IjVjYjEzZWE0Y2YwN2JkNDJjY2UyMjc0MCIsImh0dHA6Ly90YXhlZS5pby9zY29wZXMiOlsiYXBpIl0sImlhdCI6MTU1NTExOTc4MH0.DS4jUCTf1099rMvn_VY_PxUhCqFqG5MhPnH7qxlb0S4");
    }, success: function (data) {
      taxeeFedData = data;
      taxeeBracketCount = data.single.income_tax_brackets.length; //All filing types have the same number of brackets so grabbing for single is ok for now.
    }
  });
}

// Census
// apKey: 5431a0d93dfd0097df1f5e372a56adc1513cfd5b
// Geography level will be us (&for=us:1) or Georgia state (&for=state:11)
// https://api.census.gov/data/2017/acs/acs1/subject?get=S1901_C04_012E&for=state:11&key=5431a0d93dfd0097df1f5e372a56adc1513cfd5b
// S1901_C04_012E, Nonfamily households!!Estimate!!Median income (dollars)
// Data format - Contains an array of requests, then an array of responses.
// The first value in the response is our desired value: S1901_C04_012E, Nonfamily households!!Estimate!!Median income (dollars)
// thus we use: data[1][0]
const stateCodeLookup = new Map(
  [["ALABAMA", 01], ["AL", 01],
  ["ALASKA", 02], ["AK", 02],
  ["ARIZONA", 03], ["AZ", 03],
  ["ARKANSAS", 04], ["AR", 04],
  ["CALIFORNIA", 05], ["CA", 05],
  ["COLORADO", 06], ["CO", 06],
  ["CONNECTICUT", 07], ["CT", 07],
  ["DELAWARE", 08], ["DE", 08],
  ["DISTRICT OF COLUMBIA", 09], ["DC", 09],
  ["FLORIDA", 10], ["FL", 10],
  ["GEORGIA", 11], ["GA", 11],
  ["HAWAII", 12], ["HI", 12],
  ["IDAHO", 13], ["ID", 13],
  ["ILLINOIS", 14], ["IL", 14],
  ["INDIANA", 15], ["IN", 15],
  ["IOWA", 16], ["IA", 16],
  ["KANSAS", 17], ["KS", 17],
  ["KENTUCKY", 18], ["KY", 18],
  ["LOUISIANA", 19], ["LA", 19],
  ["MAINE", 20], ["ME", 20],
  ["MARYLAND", 21], ["MD", 21],
  ["MASSACHUSETTS", 22], ["MA", 22],
  ["MICHIGAN", 23], ["MI", 23],
  ["MINNESOTA", 24], ["MN", 24],
  ["MISSISSIPPI", 25], ["MS", 25],
  ["MISSOURI", 26], ["MO", 26],
  ["MONTANA", 27], ["MT", 27],
  ["NEBRASKA", 28], ["NE", 28],
  ["NEVADA", 29], ["NV", 29],
  ["NEW HAMPSHIRE", 30], ["NH", 30],
  ["NEW JERSEY", 31], ["NJ", 31],
  ["NEW MEXICO", 32], ["NM", 32],
  ["NEW YORK", 33], ["NY", 33],
  ["NORTH CAROLINA", 34], ["NC", 34],
  ["NORTH DAKOTA", 35], ["ND", 35],
  ["OHIO", 36], ["OH", 36],
  ["OKLAHOMA", 37], ["OK", 37],
  ["OREGON", 38], ["OR", 38],
  ["PENNSYLVANIA", 39], ["PA", 39],
  ["RHODE ISLAND", 40], ["RI", 40],
  ["SOUTH CAROLINA", 41], ["SC", 41],
  ["SSOUTH DAKOTA", 42], ["SD", 42],
  ["TENNESSEE", 43], ["TN", 43],
  ["TEXAS", 44], ["TX", 44],
  ["UTAH", 45], ["UT", 45],
  ["VERMONT", 46], ["VT", 46],
  ["VIRGINIA", 47], ["VA", 47],
  ["WASHINGTON", 48], ["WA", 48],
  ["WEST VIRGINIA", 49], ["WV", 49],
  ["WISCONSIN", 50], ["WI", 50],
  ["WYOMING", 51], ["WY", 51]]
);

let stateMedianSingleIncome;
let stateNumber;
function fetchStateMedianIncome() {
  const queryURL = `https://api.census.gov/data/2017/acs/acs1/subject?get=S1901_C04_012E&for=state:${stateNumber}&key=5431a0d93dfd0097df1f5e372a56adc1513cfd5b`;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (data) {
    stateMedianSingleIncome = data[1][0];
    $("#stateMedianIncome").text("$" + stateMedianSingleIncome);
  });
}

////////// Dom manipulation //////////
function sliderChange(domElement) {
  debugger;
  const val = domElement.value;
  const cat = domElement.getAttribute("data-cat");
  $(`#sliderOutput${cat}`).text(`${cat}: $${val}`);
}

//create user table 
function addChildToTable(snapshot) {
  // $("#table1").append(snapshot.val().firstName + " | " + snapshot.val().income + " | " + snapshot.val().state);
  $("#table1").append('<tr>' + '<td>' + snapshot.val().firstName + '</td>' + '<td>' + snapshot.val().state + '</td>' + '<td>' + snapshot.val().income + '</td>' + '<td>' + getFedTaxes(snapshot.val().income) + '</td>' + '</tr>');
} // end addChildToTable

//source = https://wallethacks.com/average-household-spending-budget/


function addSlider(value, category) {
  // Example Dom 
  // <input type="range" value="200" step="1" class="slider" id="slider3" min="0" max="200"
  //     name="weight" oninput="sliderOutput()">
  // <output id="slider2output2">100</output>

  $("#sliderArea").append(`
      <input type="range" value="${value}" step="1" class="slider" data-cat="${category}" min="0" max="${income}"
        name="weight" oninput="sliderChange(this)">
      <output id="sliderOutput${category}">${category}: $${value}</output>
  `);
}

//% of spend in relation to national median income ($$73,573)
function populateTable() {
  const food = 10.5;
  const housing = 27;
  const transportation = 13;
  const healthcare = 6.7;
  const entertainment = 4.4;
  const misc = 38.4;

  addSlider(Math.round(food * income / 100), "Food");
  addSlider(Math.round(housing * income / 100), "Housing");
  addSlider(Math.round(transportation * income / 100), "Transportation");
  addSlider(Math.round(healthcare * income / 100), "Healthcare");
  addSlider(Math.round(entertainment * income / 100), "Entertainment");
  addSlider(Math.round(misc * income / 100), "Misc");
}

function parseState() {
  const userEntry = $("#state").val().trim().toUpperCase();
  stateNumber = stateCodeLookup.get(userEntry);
  if (stateNumber === undefined) { stateNumber = "11"; } //Use Georgia if not found in lookup table.
  fetchStateMedianIncome();
}
function userEntry(e) {
  e.preventDefault();
  submitUserToDataBase();
  populateTable();
  parseState();
  const estimate = getFedTaxes(income);
  $("#budget").text(`Budget: $${income}`)
  $("#fedTaxEstimate").text(`Estimated fed income tax: $${estimate}`);

}

//create dropdown options for state field

const stateArray = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY"]

var select = document.getElementById("state");
var options = stateArray;
for (var i = 0; i < options.length; i++) {
  var opt = options[i];
  var el = document.createElement("option");
  el.textContent = opt;
  el.value = opt;
  select.appendChild(el);
}


//valdation first letter uppercase on modal input

// function modalCapitalization() {
//   document.getElementById("first_name").addEventListener("keypress", function (e) {
//     if (this.selectionStart == 0) {
//       // uppercase first letter
//       forceKeyPressUppercase(e);
//     } else {
//       // lowercase other letters
//       forceKeyPressLowercase(e);
//     }
//   }, false);
// }

// modalCapitalization();

//document ready functions
$(function () {
  $("#submit").on("click", userEntry);

  //Event listener for the child added event in the database 'users' scope
  database.ref('users').on("child_added", function (childSnapshot, prevChildKey) {
    //console.log(childSnapshot.val());
    addChildToTable(childSnapshot);
  });


  M.updateTextFields();
  $('.modal').modal();
  fetchTaxeeData();
  // fetchGeorgiaMedianIncome();
  $('.dropdown-trigger').dropdown({
    hover: true
  });
  
  $('select').formSelect();
  $('.collapsible').collapsible();
}); //end document
