import { requestPostFactory } from '../request';


export const examinationServices = {
  createOrUpdate: requestPostFactory<API__Examination.CreateOrUpdateReq, API__Examination.CreateOrUpdateRes>('examination/create-or-update'),
  remove: requestPostFactory<API__Examination.RemoveReq, API__Examination.RemoveRes>('examination/remove'),
  list: requestPostFactory<API__Examination.ListReq, API__Examination.ListRes>('examination/list'),
};
