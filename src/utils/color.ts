function colorToArray(color: number): number[] {
  return (
    color
      .toString(16)
      .padStart(6, '0')
      .match(/(\d|\w){2}/gi)
      ?.map((v) => parseInt(v, 16) / 255) || [0, 0, 0]
  );
}

export { colorToArray };
