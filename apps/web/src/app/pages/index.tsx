import InputField from '../components/input';
import SubmitButton from '../components/submit-button';
import Centered from '../components/centered';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import {
  SlugCreateRequestPayload,
  SlugCreateResponsePayload,
} from '@longurlrip/types';
import { API_URL, APP_URL } from '../../config';

const IndexPage = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleClick = () => {
    mutation.mutate(inputValue);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update the state variable when the input field changes
  };

  const mutation = useMutation((inputValue: string) =>
    axios.post<
      SlugCreateRequestPayload,
      AxiosResponse<SlugCreateResponsePayload>
    >(`${API_URL}/v1/slugs/create`, {
      url: inputValue,
    })
  );

  return (
    <Centered>
      <InputField value={inputValue} onChange={handleInputChange} />
      <SubmitButton onClick={handleClick} />
      {mutation.isLoading && <p className="mt-2 text-yellow-500">Checking</p>}
      {mutation.isError && <p className="mt-2 text-red-500">Already taken.</p>}
      {mutation.isSuccess && (
        <a
          className="mt-2 text-green-500"
          target={'_blank'}
          href={`${APP_URL}/rips/${mutation.data.data.slug}`}
          rel="noreferrer"
        >
          {APP_URL}/rips/{mutation.data.data.slug}
        </a>
      )}
    </Centered>
  );
};

export default IndexPage;
