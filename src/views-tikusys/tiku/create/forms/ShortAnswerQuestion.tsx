/**
 * 添加试题的表单组件
 */
import { functionalComponent, useState } from '@/utils/functional-component';
import './ChoiceQuestion.less';
import { TikuCreateCommonForm } from './TikuCreateCommonForm';
import { ShortQuestionModel, getDefaultShortQuestionModel } from 'common-packages/models/question-model-short';
import { ExposeType } from './expose-type';
import useEditWatch from './use-edit-watch';


export const ShortAnswerQuestion = functionalComponent<{
  onSubmit: (q: ShortQuestionModel) => void;
  editingTiItem?: ShortQuestionModel | null;
}>((props) => {

  const getModel = () => ({ ...getDefaultShortQuestionModel(), scoreValue: 5, });

  const [model, setModel] = useState<ShortQuestionModel>(getModel());


  useEditWatch<ShortQuestionModel>(() => props.editingTiItem, setModel);

  function onSubmit (onValidate: () => Promise<void>) {
    onValidate().then(() => {
      props.onSubmit?.(model.value);
    });
  }

  function resetAll () {
    setModel(getModel());
  }

  const exposes: ExposeType = {
    resetAll,
    setModel,
    questionType: model.value.customQuestionInfo.questionType,
  } as ExposeType;
  props.context.expose(exposes);



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
