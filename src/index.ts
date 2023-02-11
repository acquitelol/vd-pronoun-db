/**
 * Imports
 * @param findByProps: Allows to get a module by its properties
 * @param constants: Used to get Colors or Fonts etc from Discord's Constants
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param stylesheet: Used to create style sheets for React components
 * @param storage: Allows to get a boolean value from a plugin settings store
 * @param Miscellaneous: Random methods and constants that may be useful
 * @param PronounManager: The main object containing all of the items required for PronounDB to function
 * @param ArrayImplementations: Main Custom Array Manipulation Implementations class which contains a bunch of static methods
 * @param Settings: The main settings panel
 */
import { findByProps } from '@vendetta/metro';
import { constants, stylesheet, ReactNative } from '@vendetta/metro/common';
import { before } from '@vendetta/patcher';
import { storage } from '@vendetta/plugin';
import { Miscellaneous, PronounManager as PM, ArrayImplementations as ArrayOps } from './common';
import Settings from './components/Settings/Settings';

/**
 * @param UserStore: Allows for getting a user, patched later
 * @param ReactNative: Main ReactNative implementation
 * @param DCDChatManager: Allows to patch @arg updateRows which lets me modify the stringified json of a message in the chat area.
 */
const UserStore = findByProps("getUser");
const { DCDChatManager } = ReactNative.NativeModules;

const styles = stylesheet.createThemedStyleSheet({
    /**
     * @param opTagBackgroundColor: The main color of the background of the OP-tag.
     */
    opTagBackgroundColor: {
        color: constants.ThemeColorMap.HEADER_PRIMARY
    }
})

/**
 * @param unpatchGetUser: This will be set to an unpatch function when the onLoad of the plugin is ran.
 * @param unpatchUpdateRows: This will be set to an unpatch function when the onLoad of the plugin is ran.
 */
let unpatchGetUser;
let unpatchUpdateRows;

export default {
    onLoad: () => {
        unpatchGetUser = before("getUser", UserStore, args => {
            /**
             * @param {string} id: The main ID of the user
             */
            const id = args[0];

            /**
             * Inserts the id to the queue at the end of the queue if the id was not found in the PronounManager's Map.
             * This is esentially a push to the queue array but as a custom implementation
             */
            if (!PM.map[id]) ArrayOps.insertItem(PM.queue, id, PM.queue.length, "user id pronoun queue")

            /**
             * Finally, call the function to update the pronouns map.
             */
            PM.updateQueuedPronouns();
        });

        unpatchUpdateRows = before("updateRows", DCDChatManager, args => {
            /**
             * @param rows: The main JSON object of the message
             */
            const rows = JSON.parse(args[1]);

            /**
             * Single use function which returns true if any any of its predicates are true
             * @param args: The list of predicates
             * @returns {boolean}
             */
            const bulkIfStatement = (...args: any[]) => args.some(arg => arg);

            /**
             * Loops through every row and modifies either @arg Timestamp or @arg {OP/Bot Tag}
             */
            for ( const row of rows ) {
                if (bulkIfStatement(
                    /**
                     * If this is true, the @arg row is not a @arg message (different types)
                     */
                    row.type !== 1, 
                    /** 
                     * If this is true, the @arg row does not have a valid @arg {Author ID}. 
                     */
                    !row?.message?.authorId, 
                    /**
                     * If this is true, the @arg row has a valid @arg {Author ID}, but it is not in the map which means it hasn't been fetched yet.
                     */
                    !PM.map[row?.message?.authorId],
                    /**
                     * If this is true, this means @arg row has a valid @arg {Author ID}, and it is in the map, but the pronoun is @arg unspecified.
                     */
                    PM.referenceMap[PM.map[row?.message?.authorId]] === "unspecified"
                )) continue;

                /**
                 * @param pronoun: The pronoun that will be displayed to the user. This should not be invalid.
                 */
                const pronoun = PM.referenceMap[PM.map[row.message.authorId]];

                /**
                 * Checks if the user has enabled the @arg isTimestamp option in settings & if there is a valid timestamp on the message
                 * If this is true, then modify the @arg timestamp only and continue to the next row, without executing the rest of the loop.
                 */
                if (storage.isTimestamp && row.message.timestamp) {
                    row.message.timestamp += (" • " + pronoun);
                    continue;
                }

                /**
                 * Checks if there is no @arg { OP tagText }
                 * If this is true, then it sets the @arg { OP tagText } to the pronoun
                    * It also sets the @arg opTagTextColor and @arg opTagBackgroundColor which are iOS only properties. On android, you just won't see a difference.
                 * Otherwise, it checks if there is no @arg { Bot tagText } and sets the pronoun to the bot tag if there isn't
                 * Otherwise, it does nothing.
                 */
                if (!row.message.opTagText) {
                    /**
                     * Sets the @arg opTagText to the @var pronoun defined above.
                     */
                    row.message.opTagText = pronoun;

                    /** 
                     * Afterwards set the @arg text and @arg background color to a @arg {processed and themed} color
                     * using the @arg background color to determine a @arg text color with a custom implementation.
                     */
                    row.message.opTagTextColor = ReactNative.processColor(Miscellaneous.filterColor(styles.opTagBackgroundColor.color, "#212121", "#121212"));
                    row.message.opTagBackgroundColor = ReactNative.processColor(styles.opTagBackgroundColor.color);
                } else if (!row.message.tagText) {
                    /**
                     * Set the @arg tagText to the @var pronoun defined above.
                     */
                    row.message.tagText = pronoun
                }
            }
    
            /**
             * Finally, re-stringify the row.
             */
            args[1] = JSON.stringify(rows);
        });
    },
 
    onUnload: () => {
        /**
         * Unpatch the main patches
         */
        unpatchGetUser?.();
        unpatchUpdateRows?.();
    },

    /**
     * Loads a settings menu
     */
    settings: Settings
};