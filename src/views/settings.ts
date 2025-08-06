import { SettingsFormFields } from '../models/settings'

export function getSettingsForm(settings) {
  return Object.keys(SettingsFormFields)
    .map((key) => {
      const field = SettingsFormFields[key]

      const input = field.values
        ? `
      <select id="${key}" name="${key}">
        ${field.values
          .map(
            value => `
          <option value="${value}" ${settings[key] === value ? 'selected' : ''}>
            ${value}
          </option>
        `,
          )
          .join('')}
      </select>`
        : `<input type="text" id = "${key}" name = "${key}" value = "${settings[key]}" />`

      return `
      <div class="form-item">
        <div class="form-label">
          <label for="${key}">${field.title}</label>
        </div>
        <div class="form-value">
          ${input}
          ${field.description ? `<p>${field.description}</p>` : ''}
        </div>
      </div>
      `
    })
    .join('')
}
