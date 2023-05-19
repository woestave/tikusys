import { examinationServices } from '@/apis/services/examination';
import { exampaperServices } from '@/apis/services/exampaper';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { useRequest } from '@/hooks/use-request';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import { sleepCurrying } from 'common-packages/utils/sleep';
import {
  DataTableColumns,
  DatePickerInst,
  FormInst,
  FormRules,
  NButton,
  NCheckbox,
  NDataTable,
  NDatePicker,
  NDivider,
  NForm,
  NFormItem,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber,
  NSelect,
  useNotification,
} from 'naive-ui';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { ref } from 'vue';

const localPrevDateKey = 'rsd_exam_create_prev_date';
const localExamDurationKey = 'rsd_exam_create_exam_duration';

interface CreateForm extends Omit<API__Examination.CreateReq, 'examExampaperId' | 'examDate'> {
  examExampaperId: number | null;
  examDate: null | number;
}

export default functionalComponent(() => {
  const formRef = ref<FormInst>();

  const commonDataPinia = useCommonDataPinia();

  const [ examinationList, getExaminationList, getExaminationListStatus ] = useCallbackP(() => examinationServices.list({}).then((res) => res.data.list || []));
  getExaminationList();

  const [ exampaperList ] = useRequest(exampaperServices.list({}));

  const loading = globalLoading.useCreateLoadingKey({ name: '新建考试计划...', });
  const notification = useNotification();

  function genDefaultForm (): CreateForm {
    return {
      id: 0,
      examName: '',
      examIsRepeatable: 0,
      examDesc: '',
      examClassIds: [],
      examExampaperId: null,
      examDate: null as null | number,
      examDuration: Number(localStorage.getItem(localExamDurationKey) || 60),
    };
  }

  const scheduleForm = ref<CreateForm>(genDefaultForm());
  function onClear () {
    scheduleForm.value = genDefaultForm();
  }
  function onSubmit () {
    formRef.value?.validate().then(() => {
      loading.show();
      examinationServices.create({
        ...scheduleForm.value,
        examDate: scheduleForm.value.examDate!,
        examExampaperId: scheduleForm.value.examExampaperId!,
      }).then(sleepCurrying(300)).then((res) => {
        //
        getExaminationList();
        notification.success({ title: '新建考试计划成功', duration: 2400, });
      }).finally(loading.hide);
      console.log(scheduleForm.value);
    });
  }

  const rules: FormRules = {
    examName: {
      required: true,
      whitespace: true,
      trigger: ['input', 'blur'],
      message: '请输入考试名称',
    },
    examDesc: {
      required: false,
      whitespace: true,
      trigger: ['input', 'blur'],
      message: '请输入合法的考试考试简介',
    },
    examClassIds: {
      required: true,
      type: 'array',
      trigger: ['input', 'blur'],
      message: '请选择至少一个考试班级',
    },
    examExampaperId: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: '请选择试卷',
    },
    examDate: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: '请选择开考时间',
    },
    examDuration: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: '请设置考试时长',
    },
  };

  const dateRef = ref<DatePickerInst>();
  function getCurrentChecked (): number {
    const d = (dateRef.value as any);
    return d?.pendingValue || d?.uncontrolledValue || d?.value || Date.now();
  }
  const shortcuts = {
    '上次选择': () => new Date(+(localStorage.getItem(localPrevDateKey) || Date.now())).getTime(),
    '标准早上': () => new Date(getCurrentChecked()).setHours(8, 30, 0, 0),
    '标准下午': () => new Date(getCurrentChecked()).setHours(14, 0, 0, 0),
  };
  function onUpdateDate (value: number) {
    value && localStorage.setItem(localPrevDateKey, value + '');
  }

  return () => (
    <div class="examination-schedule">
      <PageTitle />
      <PageSubTitle>通过试卷、目标班级、开考时间等信息制定考试计划</PageSubTitle>
      <NDivider />
      <NForm
        class="class-overview-create-form"
        ref={formRef}
        model={scheduleForm.value}
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '640px'
        }}
      >
        <NFormItem label="考试名称" path="examName">
          <NInput
            v-model:value={scheduleForm.value.examName}
            minlength={1}
            maxlength={30}
            showCount
            placeholder="考试名称"
          />
        </NFormItem>
        <NFormItem label="考试简介" path="examDesc">
          <NInput
            v-model:value={scheduleForm.value.examDesc}
            type="textarea"
            autosize={{
              minRows: 2,
              maxRows: 3,
            }}
            showCount
            minlength={1}
            maxlength={30}
            placeholder="考试简介"
          />
        </NFormItem>
        <NFormItem label="考试班级" path="examClassIds">
          <NSelect
            v-model:value={scheduleForm.value.examClassIds}
            multiple
            options={commonDataPinia.classes as SelectMixedOption[]}
            placeholder="考试班级"
          ></NSelect>
        </NFormItem>
        <NFormItem label="选择试卷" path="examExampaperId">
          <NSelect
            v-model:value={scheduleForm.value.examExampaperId}
            labelField="paperName"
            valueField="paperId"
            filterable
            options={(exampaperList.value?.list as any || []) as SelectMixedOption[]}
            placeholder="选择试卷"
          ></NSelect>
        </NFormItem>
        <NGrid xGap={24}>
          <NFormItemGi span={15} label="开考时间" path="examDate">
            <NDatePicker
              v-model:value={scheduleForm.value.examDate}
              type="datetime"
              ref={dateRef}
              clearable
              onUpdateValue={onUpdateDate}
              isDateDisabled={(ts: number) => ts < (Date.now() - 86399000)}
              actions={['confirm']}
              shortcuts={shortcuts}
              style="width: 100%;"
            />
          </NFormItemGi>
          <NFormItemGi span={9} label="考试时长(分钟)" path="examDuration">
            <NInputNumber
              v-model:value={scheduleForm.value.examDuration}
              precision={0}
              min={1}
              max={600}
              onUpdateValue={(value) => value && localStorage.setItem(localExamDurationKey, String(value))}
            />
          </NFormItemGi>
        </NGrid>
        <NFormItem label="可重复考试">
          <NCheckbox checked={scheduleForm.value.examIsRepeatable === 1} onUpdateChecked={(newVal) => {
            scheduleForm.value.examIsRepeatable = newVal ? 1 : 0;
          }} />
        </NFormItem>
        <div class="form-actions">
          <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton>
        </div>
      </NForm>
      <NDivider />
      <NDataTable
        data={examinationList.value || []}
        columns={[
          {
            title: '编号',
            key: 'id',
          },
          {
            title: '考试名称',
            key: 'examName',
            ellipsis: {
              tooltip: true,
            },
          },
          {
            title: '试卷',
            key: 'examExampaperId',
            render (row) {
              return exampaperList.value?.list.find(x => x.paperId === row.examExampaperId)?.paperName || '';
            },
          },
          {
            title: '考试班级',
            key: 'examClassIds',
            // ellipsis: {
              // tooltip: true,
            // },
            render (row) {
              return row
                .examClassIds
                .map(classId => commonDataPinia.classes.find(y => y.value === classId))
                .map((x) => x?.label)
                .join(', ');
            },
          },
          {
            title: '考试日期',
            key: 'examDate',
            render (row) {
              return new Date(row.examDate).toLocaleString();
            },
          },
          {
            title: '考试时长',
            key: 'examDuration',
            render (row) {
              return row.examDuration + '分';
            },
          },
          {
            title: '考试简介',
            key: 'examDesc',
            ellipsis: {
              tooltip: true,
            },
          },
        ] as DataTableColumns<API__Examination.TableStruct__Examination>}
        loading={getExaminationListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
