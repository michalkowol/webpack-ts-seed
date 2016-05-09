import * as React from 'react'

const Repo = ({params}: {params: {userName: string, repoName: string}}) => (
  <div>
    <h2>{params.userName}/{params.repoName}</h2>
  </div>
);

export default Repo;