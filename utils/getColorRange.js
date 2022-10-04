import tinycolor from 'tinycolor2';

export default function getColorRange(colors) {
  let newColorRange = [...colors];
  colors.forEach((color) => {
    let complements = tinycolor(color).splitcomplement();
    complements.forEach((complement, i) => {
      //first color in complement is same as original, so skip
      if (i > 0) {newColorRange.push(complement.toHexString())};
    });
  });
  return newColorRange;
}
