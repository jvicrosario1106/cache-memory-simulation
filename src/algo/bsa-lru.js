import { MEMORY_BLOCKS, CACHE_TIME, MEMORY_TIME } from '../constant.js';

export function generateSequence(testCase, cacheBlocks) {
  // n is the number of blocks in the cache
  const n = cacheBlocks;

  if (testCase === 'sequential') {
    // Access blocks 0 -> 2n-1, then repeat the whole thing once more.
    // Example (n=4): 0,1,2,3,4,5,6,7, 0,1,2,3,4,5,6,7
    const base = Array.from({ length: 2 * n }, (_, i) => i);
    return [...base, ...base];
  }

  if (testCase === 'mid-repeat') {
    // Start from 0, then repeat blocks 1..n-1 in the middle before continuing to 2n-1.
    // Example (n=4): 0,1,2,3,1,2,3,4,5,6,7, 0,1,2,3,1,2,3,4,5,6,7
    const base = [
      ...Array.from({ length: n },     (_, i) => i),       // 0 -> n-1
      ...Array.from({ length: n - 1 }, (_, i) => i + 1),   // 1 -> n-1  (middle repeat)
      ...Array.from({ length: n },     (_, i) => i + n),   // n -> 2n-1
    ];

    return [...base, ...base];
  }

  if (testCase === 'random') {
    // 64 random block addresses drawn from the full 1024-block memory space.
    return Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * MEMORY_BLOCKS)
    );
  }

  return [];
}

export function runBSALRU(sequence, totalBlocks, waysPerSet) {

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
            (lruIndex, way, index, arr) =>
              way.lastUsed < arr[lruIndex].lastUsed ? index : lruIndex,
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
  const avgAccessTime = 0 // TODO: calculate the average access time
  const totalAccessTime = 0 // TODO: calculate the total access time

  return {
    steps,
    totalAccesses: total,
    hitCount:  hits,
    missCount: misses,
    hitRate,
    missRate,
    avgAccessTime,
    totalAccessTime,
    numberOfSets,
    waysPerSet,
  };
}
