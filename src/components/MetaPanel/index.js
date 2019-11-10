import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { Segment, Header, Accordion, Icon, Image, List } from 'semantic-ui-react'
import { renderNothingWhileTrue } from '../../hocUtils'
import withActiveIndexChange from './components/withActiveIndexChange'
import TopPosterItem from './components/TopPosterItem'
import AccordionItem from './components/AccordionItem'

const getIsPrivateChannel = props => props.isPrivateChannel
const enhance = compose(
  renderNothingWhileTrue(getIsPrivateChannel),
  withActiveIndexChange
)

const MetaPanel = ({ currentChannel, userPosts, activeIndex, changeActiveIndex }) => {
  const renderTopPosterLists = userPosts => (
    Object.entries(userPosts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], ind) => (
        <React.Fragment key={ind}>
           <TopPosterItem
             userName={key}
             imgUrl={val.avatar}
             count={val.count}
           />
        </React.Fragment>
      ))
      .slice(0, 5)
  )
  const accordionInfo = [
    {
      renderTitle: () => (
        <React.Fragment>
          <Icon name="dropdown" />
          <Icon name="info" />
          {'頻道簡介'}
        </React.Fragment>
      ),
      renderContent: () => currentChannel && currentChannel.details,
    },
    {
      renderTitle: () => (
        <React.Fragment>
          <Icon name="dropdown" />
          <Icon name="info" />
          {'最多互動'}
        </React.Fragment>
      ),
      renderContent: () => (
        <List>
          {userPosts && renderTopPosterLists(userPosts)}
        </List>
      ),
    },
    {
      renderTitle: () => (
        <React.Fragment>
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          {'頻道主人'}
        </React.Fragment>
      ),
      renderContent: () => (
        <Header as="h3">
          <Image circular src={currentChannel && currentChannel.createdBy.avatar}/>
          {currentChannel && currentChannel.createdBy.name}
        </Header>
      ),
    },
  ]
  return (
    <Segment loading={!currentChannel}>
      <Header as="h3" attached="top">
        {'關於 #'}{currentChannel && currentChannel.name}
      </Header>
      <Accordion styled attached="true">
        {accordionInfo.map((info, ind) => (
          <AccordionItem
            key={ind}
            index={ind}
            isActive={activeIndex === ind}
            changeActiveIndex={changeActiveIndex}
            renderTitle={info.renderTitle}
            renderContent={info.renderContent}
          />
        ))}
      </Accordion>
    </Segment>
  )
}

MetaPanel.propTypes = {
  currentChannel: PropTypes.object,
  userPosts: PropTypes.object,
  activeIndex: PropTypes.number,
  changeActiveIndex: PropTypes.func,
}

export default enhance(MetaPanel)
