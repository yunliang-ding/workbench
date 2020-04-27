import { observable, action } from 'mobx'
class UI {
  @observable loading = false
  @observable login = false
  @observable currentTab = 'Explorer'
  @observable tabList = [{
    icon: 'icon-wenjian',
    label: 'Explorer'
  }, {
    icon: 'icon-search1',
    label: 'Search'
  }, {
    icon: 'icon-git1',
    label: 'Git'
  }]
  @action setLoading = (loading: boolean): void => {
    this.loading = loading
  }
  @action setLogin = (login: boolean): void  => {
    this.login = login
  }
  @action setCurrentTab = (currentTab: string): void  => {
    this.currentTab = currentTab
  }
}
const ui = new UI()
export {
  ui
}