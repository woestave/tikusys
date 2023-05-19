import { TeacherRole } from 'common-packages/constants/teacher-role';

export default function getRoleColor (role: TeacherRole) {
  switch (role) {
    case TeacherRole.super:
      return 'red';
    case TeacherRole.eduAdmin:
      return 'yellow';
    case TeacherRole.teacher:
      return 'white';
    case TeacherRole.visitor:
      return 'gray';
  }
}
