import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Spinner from 'react-native-loading-spinner-overlay';
import HTMLView from 'react-native-htmlview';
import showToast from '../../utils/toast';
import {
  Button,
  Stepper,
  ImageModal,
  HeaderTitle,
  CartButton,
  VariationPicker,
  SmartImage,
} from '../../components';
import * as Api from '../../api/api';
import { formatPrice } from '../../utils/utils';
import { primaryColor } from '../../common/const';
import { addToCart } from '../../redux/cart/actions';

// helpers
// find in-stock product based on variant, if there is existing one, return the found one
function findAvailableProduct(products, options) {
  const foundProducts = products?.variations?.filter(variation => {
    let found = 0;
    for (const key in options) {
      const idx = variation.attributes?.findIndex(
        item => item.slug === key && item.option === options[key],
      );
      if (idx !== -1) {
        found++;
      }
    }
    if (found === Object.keys(options).length) {
      return true;
    }
    return false;
  });

  const inStockVariant = foundProducts.find(v => v.in_stock);

  if (inStockVariant) {
    return inStockVariant;
  }

  return foundProducts?.[0];
}

const ImagePreview = ({ id, selected, src, onPress }) => (
  <TouchableOpacity
    key={id}
    onPress={onPress}
    style={{
      width: 45,
      height: 50,
      marginStart: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    }}>
    <SmartImage
      style={{ width: 45, height: 50, opacity: !!selected ? 0.5 : 1 }}
      resizeMode="cover"
      uri={src}
    />
  </TouchableOpacity>
);

const ContactSellerButton = ({ onPress }) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}>
    <Text
      style={{
        fontSize: 16,
        color: primaryColor,
        fontWeight: 'bold',
        marginRight: 5,
      }}>
      {'Contact Seller'}
    </Text>
    <Image
      style={{
        width: 20,
        height: 20,
      }}
      resizeMode="contain"
      resizeMethod="scale"
      source={require('../../../assets/email.png')}
    />
  </TouchableOpacity>
);

class ItemDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle />,
      headerRight: () => <CartButton />,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: primaryColor,
        minHeight: Platform.OS === 'android' ? 65 : 70,
      },
    };
  };

  constructor(props) {
    super(props);

    const { item = {}, fromSearch } = props.navigation.state.params;

    if (!!item?.description) {
      item.description = item.description
        .replace(new RegExp('\n', 'g'), '<br/>')
        .replace(new RegExp('<br />', 'g'), '<br/>')
        .replace(new RegExp('<br/><br/>', 'g'), '\n')
        .replace(new RegExp('<br/>', 'g'), '');
    }

    this.state = {
      item,
      previewImage:
        item.featured_src || item.image_url || item?.images?.[0]?.src || '',
      itemPrice: item.price || 0,
      selectedImageIndex: 0,
      quantity: 1,
      inProgress: false,
      showImageModal: false,
      fromSearch,
      inStock: item.in_stock,
      pickers: {},
      options: {},
    };
  }

  componentDidMount() {
    if (!!this.state.fromSearch) {
      this.getData();
      return;
    }
    this.useDefaultVariations();
  }

  getData = async () => {
    this.setState({
      inProgress: true,
    });

    const { data } = await Api.getProduct(
      this.props.navigation.state.params.id,
    );
    this.setState(
      {
        previewImage: data.product.featured_src,
        item: data.product,
        inProgress: false,
        itemPrice: data.product.price,
        inStock: data.product.in_stock,
      },
      this.useDefaultVariations,
    );
  };

  useDefaultVariations = () => {
    const { item } = this.state;

    const variations = item?.attributes?.filter(item => item.visible) || [];

    if (variations.length) {
      let options = { sku: item.sku };
      variations.forEach(variant => {
        if (variant.options?.length && variant.position > -1) {
          if (variant.name === 'Color') {
            options.color = variant.options[variant.position || 0];
          } else if (variant.name === 'Size') {
            options.size = variant.options[variant.position || 0];
          } else {
            options.type = variant.options[variant.position || 0];
          }
        }
      });

      if (Object.keys(options).length) {
        this.setState({
          item: {
            ...this.state.item,
            options: {
              ...(this.state.item.options || {}),
              ...options,
            },
          },
        });
      }
    }
  };

  onPreviewImagePress = selectedImageIndex => {
    this.setState({
      selectedImageIndex,
      previewImage: this.state.item.images[selectedImageIndex].src,
    });
  };

  productDecrement = () => {
    if (this.state.quantity > 1) {
      this.setState({
        quantity: this.state.quantity - 1,
      });
    }
  };

  productIncrement = () => {
    this.setState({
      quantity: this.state.quantity + 1,
    });
  };

  contactSeller = () => {
    const { user } = this.props;
    const emailText = `Product Enquiry from E-Dental Mart \n \nPRODUCT NAME: ${
      this.state.item.title
    }\n \n PRODUCT URL: ${this.state.item.permalink}\n  \n CUSTOMER NAME: ${
      user?.name || ''
    } \n \nMESSAGE:  `;
    const emailSubject = 'Product Enquiry';

    this.props.navigation.navigate('ContactSeller', {
      link: this.state.item.permalink,
      image: this.state.item?.images?.[0]?.src,
      emailText,
      emailSubject,
    });
  };

  share = () => {
    if (this.state.item.permalink) {
      Share.share(
        {
          message: `Check out this item:\n${this.state.item.permalink}`,
          title: 'E-Dental Mart | Product Details',
        },
        { dialogTitle: 'Share' },
      );
    }
  };

  addToCart = async data => {
    this.props.dispatch(addToCart({ ...data, quantity: this.state.quantity }));
  };

  showImageModal = () => {
    this.setState({ showImageModal: true });
  };
  closeImageModal = () => {
    this.setState({ showImageModal: false });
  };

  handleVariantChange = () => {
    const { previewImage, selectedImageIndex, options, item } = this.state;
    let newPreviewImage = previewImage;
    let newSelectedImageIndex = selectedImageIndex;

    const validOptions = {};
    for (const key in options) {
      if (options[key] && options[key] !== -1) {
        validOptions[key] = options[key];
      }
    }
    const selectedVariant = findAvailableProduct(item, validOptions);

    if (selectedVariant && selectedVariant.image?.length) {
      const nextSelectedImageIndex = item.images.findIndex(it =>
        selectedVariant.image.some(svi => svi.src === it.src),
      );
      if (nextSelectedImageIndex > -1) {
        newSelectedImageIndex = nextSelectedImageIndex;
        newPreviewImage = item.images[newSelectedImageIndex].src;
      }
    }

    const newOptions = {};
    for (const key in options) {
      if (key === 'color' || key === 'size') {
        newOptions[key] = options[key];
      } else {
        newOptions.type = options[key];
      }
    }

    this.setState({
      item: {
        ...item,
        options: {
          ...(item.options || {}),
          ...newOptions,
          sku: selectedVariant?.sku,
        },
        id: selectedVariant?.id,
      },
      previewImage: newPreviewImage,
      selectedImageIndex: newSelectedImageIndex,
      itemPrice: selectedVariant?.price || item.price,
      inStock: selectedVariant?.in_stock,
    });
  };

  render() {
    const { item, itemPrice } = this.state;
    const { description = '', average_rating = 0, images = [] } = item;
    const { showImageModal, previewImage, selectedImageIndex } = this.state;
    const variations = item?.attributes?.filter(item => item.visible) || [];

    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.inProgress}
          textContent={'Loading...'}
          color={primaryColor}
        />
        <ImageModal
          src={previewImage}
          visible={showImageModal}
          onClose={this.closeImageModal}
        />

        <ScrollView>
          <View style={styles.imageContainer}>
            <Pressable onPress={this.showImageModal} disabled={!previewImage}>
              <SmartImage
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                }}
                resizeMode="cover"
                uri={previewImage}
              />
              {/* <Image
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                }}
                progressiveRenderingEnabled={true}
                source={{ uri: previewImage }}
                defaultSource={require('../../../assets/placeholder.png')}
              /> */}
            </Pressable>
          </View>

          <View style={styles.detailsContainer}>
            <View style={{ height: 50, marginTop: 5, marginStart: 15 }}>
              <ScrollView horizontal>
                {images.map((image, index) => (
                  <ImagePreview
                    key={index}
                    onPress={() => this.onPreviewImagePress(index)}
                    selected={index === selectedImageIndex}
                    id={image.id}
                    src={image.src}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.5, paddingStart: 15 }}>
                <Text
                  style={{
                    fontSize: 20,
                    width: '100%',
                    marginTop: 18,
                    fontWeight: 'bold',
                    color: '#000000',
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 20,
                    color: primaryColor,
                    fontWeight: 'bold',
                  }}>
                  {`PKR ${formatPrice(Math.round(itemPrice))}`}
                </Text>
              </View>

              <View
                style={{
                  flex: 0.5,
                  alignItems: 'flex-end',
                  paddingEnd: 15,
                  marginTop: 15,
                }}>
                <Stepper
                  title={this.state.quantity}
                  onPlus={this.productIncrement}
                  onMinus={this.productDecrement}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 15,
            }}>
            {!this.state.inProgress && !this.state.inStock && (
              <Text
                style={{
                  fontSize: 16,
                  color: 'red',
                  fontWeight: 'bold',
                }}>
                This item is currently out of stock
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              marginTop: 3,
              marginBottom: 15,
              alignItems: 'flex-start',
            }}>
            <AirbnbRating
              showRating={false}
              isDisabled={true}
              selectedColor="#f9c817"
              defaultRating={Number(average_rating) || 0}
              size={20}
              style={styles.subTitle}
            />

            <Text
              onPress={() =>
                this.props.navigation.navigate('Reviews', {
                  name: item.title,
                  id: this.props.navigation.state.params.id,
                })
              }
              style={[
                styles.subTitle,
                {
                  marginLeft: 'auto',
                },
              ]}>
              Reviews
            </Text>
          </View>

          {variations.map((variant, index) => {
            return (
              <VariationPicker
                key={index}
                isOpen={this.state.pickers[variant.slug]}
                setOpen={open => {
                  this.setState({
                    pickers: {
                      [variant.slug]: open,
                    },
                  });
                }}
                zIndex={1000 * variations.length}
                zIndexInverse={1000 * (index + 1)}
                title={variant.name}
                value={this.state.options[variant.slug]}
                onValueChange={itemValue => {
                  this.setState(
                    {
                      options: {
                        ...this.state.options,
                        [variant.slug]: itemValue,
                      },
                    },
                    this.handleVariantChange,
                  );
                }}
                options={variant.options}
              />
            );
          })}

          <View
            style={{
              marginHorizontal: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={[styles.subTitle, { flex: 1 }]}>Product Detail</Text>

            <ContactSellerButton onPress={() => this.contactSeller()} />
          </View>
          <View
            style={{
              marginHorizontal: 15,
            }}>
            <Text>
              SKU : {this.state.item?.options?.sku || this.state.item?.sku}
            </Text>
          </View>

          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 15,
              marginBottom: 34,
            }}>
            {!!description ? (
              <HTMLView
                addLineBreaks={false}
                stylesheet={richTextStyles}
                value={description}
              />
            ) : (
              <Text style={{ color: '#000000', fontSize: 16 }}>{'N/A'}</Text>
            )}
          </View>
          {Platform.OS === 'ios' && !!variations.length && (
            <View style={{ height: 150, width: 100 }}></View>
          )}
        </ScrollView>
        <View style={styles.optionsContainer}>
          <Button
            title="ADD TO CART"
            disabled={!this.state?.inStock}
            onPress={() => {
              if (
                variations.length > 0 &&
                variations.length !==
                  Object.values(this.state.options).filter(Boolean).length
              ) {
                showToast('Please choose an option');
                return;
              }
              this.addToCart({ ...item, price: itemPrice });
            }}
          />
          <Button title="SHARE" onPress={this.share} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: Dimensions.get('window').height * 0.294,
    backgroundColor: 'white',
  },
  detailsContainer: {},
  optionsContainer: {
    justifyContent: 'flex-end',
  },
  subTitle: { fontSize: 17, fontWeight: 'bold', color: '#000000' },
});

const richTextStyles = StyleSheet.create({
  p: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
});

const mapStateToProps = ({ user: { user } }) => {
  return {
    user,
  };
};

export default connect(mapStateToProps, null)(ItemDetail);
