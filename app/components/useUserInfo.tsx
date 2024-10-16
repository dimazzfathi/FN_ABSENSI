import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useUserInfo = () => {
  const [namaAdmin, setNamaAdmin] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const storedNamaAdmin = Cookies.get('nama_admin');
    const storedStatus = Cookies.get('status');
    
    if (storedNamaAdmin) {
      setNamaAdmin(storedNamaAdmin);
    }
    if (storedStatus) {
      setStatus(storedStatus);
    }
  }, []);

  return { namaAdmin, status };
};

export default useUserInfo;
