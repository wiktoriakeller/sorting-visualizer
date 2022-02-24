import {swap} from "./base.js";

function partition(start, end, {signal}) {
    if(signal?.aborted) {
        Promise.reject(new DOMException("Abort", "AbortError"));
    }
    
    return new Promise(async (resolve, reject) => {
        const partitionAbortHandler = () => {
            reject(new DOMException("Abort", "AbortError"));
        };
        signal?.addEventListener("abort", partitionAbortHandler);
        
        let bars = document.getElementsByClassName("bar");
        let current = start;

        let candidates = [start, Math.round((start + end) / 2), end];
        candidates.sort((a, b) => bars[a].clientHeight - bars[b].clientHeight);
        let pivotIndex = candidates[1];
        let pivot = bars[pivotIndex].clientHeight;

        try {
            await swap(bars, end, pivotIndex, {signal}, false);

            for(let i = start; i < end; i++) {
                if(bars[i].clientHeight <= pivot) {
                    await swap(bars, i, current, {signal}, false);
                    bars = document.getElementsByClassName("bar");
                    current++;
                }
            }

            await swap(bars, end, current, {signal}, false);
        }
        catch(error) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }
        
        resolve(current);
        signal?.removeEventListener("abort", partitionAbortHandler);
    });
}

export function quickSort(start, end, {signal}) {
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
    
            let pivot = await partition(start, end, {signal});
    
            if(pivot === undefined) {
                reject(new DOMException("Abort", "AbortError"));
                return;
            }
    
            await quickSort(start, pivot - 1, {signal});
            await quickSort(pivot + 1, end, {signal});
        }
        catch(error) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }

        resolve();
        signal?.removeEventListener("abort", quickSortHandler);
    });
};