import { requestPostFactory } from '../request';


export const exampaperServices = {
  createOrUpdate: requestPostFactory<API__Exampaper.CreateOrUpdateReq, API__Exampaper.CreateOrUpdateRes>('exampaper/create-or-update'),
  list: requestPostFactory<API__Exampaper.ListReq, API__Exampaper.ListRes>('exampaper/list'),
  getById: requestPostFactory<API__Exampaper.GetByIdReq, API__Exampaper.GetByIdRes>('exampaper/get-by-id'),
};
