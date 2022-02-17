$(document).ready(function() {
    setSortSliderVal();
    resize();
});

$(document).on("input", "#sort-range", setSortSliderVal);

function setSortSliderVal() {
    let sortRangeVal = $("#sort-range").val();
    $("#sort-slider-value").html(sortRangeVal);
    
    let minHeight = 1;
    let maxHeight = 99;

    const bars = document.getElementById("bars");
    bars.innerHTML = "";

    let width = 100; //100%
    let barWidth = width / sortRangeVal;

    for(let i = 0; i < sortRangeVal; i++) {
        let randomHeight = getRndInteger(minHeight, maxHeight);
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = barWidth + "%";
        bar.style.height = randomHeight + "%";
        $("#bars").append(bar);
    }
}

$(window).on("resize", resize);

function resize() {
    const navbar = document.getElementById("main-navbar");
    const bars = document.getElementById("bars");
    let height = window.innerHeight;

    if(height <= navbar.clientHeight + 1) {
        bars.style.height = "0px";
    }
    else {
        bars.style.height = (height - navbar.clientHeight) + "px";

        let sortRangeVal = $("#sort-range").val();
        let barWidth = 100 / sortRangeVal;
        $(".bar").width(barWidth + "%");
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

$("#sort-button").click(function() {
    let algorithm = $("#sort-picker").val();

    switch(algorithm) {
        case "Bubble sort":
            bubbleSort();
            break;
        default:
            break;
    }
});

function swap(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function bubbleSort() {
    const bars = $(".bar");
    for(let i = 0; i < bars.length - 1; i++) {
        for(let j = 0; j < bars.length - 1; j++) {
            let barVal = $(bars[j]).height();
            let nextBarVal = $(bars[j + 1]).height();
            if(barVal > nextBarVal) {
                swap(bars, j, j + 1);
            }
        }
    }
};
