import { requestPostFactory } from '../request';


export const examResultServices = {
  create: requestPostFactory<API__ExamResult.CreateReq, API__ExamResult.CreateRes>('exam-result/create'),
  getTeacherCorrecting: requestPostFactory<API__ExamResult.GetTeacherCorrectingReq, API__ExamResult.GetTeacherCorrectingRes>('exam-result/get-teacher-correcting'),
  saveStudentExamResult: requestPostFactory<API__ExamResult.SaveStudentExamResultReq, API__ExamResult.SaveStudentExamResultRes>('exam-result/save-student-exam-result'),
};
