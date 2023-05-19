import { functionalComponent } from '@/utils/functional-component';
import './ReferenceTag.less';
import { NButton, NIcon, NP, NPopover, NTag, TagProps } from 'naive-ui';
import { Link as LinkIcon } from '@vicons/tabler';


export interface ReferEnceTagProps {
  referName?: null | string;
  referLink?: null | string;
  renderLinkPrefix?: null | string;
  label: string;
  type?: TagProps['type'];
  onClickLink?: (link: string) => void;
}
export default functionalComponent<ReferEnceTagProps>((props) => {


  function onClickLink () {
    // console.log('onClickLink', props);
    props.onClickLink?.(props.referLink!);
  }

  return () => (
    <NTag
      class="reference-tag"
      // size="small"
      type={props.type || 'info'}
      // bordered={false}
    >
      <span>{props.label}</span>
      {props.referLink && <NPopover>
        {{
          trigger: () => (
            <NButton class="refer-link-btn" text type={props.type || 'info'} onClick={onClickLink}>
              <NIcon class="refer-link-icon" size={12}>
                <LinkIcon />
              </NIcon>
            </NButton>
          ),
          default: () => (
            <>
              {props.referName && <NP>{props.referName}</NP>}
              {props.referLink && <NP>{props.renderLinkPrefix}{props.referLink}</NP>}
            </>
          ),
        }}
      </NPopover>}
    </NTag>
  );
});
