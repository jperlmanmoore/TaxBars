

var slider = document.getElementById('test-slider');
noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    step: 1,
    // pips: {
    //     mode: 'steps',
    //     stepped: true,
    //     density: 4
    // },
   direction: 'rtl',
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 0,
        'max': 100 
    },
    format: wNumb({
        decimals: 0
    })
});

var weight = $('input[name=weight]').val();


var slider2 = document.getElementById("slider2");
var val = document.getElementById("value");
val.innerHTML = slider2.value;
slider.oninput = function() {
    val.innerHTML=this.value;
}


//source = https://wallethacks.com/average-household-spending-budget/
function populateTable(income){
    const food = 12.87;
    const housing = 33.12;
    const transportation = 15.94;
    const healthcare = 8.20;
    const entertainment = 5.33;
}


//   var range = document.getElementById('range');

// noUiSlider.create(range, {

//     range: {
//         'min': 1300,
//         'max': 3250
//     },

//     step: 150,

//     // Handles start at ...
//     start: [1450, 2050, 2350, 3000],

//     // ... must be at least 300 apart
//     margin: 300,

//     // ... but no more than 600
//     limit: 600,

//     // Display colored bars between handles
//     connect: true,

//     // Put '0' at the bottom of the slider
//     direction: 'rtl',
//     orientation: 'vertical',

//     // Move handle on tap, bars are draggable
//     behaviour: 'tap-drag',
//     tooltips: true,
//     format: wNumb({
//         decimals: 0
//     }),

//     // Show a scale with the slider
//     pips: {
//         mode: 'steps',
//         stepped: true,
//         density: 4
//     }
// });

// $(function() {
//     var el, newPoint, newPlace, offset;
    
//     // Select all range inputs, watch for change
//     $("input[type='range']").change(function() {
    
//       // Cache this for efficiency
//       el = $(this);
      
//       // Measure width of range input
//       width = el.width();
      
//       // Figure out placement percentage between left and right of input
//       newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
      
//       // Janky value to get pointer to line up better
//       offset = -1.3;
      
//       // Prevent bubble from going beyond left or right (unsupported browsers)
//       if (newPoint < 0) { newPlace = 0; }
//       else if (newPoint > 1) { newPlace = width; }
//       else { newPlace = width * newPoint + offset; offset -= newPoint; }
      
//       // Move bubble
//       el
//         .next("output")
//         .css({
//           left: newPlace,
//           marginLeft: offset + "%"
//         })
//         .text(el.val());
//     })
//     // Fake a change to position bubble at page load
//     .trigger('change');
//    });


