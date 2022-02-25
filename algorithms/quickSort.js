import { swap, wait, correctOrderColor, normalBarColor, wrongOrderColor, sortedBarColor } from "./base.js";

const pivotColor = "#0066b2";
const selectedBarColor = "#c98e61";

function partition(bars, start, end, {signal}) {
    if(signal?.aborted) {
        Promise.reject(new DOMException("Abort", "AbortError"));
    }
    
    return new Promise(async (resolve, reject) => {
        const partitionAbortHandler = () => {
            reject(new DOMException("Abort", "AbortError"));
        };
        signal?.addEventListener("abort", partitionAbortHandler);
        
        let current = start;
        let candidates = [start, Math.round((start + end) / 2), end];
        candidates.sort((a, b) => bars[a].clientHeight - bars[b].clientHeight);
        let pivotIndex = candidates[1];
        let pivot = bars[pivotIndex].clientHeight;

        try {
            bars[end].style.background = selectedBarColor;
            await wait(bars, pivotIndex, null, pivotColor, {signal});
            await swap(bars, end, pivotIndex, {signal}, false);
            
            if(pivotIndex !== end) {
                bars[pivotIndex].style.background = normalBarColor;
            }

            for(let i = start; i < end; i++) {
                let currentCopy = current;
                let colorToAssign = correctOrderColor;

                if(bars[i].clientHeight <= pivot) {
                    colorToAssign = wrongOrderColor;
                }

                await wait(bars, i, current, colorToAssign, {signal});

                if(bars[i].clientHeight <= pivot) {
                    await swap(bars, i, current, {signal}, false);
                    await wait(bars, i, current, correctOrderColor, {signal});
                    currentCopy = current;
                    current++;
                }
                
                bars[i].style.background = normalBarColor;
                bars[currentCopy].style.background = normalBarColor;
            }

            await swap(bars, end, current, {signal}, false);
            bars[current].style.background = sortedBarColor;
        }
        catch(error) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }
        
        resolve(current);
        signal?.removeEventListener("abort", partitionAbortHandler);
    });
}

export function quickSort(bars, start, end, {signal}) {
    if(signal?.aborted) {
        Promise.reject(new DOMException("Abort", "AbortError"));
    }

    return new Promise(async (resolve, reject) => {
        const quickSortHandler = () => {
            reject(new DOMException("Abort", "AbortError"));
        };
        signal?.addEventListener("abort", quickSortHandler);
        
        try {
            if(start >= end) {
                resolve();
                signal?.removeEventListener("abort", quickSortHandler);
                return;
            }
    
            let pivot = await partition(bars, start, end, {signal});
    
            if(pivot === undefined) {
                reject(new DOMException("Abort", "AbortError"));
                return;
            }
    
            await quickSort(bars, start, pivot - 1, {signal});

            for(let i = start; i <= pivot - 1; i++) {
                bars[i].style.background = sortedBarColor;
            }

            await quickSort(bars, pivot + 1, end, {signal});

            for(let i = pivot + 1; i <= end; i++) {
                bars[i].style.background = sortedBarColor;
            }
        }
        catch(error) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }

        resolve();
        signal?.removeEventListener("abort", quickSortHandler);
    });
};