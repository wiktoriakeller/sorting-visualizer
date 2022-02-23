import {swap, wait, correctOrderColor, wrongOrderColor, normalBarColor, sortedBarColor, sortedBarColorRGB, wrongBarColorRGB} from "./base.js";

function merge(leftStart, mid, rightEnd, lastIteration, {signal}) {
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
                        if(previousI === -1 && arr[g].style.background.includes(wrongBarColorRGB)) {
                            previousI = g;
                        }
                        else if(previousJ === -1 && arr[g].style.background.includes(wrongBarColorRGB)) {
                            previousJ = g;
                        }

                        if(previousI !== -1 && previousJ !== -1) {
                            break;
                        }
                    }

                    await wait(arr, previousI, previousJ, correctOrderColor, {signal});
                    i++;
                    j++;

                    if(!lastIteration) {
                        arr[previousI].style.background = normalBarColor;
                        arr[previousJ].style.background = normalBarColor;
                    }
                    else {
                        arr[previousI].style.background = sortedBarColor;
                        arr[previousJ].style.background = sortedBarColor;
                    }
                }
                else {
                    i++;

                    if(!lastIteration) {
                        arr[previousI].style.background = normalBarColor;
                    }
                    else {
                        arr[previousI].style.background = sortedBarColor;
                    }

                    arr[previousJ].style.background = normalBarColor;
                }                
            }
            catch(error) {
                reject(new DOMException("Aborted", "AbortError"));
                return;
            }
        }

        if(lastIteration) {
            for(let g = i; g < arr.length; g++) {
                if(!arr[g].style.background.includes(sortedBarColorRGB)) {
                    arr[g].style.background = sortedBarColor;
                }
            }
        }

        resolve();
        signal?.removeEventListener("abort", mergeAbortHandler);
    });
}

export function mergeSort({signal}) {
    if(signal?.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
    }
    
    return new Promise(async (resolve, reject) => {
        const mergeSortAbortHandler = () => {
            reject(new DOMException("Aborted", "AbortError"));    
        }
        
        signal?.addEventListener("abort", mergeSortAbortHandler);
        let bars = document.getElementsByClassName("bar");

        let n = bars.length;
        let lastIteration = false;

        for(let currentSize = 1; currentSize < n; currentSize *= 2) {
            for(let leftStart = 0; leftStart < n - 1; leftStart += 2 * currentSize) {
                //end of left subarray
                let mid = Math.min(leftStart + currentSize - 1, n - 1);
                
                //end of right subarray
                let rightEnd = Math.min(leftStart + (2 * currentSize) - 1, n - 1);
                
                if(currentSize * 2 >= n) {
                    lastIteration = true;
                }

                //merge subarrays bars[leftStart...mid] and bars[mid+1...rightEnd]
                try {
                    await merge(leftStart, mid, rightEnd, lastIteration, {signal});
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
