import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => (
  <Dimmer active>
    <Loader 
      size="huge"
      content={"準備中..."}/>
  </Dimmer>
)

export default Spinner;