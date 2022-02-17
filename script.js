$(document).ready(function() {
    setSortSliderVal();
});

$("#sort-range").change(setSortSliderVal);

function setSortSliderVal() {
    let sortRangeVal = $("#sort-range").val();
    $("#sort-slider-value").html(sortRangeVal);
    $("#sort-slider-value").val(sortRangeVal);
}