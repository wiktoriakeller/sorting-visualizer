const sortedBarColor = "#f5761a";
const normalBarColor = "#996033";
const wrongOrderColor = "#cc0000";
const correctOrderColor = "#00b100";
const maxSpeedTime = 1000;

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

function resetBarsColors(bars) {
    for(let i = 0; i < bars.length; i++) {
        bars[i].style.background = normalBarColor;
    }
}

function resetSettings() {
    $("#sort-button span").text("SORT!");
    $("#sort-range").prop("disabled", false);
    sortingStarted = false;
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

        const bars = document.getElementsByClassName("bar");
        barsCopy = [...bars];

        resetBarsColors(bars);
        chooseAlgorithm(algorithm, bars);
    }
});

async function chooseAlgorithm(algorithm, bars) {
    try {
        switch(algorithm) {
            case "Bubble sort":
                await bubbleSort(bars, {signal: controller.signal});
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

function swap(arr, i, j, {signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }

    return new Promise((resolve, reject) => {
        let timeout;

        const swapAbortHandler = () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
        }

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
            timeout = setTimeout(() => {
                container.insertBefore(arr[j], arr[i]);
                resolve();
                signal?.removeEventListener("abort", swapAbortHandler);
            }, (maxSpeedTime - speed));
        });

        signal?.addEventListener("abort", swapAbortHandler);
    });
}

function bubbleSort(bars, {signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }
    
    return new Promise(async (resolve, reject) => {   
        const sortAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));
        };
        
        signal?.addEventListener("abort", sortAbortHandler);

        for(let i = 0; i < bars.length - 1; i++) {
            for(let j = 0; j < bars.length - i - 1; j++) {
                let barVal = bars[j].clientHeight;
                let nextBarVal = bars[j + 1].clientHeight;

                if(barVal <= nextBarVal) {
                    bars[j].style.background = correctOrderColor;
                    bars[j + 1].style.background = correctOrderColor;
                }
                else {
                    bars[j].style.background = wrongOrderColor;
                    bars[j + 1].style.background = wrongOrderColor;
                }

                let speed = $("#sort-speed").val();

                try {
                    await new Promise((resolve, reject) => {
                        if(signal?.aborted) {
                            reject(new DOMException("Aborted", "AbortError"));
                        }

                        let timeout1;
                        const timeout1AbortHandler = () => {
                            clearTimeout(timeout1)
                            reject(new DOMException("Aborted", "AbortError"));
                        };

                        timeout1 = setTimeout(() => {
                            resolve();
                            signal?.removeEventListener("abort", timeout1AbortHandler);
                        }, (maxSpeedTime - speed) / 1.5);
    
                        signal?.addEventListener("abort", timeout1AbortHandler);
                    });
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }

                try {
                    if(barVal > nextBarVal) {
                        await swap(bars, j, j + 1, {signal});
                    }
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }

                bars[j].style.background = correctOrderColor;
                bars[j + 1].style.background = correctOrderColor;

                try {
                    await new Promise((resolve, reject) => {
                        if(signal?.aborted) {
                            reject(new DOMException("Aborted", "AbortError"));
                        }

                        let timeout2;
                        const timeout2AbortHandler = () => {
                            clearTimeout(timeout2)
                            reject(new DOMException("Aborted", "AbortError"));
                        };

                        timeout2 = setTimeout(() => {
                            resolve();
                            signal?.removeEventListener("abort", timeout2AbortHandler);
                        }, (maxSpeedTime - speed) / 1.5);
    
                        signal?.addEventListener("abort", timeout2AbortHandler);
                    });
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }

                bars[j].style.background = normalBarColor;
                bars[j + 1].style.background = normalBarColor;
            }

            bars[bars.length - i - 1].style.background = sortedBarColor;
        }

        bars[0].style.background = sortedBarColor;
        resolve();
        signal?.removeEventListener("abort", sortAbortHandler);
    });
}
