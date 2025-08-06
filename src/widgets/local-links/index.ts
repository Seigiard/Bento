import { removeLoader } from '../../helpers/loader'
import { renderText } from '../../helpers/renderText'
import { $localLinks } from './store'
import { getLinkListView } from './view'

export function initWidget(selector: string) {
  $localLinks.subscribe((links) => {
    const view = getLinkListView(links)
    renderText(selector, view)
    removeLoader(selector)
  })
}
