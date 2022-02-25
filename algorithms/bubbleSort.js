import { swap, wait, sortedBarColor, normalBarColor, correctOrderColor, wrongOrderColor } from "./base.js";

export function bubbleSort({signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }
    
    return new Promise(async (resolve, reject) => {   
        const bubbleAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));
        };
        
        signal?.addEventListener("abort", bubbleAbortHandler);
        let bars = document.getElementsByClassName("bar");

        for(let i = 0; i < bars.length - 1; i++) {
            for(let j = 0; j < bars.length - i - 1; j++) {
                let barVal = bars[j].clientHeight;
                let nextBarVal = bars[j + 1].clientHeight;
                let colorToAssign = wrongOrderColor;

                if(barVal <= nextBarVal) {
                    colorToAssign = correctOrderColor;
                    colorToAssign = correctOrderColor;
                }

                try {
                    await wait(bars, j, j + 1, colorToAssign, {signal});

                    if(barVal > nextBarVal) {
                        await swap(bars, j, j + 1, {signal});
                        bars = document.getElementsByClassName("bar");
                        await wait(bars, j, j + 1, correctOrderColor, {signal});
                    }

                    bars[j].style.background = normalBarColor;
                    bars[j + 1].style.background = normalBarColor;
                }
                catch(error) {
                    reject(new DOMException("Aborted", "AbortError"));
                    return;
                }
            }

            bars[bars.length - i - 1].style.background = sortedBarColor;
        }

        bars[0].style.background = sortedBarColor;
        resolve();
        signal?.removeEventListener("abort", bubbleAbortHandler);
    });
}
