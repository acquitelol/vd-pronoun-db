import { constants, React, stylesheet, toasts } from "@vendetta/metro/common";
import { Icons } from "../../common";
import { storage } from '@vendetta/plugin';
import { General } from "@vendetta/ui/components";
import { semanticColors } from "@vendetta/ui";
import { findByName, findByProps } from "@vendetta/metro";

const { View, Text, TouchableOpacity } = General;
const { useThemeContext } = findByProps("useThemeContext");
const { meta: { resolveSemanticColor } } = findByProps("colors", "meta");
const UserProfileSection = findByName("UserProfileSection");
const { UserProfileGradientCard } = findByProps("UserProfileGradientCard");
const HapticModule = findByProps("triggerHaptic");

const styles = stylesheet.createThemedStyleSheet({
    container: {
        alignSelf: 'flex-start',
        padding: 1,
        borderRadius: 9,
        width: "100%",

        marginTop: -4,
        marginRight: -12
    },
    innerContainer: {
        paddingHorizontal: 6,
        paddingVertical: 8,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 10/2,
        marginRight: 6
    },
    fallback: {
        color: semanticColors.BACKGROUND_SECONDARY_ALT
    },
    text: {
        fontFamily: constants.Fonts.DISPLAY_NORMAL,
    }
})

export default ({ pronoun }: { pronoun: string }) => {
    const themeContext = useThemeContext();
    const textColor = resolveSemanticColor(themeContext.theme, semanticColors.TEXT_NORMAL);

    return <UserProfileSection title="Pronouns">
        <TouchableOpacity 
            onPress={() => {
                toasts.open({
                    content: pronoun,
                    source: Icons.Pronoun
                })

                HapticModule && HapticModule.triggerHaptic();
            }}
            style={storage.isRole ? { justifyContent: 'center', alignItems: 'center',} : {}}
        >
            {storage.isRole
                ? <UserProfileGradientCard style={styles.container} fallbackBackground={styles.fallback.color}>
                    <View style={styles.innerContainer}>
                        <View style={[styles.circle, { backgroundColor: textColor }]} />
                        <Text style={[styles.text, { color: textColor }]}>
                            {pronoun}
                        </Text>
                    </View>
                </UserProfileGradientCard> 
                : <Text style={[styles.text, { fontSize: 16, color: textColor }]}>
                    {pronoun}
                </Text>}
        </TouchableOpacity>
    </UserProfileSection>
}