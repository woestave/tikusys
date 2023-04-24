import { computed, ref } from 'vue';
import { FormInst, FormItemRule, NCheckbox, NCheckboxGroup, NForm, NFormItem, NIcon, NInput, NInputNumber, NP, NSelect, NSpace, NText, useMessage, } from 'naive-ui';

import { functionalComponent, useState } from '@/utils/functional-component';

import { Container, Draggable, DropResult } from 'vue3-smooth-dnd';
import { MoveSharp } from '@vicons/ionicons5';
import './SingleQuestion.less';
import { range } from 'ramda';


/**
 * 'ABCDEFG....XYZ'
 */
const aToZ = String.fromCharCode.apply(null, range(65, 91));
function getConditionTitle (index: number) {
  return aToZ[index];
}


function applyDrag<T> (arr: Array<T>, dragResult: DropResult) {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}


export default functionalComponent(() => {
  const formRef = ref<FormInst | null>(null);
  const message = useMessage();

  const model = ref({
      tName: null,
      totalScore: null,
      phase: null,
      allOptions: [],
      //
      datetimeValue: null,
      nestedValue: {
          path1: null,
          path2: null
      },
      switchValue: false,
      checkboxGroupValue: null,
      radioGroupValue: null,
      radioButtonGroupValue: null,
      inputNumberValue: null,
      timePickerValue: null,
      sliderValue: 0,
      transferValue: null
  });

  const generalOptions = ['groode', 'veli good', 'emazing', 'lidiculous'].map((v) => ({
      label: v,
      value: v,
  }));
  const rules = {
    inputValue: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入 inputValue'
    },
    textareaValue: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入 textareaValue'
    },
    selectValue: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择 selectValue'
    },
    multipleSelectValue: {
        type: 'array' as const,
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择 multipleSelectValue'
    },
    sliderValue: {
        validator(rule: FormItemRule, value: number) {
            return value > 50;
        },
        trigger: ['blur', 'change'],
        message: 'sliderValue 需要大于 50'
    },
  };
  function handleValidateButtonClick (e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
            message.success('验证成功');
        }
        else {
            console.log(errors);
            message.error('验证失败');
        }
    });
  }


  function __genChoice (label: string, right?: boolean) {
    return {
      label,
      right: !!right,
    };
  }
  const [choices, setChoices] = useState([
    __genChoice(''),
    __genChoice(''),
    __genChoice(''),
    __genChoice(''),
  ]);
  const choiceRightLength = computed(() => choices.value.filter(x => x.right).length);

  function onDrop (dropResult: DropResult) {
    setChoices(applyDrag(choices.value, dropResult));
  }



  return () => (
    <NForm
      class="tiku-create-single-question-form"
      ref={formRef}
      model={model}
      rules={rules}
      labelPlacement="left"
      labelWidth="auto"
      requireMarkPlacement="right-hanging"
      size="medium"
      style={{
        maxWidth: '640px'
      }}
    >
      <NFormItem label="试题名称" path="inputValue">
        <NInput
          v-model:value={model.value.tName}
          placeholder="请输入试题名称"
          type="textarea"
          autosize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
      </NFormItem>
      <NFormItem label="分值" path="all">
        <NInputNumber v-model:value={model.value.totalScore} />
      </NFormItem>
      <NFormItem label="所属阶段" path="phase">
        <NSelect
          v-model:value={model.value.phase}
          placeholder="Select"
          options={generalOptions}
        />
      </NFormItem>
      <Container
        class="drag-area"
        dragHandleSelector=".draggable-handle"
        lockAxis="y"
        onDrop={onDrop}
      >
        <NFormItem class="drag-header" showFeedback={false} label={'选项'}>
          <div class="drag-header-right">
            <span>正确答案</span>
            <span>{choiceRightLength.value > 1 ? '(多选题)' : choiceRightLength.value === 1 ? '(单选题)' : ''}</span>
          </div>
        </NFormItem>
        {choices.value.map((x, i) => (
          <Draggable key={i}>
            <NFormItem label={'选项' + getConditionTitle(i)} path="phase">
              <NInput
                value={x.label}
                placeholder={i === 0 ? '请输入选项内容' : '...'}
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
      <NFormItem label="Multiple Select" path="multipleSelectValue">
        <n-input
          v-model:value={model.value.tName}
          placeholder="请输入试题名称"
          type="textarea"
          autosize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
      </NFormItem>

      <NFormItem label="正确答案" path="checkboxGroupValue">
        <NCheckboxGroup v-model:value={model.value.checkboxGroupValue}>
          <NSpace>
            <NCheckbox value="Option 1">
              Option 1
            </NCheckbox>
            <NCheckbox value="Option 2">
              Option 2
            </NCheckbox>
            <NCheckbox value="Option 3">
              Option 3
            </NCheckbox>
          </NSpace>
        </NCheckboxGroup>
      </NFormItem>

      <div style="display: flex; justify-content: flex-end">
        <n-button round type="primary" onClick={handleValidateButtonClick}>
          验证
        </n-button>
      </div>
    </NForm>
  );
});
