import * as React from 'react'
import Layout from 'js/component/Layout'
import Counter from 'js/component/Counter'

const App: React.StatelessComponent<{}> = () => {
  return (
    <Layout>
      <Counter />
    </Layout>
  )
};

export default App;