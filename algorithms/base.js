const sortedBarColor = "#f5761a";
const normalBarColor = "#996033";
const wrongOrderColor = "#cc0000";
const correctOrderColor = "#00b100";
const sortedBarColorRGB = "rb(245, 118, 26)";
const wrongBarColorRGB = "rgb(204, 0, 0)";
const maxSpeedTime = document.getElementById("sort-speed").max;

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

        const container = document.getElementById("bars");
        const style1 = window.getComputedStyle(arr[i]);
        const style2 = window.getComputedStyle(arr[j]);

        const transform1 = style1.getPropertyValue("transform");
        const transform2 = style2.getPropertyValue("transform");

        arr[i].style.transform = transform2;
        arr[j].style.transform = transform1;
        let time = maxSpeedTime - $("#sort-speed").val();

        window.requestAnimationFrame(function() {
            timeout = setTimeout(() => {
                container.insertBefore(arr[j], arr[i]);
                resolve();
                signal?.removeEventListener("abort", swapAbortHandler);
            }, time);
        });

        signal?.addEventListener("abort", swapAbortHandler);
    });
}

function resetBarsColors(bars) {
    for(let i = 0; i < bars.length; i++) {
        bars[i].style.background = normalBarColor;
    }
}

function wait(arr, i, j, color, {signal}, time = null) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }

    return new Promise((resolve, reject) => {
        let timeout;
        const timeoutAbortHandler = () => {
            clearTimeout(timeout)
            reject(new DOMException("Aborted", "AbortError"));
        };

        if(time === null) {
            time = (maxSpeedTime - $("#sort-speed").val()) / 1.5;
        }

        arr[i].style.background = color;
        arr[j].style.background = color;

        timeout = setTimeout(() => {
            resolve();
            signal?.removeEventListener("abort", timeoutAbortHandler);
        }, time);

        signal?.addEventListener("abort", timeoutAbortHandler);
    });
}

export { swap, resetBarsColors, wait, sortedBarColor, normalBarColor, wrongOrderColor, correctOrderColor, maxSpeedTime, sortedBarColorRGB, wrongBarColorRGB };
