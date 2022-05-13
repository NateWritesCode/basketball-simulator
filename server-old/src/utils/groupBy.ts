export default (array: any[], key: string) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue.color] = result[currentValue.color] || []).push(
      currentValue
    );
    console.log(result);
    return result;
  }, {});
};
