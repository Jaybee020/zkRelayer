"use strict";
// validate address
// validate tx
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAddress = exports.isHexStr = void 0;
//regex for hex string
const hexStrRE = /^0x[0-9A-Fa-f]+$/;
//check if it is valid hex string
const isHexStr = (s) => {
    return s.length % 2 == 0 && hexStrRE.test(s);
};
exports.isHexStr = isHexStr;
const isValidAddress = (addr) => {
    return true;
};
exports.isValidAddress = isValidAddress;
