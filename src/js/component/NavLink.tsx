import * as React from 'react'
import {Link} from 'react-router'

import {Commons} from 'js/commons'

const NavLink = (props : ReactRouter.LinkProps) => {
  const newProps = Commons.assign({to: '/', activeClassName: 'active'}, props);
  return React.createElement(Link, newProps);
};

export default NavLink;