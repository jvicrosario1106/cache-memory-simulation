export function sequentialSequence(n){
    return Array.from(Array(2*n).keys())
}

export function midRepeatSequence(n){
    let initArray = Array.from(Array(n).keys())
    let midRepeat = initArray.concat(initArray.slice(1))
    let finalArray = midRepeat.concat([...Array(n).keys()].map(x => x + (n)))
    return finalArray
}

export function randomSequence(mmBlocks, n){
    return Array.from({length: n}, () => Math.floor(Math.random() * mmBlocks))
}

export function doubleSequence(seq){
    return seq.concat(seq)
}

//console.log(doubleSequence(randomSequence(32, 8)))