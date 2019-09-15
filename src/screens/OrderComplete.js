import React, { Component } from 'react'
import { View, TouchableNativeFeedback,StatusBar, StyleSheet } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'

import { colors, styles as globalStyles } from '../styles'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { API_TRANSACTION } from '../service/api'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
    }
  }
  handlePress = async () => {

    
      await Axios.patch(`${API_TRANSACTION}/${this.props.navigation.getParam('id')}`, { isPaid: true }).then().catch(err => alert(err))
      await AsyncStorage.removeItem('transaction')
      this.props.navigation.navigate('ChooseTable')

    }




  
  handleChange = (text, state) => {
    this.setState({
      [state]: text
    })
  }

  render() {
    return (
      <View
        style={styles.wrapper}
      >
        <StatusBar backgroundColor={colors.primary.dark} barStyle="light-content" />
        <Text
          style={[styles.text, {
            fontSize: 30,
            paddingBottom: 20,
            textAlign: 'center'
          }]}
        > Order Completed</Text>
        <Text
          style={[styles.text, {
            fontSize: 20,
            paddingBottom: 20,
            textAlign: 'center'
          }]}
        >please go to the cashier to complete the payment
        </Text>
        <Text
          style={[styles.text,
          {
            fontSize: 20,
            paddingBottom: 20,
          }]}
        >Transaction Code : #{this.props.navigation.getParam('id')} </Text>
        {/* <Input
          value={this.state.username}
          placeholder='Kode Konfirmasi'
          inputContainerStyle={{
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'white',
          }}
          placeholderTextColor={'#f5f5f5'}
          inputStyle={[styles.text, {margin : 0}]}
          secureTextEntry={true}
          inputStyle={[globalStyles.textLight, {textAlign : 'center'}]}
          containerStyle={{ margin:0,marginBottom : 20}}
          onChangeText={(text) => this.handleChange(text, 'code')}
        /> */}
        <Button
          title={'Order Again'}
          containerStyle={{ alignSelf: 'stretch', marginBottom: 20, marginHorizontal : 11 }}
          titleStyle={styles.text}
          buttonStyle={{ backgroundColor: colors.primary.light, borderRadius: 5,
            height: 40, }}
          onPress={this.handlePress}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary.dark,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'normal',
    color: colors.text.white,
  }
})