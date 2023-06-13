import { personnelServices } from '@/apis/services/personnel';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent } from '@/utils/functional-component';
import { FormInst, FormRules, NButton, NDivider, NForm, NFormItem, NH1, NInput, NPopconfirm, NRow, useNotification } from 'naive-ui';
import { pipe } from 'ramda';
import { ref } from 'vue';

export default functionalComponent(() => {

  const formRef = ref<FormInst>();

  const passwordForm = ref({
    oldPwd: '',
    newPwd: '',
    reNewPwd: '',
  });

  const rules: FormRules = {
    oldPwd: {
      required: true,
      whitespace: true,
      message: '请输入旧密码',
    },
    newPwd: {
      required: true,
      whitespace: true,
      min: 6,
      max: 18,
      message: '请输入6-18位新密码',
    },
    reNewPwd: {
      required: true,
      whitespace: true,
      message: '两次密码不一致',
      validator: (v, x) => {
        return String(x) === passwordForm.value.newPwd;
      },
    },
  };

  const loading = globalLoading.useCreateLoadingKey({ name: '设置密码...', });

  const notification = useNotification();

  function notifiSucc () {
    notification.success({ title: '重设密码成功', duration: 2400, });
  }

  function onResetToIdCard () {
    loading.show();
    personnelServices.teacherResetPassword().then(notifiSucc).finally(loading.hide);
  }

  function onClear () {
    passwordForm.value.oldPwd = '';
    passwordForm.value.newPwd = '';
    passwordForm.value.reNewPwd = '';
  }
  function onSubmit () {
    formRef.value?.validate().then(() => {
      loading.show();
      personnelServices.teacherUpdatePassword({
        oldPwd: passwordForm.value.oldPwd,
        newPwd: passwordForm.value.newPwd,
      }).then(pipe(onClear, notifiSucc)).finally(loading.hide);
    });
  }


  return () => (
    <div class="update-password">
      <NH1>修改密码</NH1>
      <NDivider />
      <NForm
        model={passwordForm.value}
        rules={rules}
        ref={formRef}
        style={{
          maxWidth: '640px',
          marginLeft: '100px',
        }}
      >
        <NFormItem label="旧密码" path="oldPwd">
          <NInput type="password" v-model:value={passwordForm.value.oldPwd} minlength={6} maxlength={18} showCount />
        </NFormItem>
        <NFormItem label="新密码" path="newPwd">
          <NInput type="password" v-model:value={passwordForm.value.newPwd} minlength={6} maxlength={18} showCount />
        </NFormItem>
        <NFormItem label="重新输入新密码" path="reNewPwd">
          <NInput type="password" v-model:value={passwordForm.value.reNewPwd} minlength={6} maxlength={18} showCount />
        </NFormItem>
        <div class="form-actions">
          <NRow>
            <NPopconfirm
              onPositiveClick={onResetToIdCard}
            >
              {{
                default: () => (
                  <div>将密码重设为身份证号码？</div>
                ),
                trigger: () => (
                  <NButton text type="primary">重设为默认密码</NButton>
                ),
              }}
            </NPopconfirm>
          </NRow>
          <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton>
        </div>
      </NForm>
    </div>
  );
});
