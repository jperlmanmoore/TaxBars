


// Remote Resources //

//Jacob

// Taxee
//apikey: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElfS0VZX01BTkFHRVIiLCJodHRwOi8vdGF4ZWUuaW8vdXNlcl9pZCI6IjVjYjEzZWE0Y2YwN2JkNDJjY2UyMjc0MCIsImh0dHA6Ly90YXhlZS5pby9zY29wZXMiOlsiYXBpIl0sImlhdCI6MTU1NTExOTc4MH0.DS4jUCTf1099rMvn_VY_PxUhCqFqG5MhPnH7qxlb0S4
//Data format
// data.single, data.married, data.married_separately, head_of_household
// up.deductions[""0""].deduction_amount
// up.exemptions[""0""].exemption_amount
// up.income_tax_brackets[x].ammount (Taxes owed from previous brackets), bracket (ammount this bracket kicks in), marginal_rate (rate within this bracket)
let taxeeFedData;
let taxeeBracketCount; // Only need to get this once.
function getFedTaxes(income, filingType = "single") {
    //We will apply the marginal_rate for each bracket up to the ammount it contains.
    debugger;
    let taxesOwed = 0;
    if (taxeeFedData != undefined) {
        for(let i = 0; i < taxeeBracketCount; i++) {
            //No need to evaluate if you aren't in this bracket.
            if(income > taxeeFedData[filingType].income_tax_brackets[i].bracket) { 
                //Taxes from previous brackets combined
                let previousTotal = taxeeFedData[filingType].income_tax_brackets[i].amount; 
                //Subtract out the previous bracket and multiple times the rate.
                let thisBracket = (income - taxeeFedData[filingType].income_tax_brackets[i].bracket) * taxeeFedData[filingType].income_tax_brackets[i].marginal_rate / 100;
                taxesOwed = previousTotal + thisBracket;
            } //We will overwrite the Taxes owed until we hit the appropriate Tax rate.
        }
    }
    console.log(taxesOwed);
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

$(document).ready(function() {
    $('.collapsible').collapsible();
    $('.datepicker').datepicker();
    fetchTaxeeData();
})

//Jennifer

//Hilary


