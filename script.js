const sortedBarColor = "#f5761a";
const unsortedBarColor = "#ddb12c";
const normalBarColor = "#996033";
const maxSpeed = 500;

let sortClicked = false;

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

    let width = 100; //100%
    let barWidth = width / sortRangeVal;

    for(let i = 0; i < sortRangeVal; i++) {
        let randomHeight = getRandomInteger(minHeight, maxHeight);
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

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function resetBars(bars) {
    for(let i = 0; i < bars.length; i++) {
        bars[i].style.background = normalBarColor;
    }
}

function setControls() {
    $("#sort-range").prop("disabled", false);
    $("#sort-button span").text("SORT!");
    sortClicked = false;
}
 
$("#sort-button").click(function() {
    let algorithm = $("#sort-picker").val();

    if(sortClicked) {
        sortClicked = false;
    }
    else if(algorithm != null) {
        sortClicked = true;
        $("#sort-button span").text("STOP!");
        $("#sort-range").prop("disabled", true);

        const bars = document.getElementsByClassName("bar");
        resetBars(bars);

        switch(algorithm) {
            case "Bubble sort":
                bubbleSort(bars, setControls);
                break;
            default:
                break;
        }
    }
});

function swap(arr, i, j) {
    return new Promise(resolve => {
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;

        const container = document.getElementById("bars");
        const style1 = window.getComputedStyle(arr[i]);
        const style2 = window.getComputedStyle(arr[j]);

        const transform1 = style1.getPropertyValue("transform");
        const transform2 = style2.getPropertyValue("transform");

        arr[i].style.transform = transform2;
        arr[j].style.transform = transform1;
        let speed = $("#sort-speed").val();

        window.requestAnimationFrame(function() {
            setTimeout(() => {
                container.insertBefore(arr[j], arr[i]);
                resolve();
            }, maxSpeed - speed);
        });
    });
}

async function bubbleSort(bars, callback) {
    let aborted = false;
    let barsCopy = [...bars];

    for(let i = 0; i < bars.length - 1; i++) {
        for(let j = 0; j < bars.length - i - 1; j++) {
            if(sortClicked === false) {
                aborted = true;
                break;
            }

            let barVal = bars[j].clientHeight;
            let nextBarVal = bars[j + 1].clientHeight;

            bars[j].style.background = unsortedBarColor;
            bars[j + 1].style.background = unsortedBarColor;

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2);
            });

            if(barVal > nextBarVal) {
                await swap(bars, j, j + 1);
            }

            bars[j].style.background = normalBarColor;
            bars[j + 1].style.background = normalBarColor;
        }

        if(aborted) {
            break;
        }

        bars[bars.length - i - 1].style.background = sortedBarColor;
    }

    if(aborted) {
        resetBars(barsCopy);
        $("#bars").html(barsCopy);
    }
    else {
        bars[0].style.background = sortedBarColor;
    }

    callback();
};
