import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { objOf } from 'ramda';
import crypto from 'crypto';
import { crypto_md5 } from '#/utils/md5';


export function teacherCreate (body: API__Teacher.CreateReq) {
  function genDefaultTeacherPwd () {
    return crypto_md5(body.teacherIdCard);
  }

  return Tables.Teacher.insert([
    {
      ...body,
      teacherPwd: genDefaultTeacherPwd(),
      teacherCreateTime: +new Date(),
    }
  ]).exec().then((res) => ({
    succ: 1 as const,
  }));
}


export default routePOST<API__Teacher.CreateReq, API__Teacher.CreateRes>((context) => {
  return teacherCreate(context.request.body);
});
