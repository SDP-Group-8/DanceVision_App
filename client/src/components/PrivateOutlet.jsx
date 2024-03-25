import { Outlet, useNavigate } from 'react-router-dom';
// import { getUserInfo } from '../../service/auth.service';
import { useEffect } from 'react';
import { getUserInfo } from '../utils/localstorage';

const PrivateOutlet = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const localAuth = getUserInfo();
    // const localAuth = null
    if (!localAuth) {navigate('/login', {replace: true})}
  }, [navigate])

  return <Outlet />
};

export default PrivateOutlet;