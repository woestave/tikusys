/**
 * 添加试题的表单组件
 */
import { functionalComponent, useState } from '@/utils/functional-component';
import './ChoiceQuestion.less';
import { TikuCreateCommonForm } from './TikuCreateCommonForm';
import { useNotificationPreset1 } from '@/hooks/use-notification-with-duration';
import { ShortQuestionModel, getDefaultShortQuestionModel } from '@/model/question-model-short';


export const ShortAnswerQuestion = functionalComponent(() => {

  const showSuccessNotification = useNotificationPreset1('新建选择题成功', '去试题列表看看');

  const getModel = () => ({ ...getDefaultShortQuestionModel(), scoreValue: 5, });

  const [model, setModel] = useState<ShortQuestionModel>(getModel());

  function onSubmit (onValidate: () => Promise<void>) {
    onValidate().then(() => {
      showSuccessNotification(5000);
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
          return null;
        },
      }}
    </TikuCreateCommonForm>
  );
});
