// part10/frontend/src/components/SingleRepository/index.jsx

import React from 'react';
import { useParams } from 'react-router-native';

import useRepository from '../../hooks/useRepository';
import SingleRepositoryContainer from './SingleRepositoryContainer';

const SingleRepository = () => {
  const { id } = useParams();

  const { repository, fetchMore } = useRepository({ id, first: 20 });

  const onEndReached = () => {
    fetchMore();
  };

  return (
    <SingleRepositoryContainer repository={repository} onEndReached={onEndReached} />
  );
};

export default SingleRepository;
