import React from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'semantic-ui-react'

const AccordionItem = ({ isActive, index, changeActiveIndex, renderTitle, renderContent }) => (
  <React.Fragment>
    <Accordion.Title
      active={isActive}
      index={index}
      onClick={changeActiveIndex}
    >
      {renderTitle()}
    </Accordion.Title>
    <Accordion.Content active={isActive}>
      {renderContent()}
    </Accordion.Content>
  </React.Fragment>
)

AccordionItem.propTypes = {
  isActive: PropTypes.bool,
  index: PropTypes.number,
  changeActiveIndex: PropTypes.func,
  renderTitle: PropTypes.func,
  renderContent: PropTypes.func
}

export default AccordionItem
