import axios from 'axios'

const getData = async () => {
  const url = process.env.API_URL || 'https://data.sfgov.org/resource/rqzj-sfat.json'
  const fields = process.env.API_FIELDS?.split(',').map(s => s.trim()) 
                  || [ objectid, applicant, locationdescription, fooditems, latitude, longitude ]

  if (!fields.includes('latitude')) fields.push('latitude')
  if (!fields.includes('longitude')) fields.push('longitude')
  const query = `$select=${fields.join(',')}`
  const data = await axios.get(`${url}?${query}`)

  return data.data
}

export { getData }