import {StyleSheet} from 'react-native';
import {colors} from './colors';

export {colors} from './colors';

const styles = StyleSheet.create({
  /** Global */
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: colors.PRIMARYBGCOLOR,
  },
  defaultContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.WHITE,
    padding: 8,
  },
  body: {
    fontSize: 12,
    fontWeight: 'normal',
    color: colors.DARK_GREY,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 18,
    color: colors.GREY,
    textAlign: 'center',
  },
  /** List */
  listSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.SEPARATOR,
  },
  header: {
    fontSize: 22,
  },
  /** Empty Items */
  reloadButton: {
    backgroundColor: 'transparent',
    flexGrow: 0,
  },
  reloadButtonTitle: {
    color: colors.BUTTONBGCOLOR,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 10,
    margin: 10,
    borderColor: colors.BUTTONBGCOLOR,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
  },
  /** Settings */
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageLogo: {
    marginTop: 8,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 36,
    color: colors.WHITE,
    fontWeight: '300',
    marginBottom: 0,
  },
  textSubTitle: {
    fontSize: 54,
    color: colors.WHITE,
    fontWeight: '300',
    marginBottom: 10,
    marginTop: 0,
  },
  inputPhone: {
    height: 40,
    color: colors.BLACK,
    borderColor: colors.INPUT,
    borderWidth: 1,
    backgroundColor: colors.WHITE,
    paddingLeft: 8,
    marginBottom: 8,
  },
  inputAPI: {
    height: 40,
    color: colors.BLACK,
    borderColor: colors.INPUT,
    borderWidth: 1,
    backgroundColor: colors.WHITE,
    paddingLeft: 8,
    marginBottom: 8,
  },
  inputSecret: {
    height: 40,
    color: colors.BLACK,
    borderColor: colors.INPUT,
    borderWidth: 1,
    backgroundColor: colors.WHITE,
    paddingLeft: 8,
    marginBottom: 8,
  },
  inputURL: {
    height: 40,
    color: colors.BLACK,
    borderColor: colors.INPUT,
    borderWidth: 1,
    backgroundColor: colors.WHITE,
    paddingLeft: 8,
    marginBottom: 8,
  },
  buttonContainter: {
    flex: 1,
    padding: '6%',
  },
  settingsButton: {
    backgroundColor: colors.BUTTONBGCOLOR,
  },
  /** Detail */
  imageSMLogo: {
    alignSelf: 'center',
  },
  logoText: {
    color: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  detailButton: {
    backgroundColor: colors.BUTTONBGCOLOR,
    padding: 20,
    margin: 20,
  },
  detailOrdersContainer: {
    flex: 1,
    borderColor: colors.SEPARATOR,
    backgroundColor: colors.WHITE,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  detailDateAndOrderNumCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  detailDate: {
    fontSize: 21,
    color: colors.BUTTONBGCOLOR,
    marginLeft: 8,
    fontWeight: '500',
  },
  detailOrderNum: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginRight: 8,
  },
  detailLastFirstContainer: {
    // flex: 1
  },
  detailFirstLastName: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginLeft: 8,
    marginVertical: 10,
  },
  detailOrderNote: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginLeft: 8,
    marginVertical: 10,
    borderColor: colors.SEPARATOR,
    borderWidth: 1,
  },
  detailPEContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailPhone: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginLeft: 8,
    fontWeight: '500',
    marginVertical: 10,
  },
  detailEmail: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginLeft: 8,
    marginBottom: 20,
    fontWeight: '500',
  },
  detailOrderSectionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  detailProductName: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginLeft: 8,
  },
  detailQuanity: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginRight: 8,
    fontWeight: '300',
  },
  detailTaxesTotalContainer: {
    justifyContent: 'flex-end',
  },
  detailTaxesTotal: {
    fontSize: 18,
    color: colors.BUTTONBGCOLOR,
    marginRight: 8,
    alignSelf: 'flex-end',
    paddingBottom: 10,
  },
  /* Dismiss Button */
  dismissText: {
    color: colors.WHITE,
    paddingRight: 18,
    fontSize: 17,
  },
});

export default styles;
