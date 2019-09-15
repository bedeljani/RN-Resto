// import React, { Component } from 'react'
// import { Provider } from 'react-redux'
// import RootNavigation from './src/navigations/RootNavigation'

// import {store} from './src/redux/store'

// class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//     }
//   }

//   render() {
//     return (
//       <Provider store={store}>
//       <RootNavigation />
//       </Provider>
//       )
//   }
// }

// export default App

import { Provider } from 'react-redux'
import RootNavigation from './src/navigations/RootNavigation'

import {store} from './src/redux/store'
import React, { Component } from 'react';
import  {Icon} from 'native-base';
import { StyleSheet, View, Text, Image, I18nManager, Platform, StatusBar, SafeAreaView, ScrollView} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
 
I18nManager.forceRTL(false);

export default class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
 
      show_Main_App: false
 
    };
  }
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="ios-arrow-forward"
          size={24}
          style={{color:'rgba(255, 255, 255, .9)', backgroundColor: 'transparent' }}
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          size={24}
          style={{ color:'rgba(255, 255, 255, .9)',backgroundColor: 'transparent' }}
        />
      </View>
    );
  };
  _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      
      <View style={styles.MainContainer}>  
        <Image style ={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
      </View>
    );
  }
  _renderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
        type='MaterialIcons'
          name="skip-next"
          size={24}
          style={{ color:'rgba(255, 255, 255, .9)',backgroundColor: 'transparent' }}
        />
      </View>
    );
  };
 
  _
 
  on_Done_all_slides = () => {
    this.setState({ show_Main_App: true });
  };
 
  on_Skip_slides = () => {
    this.setState({ show_Main_App: true });
  };
  render() {
    if (this.state.show_Main_App) {
      return (
        <Provider store={store}>
               <RootNavigation />
               </Provider>
      );
    } else {
      return (
        
        <View style={{height:'100%'}}  >
         <StatusBar backgroundColor='#FFA505' barStyle="light-content" />
          <AppIntroSlider
        slides={slides}
          renderItem={this._renderItem}
          renderSkipButton={this._renderSkipButton}
          renderNextButton={this._renderNextButton}
          renderDoneButton={this._renderDoneButton}
          onDone={this.on_Done_all_slides}
          showSkipButton={false}
          onSkip={this.on_Skip_slides}
        />
        </View>
       
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500'
  },
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'android' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 320,
    height: 320,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  title: {
    paddingTop: 10,
    fontSize: 30,
    color: 'black',
    marginBottom: 16,
    
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 

const slides = [
  {
    key: 'somethun',
    title: 'Reserve Table',
    //text: '.\nSay something cool',
    image: require('./src/assets/images/table.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'somethun-dos',
    title: 'Select Menu',
    //text: 'Other cool stuff',
    image: require('./src/assets/images/select.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'somethun1',
    title: 'Pay to the cashier',
    //text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('./src/assets/images/pay.png'),
    backgroundColor: '#22bcb5',
  }
];