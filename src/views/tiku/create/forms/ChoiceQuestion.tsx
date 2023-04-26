/**
 * 添加试题的表单组件
 */
import { computed, ref } from 'vue';
import {
  NCheckbox,
  NFormItem,
  NIcon,
  NInput,
} from 'naive-ui';

import { functionalComponent, useState } from '@/utils/functional-component';

import { Container, Draggable, DropResult } from 'vue3-smooth-dnd';
import { MoveSharp } from '@vicons/ionicons5';
import './ChoiceQuestion.less';
import { prop } from 'ramda';
import { TikuCreateCommonForm } from './TikuCreateCommonForm';
import { useNotificationPreset1 } from '@/hooks/use-notification-with-duration';
import { getAToZ } from '@/utils/a-to-z';
import { ChoiceQuestionModel, getDefaultChoiceQuestionModel, getDefaultChoises } from '@/model/question-model-choice';


const CONFIGS = {
  choiceLabel: {
    maxLength: 30,
    minLength: 1,
  },
};




export const ChoiceQuestion = functionalComponent(() => {

  const showSuccessNotification = useNotificationPreset1('新建选择题成功', '去试题列表看看');


  const [model, setModel] = useState<ChoiceQuestionModel>(getDefaultChoiceQuestionModel());

  function resetModel () {
    setModel(getDefaultChoiceQuestionModel());
  }
  function resetChoices () {
    model.value.customQuestionInfo.choices = getDefaultChoises();
  }
  function resetAll () {
    resetModel();
    resetChoices();
    containerKey.value++;
  }

  /**
   * 自定义验证
   */
  function customValidate () {
    return model.value.customQuestionInfo.choices.some(prop('right'));
  }
  function onSubmit (onValidate: () => Promise<void>) {
    console.log(model.value.customQuestionInfo.choices);
    onValidate().then(() => {
      showSuccessNotification(5000);
    });
  }


  const choiceRightLength = computed(() => model.value.customQuestionInfo.choices.filter(x => x.right).length);

  const containerKey = ref(0);

  function onDragStart () {
    //
  }
  function onDrop (dropResult: DropResult) {
    const choices = model.value.customQuestionInfo.choices;
    const removed = choices[dropResult.removedIndex - 1];
    const arr = choices.filter(x => x !== removed);
    arr.splice(dropResult.addedIndex - 1, 0, removed);
    model.value.customQuestionInfo.choices = (arr);
    containerKey.value++;
  }



  return () => (
    <TikuCreateCommonForm
      class="choice-question-form"
      modelValue={model.value}
      key={'choice-question-form' + containerKey.value}
      onSubmit={onSubmit}
      onClear={resetAll}
    >
      {{
        customQuestionInfo () {
          return (
            <Container
              class="drag-area"
              dragHandleSelector=".draggable-handle"
              lockAxis="y"
              onDragStart={onDragStart}
              onDrop={onDrop}
            >
              <NFormItem
                class="drag-header"
                path="customQuestionInfo.choices"
                label={'选项'}
                showFeedback={false}
                rule={{ validator: customValidate, }}
              >
                <div class="drag-header-right">
                  <span>
                    <span class="have-no-right-err" v-show={!customValidate()}>(至少指定一项)</span>
                    <span>正确答案</span>
                    {/* <span class="have-no-right-err">*</span> */}
                  </span>
                  <span>
                    <If condition={choiceRightLength.value > 1}>(多选题)</If>
                    <ElseIf condition={choiceRightLength.value === 1}>(单选题)</ElseIf>
                  </span>
                </div>
              </NFormItem>
              {model.value.customQuestionInfo.choices.map((x, i) => (
                <Draggable key={i}>
                  <NFormItem
                    label={'选项' + getAToZ(i)}
                    path={`customQuestionInfo.choices[${i}].label`}
                    rule={{
                      max: CONFIGS.choiceLabel.maxLength,
                      min: CONFIGS.choiceLabel.minLength,
                      required: true,
                      trigger: ['blur', 'input', 'change'],
                      message: `请输入不超过${CONFIGS.choiceLabel.maxLength}字的选项内容`,
                    }}
                  >
                    <NInput
                      value={x.label}
                      maxlength={CONFIGS.choiceLabel.maxLength}
                      minlength={CONFIGS.choiceLabel.minLength}
                      showCount
                      placeholder="请输入选项内容"
                      onUpdateValue={(newVal) => {
                        x.label = newVal;
                      }}
                    />
                    <NIcon size={16} class="draggable-handle"><MoveSharp /></NIcon>
                    <NCheckbox class="drag-choice-right" checked={x.right} onUpdateChecked={newVal => {
                      x.right = newVal;
                    }} />
                  </NFormItem>
                </Draggable>
              ))}
            </Container>
          );
        },
      }}
    </TikuCreateCommonForm>
  );
});
