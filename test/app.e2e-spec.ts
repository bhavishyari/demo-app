import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NFTItemModule } from '../src/nftItem/nftItem.module'

describe('AppController (e2e)', () => {
  let app;
  let nftItemId: string;
  let ownerAddress: string;



  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, NFTItemModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // NFT Item API Test Cases
  it('Create NFTItem ', async () => {
    var data = await request(app.getHttpServer())
      .post('/v1/nft')
      .send({
        "tokenId": "5",
        "contract": "Item 5",
        "title": "Item Title 5",
        "ownerAddress": "ownerAddress5",
        "meta": {
          "content": {
            "@type": "IMAGE",
            "url": "https://lh3.googleusercontent.com/VA5QyDo81Al55kWMt0nXnmnSCqH_GwAFlcdDiiKTnDS1uaJXxwri0YoVZQv4kFoKVcekzcpyi-JCmk4G5r0B5LtbOizLhJGlxtxG-w",
            "representation": "ORIGINAL",
            "mimeType": "image/jpeg",
            "size": 68125,
            "width": 512,
            "height": 384
          },
          "name": "name",
          "discription": "discription"
        }
      })
      .expect(201)

    nftItemId = data.body.item._id;
    ownerAddress = data.body.item.ownerAddress;
  });



  it('Get All Listed Items ', async () => {
    var data = await request(app.getHttpServer())
      .get('/v1/nft')
      .expect(200)

      expect(data.body.items).toEqual(
        expect.arrayContaining([]),
      );
  });

  it('Get NFTItems By OwnerAddress ', async() => {
    var data = await request(app.getHttpServer())
      .get('/v1/nft/owner-address/' + ownerAddress)
      .expect(200)

      expect(data.body.items).toEqual(
        expect.arrayContaining([]),
      );

  });

  it('Update NFTItem Price ', async() => {
    var data = await request(app.getHttpServer())
      .put('/v1/nft/' + nftItemId)
      .send({
        price: 10
      })
      .expect(200)
      expect(data.body.item.price).toEqual(10);
  });

  it('Update NFTItem status to sold', () => {
    return request(app.getHttpServer())
      .put('/v1/nft/sold/' + nftItemId)
      .expect(200)
  });
});

