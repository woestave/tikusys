import { routePOST } from '#/routes/route';
import { studentUpdate } from './update';
import { studentCreate } from './create';

export default routePOST<API__Student.CreateOrUpdateReq, API__Student.CreateOrUpdateRes>((context) => {

  const body = context.request.body;

  if (typeof body.studentId === 'number' && body.studentId !== 0) {
    return studentUpdate(body).then((res) => ({
      ...res,
      type: 'update',
    }));
  } else {
    return studentCreate(body).then((res) => ({
      ...res,
      type: 'create',
    }));
  }
});
