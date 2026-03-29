/**
 * Hamming Code utility functions for encoding, error detection, and correction.
 */

/**
 * Convert a decimal number to a binary string.
 */
export function decimalToBinary(num) {
  if (num === 0) return '0';
  return num.toString(2);
}

/**
 * Convert a binary string to a decimal number.
 */
export function binaryToDecimal(bin) {
  return parseInt(bin, 2);
}

/**
 * Encode data bits using Hamming(7,4) extended to arbitrary lengths.
 * Returns an object with:
 *   - encoded: array of {position, value, type} where type is 'parity' or 'data'
 *   - parityPositions: array of parity bit positions
 */
export function encodeHamming(dataBitsStr) {
  const dataBits = dataBitsStr.split('').map(Number);
  const m = dataBits.length;

  // Determine number of parity bits needed
  let r = 0;
  while (Math.pow(2, r) < m + r + 1) {
    r++;
  }

  const totalBits = m + r;
  const encoded = new Array(totalBits + 1).fill(0); // 1-indexed
  const parityPositions = [];

  // Mark parity positions
  for (let i = 0; i < r; i++) {
    parityPositions.push(Math.pow(2, i));
  }

  // Place data bits in non-parity positions
  let dataIndex = 0;
  for (let pos = 1; pos <= totalBits; pos++) {
    if (!parityPositions.includes(pos)) {
      encoded[pos] = dataBits[dataIndex] || 0;
      dataIndex++;
    }
  }

  // Calculate parity bits
  for (const parityPos of parityPositions) {
    let parity = 0;
    for (let pos = 1; pos <= totalBits; pos++) {
      if (pos & parityPos) {
        parity ^= encoded[pos];
      }
    }
    encoded[parityPos] = parity;
  }

  // Build result array (1-indexed to 0-indexed)
  const result = [];
  for (let pos = 1; pos <= totalBits; pos++) {
    result.push({
      position: pos,
      value: encoded[pos],
      type: parityPositions.includes(pos) ? 'parity' : 'data',
    });
  }

  return { encoded: result, parityPositions };
}

/**
 * Detect error position in hamming encoded data.
 * Returns the error position (1-indexed) or 0 if no error.
 */
export function detectError(encodedBits) {
  const totalBits = encodedBits.length;
  const values = [0, ...encodedBits.map((b) => b.value)]; // 1-indexed

  let r = 0;
  while (Math.pow(2, r) <= totalBits) {
    r++;
  }

  let errorPosition = 0;
  const parityChecks = [];

  for (let i = 0; i < r; i++) {
    const parityPos = Math.pow(2, i);
    let parity = 0;
    for (let pos = 1; pos <= totalBits; pos++) {
      if (pos & parityPos) {
        parity ^= values[pos];
      }
    }
    parityChecks.push({
      parityPosition: parityPos,
      result: parity,
      pass: parity === 0,
    });
    if (parity !== 0) {
      errorPosition += parityPos;
    }
  }

  return { errorPosition, parityChecks };
}

/**
 * Correct the error at the given position.
 * Returns a new encoded array with the bit flipped.
 */
export function correctError(encodedBits, errorPosition) {
  return encodedBits.map((bit, index) => ({
    ...bit,
    value: index + 1 === errorPosition ? (bit.value === 0 ? 1 : 0) : bit.value,
    corrected: index + 1 === errorPosition,
  }));
}

/**
 * Introduce an error by flipping one random data bit.
 * Returns the corrupted data and the position of the error.
 */
export function introduceError(encodedBits) {
  // Pick a random data bit to flip
  const dataBitIndices = encodedBits
    .map((bit, index) => (bit.type === 'data' ? index : -1))
    .filter((i) => i !== -1);

  const randomIndex =
    dataBitIndices[Math.floor(Math.random() * dataBitIndices.length)];

  const corrupted = encodedBits.map((bit, index) => ({
    ...bit,
    value: index === randomIndex ? (bit.value === 0 ? 1 : 0) : bit.value,
    isError: index === randomIndex,
  }));

  return {
    corrupted,
    errorPosition: randomIndex + 1, // 1-indexed
    originalValue: encodedBits[randomIndex].value,
  };
}

/**
 * Extract data bits from encoded hamming code (remove parity bits).
 */
export function extractDataBits(encodedBits) {
  return encodedBits.filter((b) => b.type === 'data').map((b) => b.value);
}
