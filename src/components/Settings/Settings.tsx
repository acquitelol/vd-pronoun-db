/**
 * Imports
 * @param constants: Used to get Colors or Fonts etc from Discord's Constants
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param stylesheet: Used to create style sheets for React components
 * @param manifest: The plugin's manifest.
 * @param { General, Forms }: Component Objects to get components used throughout the settings panel.
 * @param { storage }: Allows for getting and setting plugin storage.
 * @param Credits: The main Credits component
 * @param SectionWrapper: An implementation similar to FormSection but anything is renderable.
 * @param Icons: Icons used throughout the component
 * @param Miscellaneous: Random methods and constants that may be useful
 * @param Updater: Allows to search for updates for @arg PronounDB.
 * @param findByProps: Allows to get a module by its properties
 */
import { stylesheet, constants, React } from '@vendetta/metro/common';
import { manifest } from '@vendetta/plugin';
import { General, Forms } from "@vendetta/ui/components";
import { storage } from '@vendetta/plugin';
import { useProxy } from '@vendetta/storage';
import Credits from "../Dependent/Credits";
import SectionWrapper from "../Dependent/SectionWrapper";
import { Icons, Miscellaneous, Constants } from "../../common";
import { findByProps } from '@vendetta/metro';

/**
 * @param {* from Forms}: Form components used inside the settings panel
 * @param {* from General}: General ReactNative components used inside the settings panel
 */
const { FormRow, FormSwitch } = Forms;
const { ScrollView, View, Image } = General;

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 */
const Router = findByProps('transitionToGuild')

/**
 * @param {stylesheet} styles: The main stylesheet for the items in the UI.
 */
const styles = stylesheet.createThemedStyleSheet({
   /**
    * @param {object} icon: Global style for icons to give them a neutral color scheme and ensure they fit together well.
    */
   icon: {
      color: constants.ThemeColorMap.INTERACTIVE_NORMAL
   },
   /**
    * @param {object} item: Style for trailing text to give it the Muted color, and contrast the normal colour of the text.
    */
   item: {
      color: constants.ThemeColorMap.TEXT_MUTED,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM
   },
   /**
    * @param {object} container: Main style for a rounded container for creating custom FormSection implementations.
    */
   container: {
      width: '90%',
      marginLeft: '5%',
      borderRadius: 10,
      backgroundColor: constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
      ...Miscellaneous.shadow() /** @param shadow: Main shadow implementation */
   },
   /**
    * @param {object} subheaderText: Main styling for the text right at the bottom of the settings page, showing build and release channel.
    */
   subheaderText: {
      color: constants.ThemeColorMap.HEADER_SECONDARY,
      textAlign: 'center',
      margin: 10,
      marginBottom: 50,
      letterSpacing: 0.25,
      fontFamily: constants.Fonts.PRIMARY_BOLD,
      fontSize: 14
   },
   image: {
      width: "100%",
      height: 60,
      borderRadius: 10
   }
});

/**
 * Main @arg Settings page implementation
 * @param manifest: The main plugin manifest passed donw as a prop.
 */
export default () => {
   useProxy(storage);

   /**
    * @param {Getter, Setter}: Whether the preview image should show the timestamp or the op tag mode.
    */
   const [timestampPreview, setTimestampPreview] = React.useState(storage.isTimestamp)

   return <ScrollView>
      {/**
       * The main credits component, to render information about the project in a form factor which is pleasing to the eyes.
       * @param Credits: The main credits component.
       * 
       * @uses @param name
       * @uses @param version
       * @uses @param plugin 
       * @uses @param authors
       */}
      <Credits 
         name={manifest.name}
         authors={manifest.authors}
      /> 
      <View style={{marginTop: 20}}>
         {/**
          * The main "timestamp section" of the settings panel. This section is where the user can:
                  * @arg {enable/disable timestamps}
            * This is wrapped in an @arg SectionWrapper which works similar to an @arg FormSection but allows you to render any styling.
         */}
         <SectionWrapper label='Timestamps' component={<>
            {/**
               * The main section of available options to be selected by the User.
               */}
            <View style={styles.container}>
                  {/**
                   * The main update button. This would allow the user to search the github for the latest release and check if it is the current release installed, and prompts the user to update if it isnt.
                   * @uses @param {number} Icons.Settings.Update: The main @arg update icon.
                   */}
                  <FormRow
                     label="Timestamps"
                     subLabel="Use Timestamps instead of OP/Bot Tag for the pronoun in the chat area."
                     onLongPress={() => Miscellaneous.displayToast(`By default, ${manifest.name} will use the OP tag, and the Bot tag when this is unavailable. By toggling this option, ${manifest.name} will always use Timestamps instead of OP/Bot tag for the pronouns.`, 'tooltip')}
                     leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Locale} />}
                     trailing={<FormSwitch
                        value={storage.isTimestamp}
                        onValueChange={(value) => {
                           storage.isTimestamp = value
                           setTimestampPreview(storage.isTimestamp)
                        }}
                     />}
                  />
            </View>
         </>} />
         <SectionWrapper label='Preview' component={<>
            {/**
               * The main image preview, which is either a timestamp or tag pronoun preview.
               */}
            <View style={styles.container}>
                  <Image
                     style={styles.image}
                     source={{
                           /**
                            * The image used for the @arg Image.
                            * @param uri: Can be either an @arg URI, which is what is provided, or it can be an @arg require.
                            */
                           uri: `https://cdn.discordapp.com/attachments/${timestampPreview
                              ? "1011346757214543875/1073350999445614694/timestamp-pronoun.png"
                              : "1011346757214543875/1073351873530183690/tag-pronoun.png"
                           }`
                     }}
                     resizeMode={"contain"}
                  />
            </View>
         </>} />
         {/**
          * The main "source section" of the settings panel. This section is where the user can:
                  * @arg {check for updates}
                  * @arg {open the repo of the plugin}
            * This is wrapped in an @arg SectionWrapper which works similar to an @arg FormSection but allows you to render any styling.
         */}
         <SectionWrapper label='Source' component={<>
            {/**
               * The main section of available options to be selected by the User.
               */}
            <View style={styles.container}>
                  {/**
                  * The main repository. This would allow the user to open an external window inside of Discord using Router and display the current PronounDB repo, on GitHub.
                  * @uses @param {number} Icons.Open: The main @arg {external} open icon.
                  */}
                  <FormRow
                     label="Source"
                     subLabel={`Open the repository of ${manifest.name} externally.`}
                     onLongPress={() => Miscellaneous.displayToast(`Opens the repository of ${manifest.name} on GitHub in an external page to view any source code of the plugin.`, 'tooltip')}
                     leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
                     trailing={() => <FormRow.Arrow />}
                     onPress={() => {
                        /**
                         * Simply opens the plugin repository externally to the user using the Router.
                         * @uses @param {string} plugin.repo: The blob link of the plugin.
                         */
                        Router.openURL(Constants.plugin.source)
                     }}
                  />
            </View>
         </>} />
      </View>
   </ScrollView>
}