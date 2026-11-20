// Разрешаем только маршруты этого сайта, включая query для возврата к объекту.
export function safeAuthRedirect(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(value)) return '/'
  try {
    const target = new URL(value, 'https://gorodaivesi.ru')
    return target.origin === 'https://gorodaivesi.ru' ? target.pathname + target.search + target.hash : '/'
  } catch { return '/' }
}
