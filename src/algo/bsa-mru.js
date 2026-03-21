import { CACHE_TIME, MEMORY_TIME } from '../constant.js';

export function runBSAMRU(sequence, totalBlocks, waysPerSet, cacheLineWords){
    /**
       * Example: totalBlocks=16, waysPerSet=4
       * numberOfSets = totalBlocks / waysPerSet
       * numberOfSets = 16 / 4
       * numberOfSets = 4
       */
      const numberOfSets = Math.max(1, Math.floor(totalBlocks / waysPerSet));
    
      /**
       * 2D array representing the cache: cache[setIndex][wayIndex]
       * - block:    memory block number stored in this way (null = empty)
       * - lastUsed: logical timestamp of the last access (used for LRU ordering)
       *
       * Example — 4 sets, 4 ways (totalBlocks=16, waysPerSet=4):
       * [
       *   [ {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0} ],  // Set 0
       *   [ {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0} ],  // Set 1
       *   [ {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0} ],  // Set 2
       *   [ {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0}, {block: null, lastUsed: 0} ],  // Set 3
       * ]
       *
       */
      const cache = Array.from({ length: numberOfSets }, () =>
        Array.from({ length: waysPerSet }, () => ({ block: null, lastUsed: 0 }))
      );
    
      let step = 0; // step increments on every access
      let hits = 0; // number of cache hits
      let misses = 0; // number of cache misses
      const steps = []; // one entry per access
    
      for (const block of sequence) {
        step++; // increment step
    
        // Map block address to a set using modulo.
        // Example: block=5, numberOfSets=4 -> setIndex = 5 % 4 = 1 -> goes to Set 1
        const setIndex = block % numberOfSets;
        const set = cache[setIndex];
    
        /**
         * Example: block=5
         * set=[
         *    { block:3, lastUsed: 0 } <-- Way 0
         *    { block:5, lastUsed: 0 } <-- Way 1 (hit)
         *    { block:null, lastUsed: 0 } <-- Way 2
         *    { block:1, lastUsed: 0 } <-- Way 3
         * ]
         * Result : hitIndex = 1  (found in Way 1)
         */
        const hitIndex = set.findIndex(way => way.block === block);
    
        // If the block is found in the set, it is a cache hit.
        if (hitIndex !== -1) {
          hits++; // increment hits
          set[hitIndex].lastUsed = step; // update the last used timestamp
    
          steps.push({
            step,
            block,
            setIndex,
            wayIndex: hitIndex,
            hit: true,
            evicted: null,
            totalHits: hits,
            totalMisses: misses,
            snapshot: cache.map(set => set.map(way => ({ ...way }))), // deep copy of the cache
          });
    
          continue; // continue to the next block
        }
    
        // If the block is not found in the set, it is a cache miss.
    
        misses++; // increment misses
    
        /**
         * Find the first empty way in the set.
         * Example: block=5 (new block to load)
         * set=[
         *    { block: 3,    lastUsed: 1 } <-- Way 0
         *    { block: null, lastUsed: 0 } <-- Way 1 (empty -> use this)
         *    { block: 7,    lastUsed: 4 } <-- Way 2
         *    { block: 1,    lastUsed: 2 } <-- Way 3
         * ]
         * Result: emptyIndex = 1  (Way 1 is empty, load block 5 here, no eviction)
         */
        const emptyIndex = set.findIndex(way => way.block === null);
    
        /**
         * Example: block=5, all ways full
         * set=[
         *    { block: 3, lastUsed: 1 } <-- Way 0 (LRU — evict this)
         *    { block: 9, lastUsed: 3 } <-- Way 1
         *    { block: 7, lastUsed: 4 } <-- Way 2
         *    { block: 1, lastUsed: 2 } <-- Way 3
         * ]
         * Result: targetIndex = 0  (Way 0 has smallest lastUsed=1, evict block 3, load block 5)
         */
        const targetIndex =
          emptyIndex !== -1
            ? emptyIndex
            : set.reduce(
                (mruIndex, way, index, arr) =>
                  way.lastUsed > arr[mruIndex].lastUsed ? index : mruIndex,
                0
              );
    
        const evicted = set[targetIndex].block; // null if the way was empty
        set[targetIndex] = { block, lastUsed: step };
    
        steps.push({
          step,
          block,
          setIndex,
          wayIndex: targetIndex,
          hit: false,
          evicted,
          totalHits: hits,
          totalMisses: misses,
          snapshot: cache.map(set => set.map(way => ({ ...way }))), // deep copy of the cache
        });
      }
    
      const total = sequence.length;
      const hitRate = hits   / total;
      const missRate = misses / total;
      const missPenalty = CACHE_TIME + (cacheLineWords * MEMORY_TIME) + CACHE_TIME;
      const avgAccessTime = (hitRate * CACHE_TIME) + (missRate * missPenalty)
      const totalAccessTime = (cacheLineWords * CACHE_TIME * hits) + ((CACHE_TIME + (cacheLineWords * MEMORY_TIME) + (cacheLineWords * CACHE_TIME)) * misses)
    
      return {
        steps,
        totalAccesses: total,
        hitCount:  hits,
        missCount: misses,
        hitRate,
        missRate,
        missPenalty,
        avgAccessTime,
        totalAccessTime,
        numberOfSets,
        waysPerSet,
      };
}