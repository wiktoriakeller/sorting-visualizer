const sortedBarColor = "#f5761a";
const unsortedBarColor = "#ddb12c";
const normalBarColor = "#996033";

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

$("#sort-button").click(function() {
    let algorithm = $("#sort-picker").val();
    const bars = document.getElementsByClassName("bar");

    for(let i = 0; i < bars.length; i++) {
        bars[i].style.background = normalBarColor;
    }

    switch(algorithm) {
        case "Bubble sort":
            bubbleSort(bars);
            break;
        default:
            break;
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

        window.requestAnimationFrame(function() {
            setTimeout(() => {
                container.insertBefore(arr[j], arr[i]);
                resolve();
            }, 10);
        });
    });
}

async function bubbleSort(bars, delay = 100) {
    for(let i = 0; i < bars.length - 1; i++) {
        for(let j = 0; j < bars.length - i - 1; j++) {
            let barVal = bars[j].clientHeight;
            let nextBarVal = bars[j + 1].clientHeight;

            bars[j].style.background = unsortedBarColor;
            bars[j + 1].style.background = unsortedBarColor;

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 50);
            });

            if(barVal > nextBarVal) {
                await swap(bars, j, j + 1);
            }

            bars[j].style.background = normalBarColor;
            bars[j + 1].style.background = normalBarColor;
        }

        bars[bars.length - i - 1].style.background = sortedBarColor;
    }

    bars[0].style.background = sortedBarColor;
};
