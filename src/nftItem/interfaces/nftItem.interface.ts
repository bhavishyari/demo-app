import { Document } from 'mongoose';

export interface INFTItem extends Document {
  tokenId?: string;
  blockchainIndex?: number;
  contract?: string;
  image?: string;
  animation_url?: string;
  title?: string,  
  meta?: object;
  ownerAddress?: string;
  stakedMeta?: object;
  price?: number;
  status?: string;
  updatedAt?: Date;
  createdAt?: Date;
}
