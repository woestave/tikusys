import { SQL_CURD } from '.';




export const Tables = {
  Tiku: SQL_CURD.of<API__Tiku.TableStruct__Tiku>('tiku'),
  Exampaper: SQL_CURD.of<API__Exampaper.TableStruct__Exampaper>('exampaper'),
  Examination: SQL_CURD.of<API__Examination.TableStruct__Examination>('examination'),
  Class: SQL_CURD.of<API__Class.TableStruct__Class>('class'),
  ClassType: SQL_CURD.of<API__ClassType.TableStruct__ClassType>('class_type'),
  Relation__Exampaper__Tiku: SQL_CURD.of<API__Relation__Exampaper__Tiku.TableStruct__Relation__Exampaper__Tiku>('relation_exampaper_tiku'),
  Student: SQL_CURD.of<API__Student.TableStruct__Student>('student'),
  Teacher: SQL_CURD.of<API__Teacher.TableStruct__Teacher>('teacher'),
  ExamResult: SQL_CURD.of<API__ExamResult.TableStruct__ExamResult>('exam_result'),
  // Major: SQL_CURD.of<API__Major.TableStruct__Major>('major'),
} as const;

