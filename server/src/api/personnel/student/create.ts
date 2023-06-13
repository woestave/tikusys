import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { crypto_md5 } from '#/utils/md5';

export function studentCreate (body: API__Student.CreateReq) {
  function genDefaultTeacherPwd () {
    return crypto_md5(body.studentIdCard);
  }

  return Tables.Student.insert([
    {
      ...body,
      studentPwd: genDefaultTeacherPwd(),
      studentCreateTime: +new Date(),
    }
  ]).exec().then((res) => ({
    succ: 1 as 1,
  }));
}

export default routePOST<API__Student.CreateReq, API__Student.CreateRes>((context) => {
  const body = context.request.body;
  return studentCreate(body);
});
