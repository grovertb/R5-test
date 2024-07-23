export const getStorageByKey = (key: string) => {
  const storageLocalString = localStorage.getItem(key) || '[]'

  return JSON.parse(storageLocalString)
}