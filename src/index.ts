import { findByProps } from '@vendetta/metro';
import { ReactNative } from '@vendetta/metro/common';
import { before } from '@vendetta/patcher';
import { storage } from '@vendetta/plugin';
import { ProunounMap } from './common/map';
import Settings from './components/Settings';
import { stylesheet, constants } from '@vendetta/metro/common';
import { filterColor } from './common/color';

let map = {};
let queue: any[] = [];
let fetching: boolean = false;

async function getPronoun(id: string) {
    if (ProunounMap[id]) return;

    id && queue.push(id);

    if (fetching) return;

    fetching = true;
    const data = await fetch(`https://pronoundb.org/api/v1/lookup-bulk?platform=discord&ids=${queue.splice(0, 15).join(",")}`, {
        method: "GET",
        headers: { "Accept": "application/json", "X-PronounDB-Source": "Vendetta" }
    }).then(res => res.json());

    Object.entries(data).forEach(([id, pronoun]) => {
        if (isNaN(+id)) return;
        map[id] = pronoun;
    })

    fetching = false;
    if (queue.length > 0) getPronoun(undefined!);
}

let unpatchUserPronounFetcher;
let unpatchUpdateRowsPatch;
const UserStore = findByProps("getUser")
const { DCDChatManager } = ReactNative.NativeModules;

export default {
    onLoad: () => {
        const styles = stylesheet.createThemedStyleSheet({
            opTagBackgroundColor: {
                color: constants.ThemeColorMap.HEADER_PRIMARY
            }
        })

        unpatchUserPronounFetcher = before("getUser", UserStore, args => {
            // args[0] is the id of the user
            getPronoun(args[0]);
        });

        unpatchUpdateRowsPatch = before("updateRows", DCDChatManager, args => {
            const rows = JSON.parse(args[1]);
            for ( const row of rows ) {
                // not a message
                if (row.type !== 1) continue;

                // no author id
                if (!row.message.authorId) continue;

                // author id exists but isnt in the map
                if (!map[row.message.authorId]) continue;

                // author id exists and is in the map but the pronoun is "unspecified"
                if (ProunounMap[map[row.message.authorId]] === "unspecified") continue;

                // if the option to set timestamp is set to true and there is a valid timestamp then do that and skip the rest
                if (storage.isTimestamp && row.message.timestamp) {
                    row.message.timestamp += (" • " + ProunounMap[map[row.message.authorId]]);
                    continue;
                }

                // otherwise if theres no op tag text then use that otherwise use the bot tag text
                if (!row.message.opTagText) {
                    row.message.opTagText = ProunounMap[map[row.message.authorId]];

                    row.message.opTagTextColor = ReactNative.processColor(filterColor(styles.opTagBackgroundColor.color, "#212121", "#121212"));
                    row.message.opTagBackgroundColor = ReactNative.processColor(styles.opTagBackgroundColor.color);
                } else {
                    row.message.tagText = ProunounMap[map[row.message.authorId]];
                }
            }

            args[1] = JSON.stringify(rows);
        });
    },
    onUnload: () => {
        unpatchUserPronounFetcher?.();
        unpatchUpdateRowsPatch?.();
    },
    settings: Settings
}