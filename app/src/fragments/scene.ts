import gql from "graphql-tag";

export default gql`
  fragment SceneFragment on Scene {
    _id
    addedOn
    name
    releaseDate
    description
    rating
    favorite
    bookmark
    studio {
      _id
      name
    }
    labels {
      _id
      name
      color
    }
    thumbnail {
      _id
      color
    }
    meta {
      size
      duration
      fps
      bitrate
      dimensions {
        width
        height
      }
    }
    watches
    streamLinks
    path
    customFields
    availableFields {
      _id
      name
      type
      values
      unit
    }
  }
`;
