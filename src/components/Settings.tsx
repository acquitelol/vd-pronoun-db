import { Forms } from "@vendetta/ui/components";
import { stylesheet, constants, React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
const { FormRow, FormSwitch, FormIcon } = Forms;
import { getAssetIDByName } from "@vendetta/ui/assets";
import { useProxy } from "@vendetta/storage";

export default () => {
    useProxy(storage);

    const styles = stylesheet.createThemedStyleSheet({
        icon: {
            color: constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
    })

    return (<FormRow
        label="Use Timestamps"
        subLabel="The plugin will use the OP tag for the pronoun and the Bot tag when this is unavailable. Toggling this option will use timestamps all the time instead of OP/Bot Tag."
        leading={<FormIcon style={styles.icon} source={getAssetIDByName("ic_locale_24px")} />}
        trailing={<FormSwitch
            value={storage.isTimestamp}
            onValueChange={(v) => {
                storage.isTimestamp = v
            }}
        />}
    />)
}