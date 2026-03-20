import { sequentialSequence } from './testcase.js'
import { midRepeatSequence } from './testcase.js'
import { randomSequence } from './testcase.js'
import { doubleSequence } from './testcase.js'

class CacheBlock{
    constructor(id, set, data){
        this.id = id
        this.set = set
        this.data = data
    }
}

class BSACache {
    constructor(blocks, blocksPerSet){
        this.blocks = blocks
        this.blocksPerSet = blocksPerSet
        this.sets = blocks/blocksPerSet
        this.replacementIDs = []

        this.cache = this.createCache(this.blocksPerSet, this.sets)
    }

    createCache(blocksPerSet, sets){
        // Create cache array
        let cache = [sets]
        for (let i = 0; i < sets; i++){
            //console.log("Creating set " + i)
            // Create a cache set
            cache[i] = [blocksPerSet]
            for (let j = 0; j < blocksPerSet; j++){   
                let blockID = j + (i * blocksPerSet)
                //console.log("Creating block" + blockID)
                // Create a number of blocks equal to the number of blocks per set   
                cache[i][j] = new CacheBlock(blockID, i, -1)
            }
        }

        return cache
    }

    readBlockData(id, data){
        let set = id % this.sets
        console.log("Reading Block [" + id + "] at Set [" + set + "]")
        for (let i = 0; i < this.cache[set].length; i++) {
            // If cache hit
            if (this.cache[set][i].data == id) {
                console.log("Cache Hit with Block [" + id  +"] at Set [" + set + "]")
                // Set the replacement cache to this block ID
                this.replacementIDs[set] = i
                // Retrieve the data here
                return this.cache[set][i].data
            }
        }

        // If cache miss, write on the data
        this.writeBlockData(id, data)
    }

    writeBlockData(id, data){
        // Get the cache set to assign the block to
        let set = id % this.sets;

        console.log("Cache Miss with Block [" + id  +"] at Set [" + set + "]")
        // Check cache set if there's still a slot
        for (let i = 0; i < this.cache[set].length; i++){
            // If there's a slot write there
            if (this.cache[set][i].data == -1){
                this.cache[set][i].data = id
                this.replacementIDs[set] = i
                return
            }
        }

        // If not then set the cache block for replacement
        this.cache[set][this.replacementIDs[set]].data = id
        return
    }

    printCache(){
        let cacheLine = ""
        for (let i = 0; i < this.sets; i++){
            cacheLine += "CACHE SET [" + i + "] \n"
            for (let j = 0; j < this.cache[i].length; j++){
                cacheLine += " Cache Block [" + this.cache[i][j].id + "]: " + this.cache[i][j].data + " \n"
            }
        }
        console.log(cacheLine)
    }

    simulate(blockSequence){
        for (let i = 0; i < blockSequence.length; i++){
            this.readBlockData(blockSequence[i])
            this.printCache()
            console.log(this.replacementIDs)
        }
    }
}

let cache = new BSACache(8, 4)
console.log(cache.blocks + " " + cache.blocksPerSet + " " + cache.sets + " " + cache.cache.length)
let blockSequence = doubleSequence(sequentialSequence(8))
console.log(blockSequence)
cache.simulate(blockSequence)
