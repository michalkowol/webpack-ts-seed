import * as React from 'react'
import Layout from 'js/component/Layout'
import Timer from 'js/component/Timer'

const App: React.StatelessComponent<{}> = () => {
  return (
    <Layout>
      <Timer />
    </Layout>
  )
};

export default App;