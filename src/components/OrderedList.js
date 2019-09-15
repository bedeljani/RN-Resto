import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import * as orderActions from './../redux/actions/orders'

import * as menuActions from './../redux/actions/menus'
import AsyncStorage from '@react-native-community/async-storage'
import { convertToRupiah } from '../functions';
import { colors, styles as globalStyles } from '../styles';
import { Card, CardItem } from 'native-base';
import { Icon } from 'native-base'


class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
    }
    handleAddOrder = item => async () => {
        const order = this.props.orders.data.filter((data) => (data.menuId === item.id))

        if (order.length >= 1) {
         
            this.props.editOrders({
                ...item,
                price: order[0].price + item.price,
                qty: order[0].qty + 1
            })
        }
    }
    handleDeleteOrder = item => () => {
        const order = this.props.orders.data.filter((data) => (data.menuId === item.id))
       
        if (item.qty) {
            this.props.editOrders({
                ...item,
               
                qty: item.qty - 1
            })
        } else {
            this.props.removeOrders(item.menuId)
        }
    }
    async componentDidMount() {

        await this.props.getOrders()
    }

    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                <FlatList
                    data={this.props.orders.data}
                    extraData={this.props.orders}
                    keyExtractor={item => item.menuId}
                    style={{
                        flex: 1,
                    }}
                    renderItem={({ item }) => (
                       
                            <View style={{flexDirection:'row'}} >

                                <Card style={{elevation:0}}>
                                    <CardItem style={{width:380}}>
                                        
                                        <View style={{flex: 2 }}>
                                        <Image
                                            source={{ uri: item.menu.image }}
                                            style={{
                                                borderRadius: 12,
                                                height: 100,
                                                width: 100,
                                                flex: 1
                                            }} />
                                            </View>
                                        {/* <View
                                            style={[{
                                                ...StyleSheet.absoluteFillObject,
                                                width: 20,
                                                height: 20,
                                                borderRadius: 20 / 2,
                                                top: 5,
                                                left: 5,
                                                textAlign: "right",
                                                backgroundColor: colors.primary.light,
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                            }]}
                                        >
                                            <Text
                                                style={[globalStyles.textLight]}
                                            >{item.qty}</Text></View> */}
                                            <View
                                    style={{flex: 4, alignItems: 'flex-start'
                                                    }}
                                    >
                                        <Text style={globalStyles.textDark}>{item.menu.name}</Text>
                                        <Text style={globalStyles.textDark}>{convertToRupiah(item.price)}</Text>
                                    </View>
                                    <View style={{borderColor:'grey',borderRadius:12,paddingTop:20,minHeight:120,flexDirection: 'row', justifyContent:'space-around'}}>
                                        <View >
                                                <View>
                                                <TouchableOpacity
                                                    key={item.menuid}
                                                    onPress={
                                                        this.handleAddOrder(item)
                                                    }
                                                >
                                                    <Icon
                                                    type='AntDesign'
                                                    name='caretup'
                                                    
                                                    />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{paddingLeft:8,justifyContent:'center'}}>
                                                    <Text style={{fontSize: 18}}>{item.qty}</Text>
                                                </View>
                                                <View>
                                                <TouchableOpacity
                                                    key={item.menuid}
                                                    onPress={
                                                        this.handleDeleteOrder(item)
                                                    }
                                                >
                                                    <Icon
                                                    type='AntDesign'
                                                    name='caretdown'
                                                    
                                                    />
                                                    </TouchableOpacity>
                                                
                                                </View>
                                        </View>

                                    </View>
                                    </CardItem>
                                    
                                </Card>
                            </View>
                                           )}
                />
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addOrders: (value) => dispatch(orderActions.addOrders(value)),
        getOrders: () => dispatch(orderActions.getOrders()),
        editOrders: (value) => dispatch(orderActions.editOrders(value)),
        removeOrders: (value) => dispatch(orderActions.removeOrders(value)),
    }
}
const mapStateToProps = state => {
    return {
        orders: state.orders,
        menus: state.menus
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List)