/**
 * 添加试题的表单组件
 */
import { functionalComponent, useState } from '@/utils/functional-component';
import './ChoiceQuestion.less';
import { TikuCreateCommonForm } from './TikuCreateCommonForm';
import { useNotificationPreset1 } from '@/hooks/use-notification-with-duration';
import { ShortQuestionModel, getDefaultShortQuestionModel } from 'common-packages/models/question-model-short';
import { tikuServices } from '@/apis/services/tiku';
import { globalLoading } from '@/utils/create-loading';


export const ShortAnswerQuestion = functionalComponent(() => {

  const showSuccessNotification = useNotificationPreset1('新建选择题成功', '去试题列表看看');

  const getModel = () => ({ ...getDefaultShortQuestionModel(), scoreValue: 5, });

  const [model, setModel] = useState<ShortQuestionModel>(getModel());


  const loading = globalLoading.useCreateLoadingKey({ name: '正在添加简答题' });

  function onSubmit (onValidate: () => Promise<void>) {
    onValidate().then(() => {
      loading.show();
      tikuServices.create({
        question: model.value,
      }).then((res) => {
        console.log('添加成功', res);
        resetAll();
        showSuccessNotification(5000);
      }).catch((err) => {
        console.log('添加失败', err);
      }).finally(loading.hide);
    });
  }

  function resetAll () {
    setModel(getModel());
  }



  return () => (
    <TikuCreateCommonForm
      class="short-answer-question-form"
      key="short-answer-question-form"
      modelValue={model.value}
      onSubmit={onSubmit}
      onClear={resetAll}
    >
      {{
        customQuestionInfo () {
          return (null);
        },
      }}
    </TikuCreateCommonForm>
  );
});
