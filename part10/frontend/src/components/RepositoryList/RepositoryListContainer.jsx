// part10/frontend/src/components/RepositoryList/RepositoryListContainer.jsx

import React from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'react-router-native';

import RepositoryItem from '../RepositoryItem';
import ItemSeparator from '../ItemSeparator';
import Header from './Header';

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const { sortType, setSortType, searchKeyword, setSearchKeyword } = this.props;

    return (
      <Header
        sortType={sortType}
        setSortType={setSortType}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
    );
  };

  render() {
    const { repositories, onEndReached } = this.props;

    const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];
    
    return (
      <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={this.renderHeader}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <Link
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          to={`/repository/${item.id}`}
          component={Pressable}
        >
          <RepositoryItem repository={item} />
        </Link>
      )}
    />
    );
  }
}

export default RepositoryListContainer;
