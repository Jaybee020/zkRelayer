// validate address
// validate tx

import {} from "ethers";
//regex for hex string
const hexStrRE = /^0x[0-9A-Fa-f]+$/;

//check if it is valid hex string
export const isHexStr = (s: string) => {
  return s.length % 2 == 0 && hexStrRE.test(s);
};

export const isValidAddress = (addr: string) => {
  return true;
};
