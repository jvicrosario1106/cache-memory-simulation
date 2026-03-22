# Algorithm Analysis

## 2n * 2 Sequential

| Cache Line Size  | Cache Blocks  | Algorithm | Memory Access Count  | Cache Hits  | Cache Hit Rate   | Cache Miss  | Cache Miss Rate   | Avg Access Time (ns) | Total Access Time (ns) |
| ----- | ------- | --------- | ------ | ----- | ------ | ----- | ------- | ------- | ------- |
| 4     | 8       | BSA + LRU | 32     | 0     | 0.00%  | 32    | 100.00% | 42.00   | 1440.00 |
| 4     | 8       | BSA + MRU | 32     | 8     | 25.00% | 24    | 75.00%  | 31.75   | 1112.00 |
| 4     | 16      | BSA + LRU | 64     | 0     | 0.00%  | 64    | 100.00% | 42.00   | 1440.00 |
| 4     | 16      | BSA + MRU | 64     | 16    | 25.00% | 48    | 75.00%  | 31.75   | 1112.00 |
| 4     | 32      | BSA + LRU | 128    | 0     | 0.00%  | 128   | 100.00% | 42.00   | 1440.00 |
| 4     | 32      | BSA + MRU | 128    | 32    | 25.00% | 96    | 75.00%  | 31.75   | 1112.00 |

Fig 1. Tabular results of 2n * 2 Sequence

In this sequence, it can be observed that BSA + LRU does not make any hits when loading a cache block because of the nature of its algorithm where it replaces the oldest (by age) or least used cache block. Since the given is 2n * 2 where n is the number of cache blocks and 2n is more than the number of cache blocks, the first quarter of the sequence will always be overridden by the second quarter of the sequence.

For example, if n = 4, the pattern generated would be [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7] and with the cache blocks also equal to 4 in a 4-way BSA algorithm, that means there will be 2 blocks assigned per 1 cache block in a set. This can be visualized by the table below:

|          | Way 0    | Way 1    | Way 3    | Way 4    |
| -------- | -------- | -------- | -------- | -------- |
| Set 0    | 0, 4     | 1, 5     | 2, 6     | 3, 7     |

As confirmed by running the simulation, the first quarter of the sequence [0, 1, 2, 3] will be overridden by second quarter of the sequence [4, 5, 6, 7]. Thus, all of the first half of the sequence [0, 1, 2, 3, 4, 5, 6, 7] will miss. Finally, repeating the sequence also yields the same result which means that the all 16 cache block calls miss. Thus, no cache blocks will ever hit in this scenario.

For this sequence to have a hit, it is recommended to have the cache blocks equal or more than n because this means that not all cache blocks in the set will be overcrowded by multiple blocks. For example, if n = 4 and cache blocks = 8 in a 4-way BSA, then each set can evenly distribute the two blocks available. The table can be visualized in this way:

|          | Way 0    | Way 1    | Way 3    | Way 4    |
| -------- | -------- | -------- | -------- | -------- |
| Set 0    | 0        | 1        | 2        | 3        |
| Set 1    | 4        | 5        | 6        | 7        |

# Website Features


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.