// part10/frontend/src/components/RepositoryItem/InfoContainer.jsx

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Text from '../Text';
import Subheading from '../Subheading';
import theme from '../../theme';

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.medium,
  },
  avatarContainer: {
    marginRight: theme.spacing.medium,
  },
  avatar: {
    width: theme.iconSize.medium,
    height: theme.iconSize.medium,
    borderRadius: theme.radius.medium,
  },
  infoTextContainer: {
    flex: 1,
  },
  language: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.tiny,
    borderRadius: theme.radius.medium,
    marginTop: theme.spacing.tiny,
  },
});

const InfoContainer = ({ fullName, description, language, ownerAvatarUrl }) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{
            uri: ownerAvatarUrl
          }}
        />
      </View>
      <View style={styles.infoTextContainer}>
        <Subheading testID="fullName">{fullName}</Subheading>
        <Text color="textSecondary" testID="description">{description}</Text>
        <Text color="textLight" style={styles.language} testID="language">{language}</Text>
      </View>
    </View>
  );
};

export default InfoContainer;
