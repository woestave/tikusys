import { requestPostFactory } from '../request';


export const classTypeServices = {
  list: requestPostFactory<API__ClassType.ListReq, API__ClassType.ListRes>('class-type/list'),
};
