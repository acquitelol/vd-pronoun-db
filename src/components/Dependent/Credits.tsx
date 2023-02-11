/** 
 * Imports
 * @param constants: Used to get Colors or Fonts etc from Discord's Constants
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param stylesheet: Used to create style sheets for React components
 * @param findByProps: Allows to get a module by its properties
 * @param General: Component Object to get components used throughout the component.
 * @param { ArrayOps.mapItem, Miscellaneous.shadow }: Functions which will be used throughout the component.
 */
import { React, constants, stylesheet } from '@vendetta/metro/common';
import { findByProps } from '@vendetta/metro';
import { General } from '@vendetta/ui/components';
import { ArrayImplementations as ArrayOps, Miscellaneous } from '../../common';

/**
 * @param {* from General}: Components used throughout the component.
 */
const { TouchableOpacity, View, Image, Text, Animated } = General;

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 */
const Router = findByProps('transitionToGuild')

/**
 * @param {string} pluginRepo: The source of the plugin
 */
const pluginRepo: string = "https://github.com/acquitelol/vd-pronoun-db"

/**
 * This is the main Style Sheet. All of the components used in this function will use this stylesheet.
 * @param {(constant)any} styles: The main stylesheet.
 */
const styles = stylesheet.createThemedStyleSheet({
    /**
     * Main container style. This would likely be used in the @arg View or @arg Subviews
     */
    container: {
        marginTop: 25,
        marginLeft: '5%',
        marginBottom: -15,
        flexDirection: "row"
    },
    /**
     * Main style for the text container, to allow multiple @arg {<Text>} components to render inline.
     */
    textContainer: {
        paddingLeft: 15,
        paddingTop: 5,
        flexDirection: 'column',
        flexWrap: 'wrap',
        ...Miscellaneous.shadow()
    },
    /**
     * Style for the @arg {<Image>} component. Pretty self explanatory.
     */
    image: {
        width: 75,
        height: 75,
        borderRadius: 10,
        ...Miscellaneous.shadow()
    },
    /**
     * Styles shared between the @arg Main text and the @arg Subtitle text.
     */
    mainText: {
        opacity: 0.975,
        letterSpacing: 0.25
    },
    /**
     * Style used for only the @arg {Main Text} component. Involes an @arg bold weight and @arg primary color.
     * Also involes a larger @arg fontSize and @arg letterSpacing
     */
    header: {
        color: constants.ThemeColorMap.HEADER_PRIMARY,
        fontFamily: constants.Fonts.DISPLAY_BOLD,
        fontSize: 25,
        letterSpacing: 0.25
    },
    /**
     * Style used for only the @arg {Subtitle Text} components. Involes an @arg normal weight (@arg bold was omitted) and @arg secondary color.
     * Additionally, the @arg fontSize is larger but not as large as @arg {Main Text} component
     */
    subHeader: {
        color: constants.ThemeColorMap.HEADER_SECONDARY,
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
    /** 
     * Use React to create a new Ref with @arg Animated
     * @param {React.useRef} animatedButtonScale: The main animation scale ref.
     */
    const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

    /**
     * Move @param animatedButtonScale to @arg {1.1}, in @arg {250ms} with the @arg spring easing type.
     * @returns {void}
     */
    const onPressIn = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1.1,
        duration: 10,
        useNativeDriver: true,
    }).start();

    /**
     * Move @param animatedButtonScale back to @arg {1}, in @arg {250ms} with the @arg spring easing type.
     * @returns {void}
     */
    const onPressOut = (): void => Animated.spring(animatedButtonScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
    }).start();

    /**
     * Opens the Repository of @arg PronounDB externally, using the @arg Router provided before.
     * @returns {void}
     */
    const onPress = (): void => Router.openURL(pluginRepo);

    /** 
     * The main animated style, which is going to be modified by the Animated property.
     * @param {object{transform[]}} animatedScaleStyle: The main scale style applied to the element which has the scale.
     */
    const animatedScaleStyle = {
        transform: [
            {
                scale: animatedButtonScale
            }
        ]
    };
    
    /** 
     * Main component
     * @returns {~ fragment closure}
     */
    return <>
        {/**
         * The main @arg View closure. This contains all of the elements.
         * @uses @arg styles.container
         */}
        <View style={styles.container}>
            {/**
             * The main @arg Image of the plugin. Wrapped in an @arg TouchableOpacity to add a bit of extra motion on press.
             * @uses @arg {uri Miscellaneous.localizedImage}
             */}
            <TouchableOpacity 
                /** 
                 * Main events which can be fired from the image.
                 * @param {onPress} onPress: Opens the repo of @arg PronounDB externally
                 * @param {onPressIn} onPressIn: Triggers when the @arg Image is held down, and scales in the image to @arg {1.1} times its normal scale.
                 * @param {onPressOut} onPressOut: Triggers when the @arg Image is has stopped being pressed, and scales out the image back to its normal scale (@arg {1}).
                 */
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {/**
                 * The main Animated view of the image.
                 * This uses @arg Animated.View instead of @arg View as it is required for the animated scale to work.
                 * @uses @arg animatedScaleStyle
                 */}
                <Animated.View style={animatedScaleStyle}>
                    <Image
                        style={[styles.image]}
                        source={{
                            /**
                             * The image used for the @arg Image.
                             * @param uri: Can be either an @arg URI, which is what is provided, or it can be an @arg require.
                             */
                            uri: Miscellaneous.localizedImage, 
                        }}
                    />
                </Animated.View>
            </TouchableOpacity>
            {/**
             * The main text container. This is where all of the details from @arg manifest.json are going to be used.
             * @uses @arg styles.textContainer
             */}
            <View style={styles.textContainer}>
                {/**
                 * This is the main title text. Pressing on it opens the repo of @arg PronounDB externally.
                 * @param name: The name of the plugin. In this case its @arg PronounDB.
                 * @uses @arg {[styles.mainText, styles.header]} asStyleArray
                 */}
                <TouchableOpacity onPress={(): void => Router.openURL(pluginRepo)}>
                    <Text style={[styles.mainText, styles.header]}>
                        {name}
                    </Text>
                </TouchableOpacity>
                {/**
                 * This is the main element which displays the @arg Authors of the plugin, and opens their GitHub profile.
                 * If there's more than 1 user, add a comma between them until the last user.
                 * @uses @arg {{flexDirection: 'row'}} styling
                 */}
                <View style={{flexDirection: 'row'}}>
                    {/**
                     * @uses @arg {[styles.mainText, styles.subHeader]}
                     */}
                    <Text style={[styles.mainText, styles.subHeader]}>
                        A project by 
                    </Text>
                    {/**
                      * Loops through an array of objects and returns an @arg {TSX} element for each iteration
                      * @param authors: The list of authors for the plugin. In this case its only 1, but its scaleable.
                      * @param {() => {}}: The callback to run for each iteration
                            * @uses @arg author: The main author object, which contains @arg name, @arg id, and @arg profile.
                            * @uses @arg index: The index of the iteration
                            * @uses @arg authorsArray: The array of authors, as a reference. It is better practice to use it from the callback rather than the object passed to the function.
                      */}
                    {ArrayOps.mapItem(authors, (author, index: number, authorsArray: any[]) => { 
                        return <TouchableOpacity onPress={(): void => Router.openURL(author.profile)}> 
                            {/**
                             * Main text element.
                             * @uses @arg {[styles.mainText, styles.subHeader, {paddingLeft: 4, fontFamily: Constants.Fonts.DISPLAY_BOLD, flexDirection: 'row'}]} styling
                             * 
                             * @param {string} author.name: The author's... name.
                             * @param {number} index: The current iteration of the loop.
                             * @param authorsArray: The array passed from the callback.
                             */}
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