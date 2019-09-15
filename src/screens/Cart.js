import React, { Component } from 'react'
import { Alert ,StyleSheet, View, Text, Dimensions, FlatList } from 'react-native'
import {  IndicatorViewPager } from 'rn-viewpager'
import { Button, Divider } from 'react-native-elements'
import { convertToRupiah, toMinute } from '../functions';
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { colors, styles as globalStyles } from '../styles'
import StepIndicator from 'react-native-step-indicator'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import OrderedList  from '../components/OrderedList'
import Axios from 'axios'

import * as categoryActions from './../redux/actions/category'
import * as menuActions from './../redux/actions/menus'
import * as orderActions from './../redux/actions/orders'

// API 
import { API_TRANSACTION, API_TRANSACTION_ORDERS, API_ORDER } from '../service/api'



const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 2,
  separatorStrokeFinishedWidth: 2,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}



const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    name: 'feed',
    color: stepStatus === 'finished' ? '#ffffff' : '#fe7013',
    size: 15
  }
  switch (position) {
    case 0: {
      iconConfig.name = 'shopping-cart'
      break
    }
    case 1: {
      iconConfig.name = 'payment'
      break
    }
   
    default: {
      break
    }
  }
  return iconConfig
}

class Cart extends Component {
  constructor () {
    super()
    this.state = {
      currentPage: 0,
      transactionData: {
        subTotal: 0,
        discount: 0,
        serviceCharge: 0,
        tax: 0,
        total: 0
    },
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextState.currentPage != this.state.currentPage) {
      if (this.viewPager) {
        this.viewPager.setPage(nextState.currentPage)
      }
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
    }, 10000)
    await this.props.getCategoryData()
    await this.props.getMenuData()
    await this.props.getOrderData()
    const transaction = await AsyncStorage.getItem('transaction')
    console.log('====================================');
    console.log(transaction);
    console.log('====================================');
    await this.setState({
        transactionData: {
            ...this.state.transactionData,
            ...JSON.parse(transaction),
        },
        timer
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

  render () {
   
    const { orders } = this.props
    return (
      <View style={styles.container}>
        
        <View style={styles.stepIndicator}>
          <StepIndicator
            stepCount={2}
            renderStepIndicator={this.renderStepIndicator}
            customStyles={secondIndicatorStyles}
            currentPosition={this.state.currentPage}
            onPress={this.onStepPress}
            labels={[
              'Cart',
              'Payment'
              
            ]}
          />
        </View>
        
        <IndicatorViewPager
        
          style={{ flex: 1,  backgroundColor: colors.primary.dark }}
          onPageSelected={page => {
            this.setState({ currentPage: page.position })
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            
            <OrderedList/>
            
             <View style={{ flexDirection: 'row',  }}>
                    <View

                    >
                       
                    
                         <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                padding: 3,
                            }}
                        >
                        <Button
                            //disabled={orders.data.filter((value) => (value.status === 0)).length === 0}
                            title={'Confirm Order'}
                            containerStyle={{
                                alignSelf: 'stretch',
                            }}
                            icon={{
                                type: 'ionicon',
                                name: 'md-reorder',
                                //color: (this.state.orderedData.length === 0 || this.state.orderedData.filter(value => value.status === 0).length == 0) ? 'grey' : 'white'

                            }}
                            titleStyle={globalStyles.textLight}
                            buttonStyle={{
                                backgroundColor: colors.primary.light,
                                borderRadius: 5,
                                margin: 5,
                                height: 50,

                            }}
                            onPress={() => {
                                this.handleConfirm()
                            }}
                        />
                        
                        
                        
                            
                        </View>
                    </View>
                   
                </View>
          </View>

          {/* Payment */}
          <View

            style={{
              backgroundColor: '#FF5733',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
                            
                <View style={{
                    height: Dimensions.get("screen").height * 80 / 100,
                    width: '100%',
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
                                //disabled={this.state.orderedData.length === 0 || this.state.orderedData.filter(value => value.status === 0).length > 0}
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

          </View>
          
          
        </IndicatorViewPager>

    {/* <ViewPager
          style={{ flexGrow: 1 }}
          ref={viewPager => {
            this.viewPager = viewPager
          }}
          
          onPageSelected={page => {
            this.setState({ currentPage: page.position })
          }}
        >
          {PAGES.map(page => this.renderViewPagerPage(page))}
        </ViewPager>  */}
      </View>
    )
  }

  onStepPress = position => {
    this.setState({ currentPage: position })
    this.viewPager.setPage(position)
  }

  renderViewPagerPage = data => {
    return (
      <View style={styles.page}>
        <Text>{data}</Text>
      </View>
    )
  }

  renderStepIndicator = params => (
    <MaterialIcon {...getStepIndicatorIconConfig(params)} />
  )

  renderLabel = ({ position, label, currentPosition }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </Text>
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
)(Cart)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.dark
  },
  stepIndicator: {
    marginVertical: 10
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999'
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f'
  }
})