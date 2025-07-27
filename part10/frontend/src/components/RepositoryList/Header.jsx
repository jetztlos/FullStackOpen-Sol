// part10/frontend/src/components/RepositoryList/Header.jsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import SortingPicker from './SortingPicker';
import TextInput from '../TextInput';
import theme from '../../theme';

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: theme.spacing.medium,
  },
  searchbar: {
    backgroundColor: theme.colors.backgroundLight,
  }
});

const Header = ({ sortType, setSortType, searchKeyword, setSearchKeyword }) => {
  const [searchValue, setSearchValue] = useState(searchKeyword);
  
  const debouncedSetSearchKeyword = useDebouncedCallback((text) => setSearchKeyword(text), 500);
  
  return (
    <View style={styles.headerContainer}>
      <TextInput
        style={styles.searchbar}
        value={searchValue}
        autoCapitalize="none"
        placeholder="Search..."
        onChangeText={(text) => {
          setSearchValue(text);
          debouncedSetSearchKeyword(text);
        }}
      />
      <SortingPicker sortType={sortType} setSortType={setSortType} />
    </View>
  );
};

export default Header;
