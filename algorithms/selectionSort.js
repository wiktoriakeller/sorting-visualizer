import { swap, wait, correctOrderColor, normalBarColor, sortedBarColor } from "./base.js";

const minBarColor = "#0066b2";
const selectedBarColor = "#c98e61";
const currentBarColor = correctOrderColor;

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

        try {
            for(let i = 0; i < (bars.length - 1); i++) {
                minBarIndex = i;
                minVal = bars[minBarIndex].clientHeight;
                await wait(bars, i, null, minBarColor, {signal});
                
                for(let j = i + 1; j < bars.length; j++) {
                    await wait(bars, j, null, selectedBarColor, {signal});

                    if(bars[j].clientHeight < minVal) {
                        let color = normalBarColor;
                        if(minBarIndex === i) {
                            color = currentBarColor;
                        }

                        bars[minBarIndex].style.background = color;

                        await wait(bars, j, null, minBarColor, {signal});
                        minBarIndex = j;
                        minVal = bars[minBarIndex].clientHeight;
                    }

                    if(j !== minBarIndex) {
                        bars[j].style.background = normalBarColor;
                    }
                }
                
                if(minBarIndex != i) {
                    await swap(bars, i, minBarIndex, {signal});
                    bars = document.getElementsByClassName("bar");
                }
                bars[i].style.background = sortedBarColor;
            }

            bars[bars.length - 1].style.background = sortedBarColor;
        }
        catch(error) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }
        
        resolve();
        signal?.removeEventListener("abort", insertionAbortHandler);
    });
}
