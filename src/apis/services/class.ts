import { requestPostFactory } from '../request';


export const classServices = {
  list: requestPostFactory<API__Class.ListReq, API__Class.ListRes>('class/list'),
  create: requestPostFactory<API__Class.CreateReq, API__Class.CreateRes>('class/create'),
};
