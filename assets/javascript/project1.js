$(function () {


// Census
// apKey: 5431a0d93dfd0097df1f5e372a56adc1513cfd5b
// Geography level will be us (&for=us:1) or Georgia state (&for=state:13)
// https://api.census.gov/data/2017/acs/acs1/subject?get=S1901_C04_012E&for=state:13&key=5431a0d93dfd0097df1f5e372a56adc1513cfd5b
// S1901_C04_012E, Nonfamily households!!Estimate!!Median income (dollars)
// Data format - Contains an array of requests, then an array of responses.
// The first value in the response is our desired value: S1901_C04_012E, Nonfamily households!!Estimate!!Median income (dollars)
// thus we use: data[1][0]

let gaMedianSingleIncome;
function fetchGeorgiaMedianIncome() {    
    const queryURL = "https://api.census.gov/data/2017/acs/acs1/subject?get=S1901_C04_012E&for=state:13&key=5431a0d93dfd0097df1f5e372a56adc1513cfd5b";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(data) {
      gaMedianSingleIncome = data[1][0];
    });
}


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
    //We will apply the marginal_rate for each bracket up to the ammount it contains.
    let taxesOwed = 0;
    if (taxeeFedData != undefined) {
        for(let i = 0; i < taxeeBracketCount; i++) {
            //No need to evaluate if you aren't in this bracket.
            if(income > taxeeFedData[filingType].income_tax_brackets[i].bracket) { 
                //Taxes from previous brackets combined
                const previousTotal = taxeeFedData[filingType].income_tax_brackets[i].amount; 
                //Subtract out the previous bracket and multiple times the rate.
                const thisBracket = (income - taxeeFedData[filingType].income_tax_brackets[i].bracket) * taxeeFedData[filingType].income_tax_brackets[i].marginal_rate / 100;
                const stdDeduction = taxeeFedData[filingType].deduction_amount;
                taxesOwed = previousTotal + thisBracket - stdDeduction;
            } //We will overwrite the Taxes owed until we hit the appropriate Tax rate.
        }
    }
    return taxesOwed;
}

function fetchTaxeeData() {
    $.ajax({
        url: 'https://taxee.io/api/v2/federal/2019',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElfS0VZX01BTkFHRVIiLCJodHRwOi8vdGF4ZWUuaW8vdXNlcl9pZCI6IjVjYjEzZWE0Y2YwN2JkNDJjY2UyMjc0MCIsImh0dHA6Ly90YXhlZS5pby9zY29wZXMiOlsiYXBpIl0sImlhdCI6MTU1NTExOTc4MH0.DS4jUCTf1099rMvn_VY_PxUhCqFqG5MhPnH7qxlb0S4")
        }, success: function(data){
            taxeeFedData = data;
            taxeeBracketCount = data.single.income_tax_brackets.length; //All filing types have the same number of brackets so grabbing for single is ok for now.
        }
    });
}

// BEA 
// User Guide: https://apps.bea.gov/api/_pdf/bea_web_service_api_user_guide.pdf
// Query example: https://apps.bea.gov/api/data/?&UserID=41900668-00C1-4805-8EA7-643EE7CB9BE9&method=GETDATASETLIST&
// API Key: 41900668-00C1-4805-8EA7-643EE7CB9BE9
// National Data, National Income and Product Accounts, = Table 3.16. Government Current Expenditures by Function
// https://apps.bea.gov/api/data/?&UserID=41900668-00C1-4805-8EA7-643EE7CB9BE9&method=getdata&frequency=a&year=2017&tablename=t31600&datasetname=nipa
// The above call requires a Year, a frequency (Annual, Monthly, Quartly), the table name, the data set, the method, and our apikey.
// response.BEAAPI.Results.Data
// TODO - Determine how to see what is a subcategory of what.
function logBEA() {
    $.ajax({
        url: `https://apps.bea.gov/api/data/?&UserID=41900668-00C1-4805-8EA7-643EE7CB9BE9&method=getdata&frequency=a&year=2017&tablename=t31600&datasetname=nipa`,
        method: "GET"
    }).then(function (response) {
        debugger;
        console.log(response.BEAAPI.Results.Data);
    });
}


// firebase
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
    $('.modal').modal();
    fetchTaxeeData();
    fetchGeorgiaMedianIncome();
  });

}); //end document
