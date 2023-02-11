/** 
 * Imports 
 * @param manifest: The manifest of the plugin
 * @param tryCallback: Function to wrap another function in a try-catch
 * @param {function} toasts: The function to open a toast on the screen
 * @param {object} Icons: The icons exported in ./Icons
 */
import { manifest } from '@vendetta/plugin';
import tryCallback from "./try_callback";
import { toasts } from "@vendetta/metro/common";
import Icons from "./icons";
import { findByProps } from '@vendetta/metro';

/**
 * @param shadow: Native shadow implementation that is used throughout the entire plugin.
 * This is a function which can take in a number for the opacity, but this @param is optional.
 */
type DefaultObject = { [key: string]: string | number | DefaultObject }
const shadow = (opacity: number = 0.10): DefaultObject => ({
    shadowColor: "#000",
    shadowOffset: {
        width: 1,
        height: 4,
    },
    shadowOpacity: opacity,
    shadowRadius: 4.65,
    elevation: 8
});

/** 
 * Open a toast with the text provided saying it has been copied to clipboard or as a tooltip
 * @param {string} source: The text provided to send inside of the toast
 * @param {'clipboard | 'tooltip'} type: The type of toast to show.
 *
 * @uses @param {number} Icons.Clipboard
 * @uses @param {number} Icons.Settings.Initial
 * @returns {void}
 */
const displayToast = (source: string, type: 'clipboard' | 'tooltip'): void => {
    toasts.open({ 
        content: type=='clipboard' ? `Copied ${source} to clipboard.` : source, 
        source: type=='clipboard' ? Icons.Clipboard : Icons.Settings.Initial 
    });
};

/** 
 * Chooses whether the color should be Dark or Light depending on the background color of the element.
 * @param {string} color: The background color
 * @param {string} light: The light color
 * @param {string} dark: The dark color
 * @param {number?} boundary: The maximum boundary that the color can reach before choosing dark mode.
 * @param {string?} label: The label of the function when called. May be undefined.
 * @returns {string color}
 */
const filterColor = (color: string, light: string, dark: string, boundary: number = 186, label?: string): string => {
    return tryCallback(() => {
        /**
         * Gets the @arg color without the @arg {#} (@arg {#FFFFFF} -> @arg {FFFFFF})
         */
        let baseColor = color.replace("#", "")

        /**
         * Parses a color as an integer from any @arg base provided to @arg {base 10}
         * @param {string} color: The color provided as a @func string, in @func baseAny
         * @param {number[]} digits: The digits of the color which it should return as @func base10
         * @param {number} base: The base provided, can be anything but it would be @func base16 when called
         * @returns {~ string formattedColor}
         */
        const parseColorAsInt = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)

        /**
         * Gets the correct integer color for each part of the color provided
         * @param {number} red: The red value of the color, at @arg {0, 2}
         * @param {number} green: The green value of the color, at @arg {2, 4}
         * @param {number} blue: The blue value of the color, at @arg {4, 6}
         */
        const red = parseColorAsInt(baseColor, [0, 2], 16),
            green = parseColorAsInt(baseColor, [2, 4], 16),
            blue = parseColorAsInt(baseColor, [4, 6], 16);

        /**
         * Checks if the colors added up are higher than the boundary, and returns the light or dark color accordingly
         * @returns ->
                 * @if {(@arg red + @arg green + @arg blue are bigger than the boundary)} -> Return the dark color.
                 * @else {()} -> Return the light color. 
         */
        return (((red + green + blue) / (255 * 3)) > boundary)
            ?   dark 
            :   light
    }, [color, light, dark, boundary], manifest.name, 'checking if color should be light or dark at', label);
};

/**
 * @param UserStore: Variable to allow getting the current user
 */
const UserStore = findByProps("getCurrentUser")

/**
 * @param localizedImage: Uses either the current user's profile picture if UserStore.getCurrentUser is defined or my profile picture if it isn't.
 */
const localizedImage = UserStore.getCurrentUser()
    ? UserStore.getCurrentUser().getAvatarURL().replace("webp", "png")
    : "https://cdn.discordapp.com/avatars/581573474296791211/4429e2dbe2bfcfbd34fb1778c802144d.png?size=1280"

export default 
{
    shadow,
    displayToast,
    filterColor,
    localizedImage
};