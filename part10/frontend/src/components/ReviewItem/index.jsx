// part10/frontend/src/components/ReviewItem/index.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

import Text from '../Text';
import Subheading from '../Subheading';
import Button from '../Button';
import theme from '../../theme';
import { parseDate } from '../../utils/helpers';

const styles = StyleSheet.create({
  reviewItemContainer: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.medium,
  },
  reviewDataContainer: {
    flexDirection: 'row',
  },
  ratingContainer: {
    marginRight: theme.spacing.medium,
    width: theme.iconSize.medium,
    height: theme.iconSize.medium,
    borderRadius: theme.iconSize.medium / 2,
    borderColor: theme.colors.primary,
    borderWidth: theme.borderWidth.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rating: {
    color: theme.colors.primary,
  },
  reviewTextContainer: {
    flex: 1,
  },
  review: {
    marginTop: theme.spacing.small,
  },
  ButtonContainer: {
    flexDirection: 'row',
  },
  ViewButton: {
    flex: 1,
    marginRight: theme.spacing.medium,
  },
  DeleteButton: {
    flex: 1,
    backgroundColor: theme.colors.urgent,
  },
});

const ReviewItem = ({ review, repositoryAsTitle, showReviewActions, handleDelete }) => {
  const showReviewText = Boolean(review.text);

  return (
    <View style={styles.reviewItemContainer}>
      <View style={styles.reviewDataContainer}>
        <View style={styles.ratingContainer}>
          <Subheading style={styles.rating}>{review.rating}</Subheading>
        </View>
        <View style={styles.reviewTextContainer}>
          {repositoryAsTitle
            ? <Subheading>{review.repository.fullName}</Subheading>
            : <Subheading>{review.user.username}</Subheading>}
          <Text color="textSecondary">{parseDate(review.createdAt)}</Text>
          {showReviewText && <Text style={styles.review}>{review.text}</Text>}
        </View>
      </View>
      {showReviewActions && <View style={styles.ButtonContainer}>
        <Link
          style={styles.ViewButton}
          component={Button}
          title="View Repository"
          to={`/repository/${review.repository.id}`}
        />
        <Button
          style={styles.DeleteButton}
          title="Delete Review"
          onPress={handleDelete(review.id)}
        />
      </View>}
    </View>
  );
};

export default ReviewItem;
