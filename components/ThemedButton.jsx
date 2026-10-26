
import { Pressable, StyleSheet} from 'react-native'
import { Colors } from '../constants/Colors'

// Creating the component 

// { style, ...props } -> Object destructuring


function ThemedButton({ style, ...props })  {

    
    return (
 
        <Pressable 
        style={({ pressed }) => {
            if(pressed === true) {
                return[
                    styles.btn,
                    styles.pressed,
                    style
                ]
            } else {
                return[
                    styles.btn,
                    style
                    ]
                }
            } 
        }
            {...props}
        />
    )
}

// A function that returns an object with the styles for the component. The styles are defined in the StyleSheet.create method below. The styles are then applied to the component using the style prop. The styles are applied in the order they are defined in the array. The last style in the array will override any previous styles with the same property.

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 6,
        marginVertical: 10
    },
    pressed: {
        opacity: 0.8
    },
})

export default ThemedButton