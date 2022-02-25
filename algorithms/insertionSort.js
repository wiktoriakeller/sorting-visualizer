import { swap, wait, wrongOrderColor, correctOrderColor, normalBarColor, sortedBarColor, maxSpeedTime } from "./base.js";

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
            try {
                if(bars[elem].clientHeight >= bars[k].clientHeight) {
                    await wait(bars, k, elem, correctOrderColor, {signal});
                }
                else {
                    while(k >= 0 && bars[elem].clientHeight < bars[k].clientHeight) {
                        await wait(bars, k, elem, wrongOrderColor, {signal});
                        await swap(bars, k, elem, {signal});
                        bars = document.getElementsByClassName("bar");
                        await wait(bars, k, elem, correctOrderColor, {signal});

                        bars[k].style.background = normalBarColor;
                        bars[elem].style.background = normalBarColor;

                        elem = k;
                        k--;
                    }
                }

               if(k >= 0 && elem >= 0) {
                    bars[k].style.background = normalBarColor;
                    bars[elem].style.background = normalBarColor;
               }
            }
            catch(error) {
                reject(new DOMException("Aborted", "AbortError"));
                return;
            }
        }

        for(let i = 0; i < bars.length; i++) {
            try {
                let time = (maxSpeedTime - $("#sort-speed").val()) / 3;
                await wait(bars, i, null, sortedBarColor, {signal}, time);
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
