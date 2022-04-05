import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("text", {nullable: false})
  from!: string

  @Column_("text", {nullable: false})
  to!: string

  @Column_("integer", {nullable: false})
  extrinsicIndex!: number

  @Column_("text", {nullable: false})
  extrinsicHash!: string

  @Column_("integer", {nullable: false})
  blockNumber!: number

  @Column_("bool", {nullable: false})
  success!: boolean

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date
}
