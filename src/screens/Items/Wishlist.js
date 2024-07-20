// import React, { Component } from 'react';
// import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, Image,CheckBox ,ActivityIndicator} from 'react-native';
// // import { Ionicons as Icon, AntDesign as AntIcon } from "@expo/vector-icons";
// import Icon from 'react-native-vector-icons/Ionicons';
// import { createStackNavigator } from "react-navigation-stack";
// import { connect } from "react-redux";
// import urls from '../../utils/urls';
// import Axios from "axios";
// import showToast from '../../utils/toast';

// import {set,get} from '../../screens/localStorage/cart'


// const primaryColor = "#008577"; 
// const log = console.log 

// var newArray=[]
// class Wishlist extends Component {
//   static navigationOptions = ({ navigation }) => {
//     return {
//       headerTitle: () => (
//         <Text
//           style={{
//             fontSize: 23,
//             marginStart: 10,
//             color: "#fff"
//           }}>
//           Wishlist
//         </Text>
//       ),
//       headerStyle: {
//         backgroundColor: primaryColor
//       },
//       drawerLabel: "Wishlist",
//       drawerIcon: ({ tintColor }) => (
//         <Icon name="md-heart" size={25} color={tintColor} />
//       ),
//       headerLeft: () => (
//         <Icon
//           onPress={() => navigation.openDrawer()}
//           style={{ marginStart: 20 }}
//           name="md-menu"
//           size={25}
//           color="#fff"
//         />
//       )
//     };
//   };

//   state = {
//     items: [],
//     selectAll : true,
//     showProgress: false,
//     check:false
//   }

//   constructor(props) {
//     super(props);
   
//   }
//   getData = async () => {

//     this.setState({
//       inProgress:true
//     })
//     try {
//       const res = await Axios.get(urls.wishlist(this.props.user.userId)); 
//       log("wishlist " + res)

//       if( res.data.error){
//         this.setState({
//           inProgress:false
//         })
//         showToast(res.data.error)
//         return
//       }  
//       this.getProductDetails(res.data)

//     }catch(e) {
//       this.setState({
//         inProgress:false
//       })
//       console.log(e)
//     }
//   }

//   getProductDetails = (val)=>
//   {
//     newArray = []
//     try {
//       var Image = null
//       val.map((item) => {

//         Axios.get(urls.product(item.product_id))
//         .then((res) =>
//         {
//           var imgArray = [res.data.product.images]
//           imgArray.map((img)=>{
//             Image = img[0].src
//           })

//         var wishlistItem = { ...res.data,
//           "product_id":item.product_id,
//           "variation_id":item.variation_id,
//           "date":item.date,
//           "quantity":item.quantity,"price":item.price,
//           "in_stock":item.in_stock,
//            "product_name": res.data.product.title ,
//            "product_image": Image ,
//            "ischecked" : false } 
//          newArray.push(wishlistItem)

//          this.setState({
//           inProgress:false
//         })

//          this.setState({
//           items: newArray
//           })

//         }).catch((error) =>
//         {
//           this.setState({
//             inProgress:false
//           })
//           console.log("  errorrr" + error)
//         }); 
//       })

//     }catch(e) {
//       console.log("errorr " + e)
      
//     this.setState({
//       inProgress:false
//     })
//     }
//   }

//   componentDidMount() { 
//     // this.focusListener = this.props.navigation.addListener(
//     //   "willFocus",
//     //   payload => {
//     //     if (!this.props.user.userId) {
//     //         this.getData();
//     //     } else {
//     //         this.getData();
//     //     }
//     //   }
//     // );
//     this.getData();
//   }

//   _addToCart = async () => {
//     this.setState({
//       inProgress :true
//     })

//     let data =  this.state.items
//     data.map((item)=>{
//       if(item.ischecked == true)
//       {
        
      
//        Promise.all(Axios.delete(urls.removeWishlistItem(this.props.user.userId ,item.product_id))
//         .then((res)=> { 
//           this.getData()

//           console.log("res " +JSON.stringify(res))

//         })
//         .catch((err)=> { 
//           console.log("err " + err) 
//           this.setState({
//             inProgress :false
//           })})
//         )


//         var cartData = {...item.product, "quantity": 1}
//         console.log("add to cart " +JSON.stringify(cartData))
//         set(cartData)

//       }
//       })

//     }

//   componentWillUnmount() {
//     //this.focusListener.remove();
//   }

//   _deleteAll = () => {
//     this.setState({
//       inProgress :true
//     })
//     let data =  this.state.items
//     data.map((item)=>{
//       if(item.ischecked == true)
//       {
//        Promise.all(Axios.delete(urls.removeWishlistItem(this.props.user.userId ,item.product_id))
//         .then((res)=> { 
//           console.log("res " +JSON.stringify(res))
      
//           this.getData()

//          })
//         .catch((err)=> { 
//           console.log("err " + err)
//           this.setState({
//             inProgress :false
//           })
//          })
//         )
//       }
       
//       })

//   }

//   checkBoxOnPress = (itemId) => {

//   var checked 

