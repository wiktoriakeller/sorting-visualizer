import {swap, wait, wrongOrderColor, correctOrderColor, normalBarColor, sortedBarColor, maxSpeedTime } from "./base.js";

export function selectionSort({signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }

    return new Promise(async (resolve, reject) => {
        const insertionAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));
        };
        signal?.addEventListener("abort", insertionAbortHandler);

        let bars = document.getElementsByClassName("bar");  
        let minBarIndex = -1;
        let minVal = -1;

        for(let i = 0; i < (bars.length - 1); i++) {
            minBarIndex = i;
            minVal = bars[minBarIndex].clientHeight;
            try {
                for(let j = i + 1; j < bars.length; j++) {
                    if(bars[j].clientHeight < minVal) {
                        minBarIndex = j;
                        minVal = bars[minBarIndex].clientHeight;
                    }
                }
    
                if(minBarIndex != i) {
                    await swap(bars, i, minBarIndex, {signal});
                }
            }
            catch(error) {
                reject(new DOMException("Aborted", "AbortError"));
                return;
            }
        }
        
        resolve();
        signal?.removeEventListener("abort", insertionAbortHandler);
    });
}
