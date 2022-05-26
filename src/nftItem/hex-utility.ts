const Web3 = require("web3");
const compiledContractABI = require("../../Hex.abi");
const hexAddr = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39";
export class HexUtility {
public HEARTS_UINT_SHIFT:bigint = 72n;
public HEARTS_MASK:bigint = (1n << this.HEARTS_UINT_SHIFT) - 1n;
public SATS_UINT_SHIFT:bigint = 56n;
public SATS_MASK:bigint = (1n << this.SATS_UINT_SHIFT) - 1n;

public decodeDailyData = (encDay:any):any => {
  let v = BigInt(encDay);
  let payout = v & this.HEARTS_MASK;
  v = v >> this.HEARTS_UINT_SHIFT;
  let shares = v & this.HEARTS_MASK;
  v = v >> this.HEARTS_UINT_SHIFT;
  let sats = v & this.SATS_MASK;
  return { payout, shares, sats };
};

public interestForRange = (dailyData:any, myShares:any):any => {
  return dailyData.reduce((s:any, d:any) => s + this.interestForDay(d, myShares), 0n);
};

public interestForDay = (dayObj:any, myShares:any):any => {
  if (dayObj.shares == 0n) return 0n;
  const test = (myShares * dayObj.payout) / dayObj.shares;
  return test;
};

public getDataRange = async (hex:any, b:any, e:any) => {
  const dataRange = await hex.methods.dailyDataRange(b, e).call();
  const data = [];
  for (let i = 0; i < dataRange.length; i++) {
    data.push(this.decodeDailyData(dataRange[i]));
  }
  return data;
};

public getInterest = async (hex:any, served_days:any, t_shares:any) => {
  const end_day = await hex.methods.currentDay().call();
  const begin_day = end_day - served_days;
  const bigIntTshare = BigInt(Math.floor(t_shares * 10e12));
  const range_data = await this.getDataRange(hex, begin_day, end_day);
  const result = await this.interestForRange(range_data, bigIntTshare);
  const hexInterest = Number(result) / 10e8;
  return hexInterest;
};

public getEmergencyHexStakeAmount = async (
  days_served:any,
  days_stakedfor:any,
  interest_accum:any,
  pricipal_amount:any,
  t_share:any,
  hex:any
) => {
  let hex_received;
  if (days_stakedfor < 180) {
    if (days_served == 0) {
      let penalty = interest_accum * 90;
      hex_received = pricipal_amount - penalty;
    } else if (days_served < 90) {
      let penalty = (interest_accum * 90) / days_served;
      hex_received = pricipal_amount - penalty + interest_accum;
    } else if (days_served == 90) {
      hex_received = pricipal_amount;
    } else {
      const half_penalty = await this.getInterest(hex, days_stakedfor / 2, t_share);
      const interest_received = interest_accum - half_penalty;
      hex_received = pricipal_amount + interest_received;
    }
  } else {
    if (days_served == 0) {
      let penalty = interest_accum * (0.5 * days_stakedfor);
      hex_received = pricipal_amount - penalty;
    } else if (days_served < days_stakedfor / 2) {
      let penalty = (interest_accum * (0.5 * days_stakedfor)) / days_served;
      hex_received = pricipal_amount - penalty + interest_accum;
    } else if (days_served == days_stakedfor / 2) {
      hex_received = pricipal_amount;
    } else {
      const half_penalty = await this.getInterest(hex, days_stakedfor / 2, t_share);
      // console.log(half_penalty);
      const interest_received = interest_accum - half_penalty;
      hex_received = pricipal_amount + interest_received;
    }
  }
  // console.log("hex", hex_received);
  if (hex_received < 0) {
    return 0;
  } else {
    return hex_received;
  }
  };
}

// console.log(
//   getEmergencyHexStakeAmount(850, 1600, 407.301031527, 702.66, 0.1).then(
//     console.log
//   )
// );