import { requestPostFactory } from '@/apis/request';

export const personnelServices = {
  // studentCreate: requestPostFactory<API__Student.CreateReq, API__Student.CreateRes>('personnel/student/create'),
  studentRemove: requestPostFactory<API__Student.RemoveReq, API__Student.RemoveRes>('personnel/student/remove'),
  studentList: requestPostFactory<API__Student.ListReq, API__Student.ListRes>('personnel/student/list'),
  changeStudentClass: requestPostFactory<API__Student.ChangeClassReq, API__Student.ChangeClassRes>('personnel/student/change-class'),
  studentCreateOrUpdate: requestPostFactory<API__Student.CreateOrUpdateReq, API__Student.CreateOrUpdateRes>('personnel/student/create-or-update'),


  // teacherCreate: requestPostFactory<API__Teacher.CreateReq, API__Teacher.CreateRes>('personnel/teacher/create'),
  teacherRemove: requestPostFactory<API__Teacher.RemoveReq, API__Teacher.RemoveRes>('personnel/teacher/remove'),
  teacherList: requestPostFactory<API__Teacher.ListReq, API__Teacher.ListRes>('personnel/teacher/list'),
  changeTeacherClass: requestPostFactory<API__Teacher.ChangeClassReq, API__Teacher.ChangeClassRes>('personnel/teacher/change-class'),
  changeTeacherRole: requestPostFactory<API__Teacher.ChangeRoleReq, API__Teacher.ChangeRoleRes>('personnel/teacher/change-role'),
  teacherCreateOrUpdate: requestPostFactory<API__Teacher.CreateOrUpdateReq, API__Teacher.CreateOrUpdateRes>('personnel/teacher/create-or-update'),
  teacherResetPassword: requestPostFactory<null, API__Teacher.TeacherUpdatePasswordRes>('personnel/teacher/reset-password'),
  teacherUpdatePassword: requestPostFactory<API__Teacher.TeacherUpdatePasswordReq, API__Teacher.TeacherUpdatePasswordRes>('personnel/teacher/update-password'),

  login: requestPostFactory<API__Teacher.LoginReq, API__Teacher.LoginRes>('personnel/teacher/login'),
  getUserInfo: requestPostFactory<null, API__Teacher.GetUserInfoRes>('personnel/teacher/get-user-info'),
};
