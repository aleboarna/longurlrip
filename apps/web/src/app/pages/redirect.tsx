import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { useQuery } from 'react-query';
import Loading from '../components/loading';
import { SlugGetResponsePayload } from '@longurlrip/types';

const RedirectPage: FC = () => {
  const location = useLocation();

  const fetchSlugData = async () => {
    const response = await axios.get<SlugGetResponsePayload>(
      `${API_URL}/v1/slug/${location.pathname.substring(6)}`
    );
    return response.data;
  };

  const { isLoading, error, data } = useQuery('slugData', fetchSlugData);

  useEffect(() => {
    if (data?.url) {
      console.log(data);
      window.location.href = data?.url;
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <p className="mt-2 text-red-500">Error.</p>;

  return null;
};

export default RedirectPage;
