import { personnelServices } from '@/apis/services/personnel';
import { PageTitle } from '@/components/PageTitle';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import { sleepCurrying } from 'common-packages/utils/sleep';
import { DataTableColumns, FormInst, FormRules, NButton, NDataTable, NDivider, NForm, NFormItem, NInput, NSelect, useNotification } from 'naive-ui';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { ref } from 'vue';

function getDefaultStudentForm (): API__Student.CreateReq {
  return {
    studentId: 0,
    studentName: '',
    studentIdCard: '',
    studentClass: null,
    studentStatus: 0,
  };
}

// const _IDRe18 =  /^([1-6][1-9]|50)\\d{4}(18|19|20)\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/;
// const _IDRe15 =  /^([1-6][1-9]|50)\\d{4}\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}$/;

function isIdCard (text: string) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(text);
}

export default functionalComponent(() => {

  const formRef = ref<FormInst>();

  const rules: FormRules = {
    studentName: {
      required: true,
      whitespace: true,
      trigger: ['input', 'blur'],
      message: '请输入学生名称',
    },
    studentClass: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: '请选择学生所属班级',
    },
    studentIdCard: {
      required: true,
      whitespace: true,
      min: 15,
      max: 18,
      validator (rule, value) {
        return isIdCard(String(value || ''));
      },
      trigger: ['input', 'blur'],
      message: '请输入合法的学生身份证号',
    },
  }

  const commonDataPinia = useCommonDataPinia();

  const [ studentList, getStudentList, getStudentListStatus ] = useCallbackP(() => personnelServices.studentList().then(x => x.data.list || []));
  getStudentList();

  const studentForm = ref<API__Student.CreateReq>(getDefaultStudentForm());

  const notification = useNotification();

  const studentCreateLoading = globalLoading.useCreateLoadingKey({ name: '创建学生信息...' });
  const studentChangeClassLoading = globalLoading.useCreateLoadingKey({ name: '修改学生班级...' });

  function onClear () {
    studentForm.value = getDefaultStudentForm();
  }
  function onSubmit () {
    formRef.value?.validate().then(() => {
      studentCreateLoading.show();
      personnelServices.studentCreate({...studentForm.value}).then((res) => {
        notification.success({ title: '新建成功', duration: 0, });
      }).then(sleepCurrying(350)).then(getStudentList).finally(studentCreateLoading.hide);
    });
  }

  function onChangeStudentClass (student: API__Student.TableStruct__Student, targetClassId: number) {
    console.log('换班', student.studentName, student.studentClass, targetClassId);
    studentChangeClassLoading.show();
    personnelServices.changeStudentClass({ studentId: student.studentId, targetClassId, }).then((res) => {
      console.log('修改班级成功');
    }).finally(studentChangeClassLoading.hide);
  }


  return () => (
    <div class="personnel-student">
      <PageTitle />
      <NDivider />
      <NForm
        class="student-create-form"
        ref={formRef}
        model={studentForm.value}
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '640px'
        }}
      >
        <NFormItem label="学生名称" path="studentName">
          <NInput
            v-model:value={studentForm.value.studentName}
            minlength={1}
            maxlength={10}
            showCount
            placeholder="学生名称"
          />
        </NFormItem>
        <NFormItem label="所属班级" path="studentClass">
          <NSelect
            v-model:value={studentForm.value.studentClass}
            options={commonDataPinia.classes as SelectMixedOption[]}
            filterable
            placeholder="所属班级"
          ></NSelect>
        </NFormItem>
        <NFormItem label="身份证号" path="studentIdCard">
          <NInput
            v-model:value={studentForm.value.studentIdCard}
            minlength={15}
            maxlength={18}
            showCount
            placeholder="身份证号"
          />
        </NFormItem>
        <div class="form-actions">
          <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton>
        </div>
      </NForm>
      <NDivider />
      <NDataTable
        data={studentList.value || []}
        columns={[
          {
            title: '学生编号',
            key: 'studentId',
          },
          {
            title: '学生名称',
            key: 'studentName',
            ellipsis: {
              tooltip: true,
            },
          },
          {
            title: '所属班级',
            key: 'studentClass',
            // ellipsis: {
              // tooltip: true,
            // },
            render (row) {
              return (
                <NSelect
                  v-model:value={row.studentClass}
                  options={commonDataPinia.classes as SelectMixedOption[]}
                  placeholder="所属班级"
                  filterable
                  onUpdateValue={(classId: number) => onChangeStudentClass(row, classId)}
                ></NSelect>
              );
            },
          },
          {
            title: '学生状态',
            key: 'studentStatus',
            align: 'center',
            render (row) {
              return commonDataPinia.studentStatus.find(x => x.value === row.studentStatus)?.label;
            },
          },
          {
            title: '操作',
            key: '',
            render () {
              return null;
            },
          },
        ] as DataTableColumns<API__Student.TableStruct__Student>}
        loading={getStudentListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
