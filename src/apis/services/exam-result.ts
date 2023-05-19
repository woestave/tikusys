import { requestPostFactory } from '../request';


export const examResultServices = {
  create: requestPostFactory<API__ExamResult.CreateReq, API__ExamResult.CreateRes>('exam-result/create'),
};
