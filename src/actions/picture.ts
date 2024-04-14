import axios from "axios"

export async function changePicture(values: any, id: number) {
  return await axios.post('/api/user/change-picture', {
    values,
    id
  }).then((data) => data.data)
}