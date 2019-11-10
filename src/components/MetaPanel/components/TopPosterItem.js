import React from 'react'
import { Image, List } from 'semantic-ui-react'

const TopPosterItem = ({ userName, imgUrl, count }) => {
  const formatCount = num => {
    return num === 1 ? `${num} 則訊息` : `${num} 則訊息`
  }
  return (
    <List.Item>
      <Image avatar src={imgUrl}/>
      <List.Content>
        <List.Header as="a">
          {userName}
        </List.Header>
        <List.Description>
          {formatCount(count)}
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

export default TopPosterItem
