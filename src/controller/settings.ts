import type { SettingsValue } from '../models/settings'
import { getElement } from '../helpers/getElement'
import { $settings } from '../nanostores/settings'

const dialog = getElement<HTMLDialogElement>('#settings')

function openDialog() {
  dialog?.showModal()
  document.body.classList.add('modal-is-open')
}

function closeDialog() {
  dialog?.close()
  document.body.classList.remove('modal-is-open')
}

// Открытие диалога по клику на кнопку настроек
getElement('#settingsButton')?.addEventListener('click', () => {
  openDialog()
})

// Закрытие диалога по клику на backdrop
dialog?.addEventListener('click', (event) => {
  const rect = dialog?.querySelector('article')?.getBoundingClientRect()
  if (!rect)
    return
  const isInDialog
    = rect.top <= event.clientY
      && event.clientY <= rect.top + rect.height
      && rect.left <= event.clientX
      && event.clientX <= rect.left + rect.width
  if (!isInDialog) {
    closeDialog()
  }
})

// Закрытие диалога при закрытии через форму или ESC
dialog?.addEventListener('close', () => {
  document.body.classList.remove('modal-is-open')
})

// Обработка изменений в форме настроек
getElement('#settingsForm')?.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const key = target.name
  const value = target.value

  $settings.setKey(key as keyof SettingsValue, value)
})
