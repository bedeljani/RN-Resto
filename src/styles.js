import {StyleSheet} from 'react-native';
const colors = {
    primary : {
        normal : '#CAD3C8' ,
        light : '#ff8a50',
        dark : '#2C3A47',
    },
    secondary : {
        normal : '#d32f2f' ,
        light : '#ff6659',
        dark : '#9a0007',
    },
    text : {
        white : '#ffffff',
        black : '#000000',
        gold  : '#FFA500',
        red   : 'red'
    },

    button :{
        primary: '#FFA500',
        normal:'#fffa65'
    }
    
}
const styles = StyleSheet.create({
    textLight: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
        color: colors.text.white,
    }, 
    textDark: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
        color: colors.text.black,
    },
    textNumber: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
        color: colors.text.red,
    }
})

export {colors, styles}

