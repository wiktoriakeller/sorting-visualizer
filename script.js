import { bubbleSort } from "./algorithms/bubbleSort.js";
import { resetBarsColors } from "./algorithms/base.js";
import { mergeSort } from "./algorithms/mergeSort.js";

let controller = new AbortController();
let sortingStarted = false;
let barsCopy = []

$(document).ready(function() {
    setSpeedSliderVal();
    setSortSliderVal();
    resize();
});

$(document).on("input", "#sort-speed", setSpeedSliderVal);

function setSpeedSliderVal() {
    let sortSpeedVal = $("#sort-speed").val();
    $("#sort-speed-value").html(sortSpeedVal);
}

$(document).on("input", "#sort-range", setSortSliderVal);

function setSortSliderVal() {
    let sortRangeVal = $("#sort-range").val();
    $("#sort-slider-value").html(sortRangeVal);
    
    let minHeight = 5;
    let maxHeight = 99;

    const bars = document.getElementById("bars");
    bars.innerHTML = "";

    let width = 100;
    let barWidth = width / sortRangeVal;

    for(let i = 0; i < sortRangeVal; i++) {
        let randomHeight = getRandomInteger(minHeight, maxHeight);
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = barWidth + "%";
        bar.style.height = randomHeight + "%";
        bars.appendChild(bar);

        if(sortRangeVal <= 15) {
            let barText = document.createElement("span");
            barText.className = "bar-text";
            barText.textContent = bar.style.height.replace("%", "");
            bar.appendChild(barText);
        }
    }
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
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

$("#sort-button").click(function() {
    let algorithm = $("#sort-picker").val();

    if(sortingStarted) {
        sortingStarted = false;
        controller.abort();
    }
    else if(algorithm != null) {
        sortingStarted = true;
        $("#sort-button span").text("STOP!");
        $("#sort-range").prop("disabled", true);

        barsCopy = [...document.getElementsByClassName("bar")];

        resetBarsColors(bars);
        chooseAlgorithm(algorithm);
    }
});

function resetSettings() {
    $("#sort-button span").text("SORT!");
    $("#sort-range").prop("disabled", false);
    sortingStarted = false;
}

async function chooseAlgorithm(algorithm) {
    try {
        switch(algorithm) {
            case "Bubble sort":
                await bubbleSort({signal: controller.signal});
                break;
            case "Merge sort":
                await mergeSort({signal: controller.signal});
                break;
            default:
                break;
        }
    }
    catch(error) {
        resetBarsColors(barsCopy);
        $("#bars").html(barsCopy);
        controller = new AbortController();
    }
    finally {
        resetSettings();
    }
}
