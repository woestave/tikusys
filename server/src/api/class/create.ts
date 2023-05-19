import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export default routePOST<API__Class.CreateReq, API__Class.CreateRes>((context) => {

  const body = context.request.body;

  return Tables.Class.insert([{
    ...body,
    createTime: +new Date(),
    classTeacher: JSON.stringify(body.classTeacher),
  }]).exec().then((res) => ({ succ: 1, result: res, }));
});
