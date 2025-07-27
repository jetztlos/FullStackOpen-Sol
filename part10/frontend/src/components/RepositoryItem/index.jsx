// part10/frontend/src/components/RepositoryItem/index.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

import StatisticsContainer from './StatisticsContainer';
import InfoContainer from './InfoContainer';
import Button from '../Button';
import theme from '../../theme';

const styles = StyleSheet.create({
  repositoryContainer: {
    backgroundColor: theme.colors.backgroundLight,
    paddingVertical: theme.spacing.medium,
  },
  linkButton: {
    marginHorizontal: theme.spacing.medium,
  },
});

const RepositoryItem = ({ repository, showLink }) => {
  const openLink = () => {
    Linking.openURL(repository.url);
  };

  return (
    <View style={styles.repositoryContainer}>
      <InfoContainer
        fullName={repository.fullName}
        description={repository.description}
        language={repository.language}
        ownerAvatarUrl={repository.ownerAvatarUrl}
      />
      <StatisticsContainer
        stargazersCount={repository.stargazersCount}
        forksCount={repository.forksCount}
        reviewCount={repository.reviewCount}
        ratingAverage={repository.ratingAverage}
      />
      {showLink && <Button style={styles.linkButton} title="Open in GitHub" onPress={openLink} />}
    </View>
  );
};

export default RepositoryItem;
