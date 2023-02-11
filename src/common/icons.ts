/**
 * @param getIDByName: Fetches the ID of an icon based on its name.
 */
import { getIDByName } from 'enmity/api/assets';

/** 
 * Icons used throughout PronounDB, available in a single place for ease of use.
 * @param {object} Icons: Object of Icons which are grouped by their place of use.
 */
export default {
    Failed: getIDByName('Small'),
    Delete:  getIDByName('ic_message_delete'),
    Copy:  getIDByName('toast_copy_link'),
    Open:  getIDByName('ic_leave_stage'),
    Clipboard:  getIDByName('pending-alert'),
    Clock: getIDByName('clock'),
    Settings: {
        Toasts: {
            Settings: getIDByName('ic_selection_checked_24px'),
            Failed: getIDByName('ic_close_circle_24px')
        },
        Initial: getIDByName('coffee'),
        Update: getIDByName("discover"),
        Locale: getIDByName("ic_locale_24px"),
    }
};