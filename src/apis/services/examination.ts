import { requestPostFactory } from '../request';


export const examinationServices = {
  create: requestPostFactory<API__Examination.CreateReq, API__Examination.CreateRes>('examination/create'),
  list: requestPostFactory<API__Examination.ListReq, API__Examination.ListRes>('examination/list'),
};
