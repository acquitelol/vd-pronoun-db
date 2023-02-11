/**
 * Imports
 * @param General: Component Object to get components used throughout the component.
 * @param constants: Used to get Colors or Fonts etc from Discord's Constants
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param stylesheet: Used to create style sheets for React components
 */
import { General } from "@vendetta/ui/components";
import { constants, React, stylesheet } from "@vendetta/metro/common"

/**
 * @param {* from General}: General ReactNative Components used throughout the component
 */
const { View, Text } = General;

/**
 * @param {StyleSheet} styles: StyleSheet of generic styles used throughout the component.
 */
const styles = stylesheet.createThemedStyleSheet({
    /**
     * @param {object} text: The main styling for the text component
     */
    text: {
        color: constants.ThemeColorMap.HEADER_SECONDARY,
        paddingLeft: "5.5%",
        paddingRight: 10,
        marginBottom: 10,
        letterSpacing: 0.25,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        fontSize: 12
    },
});

/**
 * Wrapper for any components which displays them in a section with a label
 * @param {string} label: The label for the wrapper, which will be displayed above the content inside of the component.
 * @param {TSX Fragment} component: The component to render inside of the @arg View.
 */
export default ({label, component}) => {
    /**
     * Render a view with a margin at the top
     * @returns {View}
     */
    return <View style={{marginTop: 10}}>
        {/**
         * Renders a Text Component inside of this view with the label
         * @uses @param {string} label: The label provided when the component was called
         */}
        <Text style={[styles.text, styles.optionText]}>{label.toUpperCase()}</Text>
        {/**
         * The component to render inside of this component. This can be any valid React Native code.
         */}
        {component}
    </View>
}