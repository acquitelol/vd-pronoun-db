/**
 * @param getAssetIDByName: Fetches the ID of an icon based on its name.
 */
import { getAssetIDByName } from "@vendetta/ui/assets";

/** 
 * Icons used throughout PronounDB, available in a single place for ease of use.
 * @param {object} Icons: Object of Icons which are grouped by their place of use.
 */
export default {
    Failed: getAssetIDByName('Small'),
    Delete:  getAssetIDByName('ic_message_delete'),
    Copy:  getAssetIDByName('toast_copy_link'),
    Open:  getAssetIDByName('ic_leave_stage'),
    Clipboard:  getAssetIDByName('pending-alert'),
    Clock: getAssetIDByName('clock'),
    Pronoun: getAssetIDByName('ic_accessibility_24px'),
    Settings: {
        Toasts: {
            Settings: getAssetIDByName('ic_selection_checked_24px'),
            Failed: getAssetIDByName('ic_close_circle_24px')
        },
        Initial: getAssetIDByName('coffee'),
        Update: getAssetIDByName("discover"),
        Locale: getAssetIDByName('ic_locale_24px'),
        External: getAssetIDByName("ic_raised_hand_list"),
        Edit: getAssetIDByName("ic_edit_24px")
    }
};