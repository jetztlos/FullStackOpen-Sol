// part10/frontend/src/components/SingleRepository/SingleRepositoryContainer.jsx

import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import RepositoryItem from '../RepositoryItem';
import ItemSeparator from '../ItemSeperator';
import ReviewItem from '../ReviewItem';
import theme from '../../theme';

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.small,
  },
});

const SingleRepositoryContainer = ({ repository, onEndReached }) => {
  const reviews = repository?.reviews;

  const reviewNodes = reviews
    ? reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={() => repository ? <RepositoryItem repository={repository} showLink /> : null}
      ListHeaderComponentStyle={styles.header}
      renderItem={({ item }) => <ReviewItem review={item} />}
    />
  );
};

export default SingleRepositoryContainer;
