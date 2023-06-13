import { routePOST } from '#/routes/route';
import { teacherUpdate } from './update';
import { teacherCreate } from './create';

export default routePOST<API__Teacher.CreateOrUpdateReq, API__Teacher.CreateOrUpdateRes>((context) => {

  const body = context.request.body;

  if (typeof body.teacherId === 'number' && body.teacherId !== 0) {
    return teacherUpdate(body).then((res) => ({
      ...res,
      type: 'update',
    }));
  } else {
    return teacherCreate(body).then((res) => ({
      ...res,
      type: 'create',
    }));
  }
});
