import { React, constants, stylesheet } from '@vendetta/metro/common';
import { findByProps, findByStoreName } from '@vendetta/metro';
import { General } from '@vendetta/ui/components';
import { ArrayImplementations as ArrayOps, Miscellaneous, Constants } from '../../common';
import { semanticColors } from '@vendetta/ui';

const { TouchableOpacity, View, Image, Text, Animated } = General;

const Router = findByProps('transitionToGuild', "openURL")
const UserStore = findByStoreName("UserStore");
const Profiles = findByProps("showUserProfile");

const styles = stylesheet.createThemedStyleSheet({
    container: {
        marginTop: 25,
        marginLeft: '5%',
        marginBottom: -15,
        flexDirection: "row"
    },
    textContainer: {
        paddingLeft: 15,
        paddingTop: 5,
        flexDirection: 'column',
        flexWrap: 'wrap',
        ...Miscellaneous.shadow()
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 10,
        ...Miscellaneous.shadow()
    },
    mainText: {
        opacity: 0.975,
        letterSpacing: 0.25
    },
    header: {
        color: semanticColors.HEADER_PRIMARY,
        fontFamily: constants.Fonts.DISPLAY_BOLD,
        fontSize: 25,
        letterSpacing: 0.25
    },
    subHeader: {
        color: semanticColors.HEADER_SECONDARY,
        fontSize: 12.75,
    }
});

 /** 
  * Main credits component.
  * @returns {TSX ~ Fragmented View}
  * 
  * @property @param {string} name: The name of the plugin, which is PronounDB in this case.
  * @property @param {string} version: The version of the plugin, this can vary.
  * @property @param {object} plugin: Different data involving the plugin such as the plugin's base download link and build.
  * @property @param {object}: List of authors, their Discord ID, and their GitHub profile. This will be mapped and displayed on the list.
  */
export default ({name, authors}) => {
    const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

    const onPressIn = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1.1,
        duration: 10,
        useNativeDriver: true,
    }).start();

    const onPressOut = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
    }).start();

    const onPress = (): void => Profiles.showUserProfile({ userId: UserStore.getCurrentUser().id });
    
    const animatedScaleStyle = {
        transform: [
            {
                scale: animatedButtonScale
            }
        ]
    };
    
    return <>
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Animated.View style={animatedScaleStyle}>
                    <Image
                        style={[styles.image]}
                        source={{
                            /**
                             * The image used for the @arg Image.
                             * @param uri: Can be either an @arg URI, which is what is provided, or it can be an @arg require.
                             */
                            uri: UserStore?.getCurrentUser()?.getAvatarURL()?.replace("webp", "png")
                        }}
                    />
                </Animated.View>
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <TouchableOpacity onPress={(): void => Router.openURL(Constants.plugin.source)}>
                    <Text style={[styles.mainText, styles.header]}>
                        {name}
                    </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.mainText, styles.subHeader]}>
                        A project by 
                    </Text>
                    {ArrayOps.mapItem(authors, (author, index: number, authorsArray: any[]) => { 
                        return <TouchableOpacity onPress={(): void => Router.openURL(Constants.author.profile[author.name] ?? "https://github.com/")}> 
                            <Text 
                                style={[styles.mainText, styles.subHeader, {
                                    paddingLeft: 4,
                                    fontFamily: constants.Fonts.DISPLAY_BOLD,
                                    flexDirection: 'row'
                            }]}>
                                    {author.name}{index < (authorsArray.length - 1) ? "," : null}
                            </Text>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        </View>
    </>
}