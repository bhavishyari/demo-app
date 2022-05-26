import { Routes } from 'nest-router';

import { NFTItemModule } from './nftItem/nftItem.module';
import { AuthModule } from './auth/auth.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/nft', module: NFTItemModule },
      { path: '/auth', module: AuthModule},
    ],
  },
];
