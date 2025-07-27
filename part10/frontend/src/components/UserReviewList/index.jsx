// part10/frontend/src/components/UserReviewList/index.jsx

import React from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@apollo/client';

import useAuthorizedUser from '../../hooks/useAuthorizedUser';
import UserReviewListContainer from './UserReviewListContainer';
import { DELETE_REVIEW } from '../../graphql/mutations';

const UserReviewList = () => {
  const { authorizedUser, fetchMore, refetch } = useAuthorizedUser({
    includeReviews: true,
    first: 20
  });

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    onCompleted: async () => {
      await refetch();
    }
  });

  const handleDelete = (id) => () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () =>
            await deleteReview({
              variables: { id },
            })
        }
      ]
    );
  };

  const onEndReached = () => {
    fetchMore();
  };

  return (
    <UserReviewListContainer user={authorizedUser} onEndReached={onEndReached} handleDelete={handleDelete} />
  );
};

export default UserReviewList;
