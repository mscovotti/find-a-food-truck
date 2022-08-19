export const errors = {
  POINT_OUT_OF_LIMITS: 'POINT_OUT_OF_LIMITS'
}

class Grid {

  grid = []
  #LATITUDE_COEFICIENT = 1000
  #LONGITUDE_COEFICIENT = 1000

  constructor(NW_lat, NW_lon, SE_lat, SE_lon) {
    this.NW_lat = NW_lat
    this.NW_lon = NW_lon

    this.SE_lat = SE_lat
    this.SE_lon = SE_lon
    const [x, y] = this.coordinatesToIdexes(SE_lat, SE_lon)
    this.max_x = x
    this.max_y = y
  }

  coordinatesToIdexes(latitude, longitude) {
    return [
      Math.abs(~~((longitude - this.NW_lon) * this.#LONGITUDE_COEFICIENT)),
      Math.abs(~~((this.NW_lat - latitude) * this.#LATITUDE_COEFICIENT))
    ]
  }

  isPointInGrid(x, y) {
    return y >= 0 && y <= this.max_y && x >= 0 && x <= this.max_x
  }

  populate(elements) {
    const errors = []
    elements.forEach(element => {
      const [x, y] = this.coordinatesToIdexes(element.latitude, element.longitude)

      if (!this.isPointInGrid(x, y)) {
        errors.push(element)
        return
      }
      if (!this.grid[y]) this.grid[y] = []
      if (!this.grid[y][x]) this.grid[y][x] = []
      this.grid[y][x].push(element)
    })

    return errors
  }

  getElementsArround(latitude, longitude, minQuantity = parseInt(process.env.MIN_QUANTITY_REQUIRED || 5)) {
    const [x, y] = this.coordinatesToIdexes(latitude, longitude)

    if (!this.isPointInGrid(x, y)) throw new Error(errors.POINT_OUT_OF_LIMITS)

    let response = []
    let r = 1 // radius

    if (this.grid[y] && this.grid[y][x]) response = this.grid[y][x]
    while (response.length < minQuantity && (y - r >= 0 || y + r <= this.max_y || x - r >= 0 || x + r <= this.max_x)) {
      for (let i = x - r; i <= x + r; i++){
        const top_y = y - r
        const bottom_y = y + r
        if (this.grid[top_y] && this.grid[top_y][i]) response = response.concat(this.grid[top_y][i])
        if (this.grid[bottom_y] && this.grid[bottom_y][i]) response = response.concat(this.grid[bottom_y][i])
      }
      for (let j = y - r + 1; j <= y + r - 1; j++){
        if (!this.grid[j]) continue
        const left_x = x - r
        const right_x = x + r
        if (this.grid[j][left_x]) response = response.concat(this.grid[j][left_x])
        if (this.grid[j][right_x]) response = response.concat(this.grid[j][right_x])
      }
      r++
    }

    return response
  }

}

export default Grid