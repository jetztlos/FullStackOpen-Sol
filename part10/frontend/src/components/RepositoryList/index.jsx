// part10/frontend/src/components/RepositoryList/index.jsx

import React, { useState } from 'react';
import useRepositories from '../../hooks/useRepositories';
import RepositoryListContainer from './RepositoryListContainer';

const RepositoryList = () => {
  const [sortType, setSortType] = useState('most-recent');
  const [searchKeyword, setSearchKeyword] = useState('');

  const getSortVariables = (sortType) => {
    switch (sortType) {
      case 'most-recent':
        return {
          orderBy: 'CREATED_AT',
        };
      case 'highest-rated':
        return {
          orderBy: 'RATING_AVERAGE',
          orderDirection: 'DESC',
        };
      case 'lowest-rated':
        return {
          orderBy: 'RATING_AVERAGE',
          orderDirection: 'ASC',
        };
      default:
        return {};
    }
  };

  const variables = { searchKeyword, first: 20, ...getSortVariables(sortType) };

  const { repositories, fetchMore } = useRepositories(variables);

  const onEndReached = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      sortType={sortType}
      setSortType={setSortType}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
      onEndReached={onEndReached}
    />
  );
};

export default RepositoryList;
