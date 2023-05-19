import { functionalComponent } from '@/utils/functional-component';
import './Create.less';
import { NDivider, NTabPane, NTabs } from 'naive-ui';
import { ChoiceQuestion } from './forms/ChoiceQuestion';
import { ShortAnswerQuestion } from './forms/ShortAnswerQuestion';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';

export default functionalComponent(() => {

  return () => (
    <div class="tiku-create">
      <PageTitle />
      <PageSubTitle>生成试题</PageSubTitle>
      <NDivider />
      <NTabs defaultValue="chap1" justifyContent="start" animated>
        <NTabPane name="chap1" tab="选择题" displayDirective="show:lazy">
          <ChoiceQuestion />
        </NTabPane>
        <NTabPane name="chap3" key={2} tab="简答题" displayDirective="show:lazy">
          <ShortAnswerQuestion />
        </NTabPane>
      </NTabs>
    </div>
  );
});
