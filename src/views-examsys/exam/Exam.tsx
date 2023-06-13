import { exampaperServices } from '@/apis/services/exampaper';
import examsysServices from '@/apis/services/examsys';
import { useRequest } from '@/hooks/use-request';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import { DataTableColumns, NButton, NDataTable, NH1 } from 'naive-ui';
import { prop } from 'ramda';
import { useRouter, } from 'vue-router';

function getEndTime (targetTime: number, duration: number) {
  return (targetTime + (duration * 60 * 1000));
}
/**
 * 判断当前时间是否在给定时间戳+给定持续时间之内
 */
function inTime (targetTime: number, duration: number) {
  return +new Date() > targetTime && +new Date() <= getEndTime(targetTime, duration);
}

export default functionalComponent(() => {

  const router = useRouter();

  const [ examinationList, getExaminationList, getExaminationListStatus ] = useCallbackP(() => examsysServices.getMyExam().then((res) => res.data.list || []));

  getExaminationList();

  const [ exampaperList ] = useRequest(exampaperServices.list({}));

  const commonDataPinia = useCommonDataPinia();

  function onExaming (row: API__Examination.TableStruct__Examination) {
    router.push({
      name: 'examing',
      params: {
        examinationId: row.id,
      },
    });
  }

  return () => (
    <div class="exam-page">
      <div style="margin-top: 50px;"></div>
      <NH1>最近的考试</NH1>
      {/* <PageSubTitle>最近的考试：</PageSubTitle> */}
      <NDataTable
        data={examinationList.value || []}
        rowKey={prop('id')}
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
              const examDate = new Date(row.examDate);
              const started = inTime(row.examDate, row.examDuration);
              return (
                <span
                  style={{
                    color: examDate.toLocaleDateString() === new Date().toLocaleDateString()
                      ? started
                        ? 'red'
                        : 'yellow'
                      : 'inherit',
                  }}
                >{examDate.toLocaleString()}</span>
              );
            },
          },
          {
            title: '考试时长',
            key: 'examDuration',
            render (row) {
              return row.examDuration + '分钟';
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
            title: '操作',
            key: '',
            render (row) {
              const examing = inTime(row.examDate, row.examDuration);
              return (
                <>
                  {examing && <NButton
                    type={examing ? 'primary' : 'default'}
                    onClick={() => onExaming(row)}
                  >开始考试</NButton>}
                  {(getEndTime(row.examDate, row.examDuration) < +new Date()) && row.isAnswered && (
                    <NButton
                      type="info"
                      onClick={() => onExaming(row)}
                    >查看成绩</NButton>
                  )}
                </>
              );
            },
          },
        ] as DataTableColumns<API__Examsys__User.GetMyExamRes['list'][0]>}
        loading={getExaminationListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
