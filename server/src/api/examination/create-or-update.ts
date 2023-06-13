import { routePOST } from '#/routes/route';
import { examinationUpdate } from './update';
import { examinationCreate } from './create';

export default routePOST<API__Examination.CreateOrUpdateReq, API__Examination.CreateOrUpdateRes>((context) => {

  const body = context.request.body;
  const userInfo = context.state.user as API__Teacher.GetUserInfoRes['userInfo'];

  if (typeof body.id === 'number' && body.id !== 0) {
    return examinationUpdate(body).then((res) => ({
      ...res,
      type: 'update',
    }));
  } else {
    return examinationCreate(body, userInfo).then((res) => ({
      ...res,
      type: 'create',
    }));
  }
});
