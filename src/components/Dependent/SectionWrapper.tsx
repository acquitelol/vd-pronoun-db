import { General } from "@vendetta/ui/components";
import { constants, React, stylesheet } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui";

const { View, Text } = General;

const styles = stylesheet.createThemedStyleSheet({
    text: {
        color: semanticColors.HEADER_SECONDARY,
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
export default ({label, children}) => {
    return <View style={{marginTop: 10}}>
        <Text style={[styles.text, styles.optionText]}>{label.toUpperCase()}</Text>
        {children}
    </View>
}