import dotenv from 'dotenv'
import express from 'express'
import { getData } from './repositories/food-truck.repository.js'
import Grid, { errors as gridErrors} from './lib/Grid.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// Set the grid
const coords = process.env.AREA_LIMITS.split(',').map(parseFloat)
const grid = new Grid(
  Math.max(coords[0], coords[2]),  Math.min(coords[1], coords[3]), // North-West area limit
  Math.min(coords[0], coords[2]),  Math.max(coords[1], coords[3])  // South-East area limit
)

// Populate the grid
const data = await getData(process.env.API_URL)
const errors = grid.populate(data)
if (errors.length) {
  console.log(`=== Elements with errors (${errors.length}) ===`)
  console.log(errors)
  console.log('=================================')
}

// GET: /foodtrucks
app.get('/foodtrucks', (req, res) => {
  const point = req.query.point.split(',').map(parseFloat)
  let elements = []
  try {
    elements = grid.getElementsArround(point[0], point[1])
  } catch (e) {
    if (e.message === gridErrors.POINT_OUT_OF_LIMITS) {
      res.status(400).send('Given coordinates are out of limits!')

      return
    }
  }
  res.send(elements)
})

// Server start
app.listen(port, () => {
  console.log(`Find a food truck app listening on port ${port}`)
})