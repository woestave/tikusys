import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export function classCreate (body: API__Class.CreateReq) {
  return Tables.Class.insert([{
    ...body,
    createTime: +new Date(),
    classTeacher: JSON.stringify(body.classTeacher),
  }]).exec().then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Class.CreateReq, API__Class.CreateRes>((context) => {
  return classCreate(context.body);
});
