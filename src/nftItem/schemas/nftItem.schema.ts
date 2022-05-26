import { Schema } from 'mongoose';

export const NFTItemSchema = new Schema({
  tokenId: { type: String },
  blockchainIndex: { type: Number, default: null },
  contract: { type: String },
  title: { type: String, default: "" },
  meta: { type: Schema.Types.Mixed, default: null }, // name, discription, content
  ownerAddress: { type: String, default: null },
  stakedMeta: { type: Schema.Types.Mixed, default: null },
  price: { type: Number, default: 0 },
  image: { type: String, default: "" },
  animation_url: { type: String, default: "" },
  status: {
    type: String,
    enum: [
      'LISTED',
      'DELIST',
      'ACTIVE',
      'SLOD'
    ],
    default: 'ACTIVE'
  },
  updatedAt: { type: Date, select: false },
  createdAt: { type: Date, select: false },
  __v: { type: Number, select: false },

}, { timestamps: true });
