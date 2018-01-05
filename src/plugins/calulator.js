const calSquareArea = l => l * l;
const calRectangleArea = (l1, l2) => l1 * l2;
const calCircleArea = r => Math.PI * r * r;

const toNumber = (string) => {
  const match = /([+-]?\d+)(.\d+)?/.exec(string);

  if (match[2] === null) {
    return parseInt(match[1]);
  }

  return parseFloat(match[0]);
};

const calArea = function calArea(shape, params, cb) {
  let area = 0;
  switch (shape) {
    case '正方形':
      area = calSquareArea(toNumber(params.l1));
      break;
    case '长方形':
      area = calRectangleArea(toNumber(params.l1), toNumber(params.l2));
      break;
    case '三角形':
      area = calRectangleArea(toNumber(params.l1), toNumber(params.l2)) / 2;
      break;
    case '圆形':
      area = calCircleArea(toNumber(params.l1));
  }
  cb(null, `${shape}的面积是 ${area}`);
};

const hasNumber = function hasNumber(count, cb) {
  cb(null, this.message.numbers.length === count);
};

export default {
  calArea,
  hasNumber,
};
