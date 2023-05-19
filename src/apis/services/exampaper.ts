import { requestPostFactory } from '../request';


export const exampaperServices = {
  create: requestPostFactory<API__Exampaper.CreateReq, API__Exampaper.CreateRes>('exampaper/create'),
  list: requestPostFactory<API__Exampaper.ListReq, API__Exampaper.ListRes>('exampaper/list'),
};
