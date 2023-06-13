import { requestPostFactory } from '../request';



export const tikuServices = {
  // create: requestPostFactory<API__Tiku.CreateReq, API__Tiku.CreateRes>('tiku/create'),
  createOrUpdate: requestPostFactory<API__Tiku.CreateOrUpdateReq, API__Tiku.CreateOrUpdateRes>('tiku/create-or-update'),
  remove: requestPostFactory<API__Tiku.RemoveReq, API__Tiku.RemoveRes>('tiku/remove'),
  getById: requestPostFactory<API__Tiku.GetByIdReq, API__Tiku.GetByIdRes>('tiku/get-by-id'),
  list: requestPostFactory<API__Tiku.ListReq, API__Tiku.ListRes>('tiku/list'),
};
