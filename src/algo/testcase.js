export function sequentialSequence(n, mult = 2){
    return Array.from(Array(mult*n).keys())
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

export function sequenceRepeat(seq, count){
    let newSeq = Array.from(seq)
    for (let i = 1; i < count; i++){
        newSeq = newSeq.concat(seq)
    }

    return newSeq
}

export function doubleSequence(seq){
    return sequenceRepeat(seq, 2)
}

export class TestCastStats{
    constructor(){
        this.hitRate = 0
        this.missRate = 0
        this.avgAccessTime = 0
        this.totalAccessTime = 0
        this.missPenalty = 0
    }
}

export class TestCase{
    constructor(){
        this.sequence = []
        this.sequenceHits = []
        this.testCaseStats = new TestCastStats()
    }

    createSequentialSequence(n, mult = 2){
        this.sequence = Array.from(Array(mult*n).keys())
        return this
    }

    createRandomSequence(n, mmBlocks){
        this.sequence = Array.from({length: n}, () => Math.floor(Math.random() * mmBlocks))
        return this
    }

    repeatSequence(count){
        let newSeq = Array.from(this.sequence)
        for (let i = 0; i < count; i++){
            newSeq = newSeq.concat(this.sequence)
        }
        this.sequence = newSeq
        return this
    }

    doubleSequence(){
        this.repeatSequence(1)
        return this
    }

    midRepeatSequence(){
        let firstHalf = this.sequence.slice(0, Math.floor(this.sequence.length/2))
        let secondHalf = this.sequence.slice(Math.floor(this.sequence.length/2), this.sequence.length)
        
        let initArray = firstHalf
        let midRepeat = initArray.concat(initArray.slice(1))
        let finalArray = midRepeat.concat(secondHalf)

        this.sequence = finalArray
        return this
    }
}

//let test = new TestCase()
//test.createSequentialSequence(4,2).midRepeatSequence().doubleSequence()
//console.log(test.sequence)