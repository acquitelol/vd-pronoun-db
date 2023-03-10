import { findByProps, findByStoreName } from '@vendetta/metro';
import { constants, stylesheet, ReactNative } from '@vendetta/metro/common';
import { after, before } from '@vendetta/patcher';
import { storage } from '@vendetta/plugin';
import { findInReactTree } from '@vendetta/utils';
import { PronounManager as PM, ArrayImplementations as ArrayOps } from './common';
import Pronoun from './components/Dependent/Pronoun';
import Settings from './components/Settings/Settings';
import { semanticColors } from '@vendetta/ui';

const UserProfile = findByProps("PRIMARY_INFO_TOP_OFFSET", "SECONDARY_INFO_TOP_MARGIN", "SIDE_PADDING")
const UserStore = findByStoreName("UserStore");
const { DCDChatManager } = ReactNative.NativeModules;

const styles = stylesheet.createThemedStyleSheet({
    opTagBackgroundColor: {
        color: semanticColors.HEADER_PRIMARY
    },
    opTagTextColor: {
        color: semanticColors.BACKGROUND_PRIMARY
    }
})

let unpatchGetUser;
let unpatchProfile;
let unpatchUpdateRows;

export default {
    onLoad: () => {
        unpatchGetUser = before("getUser", UserStore, args => {
            const id = args[0];

            if (!PM.map[id]) ArrayOps.insertItem(PM.queue, id, PM.queue.length, "user id pronoun queue")
            PM.updateQueuedPronouns();
        });

        unpatchProfile = after("type", UserProfile.default, (_, res) => {
            const profileCardSection = (findInReactTree(res, r => 
                r?.props?.children.find((res: any) => typeof res?.props?.displayProfile?.userId === "string")
                && r?.type?.displayName === "View"
                && Array.isArray(r?.props?.style)
            ) as any)?.props?.children

            if (!profileCardSection) return res;

            const { userId } = profileCardSection?.find((r: any) => typeof r?.props?.displayProfile?.userId === "string")?.props?.displayProfile ?? {};

            if (
                !userId
                || !PM.map[userId]
                || PM.referenceMap[PM.map[userId]] === "unspecified"
            ) {
                console.log(`uid: ${userId}, map: ${PM.map[userId]}, ref: ${PM.referenceMap[PM.map[userId]]}`)
                return res
            }

            /**
             * @param {string} pronoun: The main pronoun in @plainText ~ This *should not be undefined*
             */
            const pronoun = PM.referenceMap[PM.map[userId]]

            profileCardSection.unshift(<Pronoun pronoun={pronoun} />)
        })

        unpatchUpdateRows = before("updateRows", DCDChatManager, args => {
            const rows = JSON.parse(args[1]);

            for ( const row of rows ) {
                if (row.type !== 1
                    || !row?.message?.authorId
                    || !PM.map[row?.message?.authorId]
                    || PM.referenceMap[PM.map[row?.message?.authorId]] === "unspecified"
                ) continue;
                
                /**
                 * @param pronoun: The pronoun that will be displayed to the user. This should not be invalid.
                 */
                const pronoun = PM.referenceMap[PM.map[row.message.authorId]];

                /**
                 * Checks if the user has enabled the @arg isTimestamp option in settings & if there is a valid timestamp on the message
                 * If this is true, then modify the @arg timestamp only and continue to the next row, without executing the rest of the loop.
                 */
                if (storage.isTimestamp && row.message.timestamp) {
                    row.message.timestamp += (" ??? " + pronoun);
                    continue;
                }

                if (!row.message.opTagText) {
                    /**
                     * Sets the @arg opTagText to the @var pronoun defined above.
                     */
                    row.message.opTagText = pronoun;

                    /** 
                     * Afterwards set the @arg text and @arg background color to a @arg {processed and themed} color
                     * using the @arg background color to determine a @arg text color with a custom implementation.
                     */
                    row.message.opTagTextColor = ReactNative.processColor(styles.opTagTextColor.color);
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
        unpatchProfile?.();
        unpatchUpdateRows?.();
    },

    /**
     * Loads a settings menu
     */
    settings: Settings
};