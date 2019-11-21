import defaultSettings from '@/settings'

const title = defaultSettings.title || 'DBger管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
