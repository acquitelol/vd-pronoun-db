import { stylesheet, constants, React } from '@vendetta/metro/common';
import { manifest } from '@vendetta/plugin';
import { General, Forms } from "@vendetta/ui/components";
import { storage } from '@vendetta/plugin';
import { useProxy } from '@vendetta/storage';
import Credits from "../Dependent/Credits";
import SectionWrapper from "../Dependent/SectionWrapper";
import { Icons, Miscellaneous, Constants } from "../../common";
import { findByProps } from '@vendetta/metro';
import { semanticColors } from '@vendetta/ui';
import IntelligentImage from '../Dependent/IntelligentImage';

const { FormRow, FormSwitch, FormDivider } = Forms;
const { ScrollView, View, Text } = General;

const Router = findByProps('transitionToGuild', "openURL")

const styles = stylesheet.createThemedStyleSheet({
   icon: {
      color: semanticColors.INTERACTIVE_NORMAL
   },
   item: {
      color: semanticColors.TEXT_MUTED,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM
   },
   container: {
      width: '90%',
      marginLeft: '5%',
      borderRadius: 10,
      backgroundColor: semanticColors.BACKGROUND_MOBILE_SECONDARY,
      ...Miscellaneous.shadow() /** @param shadow: Main shadow implementation */
   },
   subheaderText: {
      color: semanticColors.HEADER_SECONDARY,
      textAlign: 'center',
      margin: 10,
      marginBottom: 50,
      letterSpacing: 0.25,
      fontFamily: constants.Fonts.PRIMARY_BOLD,
      fontSize: 14
   },
   image: {
      width: "100%",
      maxWidth: 350,
      borderRadius: 10
   }
});

/**
 * Main @arg Settings page implementation
 * @param manifest: The main plugin manifest passed donw as a prop.
 */
export default () => {
   useProxy(storage);

   const [timestampPreview, setTimestampPreview] = React.useState(storage.isTimestamp)
   const [rolePreview, setRolePreview] = React.useState(storage.isRole)

   return <ScrollView>
      <Credits 
         name={manifest.name}
         authors={manifest.authors}
      /> 
      <View style={{marginTop: 20}}>
         <SectionWrapper label='Preferences'>
            <View style={[styles.container]}>
               <FormRow
                  label="Timestamps"
                  subLabel="Use Timestamps instead of OP Tag for the pronoun in the chat area."
                  onLongPress={() => Miscellaneous.displayToast(`By default, ${manifest.name} will use the OP tag to display pronouns. Toggling this option will always use Timestamps instead of OP tag for pronouns.`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Locale} />}
                  trailing={<FormSwitch
                     value={storage.isTimestamp}
                     onValueChange={() => {
                        storage.isTimestamp = !storage.isTimestamp
                        setTimestampPreview(storage.isTimestamp)
                     }}
                  />}
               />
               <FormDivider />
               <FormRow
                  label="Roles"
                  subLabel="Show the pronoun styled as a role instead of plain text inside of profiles."
                  onLongPress={() => Miscellaneous.displayToast(`With this option enabled, ${manifest.name} will style pronouns as roles in profiles. Otherwise, it will style them as plain text.`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Edit} />}
                  trailing={<FormSwitch
                     value={storage.isRole}
                     onValueChange={() => {
                        storage.isRole = !storage.isRole
                        setRolePreview(storage.isRole)
                     }}
                  />}
               />
            </View>
         </SectionWrapper>
         <SectionWrapper label='Previews'>
            <View style={{
               ...styles.container,
               maxWidth: 350
            }}>
               <IntelligentImage 
                  style={styles.image}
                  source={`https://cdn.discordapp.com/attachments/${timestampPreview
                     ? "1011346757214543875/1075007230337896448/pronoun-timestamp.png"
                     : "1011346757214543875/1075007230107193374/pronoun-tag.png"
                  }`}
               />
            </View>
            <View style={{
               ...styles.container, 
               marginTop: 10,
               maxWidth: 350
            }}>
               <IntelligentImage
                  style={styles.image}
                  source={`https://cdn.discordapp.com/attachments/${rolePreview
                     ? "1011346757214543875/1075007778399199282/profile-role.png"
                     : "1011346757214543875/1075007778067841044/profile-plain.png"
                  }`}
               />
            </View>
         </SectionWrapper>
         <SectionWrapper label='Source'>
            <View style={styles.container}>
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
               <FormDivider />
               <FormRow
                  label="PronounDB"
                  subLabel={`Open the ${manifest.name} website externally at \`https://pronoundb.org\`.`}
                  onLongPress={() => Miscellaneous.displayToast(`Opens the PronounDB website in an external page which allows you to link your Discord account to PronounDB.`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.External} />}
                  trailing={() => <FormRow.Arrow />}
                  onPress={() => {
                     /**
                      * Simply opens the PronounDB website externally to the user using the Router.
                      * @uses @param {string} plugin.pronoundb: The PronounDB website.
                      */
                     Router.openURL(Constants.plugin.pronoundb)
                  }}
               />
            </View>
         </SectionWrapper>
      </View>
      {/**
       * Renders a simple FormRow with a version and build to display to the user. This is unnecessary as there as multiple ways to view this but it adds slightly more polish to the Settings Panel.
       */}
      <Text style={styles.subheaderText}>
         {`Build: (${manifest.hash.substring(0, 8)})`}
      </Text>
   </ScrollView>
}