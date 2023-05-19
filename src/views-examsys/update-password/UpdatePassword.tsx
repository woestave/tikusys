import { globalLoading } from '@/utils/create-loading';
import { functionalComponent } from '@/utils/functional-component';
import { sleep } from 'common-packages/utils/sleep';
import { NButton, NDivider, NForm, NFormItem, NH1, NInput, NPopconfirm, NRow, useNotification } from 'naive-ui';
import { ref } from 'vue';

export default functionalComponent(() => {

  const passwordForm = ref({
    oldPwd: '',
    newPwd: '',
    reNewPwd: '',
  });

  const loading = globalLoading.useCreateLoadingKey({ name: '设置密码...', });

  const notification = useNotification();

  function notifiSucc () {
    notification.success({ title: '重设密码成功', duration: 2400, });
  }

  function onUpdatePassword () {}
  function onResetToIdCard () {
    loading.show();
    sleep(500).then(onClear).then(loading.hide).then(notifiSucc);
  }

  function onClear () {
    passwordForm.value.oldPwd = '';
    passwordForm.value.newPwd = '';
    passwordForm.value.reNewPwd = '';
  }
  function onSubmit () {
    onUpdatePassword();
  }


  return () => (
    <div class="update-password">
      <NH1>修改密码</NH1>
      <NDivider />
      <NForm
        style={{
          maxWidth: '640px',
          marginLeft: '100px',
        }}
      >
        <NFormItem label="旧密码" required>
          <NInput type="password" v-model:value={passwordForm.value.oldPwd} />
        </NFormItem>
        <NFormItem label="新密码" required>
          <NInput type="password" v-model:value={passwordForm.value.newPwd} />
        </NFormItem>
        <NFormItem label="重新输入新密码" required>
          <NInput type="password" v-model:value={passwordForm.value.reNewPwd} />
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
