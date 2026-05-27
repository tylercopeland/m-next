import { CompactionItem } from './compact';

/**
 * Compares two CompactionItem objects for equality
 */
function areCompactionItemsEqual(received: CompactionItem, expected: CompactionItem): boolean {
  return (
    received.id === expected.id &&
    received.x === expected.x &&
    received.y === expected.y &&
    received.w === expected.w &&
    received.h === expected.h
  );
}

/**
 * Compares two CompactionItem arrays for equality (order-independent).
 * Returns detailed differences when arrays don't match.
 */
export function compareCompactionItemArrays(
  received: CompactionItem[],
  expected: CompactionItem[],
): { equal: boolean; differences: string[] } {
  const differences: string[] = [];

  if (received.length !== expected.length) {
    differences.push(`Array lengths differ: expected ${expected.length} items, received ${received.length} items`);
  }

  // Create maps for easier lookup
  const receivedMap = new Map(received.map((item) => [item.id, item]));
  const expectedMap = new Map(expected.map((item) => [item.id, item]));

  // Check for items in expected that are missing in received
  for (const [id, expectedItem] of expectedMap.entries()) {
    if (!receivedMap.has(id)) {
      differences.push(`Missing item with id: "${id}"`);
      differences.push(`  Expected: ${JSON.stringify(expectedItem)}`);
    }
  }

  // Check for items in received that shouldn't be there
  for (const [id, receivedItem] of receivedMap.entries()) {
    if (!expectedMap.has(id)) {
      differences.push(`Unexpected item with id: "${id}"`);
      differences.push(`  Received: ${JSON.stringify(receivedItem)}`);
    }
  }

  // Check for items that exist in both but have different properties
  for (const [id, receivedItem] of receivedMap.entries()) {
    const expectedItem = expectedMap.get(id);
    if (expectedItem && !areCompactionItemsEqual(receivedItem, expectedItem)) {
      differences.push(`Item with id "${id}" has different properties:`);

      if (receivedItem.x !== expectedItem.x) {
        differences.push(`  x: expected ${expectedItem.x}, received ${receivedItem.x}`);
      }
      if (receivedItem.y !== expectedItem.y) {
        differences.push(`  y: expected ${expectedItem.y}, received ${receivedItem.y}`);
      }
      if (receivedItem.w !== expectedItem.w) {
        differences.push(`  w: expected ${expectedItem.w}, received ${receivedItem.w}`);
      }
      if (receivedItem.h !== expectedItem.h) {
        differences.push(`  h: expected ${expectedItem.h}, received ${receivedItem.h}`);
      }
    }
  }

  return {
    equal: differences.length === 0,
    differences,
  };
}

/**
 * Custom equality tester for CompactionItem arrays.
 * Compares arrays without regard to order.
 */
export function areCompactionItemArraysEqual(received: unknown, expected: unknown): boolean | undefined {
  const isReceivedArray = Array.isArray(received);
  const isExpectedArray = Array.isArray(expected);

  if (!isReceivedArray || !isExpectedArray) {
    return undefined;
  }

  // Check if arrays contain CompactionItem objects
  const isReceivedGridItemArray =
    received.length === 0 ||
    (received.length > 0 &&
      typeof received[0] === 'object' &&
      received[0] !== null &&
      'id' in received[0] &&
      'x' in received[0] &&
      'y' in received[0] &&
      'w' in received[0] &&
      'h' in received[0]);

  const isExpectedGridItemArray =
    expected.length === 0 ||
    (expected.length > 0 &&
      typeof expected[0] === 'object' &&
      expected[0] !== null &&
      'id' in expected[0] &&
      'x' in expected[0] &&
      'y' in expected[0] &&
      'w' in expected[0] &&
      'h' in expected[0]);

  if (isReceivedGridItemArray && isExpectedGridItemArray) {
    const result = compareCompactionItemArrays(received as CompactionItem[], expected as CompactionItem[]);
    return result.equal;
  }

  return undefined;
}
