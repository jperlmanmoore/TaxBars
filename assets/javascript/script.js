


// Remote Resources //

// BEA 
// User Guide: https://apps.bea.gov/api/_pdf/bea_web_service_api_user_guide.pdf
// Query example: https://apps.bea.gov/api/data/?&UserID=41900668-00C1-4805-8EA7-643EE7CB9BE9&method=GETDATASETLIST&
// API Key: 41900668-00C1-4805-8EA7-643EE7CB9BE9
// National Data, National Income and Product Accounts, = Table 3.16. Government Current Expenditures by Function
// https://apps.bea.gov/api/data/?&UserID=41900668-00C1-4805-8EA7-643EE7CB9BE9&method=getdata&frequency=a&year=2017&tablename=t31600&datasetname=nipa
// The above call requires a Year, a frequency (Annual, Monthly, Quartly), the table name, the data set, the method, and our apikey.
// response.BEAAPI.Results.Data
// TODO - Determine how to see what is a subcategory of what.
$.ajax({
    url: `https://apps.bea.gov/api/data/?&UserID=41900668-00C1-4805-8EA7-643EE7CB9BE9&method=GETparameterLIST&datasetname=Regional`,
    method: "GET"
}).then(function (response) {
    console.log(response.BEAAPI.Results.Data);
});

$(document).ready(function() {
    $('.collapsible').collapsible();
    $('.datepicker').datepicker();
})