//   const newArray = this.state.items.map(item => {

//     if (item.product_id == itemId) {
//       if(item.ischecked)
//       {
//         checked = false
//       }
//       else{
//         checked = true
//       }
//       return { ...item, ischecked: checked };
//     }
//     return item;
//   });
//   this.setState({
//     items: newArray
//   });

//   }

//   _renderItem = (item) => {

//     return (
//       <View style={styles.itemContainer}>
//         {/* <Icon name="md-checkbox" color={primaryColor} size={20} /> */}
//         <TouchableOpacity style={{flex: 0, padding: 1, justifyContent: 'center', }}  onPress={ () => this.checkBoxOnPress(item.product_id)}>
//         {item.ischecked ? 
//         (<Image style={styles.container} resizeMode="contain" source={require('../../../assets/check.png')}/> )
//          :
//         (<Image style={styles.container} resizeMode="contain" source={require('../../../assets/uncheck.png')} />)}
      
//     </TouchableOpacity>

//    {/* <CheckBox
//     checked={this.state.check === item.id}
//     onPress={() => this.checkBoxOnPress(item)}
//    /> */}


//         <Image
//           style={styles.itemImage}
//           resizeMode="contain"
//           source={item.product_image ? { uri: item.product_image} :require("../../../assets/picinstrument.jpg")}
//         />
//   <Text style={styles.headerStyles}>{item.product_name}</Text>
//     <Text style={[styles.headerStyles, { width: "15%" }]}>{item.price}</Text>
//     <Text style={[styles.headerStyles, { width: "15%" }]}>{item.date}</Text>
//       {item.in_stock == 0? 
//         <Text style={[styles.headerStyles, { width: "15%" }]}>
//           Not in stock
//         </Text>
//         :
//         <Text style={[styles.headerStyles, { width: "15%" }]}>
//           In stock
//         </Text>
//         }
//       </View>
//     );
//   };

//   _selectAll = () => {
//     this.setState({
//       selectAll: !this.state.selectAll
//     })
//   }

//   render() {
//     return (
//       <View style={styles.container}>
        
//         <View
//           style={{
//             flexDirection: "row",
//             margin: 20,
//             justifyContent: "space-between"
//           }}>
//           <Text style={{ fontSize: 22, fontWeight: "500" }}>My Wishlist</Text>

//           <TouchableOpacity
//             onPress={this._deleteAll}
//             style={{ height: 28, width: 28 }}>
//             <Image
//               resizeMode="contain"
//               style={{ height: 28, width: 28 }}
//               source={require("../../../assets/delete.png")}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.itemContainer}>
//           <Icon
//             onPress={this._selectAll}
//             name={this.state.selectAll ? "md-checkbox" : "md-checkbox-outline"}
//             color={primaryColor}
//             size={20}
//           />
//           <Image style={styles.itemImage} resizeMode="contain" />
//           <Text style={styles.headerStyles}>Product Name</Text>
//           <Text style={[styles.headerStyles, { width: "15%" }]}>
//             Unit Price
//           </Text>
//           <Text style={[styles.headerStyles, { width: "15%" }]}>
//             Date Added
//           </Text>
//           <Text style={[styles.headerStyles, { width: "15%" }]}>
//             Stock Status
//           </Text>
//         </View>

//             <View>
//               {this.state.inProgress ? (
//                 <View
//                   style={{ justifyContent: "center", alignItems: "center" }}>
//                   <ActivityIndicator size="large" color={primaryColor} />
//                 </View>
//               ) : null}
//             </View>

//         <FlatList
//           data={this.state.items}
//           renderItem={({ item }) => this._renderItem(item)}
//           ListFooterComponent={() => <View style={{ height: 70 }} />}
//         />

//         <TouchableOpacity style={styles.addToCartButton} 
//         onPress ={()=> this._addToCart()}>
//           <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
//             ADD TO CART
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   itemImage: {
//     width: 60,
//     height: 60,
//     marginStart: 10,
//     marginEnd: 10
//   },
//   itemContainer: {
//     height: 70,
//     width: "90%",
//     alignSelf: "center",
//     flexDirection: "row",
//     alignItems: "flex-start"
//   },
//   headerStyles: {
//     width: "30%",
//     fontSize: 13,
//     marginTop: 5,
//     fontWeight: "500"
//   },
//   addToCartButton: {
//     position: "absolute",
//     width: "98%",
//     bottom: 5,
//     marginStart: '1%',
//     marginEnd: '1%',
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: primaryColor
//   }
// });


// const mapStateToProps = (state /*, ownProps*/) => {
//   return {
//     user: state
//   };
// };
 
// export default createStackNavigator(
//   {
//     Wishlist: {
//       screen: connect(mapStateToProps, null)(Wishlist)
//     }
//   },
//   {
//     navigationOptions: {
//       headerStyle: {
//         backgroundColor: primaryColor
//       },
//       drawerLabel: "Wishlist",
//       drawerIcon: ({ tintColor }) => (
//         <Icon name="md-heart" size={25} color={tintColor} />
//       )
//     }
//   }
// );