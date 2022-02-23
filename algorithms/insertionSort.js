import {swap, wait, wrongOrderColor, correctOrderColor, normalBarColor, sortedBarColor } from "./base.js";

export function insertionSort({signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }

    return new Promise(async (resolve, reject) => {
        const insertionAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));
        };
        signal?.addEventListener("abort", insertionAbortHandler);

        let bars = document.getElementsByClassName("bar");  

        for(let i = 1; i < bars.length; i++) {
            let k = i - 1;
            let elem = i;

            while(k >= 0 && bars[elem].clientHeight < bars[k].clientHeight) {
                try {
                    await swap(bars, k, elem, {signal});
                    elem = k;
                    k--;
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }
            }
        }

        resolve();
        signal?.removeEventListener("abort", insertionAbortHandler);
    });
}
