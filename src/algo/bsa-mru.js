class BSACache {
    constructor(blocks, setsPerBlock){
        this.blocks = blocks
        this.setsPerBlock = setsPerBlock

        this.cache = createCache(blocks, setsPerBlock)
    }

    function createCache(blocks, setsPerBlock){
        let cache = []
        for (let i = 0; i < setsPerBlock; i++){

        }

        return cache
    }
}
