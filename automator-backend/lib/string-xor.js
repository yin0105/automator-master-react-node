function stringXOR(a, b) {
  if (a.length < b.length) {
    [a, b] = [b, a];
  }
  console.log("a => ", a);
  console.log("b => ", b);
  const authcode = [...a]
    .map((aChar, index) => {
      const bChar = b[index] || '';
      return String.fromCharCode(aChar.charCodeAt() ^ bChar.charCodeAt());
    })
    .join('');
  console.log("auth => ", authcode);
  return authcode;
}

module.exports = stringXOR;
