import React, { Component } from 'react'
import { View, Text, Alert, StyleSheet, FlatList, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Container, Tabs, Tab, Header, Left, Body, ScrollableTab, Right, Icon} from 'native-base'
import Modal from 'react-native-modal';
import { Button, Divider } from 'react-native-elements'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

import * as categoryActions from './../redux/actions/category'
import * as menuActions from './../redux/actions/menus'
import * as orderActions from './../redux/actions/orders'

import List from '../components/List'
import OrderedList from '../components/OrderedList'

import { categories, menus } from '../../data'
import { colors, styles as globalStyles } from '../styles'
import { convertToRupiah, toMinute } from '../functions';
import Axios from 'axios'

// API 
import { API_TRANSACTION, API_TRANSACTION_ORDERS, API_ORDER } from '../service/api'
import { FAB } from 'react-native-paper';
//import FAB from 'react-native-fab'

class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Table:'No.Table: ',
            orderedData: [],
            categories: categories,
            menus: menus,
            time: 0,
            timer: null,
            modalVisible: false,
            transactionData: {
                subTotal: 0,
                discount: 0,
                serviceCharge: 0,
                tax: 0,
                total: 0
            },

        }
    }
    async componentDidMount() {
        let timer = setInterval(() => (
            this.setState(state => (
                { time: state.time + 1 }
            ))
        ), 1000)
        let interval = setInterval(async () => {
            await Axios.patch(`${API_TRANSACTION_ORDERS}/${this.state.transactionData.id}`, {})
            const orderData = await Axios.get(`${API_TRANSACTION_ORDERS}/${this.state.transactionData.id}`)
            let orderDataWithMenu = []
            if (!orderData) {
                //error
            } else {
                orderData.data.forEach((value) => {
                    orderDataWithMenu = [...orderDataWithMenu,
                    {
                        ...value,
                        menu: this.props.menus.data.filter((item) => (item.id === value.menuId))[0]
                    }
                    ]
                })
            }

            await this.setState({
                //modalVisible: visible,
                orderedData: orderDataWithMenu
            })
        }, 15000)
        await this.props.getCategoryData()
        await this.props.getMenuData()
        await this.props.getOrderData()
        const transaction = await AsyncStorage.getItem('transaction')
        console.log('====================================');
        console.log(transaction);
        console.log('====================================');
         this.setState({
            transactionData: {
                ...this.state.transactionData,
                ...JSON.parse(transaction),
            },
            timer
        })
    }

    async setModalVisible(visible) {
        await this.setState({
            modalVisible: visible,

        })



    }

    sendOrders() {
        this.props.orders.data.forEach(async (value) => {
            res = await Axios.post(API_ORDER,
                {
                    menuId: value.menuId,
                    transactionId: value.transactionId,
                    qty: value.qty,
                    price: value.price,
                    status: value.status
                })
            if (!res) {
                alert('gagal Kirim')
            }
            const orderData = await Axios.get(`${API_TRANSACTION_ORDERS}/${this.state.transactionData.id}`)
            let orderDataWithMenu = []
            if (!orderData) {
                //error
            } else {
                orderData.data.forEach((value) => {
                    orderDataWithMenu = [...orderDataWithMenu,
                    {
                        ...value,
                        menu: this.props.menus.data.filter((item) => (item.id === value.menuId))[0]
                    }
                    ]
                })
            }

            await this.setState({
                orderedData: orderDataWithMenu
            })

            let total = 0
            this.state.orderedData.forEach((value) => {

                total = total + value.price

            })

            await this.setState({
                transactionData: {
                    ...this.state.transactionData,
                    subTotal: total,
                    discount: total * 0,
                    serviceCharge: total * 5 / 100,
                    tax: total * 10 / 100,
                    total: total * 0 + total + total * 5 / 100 + total * 10 / 100
                }
            })
            this.props.clearOrders()
        })

    }

    async payOrders() {
        let res
        const { transactionData } = this.state
        if (this.state.orderedData.filter(value => value.status === 0).length === 0) {
            res = await Axios.patch(`${API_TRANSACTION}/${this.state.transactionData.id}`,
                {
                    tableNumber: transactionData.tableNumber,
                    finishedTime: toMinute(0 + this.state.time),
                    subtotal: transactionData.subTotal,
                    discount: transactionData.discount,
                    serviceCharge: transactionData.serviceCharge,
                    tax: transactionData.tax,
                    total: transactionData.total,
                    isPaid: false
                })
            if (!res) {
                alert('failed to sent')
            }
            this.props.clearOrders()
            this.props.navigation.navigate('OrderComplete', { id: transactionData.id })
        } else {
            alert('Order status still pending')
        }

    }


    handleConfirm() {

        Alert.alert(
            'Confirm Order',
            'Are you sure to order this?',
            [
                
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        this.sendOrders()
                    }
                }

            ],
            { cancelable: false },
        )
    }
    render() {
        let category = {
            data: this.state.categories
        }
        let menus = {
            data: this.state.menus
        }
        let isLoaded = !(this.props.menus.data.length == 0 && this.props.category.data.length == 0)
        if (isLoaded) {
            menus = this.props.menus
            category = this.props.category
        }
        const { orders } = this.props
        
        return (
            <Container>
                <Header
                    style={{
                        backgroundColor: colors.primary.dark
                    }}
                    androidStatusBarColor={colors.primary.dark}
                >
                    <Left

                    >
                        <Text
                            style={[globalStyles.textLight, {
                                fontSize: 16,
                                textAlign: 'center',
                               top:10,
                                borderColor: 'white',
                              
                                width: 100,
                                height: 25,
                            }]}
                        >
                           {this.state.Table}{this.state.transactionData.tableNumber}</Text>
                    </Left>
                    <Body>
                    <Text
                            style={[globalStyles.textLight, {
                                fontSize: 20,

                                bottom:10,
                                textAlign: 'center',
                               
                                borderColor: 'white',
                              
                                width: 180,
                                height: 25,
                            }]}
                        >
                           Kedaiku</Text>
                        </Body>
                    
                </Header>

                {this.props.menus.isLoading && (
                    <View style={{ flexGrow: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={50} color={colors.primary.light} />
                    </View>
                )}
                {!this.props.menus.isLoading && (
                    <Tabs tabBarUnderlineStyle={{borderWidth: 0.5 , backgroundColor: '#FFA500'}}
                        renderTabBar={() => <ScrollableTab />}
                    >
                        {category.data.map((data) => (
                            <Tab
                                heading={data.name}
                                key={data.id}
                                
                                tabStyle={{ backgroundColor: colors.primary.dark }}
                                activeTabStyle={{ backgroundColor: colors.primary.dark}}
                                activeTextStyle={{color: colors.text.gold}}
                                textStyle={colors.text.white}
                            >
                                <List data={menus.data.filter((item) => (item.categoryId === data.id))} />
                            </Tab>
                        ))}
                    </Tabs>
                )}
                
                
                
                {/* <View style={{ minHeight: 200, flexDirection: 'row', backgroundColor: colors.primary.dark, }}>
                    <View

                    >
                         {orders.data.length !== 0 && (
                        <OrderedList />
                    )}
                         <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                padding: 3,
                            }}
                        >
                        <Button
                            disabled={orders.data.filter((value) => (value.status === 0)).length === 0}
                            title={'Confirm Order'}
                            containerStyle={{
                                alignSelf: 'stretch',
                            }}
                            icon={{
                                type: 'ionicon',
                                name: 'md-reorder',
                                color: (this.state.orderedData.length === 0 || this.state.orderedData.filter(value => value.status === 0).length == 0) ? 'grey' : 'white'

                            }}
                            titleStyle={globalStyles.textLight}
                            buttonStyle={{
                                backgroundColor: colors.primary.light,
                                borderRadius: 5,
                                margin: 5,
                                width: 140,
                                height: 50,

                            }}
                            onPress={() => {
                                this.handleConfirm()
                            }}
                        />
                       
                            <Button
                                disabled={this.state.orderedData.length === 0 || this.state.orderedData.filter(value => value.status === 0).length == 0}
                                title='Call'
                                icon={{
                                    type: 'ionicon',
                                    name: 'md-call',
                                    color: (this.state.orderedData.length === 0 || this.state.orderedData.filter(value => value.status === 0).length == 0) ? 'grey' : 'white'

                                }}
                                containerStyle={{
                                    alignSelf: 'stretch',
                                }}
                                titleStyle={globalStyles.textLight}
                                buttonStyle={{
                                    backgroundColor: colors.primary.light,
                                    margin: 5,
                                    borderRadius: 5,
                                    width: 100,
                                    height: 50,
                                }}
                                onPress={() => {
                                    this.payOrders()
                                }}
                            />
                            <Button
                                title='Bill'
                                icon={{
                                    type: 'ionicon',
                                    name: 'md-list-box',
                                    color: 'white'

                                }}
                                containerStyle={{
                                    alignSelf: 'stretch',
                                }}
                                titleStyle={globalStyles.textLight}
                                buttonStyle={{
                                    backgroundColor: colors.primary.light,
                                    margin: 5,
                                    borderRadius: 5,
                                    width: 100,
                                    height: 50,
                                }}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible)
                                }}
                            />
                        </View>
                    </View>
                   
                </View> */}
                <TouchableOpacity
                    style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:70,
                        position: 'absolute',                                          
                        bottom: 10,                                                    
                        right: 10,
                        height:70,
                        backgroundColor:'#ffa500',
                        borderRadius:100,
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('Cart');
                        }} 
                    >
                    <Icon name="ios-cart"  size={30} style={{color:'white'}} />
                    </TouchableOpacity>
                                    
                <Modal

                    isVisible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible)
                    }}
                    style={{position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0}}
                >
                    <View style={{
                        height: Dimensions.get("screen").height * 80 / 100,
                        backgroundColor: 'white',
                        borderWidth: 0.5
                    }}>

                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                marginBottom: 5,
                                padding: 10,
                                borderBottomWidth: 0.5,
                                backgroundColor: colors.primary.normal
                            }}
                        >
                            <Button
                                icon={{
                                    type: 'ionicon',
                                    name: "md-close",
                                    size: 20,
                                    color: "white"
                                }}
                                buttonStyle={{
                                    padding: 1,
                                    paddingVertical: 2,
                                    backgroundColor: colors.primary.normal,
                                    borderRadius: 50
                                }}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible)
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexGrow: 1,
                                justifyContent: 'space-between',
                                padding: 10

                            }}
                        >
                            <View style={{ flexGrow: 1 }}>
                                <FlatList
                                    data={this.state.orderedData}
                                    extraData={this.state}
                                    style={{ flex: 1 }}
                                    renderItem={({ item, index }) => (
                                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                            <View>
                                            <Text style={[globalStyles.textDark, {
                                                marginRight: 5,
                                                width: 70,
                                                color: item.status === 0 ? 'red' : 'green',
                                                fontSize: 16
                                            }]}>{item.status === 0 ? 'PENDING' : 'SENT'}</Text>
                                            </View>
                                            
                                            <Text style={[globalStyles.textDark, { flexGrow: 1 }, { fontSize: 16 }]}>{item.menu.name} : {item.qty}</Text>
                                            <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(item.price)}</Text>
                                        </View>
                                    )}
                                />
                            </View>

                            <View
                            >
                                <Divider
                                    style={{
                                        marginVertical: 5,
                                        borderBottomWidth: 2
                                    }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Subtotal</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.subTotal)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Diskon</Text>
                                    <Text style={[  globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.discount)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Biaya Layanan (5%)</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.serviceCharge)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Pajak (10%)</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.tax)}</Text>
                                </View>
                                <Divider
                                    style={{
                                        marginVertical: 5,
                                        borderBottomWidth: 1
                                    }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Total</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.total)}</Text>
                                </View>
                                <Divider
                                    style={{
                                        marginVertical: 5,
                                        borderBottomWidth: 2
                                    }}
                                />
                                <Button title='Payment'
                                    disabled={this.state.orderedData.length === 0 || this.state.orderedData.filter(value => value.status === 0).length > 0}
                                    containerStyle={{
                                        alignSelf: 'stretch',
                                    }}
                                    titleStyle={globalStyles.textLight}
                                    buttonStyle={{
                                        backgroundColor: colors.primary.light,
                                        borderRadius: 5,
                                        height: 40,
                                    }}
                                    onPress={() => {
                                        this.payOrders()
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </Container>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getCategoryData: () => dispatch(categoryActions.getData()),
        getMenuData: () => dispatch(menuActions.getData()),
        getOrderData: () => dispatch(orderActions.getOrders()),
        clearOrders: () => dispatch(orderActions.clearOrders()),
        editOrders: (value) => dispatch(orderActions.editOrders(value)),
    }
}
const mapStateToProps = state => {
    return {
        category: state.category,
        menus: state.menus,
        orders: state.orders,
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu)
const styles = StyleSheet.create({
    fab: {
      backgroundColor:'#FFA500',
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    FABContainer : {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center'
    },
    FABButton: {
        backgroundColor: 'white',
        width: 80,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
  })