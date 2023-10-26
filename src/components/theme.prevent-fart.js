const html = document.documentElement

if (localStorage.theme === 'light') {
  html.classList.add('is-light')
} else if (localStorage.theme === 'dark') {
  html.classList.add('is-dark')
}