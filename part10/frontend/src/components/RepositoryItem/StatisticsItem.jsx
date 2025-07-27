// part10/frontend/src/components/RepositoryItem/StatisticsItem.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { parseStatistics } from '../../utils/helpers';
import Text from '../Text';

const styles = StyleSheet.create({
  statisticsItem: {
    alignItems: 'center',
  },
});

const StatisticsItem = ({ statistic, description, ...props }) => {
  return (
    <View style={styles.statisticsItem} {...props}>
      <Text fontWeight="bold">
        {parseStatistics(statistic)}
      </Text>
      <Text color="textSecondary">{description}</Text>
    </View>
  );
};

export default StatisticsItem;
