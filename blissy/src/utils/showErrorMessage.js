import * as errorCodes from "./ValidationErrors";
import { withTranslation } from 'react-i18next';
import { I18nManager } from 'react-native'


const showErrorMessage = (properties) => {
  console.log(properties)
  const { t, errorMsg, validationRules, minDateErr } = properties;
  const errorMsgs = errorMsg.split(",");

  const fromdateError = I18nManager.isRTL ? 'يجب أن تكون قيمة "من تاريخ" أصغر من قيمة "حتى تاريخ"' : "From date should be less than To date"

  const todateError = I18nManager.isRTL ? 'يجب أن تكون قيمة "حتى تاريخ" أكبر من قيمة "من تاريخ"' : "To date should be Greater than From date"


  let errorStr = "";
  errorMsgs.forEach((errorCode) => {
    switch (errorCode) {
      case errorCodes.MIN_LENGTH_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.min', { val: validationRules['minLength'] }));
        break;
      case errorCodes.CUS_MIN_LENGTH_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.cusMin', { val1: validationRules['itemName'], val2: validationRules['cusMinLength'] }));
        break;
      case errorCodes.MAX_LENGTH_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.max', { val: validationRules["maxLength"] }));
        break;
      case errorCodes.CUS_MAX_LENGTH_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.cusMax', { val1: validationRules['itemName'], val2: validationRules['cusMaxLength'] }));
        break;
      case errorCodes.MANDATORY_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.req'));
        break;
      case errorCodes.NUMBER_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.num'));
        break;
      case errorCodes.ALPHA_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.isAlpha'));
        break;
      case errorCodes.ALPHANUMERIC_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.alphanum'));
        break;
      case errorCodes.ALPHANUMERICSPL_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.alphanumspl'));
        break;
      case errorCodes.ALPHANUMERICSPECSPL_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.alphanumspecspl'));
        break;
      case errorCodes.EMAIL_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.email'));
        break;
      case errorCodes.THREEREPEATINGCHAR_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.threerepchar'));
        break;
      case errorCodes.THREESEQUENCECHAR_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.threeseqchar'));
        break;
      case errorCodes.MINMAXAMOUNT_ERR:
        // errorStr = setErrorMsg(errorStr, t("Validate:validate.minMaxAmountError"));
        errorStr = setErrorMsg(errorStr, t("Validate:validate.minMaxAmountError", { val1: validationRules['minValue'], val2: validationRules['maxValue'] }));
        break;
      case errorCodes.AMOUNTTHREEDECIMAL_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.amountdecimal'));
        break;
      case errorCodes.MOBILENUMBER_EIGHTDIGIT_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.mobileNoEightDigitError", { val: properties.value.length }));
        break;
      case errorCodes.MOBILENUMBER_NONZERO_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.mobileNoNonZeroError"));
        break;  
      case errorCodes.IBAN_DIGIT_ERR:
      errorStr = setErrorMsg(errorStr, t("Validate:validate.IBANDigitError", { val: properties.value.length }));
      break;
      case errorCodes.SHOULDALLOWEDLENGTH_ERR:
        errorStr = setErrorMsg(errorStr, t('creditcardpayment.error.shouldAllowedlengthErrorMsg', { val: validationRules["isAllowedLength"] }));
        break;

      case errorCodes.MANDATORYSELECT_ERR:
        errorStr = setErrorMsg(errorStr, t('Common:errorMsg.mandatorySelect'));

        break;
      case errorCodes.NOTBEGINWITH_SPACE_ERR:
        errorStr = setErrorMsg(errorStr, t("errors.isNotBeginWithSpace"));
        break;
      case errorCodes.CHECKBOX_ERR:
        errorStr = setErrorMsg(errorStr, t("ownAccountPayment.noteCheckBoxError"));
        break;
      case errorCodes.MIN_CHAR_WITHOUT_SPACE:
        errorStr = setErrorMsg(errorStr, t("errors.isMinCharWithOutSpace"));
        break;
      case errorCodes.CONCECUTIVE_SPACE_ERR:
        errorStr = setErrorMsg(errorStr, t("errors.isConcecutiveSpace"));
        break;
      case errorCodes.ALPHANUMERICSPL_WITHSPACE_ERR:
        errorStr = setErrorMsg(errorStr, t('errors.isAphaNumericSplWithSpace'));
        break;
      case errorCodes.THREEDECIMAL_ERROR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.threeDecimalError"));
        break;

      case errorCodes.NOTBEGINWITH_SPACE_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.isNotBeginWithSpace"));
        break;
      case errorCodes.MIN_CHAR_WITHOUT_SPACE:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.isMinCharWithOutSpace"));
        break;
      case errorCodes.CONCECUTIVE_SPACE_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.isConcecutiveSpace"));
        break;
      case errorCodes.ALPHANUMERICSPL_WITHSPACE_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.isAphaNumericSplWithSpace'));
        break;

      case errorCodes.FROMDATE_TODATE_SAME:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.fromdatetodatearesame'));
        break;
      case errorCodes.FROMDATE_LESSERTHAN_TODATE:
        errorStr = setErrorMsg(errorStr, todateError);
        break;
      case errorCodes.FROMDATE_GREATERTHAN_TODATE:
        errorStr = setErrorMsg(errorStr, fromdateError);
        break;
      case errorCodes.TRIP_EXIST:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.sametripfound'));
        break;
      case errorCodes.ID_LENGTH_ERR:
        errorStr = setErrorMsg(errorStr, t('Register:Register.errormsg.custom'));
        break;
      case errorCodes.IS_DATE:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.date'));
        break;
      case errorCodes.ALPHA_ALLOW_SPACE_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.alphaspace'));

      case errorCodes.ALPHA_WITH_SPACE_ERR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.isAlphawithSpace'));
        break;

      case errorCodes.MANDATORYSELECT_AMOUNT:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.amounterror'));
        break;
      case errorCodes.TERMSANDCONDITION_ERROR:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.termsandcondtion'));
        break;

      case errorCodes.CARDRELOAD_MANDATORYTEXT:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.cardreload.cardReloadMandatoryTextBoxError', { val: validationRules['fieldName'] }));
        break;
      case errorCodes.CARDRELOAD_MANDATORYDROPDOWN:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.cardreload.cardReloadMandatoryDropDownError', { val: validationRules['fieldName'] }));
        break;
      case errorCodes.CARDRELOAD_LENGTHVALIDATION:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.cardreload.cardReloadLengthError', { val1: validationRules['maxLength'], val2: validationRules['fieldName'] }));
        break;
      case errorCodes.IS_TWO_WORDS:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.istwowords'));
        break;
      case errorCodes.IS_MULTIPLE_25:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.ismultiple25'));
        break;

      case errorCodes.MINAMOUNT_ERR:
        // errorStr = setErrorMsg(errorStr, t("Validate:validate.minMaxAmountError"));
        errorStr = setErrorMsg(errorStr, t("Validate:validate.minAmountError", { val1: validationRules['minimumValue'], }));
        break;

      case errorCodes.INVALID_DATE_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.InvalidDate"));
        break;

      case errorCodes.DATE_RANGE_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.DateRangeExceed"));
        break;
      case errorCodes.DATE_VALID_ERR:
      errorStr = setErrorMsg(errorStr, t("Validate:validate.todatevalidation"));
      break;
      case errorCodes.NON_ZERO:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.notzero"));
        break;
      case errorCodes.LESS_THEN_ZERO:
        errorStr = setErrorMsg(errorStr, t('Validate:validate.lesszero'));
        break;
      case errorCodes.MIN_DATE_EXCEED_ERR:
        errorStr = setErrorMsg(errorStr, t("Validate:validate.minDateExceed", { val: minDateErr}));
        break;
      case errorCodes.ALPHANUMERIC_HYPHEN_ERR:
        errorStr = setErrorMsg(errorStr, t("beneficiaryMaintance:alphanumericWithSpaceHyphenErrorMsg"));
      break;

      default:
        errorStr = setErrorMsg(errorStr, t(errorCode));
        break;


    }
  });
  return errorStr;
};

const setErrorMsg = (ErrMessage, message) => {
  let resMessage;
  if (ErrMessage.length > 0) {
    resMessage = ErrMessage.concat(',', message)
  }
  else
    resMessage = message
  return resMessage
}

export default withTranslation()(showErrorMessage);
//export default showErrorMessage;
