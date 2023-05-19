import { requestPostFactory } from '../request';

const examsysServices = {
  getUserInfo: requestPostFactory<null, API__Examsys__User.GetUserInfoRes>('examsys/get-user-info'),
  login: requestPostFactory<API__Examsys__User.LoginReq, API__Examsys__User.LoginRes>('examsys/login'),
  logout: requestPostFactory<null, API__Examsys__User.LogoutRes>('examsys/logout'),
  getMyExam: requestPostFactory<null, API__Examsys__User.GetMyExamRes>('examsys/get-my-exam'),
  getExamDetail: requestPostFactory<API__Examsys__User.GetExamDetailReq, API__Examsys__User.GetExamDetailRes>('examsys/get-exam-detail'),
  getTiListByPaperId: requestPostFactory<API__Examsys__User.GetTiListByPaperIdReq, API__Examsys__User.GetTiListByPaperIdRes>('examsys/get-ti-list-by-paper-id'),
  getMyExamResult: requestPostFactory<API__Examsys__User.GetMyExamResultReq, API__Examsys__User.GetMyExamResultRes>('examsys/get-my-exam-result'),
  removeMyExamResult: requestPostFactory<API__Examsys__User.RemoveMyExamResultReq, API__Examsys__User.RemoveMyExamResultRes>('examsys/remove-my-exam-result'),
};

export default examsysServices;
