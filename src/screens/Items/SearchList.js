//import liraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import Highlighter from 'react-native-highlight-words';

import SearchInput from './Components/SearchInput';
import { loadSearchData } from '../../redux/search/actions';
import { noop } from '../../utils/utils';
import { Styles, SmartImage } from '../../components';
import { primaryColor } from '../../common/const';

const SearchItemComponent = ({
  title,
  imageUrl,
  highlightText = '',
  onItemPress = noop,
}) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 50,
          paddingHorizontal: 15,
          paddingVertical: 5,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SmartImage
            style={{ width: 50, height: 30 }}
            resizeMode="cover"
            uri={imageUrl}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
          <Highlighter
            style={Styles.normalText}
            highlightStyle={{ color: '#000', fontWeight: '500' }}
            searchWords={[highlightText]}
            textToHighlight={title}
          />
        </View>
        <Image
          style={{
            width: 10,
            height: 10,
            marginLeft: 5,
            tintColor: '#7E7E7E',
          }}
          resizeMode="cover"
          source={require('../../../assets/linkArrow.png')}
        />
      </View>
    </TouchableOpacity>
  );
};

const ItemSeparator = () => (
  <View style={{ height: 1, width: '100%', backgroundColor: '#eaeaea' }}></View>
);

class SearchList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <SearchInput />,
      headerRight: () => null,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  componentDidMount() {
    this.props.dispatch(loadSearchData());
  }

  state = {
    items: [],
    showIndicator: true,
  };

  onItemPress = item => {
    this.props.navigation.navigate('ProductDetails', {
      id: item.id,
      item,
      fromSearch: true,
    });
  };

  renderItem = ({ item }) => {
    const { searchText } = this.props;
    return (
      <SearchItemComponent
        title={item.title}
        imageUrl={
          item?.scaled_image || item?.image_url || item?.images?.[0]?.src
        }
        highlightText={searchText}
        onItemPress={() => this.onItemPress(item)}
      />
    );
  };

  render() {
    const { searchResults } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <FlatList
            style={{ alignSelf: 'stretch' }}
            data={searchResults}
            keyExtractor={item => item.id + ''}
            renderItem={this.renderItem}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    alignSelf: 'stretch',
  },
  itemContainer: {
    width: '93%',
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 5,
    height: '95%',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
});

const mapStateToProps = ({ search: { searchResults, searchText } }) => ({
  searchResults,
  searchText,
});

export default connect(mapStateToProps)(SearchList);
