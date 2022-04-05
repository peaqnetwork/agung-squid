import * as ss58 from "@subsquid/ss58";
import {
  EventHandlerContext,
  Store,
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { Account, Transfer } from "./model";
import { BalancesTransferEvent } from "./types/events";

const processor = new SubstrateProcessor("peaq_accounts");

processor.setTypesBundle("polkadot");
processor.setBatchSize(500);
processor.setBlockRange({ from: 0 });

processor.setDataSource({
  archive: "https://peaq.indexer.gc.subsquid.io/v4/graphql",
  chain: "wss://wss.test.peaq.network",
});

processor.addEventHandler("balances.Transfer", async (ctx) => {
  const transfer = getTransferEvent(ctx);
  const tip = ctx.extrinsic?.tip || 0n;
  const from = ss58.codec("polkadot").encode(transfer.from);
  const to = ss58.codec("polkadot").encode(transfer.to);

  const fromAcc = await getOrCreate(ctx.store, Account, from);
  fromAcc.balance = fromAcc.balance || 0n;
  fromAcc.balance -= transfer.amount;
  fromAcc.balance -= tip;
  await ctx.store.save(fromAcc);

  const toAcc = await getOrCreate(ctx.store, Account, to);
  toAcc.balance = toAcc.balance || 0n;
  toAcc.balance += transfer.amount;
  await ctx.store.save(toAcc);

  await ctx.store.save(
    new Transfer({
      id: ctx.event.id,
      amount: transfer.amount,
      from: fromAcc?.id,
      to: toAcc?.id,
      extrinsicIndex: ctx.extrinsic?.indexInBlock,
      extrinsicHash: ctx.extrinsic?.hash,
      blockNumber: ctx.block.height,
      success: true,
      createdAt: new Date(ctx.block.timestamp),
    })
  );
});

processor.run();

interface TransferEvent {
  from: Uint8Array;
  to: Uint8Array;
  amount: bigint;
}

function getTransferEvent(ctx: EventHandlerContext): TransferEvent {
  const event = new BalancesTransferEvent(ctx);
  // if (event.isV1020) {
  //   const [from, to, amount] = event.asV1020;
  //   return { from, to, amount };
  // }
  // if (event.isV1050) {
  //   const [from, to, amount] = event.asV1050;
  //   return { from, to, amount };
  // }
  // if (event.isV9130) {
  //   const { from, to, amount } = event.asV9130;
  //   return { from, to, amount };
  // }
  return event.asLatest;
}

async function getOrCreate<T extends { id: string }>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> {
  let entity = await store.get<T>(EntityConstructor, {
    where: { id },
  });

  if (entity == null) {
    entity = new EntityConstructor();
    entity.id = id;
  }

  return entity;
}

type EntityConstructor<T> = {
  new (...args: any[]): T;
};
