import React from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

export const withRouter = (Component) => {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    const {login, logout} = useAuth()
    const { user } = React.useContext(AuthContext)

    return <Component {...props} {...{location, navigate, params, login, logout, user}} />;
  }

  return ComponentWithRouterProp;
}