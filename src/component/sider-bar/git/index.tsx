import * as React from "react"
import { observer, inject } from 'mobx-react'
import { Tree, Popover, Loading, Message, Button } from 'react-ryui'
import './index.less'

const $: any = document.querySelector.bind(document)
@inject('UI', 'FileSystem', 'Git')
@observer
class Git extends React.Component<any, any> {
  props: any
  constructor(props) {
    super(props)
  }
  message = new Message({
    duration: 3,
    dark: this.props.UI.isDark,
    position: 'br'
  })
  commit = async (commitInfo: string) => {
    if (this.props.Git.countChange === 0) {
      this.message.warning(`暂无提交的内容.`)
      return
    }
    if (commitInfo === '') {
      this.message.warning(`提交信息不能为空.`)
    } else {
      this.props.Git.commitFile(commitInfo)
    }
  }
  workSpaceChangeMenu = (item) => {
    const statusTree = {
      'U': <div className='app-git-menu'>
        <div className='app-git-menu-item' onClick={
          () => {
            this.props.FileSystem.deleteFile(item)
          }
        }>
          <span>删除文件</span>
          <i className='iconfont icon-shanchu'></i>
        </div>
        <div className='app-git-menu-item' onClick={
          () => {
            this.props.Git.addFile(item.path)
          }
        }>
          <span>添加暂存区</span>
          <i className='iconfont icon-jia-copy-copy'></i>
        </div>
      </div>,
      'D': <div className='app-git-menu'>
        <div className='app-git-menu-item' onClick={
          () => {
            this.props.Git.checkoutFile(item.path)
          }
        }>
          <span>恢复文件</span>
          <i className='iconfont icon-chexiao-sys-iconF'></i>
        </div>
        <div className='app-git-menu-item' onClick={
          () => {
            this.props.Git.addFile(item.path)
          }
        }>
          <span>添加暂存区</span>
          <i className='iconfont icon-jia-copy-copy'></i>
        </div>
      </div>,
      'M': <div className='app-git-menu'>
        <div className='app-git-menu-item' onClick={
          () => {
            this.props.Git.checkoutFile(item.path)
          }
        }>
          <span>撤销修改</span>
          <i className='iconfont icon-chexiao-sys-iconF'></i>
        </div>
        <div className='app-git-menu-item' onClick={
          () => {
            this.props.Git.addFile(item.path)
          }
        }>
          <span>添加暂存区</span>
          <i className='iconfont icon-jia-copy-copy'></i>
        </div>
      </div>
    }
    return statusTree[item.status]
  }
  stagedChangeMenu = (item) => {
    return <div className='app-git-menu'>
      <div className='app-git-menu-item' onClick={
        () => {
          this.props.Git.resetFile(item.path)
        }
      }>
        <span>撤销暂存区</span>
        <i className='iconfont icon-chexiao-sys-iconF'></i>
      </div>
    </div>
  }
  renderTreeData = (node, staged) => {
    return node.map(item => {
      let obj: any = {
        key: item.path,
        icon: `iconfont ${item.icon}`,
        iconColor: item.iconColor,
        label: <Popover
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
          dark={this.props.UI.isDark}
          content={staged ? this.stagedChangeMenu(item) : this.workSpaceChangeMenu(item)}
          trigger='contextMenu'
          placement='bottom'
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={
            async () => {
              await this.props.Git.queryStagedText(item)
              await this.props.FileSystem.openFile(item)
            }
          }>
            <div style={{ display: 'flex', alignItems: 'center', width: 'calc(100% - 20px)' }}>
              <span>
                <span style={{ margin: '0 8px', opacity: 0.6, textDecoration: item.status === 'D' ? 'line-through' : 'unset' }}>
                  {item.name}
                </span>
                <span>{item.dir}</span>
              </span>
            </div>
            <span style={{ width: 20, textAlign: 'center', color: item.color }}>{item.status}</span>
          </div>
        </Popover>
      }
      return Object.assign({}, item, obj)
    })
  }
  render() {
    const { git: { isGitProject }, workspaceChanges, stagedChanges, loading } = this.props.Git
    const workspaceChangesData = this.renderTreeData(workspaceChanges, false)
    const stagedChangesData = this.renderTreeData(stagedChanges, true)
    let theme = this.props.UI.isDark ? '-dark' : ''
    return <Loading
      style={{ height: '100%', width: '100%' }}
      loading={loading}>
      <div className={`app-git${theme}`}>
        <div className='app-git-header'>
          <div className='app-git-header-left'>
            source control : git
          </div>
          {
            isGitProject && <div className='app-git-header-right'>
              <i title='commit' className='codicon codicon-check' onClick={
                () => {
                  this.commit($('#commit-info').value.trim())
                }
              }></i>
              <i title='refresh' className='codicon codicon-refresh' onClick={
                () => {
                  this.props.Git.queryStatus()
                }
              }></i>
              <i title='push' className='codicon codicon-more' onClick={
                () => {
                  this.props.Git.pushFile()
                }
              }></i>
            </div>
          }
        </div>
        {
          isGitProject ? <div className='app-git-body'>
            <div className='app-git-input'>
              <input autoFocus autoComplete='off' id='commit-info' placeholder='Message (press Enter to commit)' onKeyDown={
                (e: any) => {
                  if (e.keyCode === 13) {
                    this.commit(e.target.value.trim())
                  }
                }
              } />
            </div>
            <div className='app-git-body-change'>
              {
                stagedChangesData.length > 0 && <div className='app-git-body-change-staged'>
                  <div className='app-git-body-change-title'>Staged Change</div>
                  <Tree
                    dark={this.props.UI.isDark}
                    treeData={stagedChangesData}
                  />
                </div>
              }
              {
                workspaceChangesData.length > 0 && <div className='app-git-body-change-workspace'>
                  <div className='app-git-body-change-title'>Change</div>
                  <Tree
                    dark={this.props.UI.isDark}
                    treeData={workspaceChangesData}
                  />
                </div>
              }
            </div>
          </div> : <div className='app-git-body-none'>
              <Button label='Is Not Git Project' style={{ width: 220 }} type='primary' />
            </div>
        }
      </div>
    </Loading>
  }
}
export { Git }