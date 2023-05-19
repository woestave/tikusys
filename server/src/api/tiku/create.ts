import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export default routePOST<API__Tiku.CreateReq, API__Tiku.CreateRes>((context) => {

  const body = context.request.body;
  const question = body?.question;

  const data: typeof Tables.Tiku['StructIn'] = {
    ...question,
    customQuestionInfo: JSON.stringify(context.request.body?.question.customQuestionInfo),
    createBy: 1,
    createTime: +new Date(),
  };

  // return {
  //   succ: 1, res: Tables
  //   .Tiku
  //   .insert([data])
  //   .sql(),
  //   x: data,
  // };

  return Tables
    .Tiku
    .insert([data])
    .exec()
    .then((res) => ({ succ: 1, res }));
});
