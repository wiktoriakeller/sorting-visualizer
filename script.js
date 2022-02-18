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


    switch(algorithm) {
        case "Bubble sort":
            bubbleSort();
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

async function bubbleSort(delay = 100) {
    const bars = document.getElementsByClassName("bar");
    const isSorted = new Array(bars.length);
    isSorted.fill(false, 0, bars.length);

    for(let i = 0; i < bars.length - 1; i++) {
        for(let j = 0; j < bars.length - 1; j++) {
            let barVal = bars[j].clientHeight;
            let nextBarVal = bars[j + 1].clientHeight;
            
            if(isSorted[j + 1] === false) {
                bars[j].style.background = unsortedBarColor;
            }
            
            if(isSorted[j + 1] === false) {
                bars[j + 1].style.background = unsortedBarColor;
            }

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 50);
            });

            if(barVal > nextBarVal) {
                await swap(bars, j, j + 1);
            }

            if(isSorted[j + 1] === false) {
                bars[j].style.background = normalBarColor;
            }
            
            if(isSorted[j + 1] === false) {
                bars[j + 1].style.background = normalBarColor;
            }
        }

        isSorted[bars.length - i - 1] = true;
        bars[bars.length - i - 1].style.background = sortedBarColor;
    }

    bars[0].style.background = sortedBarColor;
};
