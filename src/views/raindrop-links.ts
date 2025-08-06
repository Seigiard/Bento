import type { RaindropCollectionTree } from '../models/raindrop-links'

/**
 * Новая функция для вывода вложенного списка коллекций
 */
export function getRaindropCollectionTreeView(
  collections: readonly RaindropCollectionTree[],
): string {
  if (!collections || collections.length === 0) {
    return ''
  }

  function renderCollection(
    collection: RaindropCollectionTree,
    level = 0,
  ): string {
    let html = ''

    // Заголовок коллекции как элемент списка
    html += `<li>${collection.title}`

    // Если есть ссылки или дочерние коллекции, создаем вложенный список
    if (
      (collection.raindrops && collection.raindrops.length > 0)
      || (collection.children && collection.children.length > 0)
    ) {
      html += '<ul>'

      // Ссылки в коллекции
      if (collection.raindrops && collection.raindrops.length > 0) {
        collection.raindrops.forEach((raindrop) => {
          html += `<li><a href="${raindrop.link}" target="_blank" rel="noopener noreferrer">${raindrop.title}</a></li>`
        })
      }

      // Дочерние коллекции
      if (collection.children && collection.children.length > 0) {
        collection.children.forEach((child) => {
          html += renderCollection(child, level + 1)
        })
      }

      html += '</ul>'
    }

    html += '</li>'
    return html
  }

  let result = '<ul>'
  collections.forEach((collection) => {
    result += renderCollection(collection)
  })
  result += '</ul>'

  return result
}
