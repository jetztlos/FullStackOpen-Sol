// part10/frontend/src/components/RepositoryItem/StatisticsContainer.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import StatisticsItem from './StatisticsItem';
import theme from '../../theme';

const styles = StyleSheet.create({
  statistics: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing.medium,
  },
});

const StatisticsContainer = ({ stargazersCount, reviewCount, forksCount, ratingAverage }) => {
  return (
    <View style={styles.statistics}>
      <StatisticsItem
        statistic={stargazersCount}
        description="Stars"
        testID="stargazersCountStatsItem"
      />
      <StatisticsItem
        statistic={forksCount}
        description="Forks"
        testID="forksCountStatsItem"
      />
      <StatisticsItem
        statistic={reviewCount}
        description="Reviews"
        testID="reviewCountStatsItem"
      />
      <StatisticsItem
        statistic={ratingAverage}
        description="Rating"
        testID="ratingAverageStatsItem"
      />
    </View>
  );
};

export default StatisticsContainer;
