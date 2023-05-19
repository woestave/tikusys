import { requestPostFactory } from '../request';



export const tikuServices = {
  create: requestPostFactory<API__Tiku.CreateReq, API__Tiku.CreateRes>('tiku/create'),
  list: requestPostFactory<API__Tiku.ListReq, API__Tiku.ListRes>('tiku/list'),
};
