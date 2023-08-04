export const API_END_POINT = 'https://misc.edu-api.programmers.co.kr/posts'

export const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (res.ok) {
      return await res.json()
    }

    throw new Error('API 처리 중 뭔가 이상하다!')
  } catch (e) {
    alert(e.message)
  }
}