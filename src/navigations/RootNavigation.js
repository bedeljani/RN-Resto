import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation'

import ChooseTable from '../screens/ChooseTable'
import OrderComplete from '../screens/OrderComplete'
import Menu from '../screens/Menu'
import Cart from '../screens/Cart'
import Intro from '../screens/Intro'

const switchNav = createSwitchNavigator(
    {
        // Intro: {
        //     screen: Intro 
        // },
        ChooseTable : {
            screen: ChooseTable
        },
        Home : {
            screen :createStackNavigator ({
                Menu: {
                    
                    screen: Menu
                },
                Cart : {
                    screen: Cart
                },
            },
            {
                defaultNavigationOptions: {
                  header: null
                }
              })
        },
        OrderComplete : {
            screen : OrderComplete
        },
    },
    {
        
    }
)
const RootNavigation = createAppContainer(switchNav)

export default RootNavigation
