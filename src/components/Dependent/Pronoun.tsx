import { constants, React, stylesheet, toasts } from "@vendetta/metro/common";
import { Icons } from "../../common";
import { storage } from '@vendetta/plugin';
import { General } from "@vendetta/ui/components";
import { semanticColors } from "@vendetta/ui";

const { View, Text, TouchableOpacity } = General;

const styles = stylesheet.createThemedStyleSheet({
    container: {
        marginTop: 12,
        marginLeft: 12,
        alignSelf: 'flex-start'
    },
    eyebrow: {
        textTransform: 'uppercase',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        color: semanticColors.TEXT_NORMAL,

        marginBottom: 10
    },
    innerContainer: {
        backgroundColor: semanticColors.BACKGROUND_MOBILE_PRIMARY,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: semanticColors.HEADER_PRIMARY,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 12/2,
        backgroundColor: semanticColors.HEADER_PRIMARY,

        marginLeft: 8,
        marginRight: 6
    },
    content: {
        fontSize: 14,
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
    },
    text: {
        fontFamily: constants.Fonts.DISPLAY_NORMAL,
        color: semanticColors.TEXT_NORMAL
    }
})

/**
 * Main @Pronoun component implementation.
 * @param pronoun: The pronoun of the user, passed as a string
 * @returns TSX Component
 */
export default ({ pronoun }) => {
    return <View style={styles.container}>
        <Text style={styles.eyebrow}>
            Pronouns
        </Text>
        <TouchableOpacity onPress={() => toasts.open({
            content: pronoun,
            source: Icons.Pronoun
        })}>
            {storage.isRole
                ? <View style={styles.innerContainer}>
                    <View style={styles.circle} />
                    <Text style={[styles.text, styles.content]}>
                        {pronoun}
                    </Text>
                </View> 
                : <Text style={[styles.text, { fontSize: 16 }]}>
                    {pronoun}
                </Text>}
        </TouchableOpacity>
    </View>
}