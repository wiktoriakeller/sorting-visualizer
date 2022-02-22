import { swap, wait, correctOrderColor, wrongOrderColor, normalBarColor } from "./base.js";

function merge(leftStart, mid, rightEnd, {signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }

    return new Promise(async (resolve, reject) => {
        const mergeAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));
        };

        signal?.addEventListener("abort", mergeAbortHandler);

        let arr = document.getElementsByClassName("bar");
        let i = leftStart;
        let j = mid + 1;
        let previousI = 0;
        let previousJ = 0;

        while(i <= rightEnd && j <= rightEnd && i < j) {
            let bar1Val = arr[i].clientHeight;
            let bar2Val = arr[j].clientHeight;
            let colorToAssign = wrongOrderColor;
            previousI = i;
            previousJ = j;

            if(bar1Val <= bar2Val) {
                colorToAssign = correctOrderColor;
                colorToAssign = correctOrderColor;
            }

            try {
                await wait(arr, i, j, colorToAssign, {signal});

                if(bar1Val > bar2Val) {
                    await swap(arr, i, j, {signal});
                    arr = document.getElementsByClassName("bar");

                    previousI = -1;
                    previousJ = -1;
                    for(let g = 0; g < arr.length; g++) {
                        if(previousI === -1 && arr[g].style.background.includes("rgb(204, 0, 0)")) {
                            previousI = g;
                        }
                        else if(previousJ === -1 && arr[g].style.background.includes("rgb(204, 0, 0)")) {
                            previousJ = g;
                        }

                        if(previousI !== -1 && previousJ !== -1) {
                            break;
                        }
                    }

                    await wait(arr, previousI, previousJ, correctOrderColor, {signal});
                    i++;
                    j++;
                }
                else {
                    i++;
                }

                arr[previousI].style.background = normalBarColor;
                arr[previousJ].style.background = normalBarColor;
            }
            catch(error) {
                reject(new DOMException("Aborted", "AbortError"));
                return;
            }
        }

        resolve();
        signal?.removeEventListener("abort", mergeAbortHandler);
    });
}

export function mergeSort({signal}) {
    if(signal?.aborted) {
        return Prosmise.reject(new DOMException("Aborted", "Abort"));
    }
    
    return new Promise(async (resolve, reject) => {
        const mergeSortAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));    
        }
        
        signal?.addEventListener("abort", mergeSortAbortHandler);
        let bars = document.getElementsByClassName("bar");

        let n = bars.length;
        for(let currentSize = 1; currentSize < n; currentSize *= 2) {
            for(let leftStart = 0; leftStart < n - 1; leftStart += 2 * currentSize) {
                //end of left subarray
                let mid = Math.min(leftStart + currentSize - 1, n - 1);
                
                //end of right subarray
                let rightEnd = Math.min(leftStart + (2 * currentSize) - 1, n - 1);
                
                //merge subarrays bars[leftStart...mid] and bars[mid+1...rightEnd]
                try {
                    await merge(leftStart, mid, rightEnd, {signal});
                    bars = document.getElementsByClassName("bar");
                }
                catch(error) {
                    reject(new DOMException("Abort", "AbortError"));
                    return;
                }
            }
        }

        resolve();
        signal?.removeEventListener("abort", mergeSortAbortHandler);
    });
}
