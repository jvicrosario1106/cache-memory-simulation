/*
* This function generates a sequence of block addresses based on the test case and cache blocks.
* The test case can be 'sequential', 'mid-repeat', or 'random'
*/
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