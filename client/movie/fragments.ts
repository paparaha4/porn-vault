export const movieCardFragment = `
fragment MovieCard on Movie {
  _id
  name
  releaseDate
  duration
  favorite
  bookmark
  rating
  frontCover {
    _id
    color
  }
  actors {
    _id
    name
  }
  labels {
    _id
    name
    color
  }
  studio {
    _id
    name
  }
  scenes {
    _id
  }
}
`;
