import { requestPostFactory } from '@/apis/request';

export const personnelServices = {
  studentCreate: requestPostFactory<API__Student.CreateReq, API__Student.CreateRes>('personnel/student/create'),
  studentList: requestPostFactory<null, API__Student.ListRes>('personnel/student/list'),
  changeStudentClass: requestPostFactory<API__Student.ChangeClassReq, API__Student.ChangeClassRes>('personnel/student/change-class'),

  teacherCreate: requestPostFactory<API__Teacher.CreateReq, API__Teacher.CreateRes>('personnel/teacher/create'),
  teacherList: requestPostFactory<null, API__Teacher.ListRes>('personnel/teacher/list'),
  changeTeacherClass: requestPostFactory<API__Teacher.ChangeClassReq, API__Teacher.ChangeClassRes>('personnel/teacher/change-class'),
  changeTeacherRole: requestPostFactory<API__Teacher.ChangeRoleReq, API__Teacher.ChangeRoleRes>('personnel/teacher/change-role'),

  login: requestPostFactory<API__Teacher.LoginReq, API__Teacher.LoginRes>('personnel/teacher/login'),
  getUserInfo: requestPostFactory<null, API__Teacher.GetUserInfoRes>('personnel/teacher/get-user-info'),
};
