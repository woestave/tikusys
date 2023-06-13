import { examinationServices } from '@/apis/services/examination';
import { exampaperServices } from '@/apis/services/exampaper';
import { personnelServices } from '@/apis/services/personnel';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { useRequest } from '@/hooks/use-request';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import { Trash } from '@vicons/ionicons5';
import { Edit } from '@vicons/tabler';
import { TeacherRole } from 'common-packages/constants/teacher-role';
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
  NIcon,
  NInput,
  NInputNumber,
  NP,
  NPopconfirm,
  NSelect,
  NTooltip,
  PaginationInfo,
  useMessage,
} from 'naive-ui';
import { RenderPrefix } from 'naive-ui/es/pagination/src/interface';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const localPrevDateKey = 'rsd_exam_create_prev_date';
const localExamDurationKey = 'rsd_exam_create_exam_duration';

interface CreateForm extends Omit<API__Examination.CreateReq, 'examExampaperId' | 'examDate'> {
  examExampaperId: number | null;
  examDate: null | number;
}

export default functionalComponent(() => {
  const router = useRouter();

  const formRef = ref<FormInst>();

  const commonDataPinia = useCommonDataPinia();

  const pagination = reactive<Partial<PaginationInfo & {
    prefix: RenderPrefix;
  }>>({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    prefix: ({ itemCount }) => `${itemCount}条记录`,
  });

  const [ examinationList, getExaminationList, getExaminationListStatus ] = useCallbackP(() => examinationServices.list({
    pageNumber: pagination.page,
    pageSize: pagination.pageSize,
  }).then((res) => {
    pagination.itemCount = res.data.total;
    return res.data || [];
  }));
  getExaminationList();

  function onUpdatePageNumber (newPageNumber: number) {
    pagination.page = newPageNumber;
    getExaminationList();
  }

  const [userInfo] = useRequest(personnelServices.getUserInfo());

  const [ exampaperList ] = useRequest(exampaperServices.list({}));

  const loading = globalLoading.useCreateLoadingKey({ name: '新建考试计划...', });
  const message = useMessage();

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
  function onSubmitOrEdit () {
    formRef.value?.validate().then(() => {
      loading.show();
      examinationServices.createOrUpdate({
        ...scheduleForm.value,
        examDate: scheduleForm.value.examDate!,
        examExampaperId: scheduleForm.value.examExampaperId!,
      }).then(sleepCurrying(300)).then((res) => {
        //
        getExaminationList();
        message.success(isEditing.value ? '修改成功' : '新建成功');
        isEditing.value = false;
        onClear();
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
  // 批改试卷
  function onCorrecting (row: API__Examination.TableStruct__Examination) {
    //
    router.push({ name: 'examination-correcting', query: { examinationId: row.id, }, });
  }




  const isEditing = ref(false);
  function onEdit (row: API__Examination.TableStruct__Examination) {
    isEditing.value = true;
    scheduleForm.value = {...row};
    document.querySelector('.examination-schedule')?.scrollIntoView({ behavior: 'smooth', });
  }
  function onEditCancel () {
    isEditing.value = false;
    scheduleForm.value = genDefaultForm();
  }

  const removeExaminationLoading = globalLoading.useCreateLoadingKey({ name: '删除考试信息...' });
  function onRemove (row: API__Examination.TableStruct__Examination) {
    removeExaminationLoading.show();
    examinationServices.remove({ id: row.id }).then((res) => {
      res.data.succ === 1 && message.success('删除考试信息成功');
      onClear();
      isEditing.value = false;
      getExaminationList();
    }).finally(removeExaminationLoading.hide);
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
          {/* <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton> */}
          {
            isEditing.value
              ? (
                <>
                  <NButton class="clear-btn" ghost round type="error" onClick={onEditCancel}>取消编辑</NButton>
                  <NButton type="primary" round onClick={onSubmitOrEdit}>确认修改</NButton>
                </>
              )
              : (
                <>
                  <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
                  <NButton type="primary" round onClick={onSubmitOrEdit}>新建</NButton>
                </>
              )
          }
        </div>
      </NForm>
      <NDivider />
      <NDataTable
        data={examinationList.value?.list || []}
        remote
        pagination={pagination}
        onUpdatePage={onUpdatePageNumber}
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
          {
            title: '教师操作',
            key: 'teacher-actions',
            render (row) {
              /** 两天内允许改卷 */
              const flag = row.examDate > (+new Date() - (60 * 60 * 24 * 1000) * 2);
              // 只能批改本班作业
              const isMyClass = row.examClassIds.includes(userInfo.value?.userInfo.teacherClass || -9999);
              return (
                flag && isMyClass && <NButton type="primary" onClick={() => onCorrecting(row)}>批改</NButton>
              );
            },
          },

          {
            title: '操作',
            key: '',
            render (row) {
              // 是否已开始
              const isStarted = row.examDate < +new Date();
              // 是否是我创建的
              const isMine = row.createBy === userInfo.value?.userInfo.teacherId;
              // 是否是超级管理员
              const hasAuth = userInfo.value?.userInfo.taecherRole === TeacherRole.super || isMine;

              const btnDisabled = !hasAuth || (isStarted);

              function getTooltip (actionName: string, trigger: () => JSX.Element) {
                return (
                  <NTooltip disabled={!btnDisabled} trigger="hover">
                    {{
                      default: () => (
                        <span>{(!hasAuth
                          ? `您不能${actionName}别人创建的考试信息`
                          : isStarted
                            ? `考试开始时间已过，不能${actionName}`
                            : null
                        )}</span>
                      ),
                      trigger,
                    }}
                  </NTooltip>
                );
              }


              return (
                <>
                  {getTooltip('编辑', () => (
                    <span onClick={() => !btnDisabled && onEdit(row)} style="cursor: pointer;">
                      <NIcon size={22} color={btnDisabled ? 'gray' : 'white'}>
                        <Edit />
                      </NIcon>
                    </span>
                  ))}
                  <NPopconfirm
                    class="global--n-popconfirm"
                    negativeText="取消"
                    positiveText="确认"
                    disabled={btnDisabled}
                    onPositiveClick={() => onRemove(row)}
                    // onNegativeClick="handleNegativeClick"
                  >
                    {{
                      trigger: () => {
                        return getTooltip('删除', () => (
                          <NIcon size={22} color={btnDisabled ? 'gray' : 'white'} style="margin-left: 16px; cursor: pointer;">
                            <Trash />
                          </NIcon>
                        ));
                      },
                      default: () => (
                        <div>
                          <NP>
                            <p>删除后无法恢复。</p>
                            <p style="font-size: 12px; color: gray;"></p>
                          </NP>
                        </div>
                      ),
                    }}
                  </NPopconfirm>
                </>
              );
            },
          },
        ] as DataTableColumns<API__Examination.TableStruct__Examination>}
        loading={getExaminationListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
