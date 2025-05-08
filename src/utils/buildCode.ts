export const generateTurnCode = (prefix: string, sequence: number) => {
  const paddedSequence = String(sequence).padStart(3, "0");
  return `${prefix}-${paddedSequence}`;
};
