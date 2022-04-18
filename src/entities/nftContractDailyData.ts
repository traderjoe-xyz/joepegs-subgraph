import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { NftContractDailyData } from "../../generated/schema";
import { BIG_INT_ZERO } from "../constants";
import { upsertNftContractData } from "./nftContractData";

const SECONDS_PER_DAY = 60 * 60 * 24;

export function upsertNftContractDailyData(
  nftContractDataId: string,
  timestamp: BigInt,
  currency: Bytes,
  price: BigInt
): NftContractDailyData {
  let dailyIntervalTimestamp =
    (timestamp.toI32() / SECONDS_PER_DAY) * SECONDS_PER_DAY;
  let nftContractDailyDataId =
    nftContractDataId + "-" + dailyIntervalTimestamp.toString();
  let nftContractDailyData = NftContractDailyData.load(nftContractDailyDataId);

  if (nftContractDailyData === null) {
    nftContractDailyData = new NftContractDailyData(nftContractDailyDataId);
    nftContractDailyData.timestamp = BigInt.fromI32(dailyIntervalTimestamp);
    nftContractDailyData.volumeAVAX = BIG_INT_ZERO;
    nftContractDailyData.contract = nftContractDataId;
  }
  // TODO: assume currency is always AVAX for now
  if (currency.toString() === 'WAVAX') {
    nftContractDailyData.volumeAVAX = nftContractDailyData.volumeAVAX.plus(price);
  }
  nftContractDailyData.save();

  return nftContractDailyData;
}
