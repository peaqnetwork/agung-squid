import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v2 from './v2'

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   * Transfer succeeded.
   */
  get isV2(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '99bc4786247456e0d4a44373efe405e598bfadfac87a7c41b0a82a91296836c1'
  }

  /**
   * Transfer succeeded.
   */
  get asV2(): {from: v2.AccountId32, to: v2.AccountId32, amount: bigint} {
    assert(this.isV2)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV2
  }

  get asLatest(): {from: v2.AccountId32, to: v2.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV2
  }
}
