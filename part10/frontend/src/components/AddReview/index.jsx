// part10/frontend/src/components/AddReview/index.jsx

import React from 'react';
import { useHistory } from 'react-router-native';

import AddReviewContainer from './AddReviewContainer';
import useCreateReview from '../../hooks/useCreateReview';

const AddReview = () => {
  const [createReview, { error }] = useCreateReview();

  const history = useHistory();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;
    try {
      const { data } = await createReview({ ownerName, repositoryName, rating, text });

      if (data?.createReview) {
        history.push(`/repository/${data.createReview.repositoryId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <AddReviewContainer onSubmit={onSubmit} error={error} />;
};

export default AddReview;
