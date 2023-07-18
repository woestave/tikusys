/**
 * 添加试题的表单组件
 */
import { computed, ref } from 'vue';
import {
  NButton,
  NCheckbox,
  NFormItem,
  NIcon,
  NInput,
  NRow,
} from 'naive-ui';

import { functionalComponent, useState } from '@/utils/functional-component';

import { Container, Draggable, DropResult } from 'vue3-smooth-dnd';
import { MoveSharp } from '@vicons/ionicons5';
import './ChoiceQuestion.less';
import { prop } from 'ramda';
import { TikuCreateCommonForm } from './TikuCreateCommonForm';
import { getAToZ } from '@/utils/a-to-z';
import { ChoiceQuestionModel, genChoiceModel, getDefaultChoiceQuestionModel, getDefaultChoises } from 'common-packages/models/question-model-choice';
import { DeleteFilled } from '@vicons/material';
import { ExposeType } from './expose-type';
import useEditWatch from './use-edit-watch';


const CONFIGS = {
  choiceLabel: {
    maxLength: 200,
    minLength: 1,
  },
};



export interface ChoiceQuestionProps {
  onSubmit: (model: ChoiceQuestionModel) => void;
  editingTiItem?: ChoiceQuestionModel | null;
}

export const ChoiceQuestion = functionalComponent<ChoiceQuestionProps>((props) => {


  const [model, setModel] = useState<ChoiceQuestionModel>(getDefaultChoiceQuestionModel());


  function resetModel () {
    setModel({
      ...getDefaultChoiceQuestionModel(),
      major: model.value.major,
      scoreValue: model.value.scoreValue,
      phase: model.value.phase,
    });
  }
  function resetChoices () {
    model.value.customQuestionInfo.choices = getDefaultChoises();
  }
  function resetAll () {
    resetModel();
    resetChoices();
    containerKey.value++;
  }

  useEditWatch<ChoiceQuestionModel>(() => props.editingTiItem, setModel);

  const exposes: ExposeType = {
    resetAll,
    setModel,
    questionType: model.value.customQuestionInfo.questionType,
  } as ExposeType;
  props.context.expose(exposes);

  /**
   * 自定义验证
   */
  function customValidate () {
    return model.value.customQuestionInfo.choices.some(prop('right'));
  }
  function onSubmit (onValidate: () => Promise<void>) {
    onValidate().then(() => {
      props.onSubmit?.(model.value);
    });
  }

  function onRemoveChoice (index: number) {
    const target = model.value.customQuestionInfo.choices[index];
    target && model.value.customQuestionInfo.choices.splice(index, 1);
  }
  function onAddOneChoice () {
    model.value.customQuestionInfo.choices.push(genChoiceModel(''));
    containerKey.value++;
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
                      whitespace: true,
                      required: true,
                      trigger: ['blur', 'input'],
                      message: `请输入选项内容`,
                    }}
                  >
                    <NInput
                      value={x.label}
                      type="textarea"
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
                      // const rightLength = model.value.customQuestionInfo.choices.filter(y => y.right).length;
                      // if (rightLength === 1) {
                      //   model.value.customQuestionInfo.choiceQuestionSubtype = ChoiceQuestionSubtype.single;
                      // } else if (rightLength > 1) {
                      //   model.value.customQuestionInfo.choiceQuestionSubtype = ChoiceQuestionSubtype.multi;
                      // } else {
                      //   model.value.customQuestionInfo.choiceQuestionSubtype = ChoiceQuestionSubtype.unset;
                      // }
                    }} />
                    <div
                      onClick={() => onRemoveChoice(i)}
                      v-show={model.value.customQuestionInfo.choices.length > 2}
                      style="margin-left: 24px;"
                    >
                      <NIcon>
                        <DeleteFilled />
                      </NIcon>
                    </div>
                  </NFormItem>
                </Draggable>
              ))}
              <NRow
                v-show={model.value.customQuestionInfo.choices.length < 4}
                style="padding-bottom: 24px;" justifyContent="flex-end"
              >
                <NButton text onClick={onAddOneChoice}>新增一行</NButton>
              </NRow>
            </Container>
          );
        },
      }}
    </TikuCreateCommonForm>
  );
});
