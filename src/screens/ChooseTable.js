import React, { Component } from 'react'
import { View, Alert, StyleSheet, StatusBar, Image,ScrollView} from 'react-native'
import { Text, Input, Button, leftIcon} from 'react-native-elements'

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors, styles as globalStyles } from '../styles'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import imageLogo from '../assets/logo/logo.png'
import { Fumi } from 'react-native-textinput-effects';
import {
  Blink,
  Scale,
  Bounce,
  Rotate,
  Circle,
  SlideLeft,
  SlideInTop,
  SlideInBottom,
  ScaleSlide
} from 'react-native-animation-effects';

// API 
import { API_TRANSACTION } from '../service/api'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      table: '',
      isLoading: false,
    }
  }

   handlePress = async () => {
    await this.setState({
      isLoading: true
    })
    try {
      const res = await Axios.post(`${API_TRANSACTION}`, {
        tableNumber: parseInt(this.state.table),
        isPaid: false
      })
      if (res) {
        await AsyncStorage.setItem('transaction', JSON.stringify(res.data.transaction))
        this.props.navigation.navigate('Menu')
      } else {
        alert('Koneksi gagal')
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Koneksi Gagal',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      )
    }
    await this.setState({
      isLoading: false
    })


  }
  handleChange = (text, state) => {
    this.setState({
      [state]: text
    })
  }

  render() {
    return (
      
      
      
      <ScrollView style={styles.container}>
      <StatusBar backgroundColor={colors.primary.dark} barStyle="light-content" />
           
        <KeyboardAwareScrollView style={{paddingTop: 60}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Scale>
          <Image source={imageLogo} />
          </Scale>
          </View>
          
       
          <View style={{justifyContent: 'center', paddingBottom: 20, }}>
           
          <Fumi
            onChangeText={(text) => this.handleChange(text, 'table')}
            style={{marginHorizontal: 20, backgroundColor: colors.primary.dark,borderBottomWidth: 0.5,  borderColor: colors.text.white}}
            label={'Set Table'}
            labelStyle={{ color: '#fff' }}
            inputStyle={{ color: '#fff' }}
            keyboardType={'number-pad'}
            iconClass={FontAwesomeIcon}
            iconName={'book'}
            iconColor={'#FFA500'}
            iconSize={20}
            
          />
          
       </View>
       
        
        <Button
          title={'Order Here  '}
          loading={this.state.isLoading}
          loadingStyle={colors.text.white}
          disabled={this.state.isLoading}
          disabledStyle={{
            backgroundColor: colors.button.normal
          }}
          containerStyle={{
            alignSelf: 'stretch',
            marginBottom: 20,
            marginHorizontal : 11
          }}
          titleStyle={globalStyles.textDark}
          buttonStyle={{
        
            backgroundColor: colors.button.primary,
            borderRadius: 12,
            height: 40,

          }}
          onPress={this.handlePress}
        />
        
</KeyboardAwareScrollView>
</ScrollView>    )
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary.dark,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,

  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: colors.primary.dark,
  },
  content: {
    // not cool but good enough to make all inputs visible when keyboard is active
    paddingBottom: 300,
  },
  card1: {
    paddingVertical: 16,
  },
  card2: {
    padding: 16,
  },
  input: {
    marginTop: 4,
  },
  title: {
    paddingBottom: 16,
    textAlign: 'center',
    color: '#404d5b',
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  
})