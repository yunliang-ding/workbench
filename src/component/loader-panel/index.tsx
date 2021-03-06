import * as React from "react"
import { observer, inject } from 'mobx-react'
import './index.less'
@inject('UI', 'Loader')
@observer
class LoaderPanel extends React.Component<any, any> {
  props: any
  constructor(props) {
    super(props)
  }
  init = async () => {
    this.props.Loader.start(this.props.UI.projectPath) // 加载项目
  }
  componentWillMount() {
    this.init()
  }
  render() {
    let theme = this.props.UI.isDark ? '-dark' : ''
    const { stepInfos } = this.props.Loader
    return <div className={`app-loader-panel${theme}`}>
      <div className='app-loader-panel-header'>
        <i className='iconfont icon-tools'></i>
      </div>
      <div className='app-loader-panel-message'>
        <div className='inner-box'>
          {
            stepInfos.map((item, index) => {
              return <p key={index}>{item.message}</p>
            })
          }
        </div>
      </div>
    </div>
  }
}
export { LoaderPanel }