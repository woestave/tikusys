/**
 * 添加试题的表单组件
 */
import { ref } from 'vue';
import {
  FormInst,
  FormRules,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  useMessage,
} from 'naive-ui';

import { functionalComponent } from '@/utils/functional-component';
import './TikuCreateCommonForm.less';
import { BaseCustomQuestionInfo, QuestionModel } from '@/model/question-model-base';




const CONFIGS = {
  nName: {
    maxLength: 99,
    minLength: 1,
  },
};




export interface TikuCreateCommonFormProps<Q extends BaseCustomQuestionInfo> {
  class?: any;
  modelValue: QuestionModel<Q>;
  // customQuestionInfo: Q;
  onSubmit: (onValidate: () => Promise<void>) => void;
  onSubmitPreventDefault?: boolean;
  onClear?: () => void;
}

// type R = <T>(props: Readonly<TikuCreateCommonFormProps<T>>) => JSX.Element;
export const TikuCreateCommonForm = functionalComponent<TikuCreateCommonFormProps<any>>(function (props) {
  const formRef = ref<FormInst | null>(null);

  const message = useMessage();



  const generalOptions = ['groode', 'veli good', 'emazing', 'lidiculous'].map((v) => ({
      label: v,
      value: v,
  }));
  const rules: FormRules = {
    tName: {
        required: true,
        trigger: ['blur', 'input'],
        min: CONFIGS.nName.minLength,
        max: CONFIGS.nName.maxLength,
        message: '请输入试题名称',
    },
    scoreValue: {
        required: true,
        type: 'number',
        trigger: ['blur', 'input'],
        message: '请输入整数分值',
    },
    phase: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择所属阶段',
    },
  };

  function onClear () {
    props.onClear?.();
  }

  function onSubmit (e: MouseEvent) {
    props.onSubmitPreventDefault !== false && e.preventDefault();
    if (!formRef.value || !formRef.value.validate) {
      message.error('TikuCreateCommonForm.tsx::formRef.value.validate is null.');
    }
    props.onSubmit?.(() => {
      const p = formRef.value!.validate();
      // p.catch(() => {});
      return p;
    });
  }


  return () => (
    <NForm
      // key={props.id}
      class={['tiku-create-common-form', props.class]}
      ref={formRef}
      model={props.modelValue}
      rules={rules}
      labelPlacement="left"
      labelWidth="auto"
      requireMarkPlacement="right-hanging"
      size="medium"
      style={{
        maxWidth: '640px'
      }}
    >
      <NFormItem label="试题名称" path="tName">
        <NInput
          v-model:value={props.modelValue.tName}
          placeholder="请输入试题名称"
          type="textarea"
          minlength={CONFIGS.nName.minLength}
          maxlength={CONFIGS.nName.maxLength}
          showCount
          autosize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
      </NFormItem>
      <NFormItem label="分值" path="scoreValue">
        <NInputNumber v-model:value={props.modelValue.scoreValue} precision={0} step={1} min={1} max={100} placeholder="请输入整数分值" />
      </NFormItem>
      <NFormItem label="所属阶段" path="phase">
        <NSelect
          v-model:value={props.modelValue.phase}
          placeholder="请选择所属阶段"
          options={generalOptions}
        />
      </NFormItem>
      {props.context.slots.customQuestionInfo?.()}

      <div class="form-actions">
        <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
        <NButton round type="primary" onClick={onSubmit}>提交</NButton>
      </div>
    </NForm>
  );
});
