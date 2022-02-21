import { swap, wait, sortedBarColor, normalBarColor, correctOrderColor, wrongOrderColor, maxSpeedTime } from "./base.js";

export function bubbleSort(bars, {signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }
    
    return new Promise(async (resolve, reject) => {   
        const sortAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));
        };
        
        signal?.addEventListener("abort", sortAbortHandler);
        let speed = 0;

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

                try {
                    speed = $("#sort-speed").val();
                    await wait({signal}, (maxSpeedTime - speed) / 1.5);
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }

                try {
                    if(barVal > nextBarVal) {
                        await swap(bars, j, j + 1, {signal});
                        bars = document.getElementsByClassName("bar");
                    }
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }

                bars[j].style.background = correctOrderColor;
                bars[j + 1].style.background = correctOrderColor;

                try {
                    speed = $("#sort-speed").val();
                    await wait({signal}, (maxSpeedTime - speed) / 1.5);
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
