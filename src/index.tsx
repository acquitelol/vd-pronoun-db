import { find, findByStoreName, findByName } from '@vendetta/metro';
import { stylesheet, ReactNative } from '@vendetta/metro/common';
import { after, before } from '@vendetta/patcher';
import { storage } from '@vendetta/plugin';
import { findInReactTree } from '@vendetta/utils';
import { PronounManager as PM, ArrayImplementations as ArrayOps } from './common';
import Pronoun from './components/Dependent/Pronoun';
import Settings from './components/Settings/Settings';
import { semanticColors } from '@vendetta/ui';

const UserProfile = find(x => x?.type?.name == "UserProfile");
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

        unpatchProfile = after("type", UserProfile, (_, res) => {
            const profileCardSection = findInReactTree(res, r => 
                r?.type?.displayName === "View" &&
                r?.props?.children.findIndex(i => i?.type?.name === "UserProfileBio") !== -1
            )?.props?.children;

            if (!profileCardSection) return res;

            const { userId } = profileCardSection?.find((r: any) => typeof r?.props?.displayProfile?.userId === "string")?.props?.displayProfile ?? {};

            if (
                !userId
                || !PM.map[userId]
                || PM.referenceMap[PM.map[userId]] === "unspecified"
            ) {
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
                 * @param {string} pronoun: The main pronoun in @plainText ~ This *should not be undefined*
                 */
                const pronoun: string = PM.referenceMap[PM.map[row.message.authorId]];

                if (storage.isTimestamp && row.message.timestamp) {
                    row.message.timestamp += (" • " + pronoun);
                    continue;
                }

                if (row.message.opTagText) {
                    row.message.tagText = (
                        row.message.tagText 
                            ? row.message.tagText + " • " 
                            : ""
                        + row.message.opTagText)
                }

                row.message.opTagText = pronoun;
                row.message.opTagTextColor = ReactNative.processColor(styles.opTagTextColor.color);
                row.message.opTagBackgroundColor = ReactNative.processColor(styles.opTagBackgroundColor.color);
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