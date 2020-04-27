import * as React from "react"
import { observer, inject } from 'mobx-react'
import './index.less'
const Window: any = window
@inject('UI')
@observer
class ActivityBar extends React.Component<any, any> {
  props: any
  constructor(props) {
    super(props)
  }
  render() {
    let theme = Window.config.dark ? '-dark' : ''
    const {
      currentTab,
      tabList,
      setCurrentTab
    } = this.props.UI
    return <div className={`app-activity-bar${theme}`}>
      {
        tabList.map(tab => {
          return <div
            className={tab.label === currentTab ? 'app-activity-bar-item-active' : 'app-activity-bar-item'}
            key={tab.label}
            onMouseDown={
              () => {
                setCurrentTab(tab.label)
              }
            }
          >
            <i title={tab.label} className={`iconfont ${tab.icon}`}></i>
          </div>
        })
      }
    </div>
  }
}
export { ActivityBar }