export function gerarULID() {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; 

  const encodeTime = (now, len) => {
    let str = '';
    for (let i = len - 1; i >= 0; i--) {
      const mod = now % 32;
      str = ENCODING[mod] + str;
      now = Math.floor(now / 32);
    }
    return str;
  };

  const encodeRandom = (len) => {
    let str = '';
    for (let i = 0; i < len; i++) {
      const rand = Math.floor(Math.random() * 32);
      str += ENCODING[rand];
    }
    return str;
  };

  const time = Date.now();
  return encodeTime(time, 10) + encodeRandom(16);
}
