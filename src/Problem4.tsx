// Same with Problem 1
// Provide 3 unique implementations of the following function in TypeScript.
// **Input**: `n` - any integer
// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.
// **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

/**
 * Mathematical approach: Most efficient
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * No need for return type annotation as TypeScript infers it
 */
export function sum_to_n_a(n: number) {
  return (n * (n + 1)) / 2
}

/**
 * Iterative approach using a for loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * No need for return type annotation as TypeScript infers it
 */
export function sum_to_n_b(n: number) {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i
  }

  return sum
}

/**
 * Recursive approach
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function sum_to_n_c(n: number): number {
  if (n <= 1) {
    return n
  }

  return n + sum_to_n_c(n - 1)
}
