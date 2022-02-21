import { swap, wait, correctOrderColor, wrongOrderColor, normalBarColor, maxSpeedTime } from "./base.js";

function merge(arr, leftStart, mid, rightEnd, {signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }

    return new Promise(async (resolve, reject) => {
        if(arr.length == 1) {
            resolve();
            return;
        }

        let i = leftStart;
        let j = mid + 1;

        while(i <= rightEnd && j <= rightEnd && i < j) {
            let bar1Val = arr[i].clientHeight;
            let bar2Val = arr[j].clientHeight;

            if(bar1Val > bar2Val) {
                await swap(arr, i, j, {signal});
                i++;
                j++;
            }
            else {
                i++;
            }
        }

        resolve();
    });
}

export function mergeSort(bars, {signal}) {
    if(signal?.aborted) {
        return Prosmise.reject(new DOMException("Aborted", "Abort"));
    }
    
    return new Promise(async (resolve, reject) => {
        const sortAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));    
        }
        
        signal?.addEventListener("abort", sortAbortHandler);

        let n = bars.length;
        for(let currentSize = 1; currentSize < n; currentSize *= 2) {
            for(let leftStart = 0; leftStart < n - 1; leftStart += 2 * currentSize) {
                //end of left subarray
                let mid = Math.min(leftStart + currentSize - 1, n - 1);
                
                //end of right subarray
                let rightEnd = Math.min(leftStart + (2 * currentSize) - 1, n - 1);
                
                //merge subarrays bars[leftStart...mid] and bars[mid+1...rightEnd]
                try {
                    await merge(bars, leftStart, mid, rightEnd, {signal});
                    bars = document.getElementsByClassName("bar");
                }
                catch(error) {
                    reject(new DOMException("Abort", "AbortError"));
                    return;
                }
            }
        }

        resolve();
        signal?.removeEventListener("abort", sortAbortHandler);
    });
}
