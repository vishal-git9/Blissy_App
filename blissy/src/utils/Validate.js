import * as errorCodes from './ValidationErrors';
import moment from "moment";
//Validate.js
//const Validate = (value, rules) => {
const Validate = (value, rules, customErrorMsg, customminerr) => {
  let isValid = true;
  let tmpErrorMsg = '';
  let tmpisValid;
  let errorMsg = '';
  let checkval;
  if (value instanceof Array && value[0] !== undefined) {
    checkval = value[0];
  }
  else {
    if (value instanceof Array && value[0] === undefined)
      checkval = '';
    else
      checkval = (value == null ? '' : value);
  }


  for (let rule in rules) {

    switch (rule) {

      case 'minLength':
        // tmpisValid = minLengthValidator(checkval, rules[rule]);
        if (checkval == '' || checkval.length == 0) {
          tmpisValid = true
        } else {
          tmpisValid = minLengthValidator(checkval, rules[rule]);
        }
        // tmpErrorMsg = !tmpisValid ? errorCodes.MIN_LENGTH_ERR : ''
        tmpErrorMsg = !tmpisValid ? (customminerr && customminerr !== '' ? customminerr : errorCodes.MIN_LENGTH_ERR) : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'cusMinLength':
        // tmpisValid = minLengthValidator(checkval, rules[rule]);
        if (checkval == '' || checkval.length == 0) {
          tmpisValid = true
        } else {
          tmpisValid = minLengthValidator(checkval, rules[rule]);
        }
        // tmpErrorMsg = !tmpisValid ? errorCodes.MIN_LENGTH_ERR : ''
        tmpErrorMsg = !tmpisValid ? (customminerr && customminerr !== '' ? customminerr.minLenErrorMsg : '') : ''
        // tmpErrorMsg = !tmpisValid ? (customErrorMsg && customErrorMsg != '' ? customErrorMsg : '') : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'maxLength':

        tmpisValid = maxLengthValidator(checkval, rules[rule]);
        tmpErrorMsg = !tmpisValid ? errorCodes.MAX_LENGTH_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'cusMaxLength':
        tmpisValid = maxLengthValidator(checkval, rules[rule]);
        // tmpErrorMsg = !tmpisValid ? errorCodes.CUS_MAX_LENGTH_ERR : ''
        tmpErrorMsg = !tmpisValid ? (customErrorMsg && customErrorMsg != '' ? customErrorMsg : '') : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'cusPatternValidator':
        tmpisValid = cusPatternValidator(checkval, rules[rule]);
        tmpErrorMsg = !tmpisValid ? (customminerr && customminerr != '' ? customminerr.errorMsg : '') : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'cusPatternValidatorV2':
        tmpisValid = cusPatternValidator(checkval, rules[rule]);
        tmpErrorMsg = !tmpisValid ? errorCodes.CUS_PATTERN_VALIDATOR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isRequired':
        if (rules[rule] === true) {
          tmpisValid = requiredValidator(checkval);
          // tmpErrorMsg = !tmpisValid ? errorCodes.MANDATORY_ERR : ''    
          tmpErrorMsg = !tmpisValid ? (customErrorMsg && customErrorMsg != '' ? customErrorMsg : errorCodes.MANDATORY_ERR) : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'isRequiredDate':
        if (rules[rule] === true) {
          tmpisValid = requiredValidator(checkval);
          // tmpErrorMsg = !tmpisValid ? errorCodes.MANDATORY_ERR : ''    
          tmpErrorMsg = !tmpisValid ? (customErrorMsg && customErrorMsg != '' ? customErrorMsg : errorCodes.INVALID_DATE_ERR) : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'isNumber':
        tmpisValid = numberValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.NUMBER_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isAlpha':
        tmpisValid = alphaValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHA_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;


      case 'isAlphaWithSpace':
        tmpisValid = alphaWithSpaceValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHA_WITH_SPACE_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      // case 'isAphaNumeric':
      //   tmpisValid = alphanumericValidator(checkval);
      //   tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERIC_ERR : ''
      //   isValid = isValid && tmpisValid
      //   if (!tmpisValid)
      //     errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
      //   break;
      case 'isAphaNumeric':
        if (rules[rule] === true) {
          tmpisValid = alphanumericValidator(checkval);
          tmpErrorMsg = !tmpisValid ? (customminerr && customminerr !== '' ? customminerr : errorCodes.ALPHANUMERIC_ERR) : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'isAphaNumericWithSpace':

        if (rules[rule] === true) {
          tmpisValid = isAphaNumericWithSpace(checkval);
          tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERIC_ERR : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'isAphaNumericWithSpaceV2':

        if (rules[rule] === true) {
          tmpisValid = isAphaNumericWithSpacev2(checkval);
          tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERIC_HYPHEN_ERR : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }


      case 'isAphaNumericSpl':
        tmpisValid = alphanumericsplValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERICSPL_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isNonZero':
        tmpisValid = isNonZero(checkval);
        console.log(tmpisValid)
        tmpErrorMsg = !tmpisValid ? errorCodes.NON_ZERO : ''
        console.log(tmpErrorMsg)
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isLessZero':
        tmpisValid = isLessZero(checkval);
        console.log(tmpisValid)
        tmpErrorMsg = !tmpisValid ? errorCodes.LESS_THEN_ZERO : ''
        console.log(tmpErrorMsg)
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isAphaNumericSpeficSpl':
        tmpisValid = alphanumericspecificsplValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERICSPECSPL_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isAphaNumericunderscore':
        tmpisValid = alphanumericunderscoreValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERICSPECSPL_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isAphaNumerichyphen':
        tmpisValid = alphanumerichyphenValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHANUMERICSPECSPL_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isEmail':
        tmpisValid = emailValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.EMAIL_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isNotThreeRepeatingChar':
        tmpisValid = NotThreeRepeatingCharValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.THREEREPEATINGCHAR_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isNotThreeSequenceChar':
        tmpisValid = NotThreeSequenceCharValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.THREESEQUENCECHAR_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isChecked':
        tmpisValid = checkval;
        tmpErrorMsg = tmpisValid ? '' : errorCodes.CHECKBOX_ERR;
        isValid = isValid && tmpisValid;
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'idlength':
        tmpisValid = idlengthvalidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ID_LENGTH_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      // case 'isChecked':
      //   tmpisValid = checkval;
      //   tmpErrorMsg = tmpisValid ? errorCodes.CHECKBOX_ERR : '';
      //   isValid = isValid && tmpisValid;
      //   if (!tmpisValid)
      //     errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
      //   break;
      case 'amountDecimalValidatior':
        tmpisValid = amountDecimalValidatior(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.AMOUNTTHREEDECIMAL_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'mobileNumberValidator':
        tmpisValid = mobileNumberValidator(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.MOBILENUMBER_EIGHTDIGIT_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'mobileNumberNonZero':
        tmpisValid = mobileNumberNonZero(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.MOBILENUMBER_NONZERO_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'IBANDigitsValidator':
        tmpisValid = IBANDigitsValidator(checkval);
        console.log("tmpisValid", tmpisValid)
        tmpErrorMsg = !tmpisValid ? errorCodes.IBAN_DIGIT_ERR : ''
        console.log("tmpErrorMsg", tmpErrorMsg)
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'minMaxAmountValidator':

        if (rules[rule] === true) {
          tmpisValid = minMaxAmountValidator(checkval, rules);
          tmpErrorMsg = !tmpisValid ? errorCodes.MINMAXAMOUNT_ERR : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'isRequiredDropDown':
        tmpisValid = requiredValidator(checkval);
        console.log(tmpisValid)
        tmpErrorMsg = !tmpisValid ? errorCodes.MANDATORYSELECT_ERR : ''
        console.log(tmpErrorMsg)
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isRequiredAmount':
        tmpisValid = requiredValidator(checkval);
        console.log(tmpisValid)
        tmpErrorMsg = !tmpisValid ? errorCodes.MANDATORYSELECT_AMOUNT : ''
        console.log(tmpErrorMsg)
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;


      case 'isTwoDecimal':
        if (rules[rule] === true) {
          console.log("RL...", rules[rule])
          tmpisValid = twoDecimalValidator(checkval);
          tmpErrorMsg = !tmpisValid ? 'not valid 2' : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid) {
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          }
          break;
        } else {
          //errorMsg = "";
          //isValid =true;
          break;
        }

      case 'isThreeDecimal':
        if (rules[rule] === true) {
          tmpisValid = threeDecimalValidator(checkval);
          tmpErrorMsg = !tmpisValid ? errorCodes.THREEDECIMAL_ERROR : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid) {
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          }
          break;
        } else {
          //errorMsg = "";
          // isValid =true;
          break;
        }



      case 'isAllowedLength':
        tmpisValid = allowedLengthValidator(checkval, rules[rule]);
        console.log(tmpisValid)
        tmpErrorMsg = !tmpisValid ? errorCodes.SHOULDALLOWEDLENGTH_ERR : ''
        console.log(tmpErrorMsg)
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isNotBeginWithSpace':
        tmpisValid = NotBeginWithSpace(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.NOTBEGINWITH_SPACE_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isMinCharWithOutSpace':
        tmpisValid = MinCharWithOutSpace(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.MIN_CHAR_WITHOUT_SPACE : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isConcecutiveSpace':
        tmpisValid = ConcecutiveSpace(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.CONCECUTIVE_SPACE_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'allowspace':
        tmpisValid = allowspace(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALLOW_SPACE_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isAphaNumericSplWithSpace':
        tmpisValid = alphanumericsplValidatorWithSpace(checkval);
        tmpErrorMsg = !tmpisValid ? errorCodes.ALPHA_ALLOW_SPACE_ERR : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isDate':
        tmpisValid = dateValidator(checkval, rules[rule]);
        tmpErrorMsg = !tmpisValid ? errorCodes.IS_DATE : '';
        isValid = isValid && tmpisValid;
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;

      case 'isTwoWords':
        tmpisValid = twowordsValidator(checkval, rules[rule]);
        tmpErrorMsg = !tmpisValid ? errorCodes.IS_TWO_WORDS : ''
        isValid = isValid && tmpisValid
        if (!tmpisValid)
          errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
        break;
      case 'isMultipleOf25':
        if (rules[rule] === true) {
          tmpisValid = multiple25Validator(checkval);
          // tmpErrorMsg = !tmpisValid ? errorCodes.MANDATORY_ERR : ''         
          tmpErrorMsg = !tmpisValid ? errorCodes.IS_MULTIPLE_25 : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'minAmountValidator':

        if (rules[rule] === true) {
          tmpisValid = minAmountValidator(checkval, rules);
          tmpErrorMsg = !tmpisValid ? errorCodes.MINAMOUNT_ERR : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }
      case 'isLesserThanOtherDate':

        if (rules[rule] === true) {
          tmpisValid = isLesserThanOtherDate(checkval, rules['OtherDate']);
          tmpErrorMsg = !tmpisValid ? errorCodes.FROMDATE_GREATERTHAN_TODATE : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'isGreaterThanOtherDate':

        if (rules[rule] === true) {
          tmpisValid = isGreaterThanOtherDate(checkval, rules['OtherDate']);
          tmpErrorMsg = !tmpisValid ? errorCodes.FROMDATE_LESSERTHAN_TODATE : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

      case 'minMaxDateChecker':
        if (rules[rule] === true) {
          tmpisValid = minMaxDateValidator(rules['minDate'], rules['maxDate'], rules['dateFormat'], value);
          tmpErrorMsg = !tmpisValid ? errorCodes.MIN_MAX_DATE_CHECKER : ''
          isValid = isValid && tmpisValid
          if (!tmpisValid)
            errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
          break;
        } else {
          errorMsg = "";
          isValid = true;
          break;
        }

        case 'monthEndDateChecker':
          if (rules[rule] === true) {
            tmpisValid = monthEndValidator(rules['dateFormat'], value);
            tmpErrorMsg = !tmpisValid ? errorCodes.MONTH_END_DATE_CHECKER : ''
            isValid = isValid && tmpisValid
            if (!tmpisValid)
              errorMsg = setErrorMsg(errorMsg, tmpErrorMsg)
            break;
          } else {
            errorMsg = "";
            isValid = true;
            break;
          }

        
      default:
        // isValid = true;
        // errorMsg = ''
        break;
    }
  }
  return {
    valid: isValid,
    errorMsg: errorMsg
  }
}

const setErrorMsg = (ErrMessage, message) => {
  let resMessage;
  if (ErrMessage.length > 0) {
    resMessage = ErrMessage.concat(',', message)
  }
  else
    resMessage = message


  return resMessage
}

/**
 * minLength 
 * @param  value 
 * @param  minLength
 * @return          
 */
const minLengthValidator = (value, minLength) => {
  return value.length >= minLength;
}

/**
 * maxLength 
 * @param  value 
 * @param  maxLength
 * @return          
 */
const maxLengthValidator = (value, maxLength) => {
  return value.length <= maxLength;
}

/**
 * patternCheck 
 * @param  value 
 * @param  pattern
 * @return          
 */
const cusPatternValidator = (value, cusPattern) => {
  if (value.length > 0) {
    var regex = new RegExp(cusPattern);
    return regex.test(value)
  }
  else
    return true;
}

/**
 * Check to confirm that field is required
 * 
 * @param  value 
 * @return       
 */
const requiredValidator = value => {
  //return value != null ?  (value.totrim() !== '') : '';
  return value != null ? (value.toString().trim() !== '') : false;
}


/**
 * Check to confirm that field has only numbers
 * 
 * @param  value 
 * @return       
 */
const numberValidator = value => {
  if (value.length > 0) {
    const pattern = /^[0-9]+$/
    return pattern.test(value)
  }
  else
    return true;
}

/**
   * Check to confirm that field has only Alpha
   * 
   * @param  value 
   * @return       
   */
const alphaValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z]+$/
    return pattern.test(value)
  }
  else
    return true;
}


const alphaWithSpaceValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z\u0621-\u064A\040\s]*$/
    return pattern.test(value)
  }
  else
    return true;
}


/**
   * Check to confirm that field has only AlphaNumeric
   * 
   * @param  value 
   * @return       
   */
const alphanumericValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669]+$/
    return pattern.test(value)
  }
  else
    return true;
}

const isNonZero = value => {

  if (value >= 1) {
    return true
  }
  else
    return false;
}

const isLessZero = value => {
  if (value < 1) {
    return false
  }
  else
    return true;
}

const isAphaNumericWithSpace = value => {
  
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669\s]+$/
    console.log(pattern.test(value),value,'chek');
    return pattern.test(value)
  }
  else
    return true;
}

const isAphaNumericWithSpacev2 = value => {
  
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669\s-]+$/
    console.log(pattern.test(value),value,'chek');
    return pattern.test(value)
  }
  else
    return true;
}

/**
   * Check to confirm that field has only AlphaNumeric and Special Chars
   * 
   * @param  value 
   * @return       
   */
const alphanumericsplValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9!@#$%^&*)(+=_-]+$/
    return pattern.test(value)
  }
  else
    return true;
}

/**
   * Check to confirm that field has only AlphaNumeric and Specific Special Chars
   * 
   * @param  value 
   * @return       
   */
const alphanumericspecificsplValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-?:(),\/+.\s]+$/
    return pattern.test(value)
  }
  else
    return true;
}
/**
   * Check to confirm that field has only AlphaNumeric and Specific Special Chars(Underscore)
   * 
   * @param  value 
   * @return       
   */
const alphanumericunderscoreValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9_\s]+$/
    return pattern.test(value)
  }
  else
    return true;
}
const alphanumerichyphenValidator = value => {
  if (value.length > 0) {
    const pattern = /^[a-zA-Z0-9_-\s]+$/
    return pattern.test(value)
  }
  else
    return true;
}
/**
 * Email validation
 * 
 * @param value
 * @return 
 */
const emailValidator = value => {
  if (value.length > 0) {
    // var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(value).toLowerCase());
  }
  else
    return true
}


/**
   * Three Repeating Char validation
   * 
   * @param value
   * @return 
   */
const NotThreeRepeatingCharValidator = value => {
  if (value.length > 0) {
    const pattern = /(.)\1{2,}/;
    const res = pattern.test(value);
    return !res;
  }
  else
    return true
}

/**
 * Three Sequence Char validation
 * 
 * @param value
 * @return 
 */
const NotThreeSequenceCharValidator = value => {
  if (value.length > 0) {
    const pattern = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|ABC|BCD|CDE|DEF|EFG|FGH|GHI|HIJ|IJK|JKL|KLM|LMN|MNO|NOP|OPQ|PQR|QRS|RST|STU|TUV|UVW|VWX|WXY|XYZ|012|123|234|345|456|567|678|789)+/;
    const res = pattern.test(value);
    return !res;
  }
  else
    return true
}

/**  Ezpay module
   * Added for Allowing 3 Decimals in Amount field..For Ezpay module
   * 
   * @param  value 
   * @return       
   */
const amountDecimalValidatior = value => {
  if (value.length > 0) {
    const pattern = /^[0-9]{1,17}(?:\.[0-9]{1,3})?$/
    return pattern.test(value)
  }
  else
    return true;
}




/**  Ezpay module
 * Added for Allowing 8 digit mobile number validation..For Ezpay module
 * 
 * @param  value 
 * @return       
 */
const mobileNumberValidator = value => {
  if (value.length > 0) {
    const pattern = /^\d{9}$/;
    return pattern.test(value)
  }
  else
    return true;
}

const mobileNumberNonZero = value => {
  let firstDigit = value.toString()
  console.log("firstDigit", firstDigit.charAt(0))
  if (value.length > 0) {
    if (firstDigit.charAt(0) == 0) {
      return false
    } else {
      return true
    }
  }
  else
    return true;
}

/**  IPS module
 * Added for Allowing 24 digit IBAN validation..For IPS module
 * 
 * @param  value 
 * @return       
 */
const IBANDigitsValidator = value => {
  if (value.length > 0) {
    return value.length == 24
  }
  else
    return true;
}





// const minMaxAmountValidator = value => {

//   if ((value < 1) || (value > 1000)) {

//   }
//   else {
//     return true;
//   }
// }

const minMaxAmountValidator = (value, rules) => {


  if ((Number(value) >= rules['minValue']) && (Number(value) <= rules['maxValue'])) {
    return true

  }
  else {
    return false;
  }
}

const threeDecimalValidator = value => {
  if (value.length > 0) {
    const pattern = /^[0-9]+(\.[0-9]{3})?$/
    return pattern.test(value)
  }
}


//Two decimal validation

const twoDecimalValidator = value => {
  if (value.length > 0) {
    const pattern = /^[0-9]+(\.[0-9]{2})?$/
    return pattern.test(value)
  }
}

//Allowed length validation
const allowedLengthValidator = (value, maxLength) => {
  return value.length === maxLength;
}


const NotBeginWithSpace = value => {
  if (value.length > 0) {
    const pattern = /^\s+|\s+$/;
    //^[^\s]+(\S+[^\s]+)
    const res = pattern.test(value);
    return !res;
  }
  else
    return true
}

const MinCharWithOutSpace = value => {
  if (value.length > 0) {
    value = value.replace(/\s/g, "");
    if (value.length < 3) {
      return !value;
    } else {
      return true
    }
  }
}

const ConcecutiveSpace = value => {
  if (value.length > 0) {
    const pattern = /\s\s/g;
    const res = pattern.test(value);
    return !res;
  } else
    return true
}
const allowspace = value => {
  if (value.length > 0) {
    const pattern = /^[0-9a-zA-Z\s]*$/
    return pattern.test(value)
  }
  else
    return true;
}

const alphanumericsplValidatorWithSpace = value => {
  if (value.length > 0) {
    //const pattern = /^[a-zA-Z0-9!@#$%^&*)(+=._-\s]+$/
    const pattern = /^[a-zA-Z0-9!@#$%^&*,;)(+=._-\s]+$/
    return pattern.test(value)
  }
  else
    return true;
}
const idlengthvalidator = (value) => {
  if (value.length === 10 || value.length === 11) {
    return false;
  } else return true;
};
const dateValidator = (value) => {
  return moment(value, 'DD/MM/YYYY', true).isValid()
};

const twowordsValidator = value => {
  if (value.length > 0) {
    //const pattern = /^(?![a-zA-Z0-9]+$)(?!\d+$)[a-zA-Z0-9 ]+(?:\s[a-zA-Z0-9 ]+)+$/
    const pattern = /^(?![a-zA-Z]+$)(?!\d+$)[a-zA-Z]+(?:\s[a-zA-Z]+)+$/
    return pattern.test(value)
  }
  else
    return true;
}
const multiple25Validator = value => {
  if ((value % 25) !== 0)
    return false
  else
    return true;
}

const minAmountValidator = (value, rules) => {


  if ((Number(value) >= rules['minimumValue'])) {
    return true

  }
  else {
    return false;
  }
}


const isLesserThanOtherDate = (dateOne, dateTwo) => {

  if (dateTwo === "" || dateTwo === undefined) {
    return true
  }

  let dateFrom = moment(dateOne, "DD/MM/YYYY").format("YYYY-MM-DD")
  let dateTo = moment(dateTwo, "DD/MM/YYYY").format("YYYY-MM-DD")

  dateFrom = moment(dateFrom)
  dateTo = moment(dateTo)
  if (dateFrom.diff(dateTo, 'days') <= 0) {
    // console.log("isLesserThanOtherDate true")
    return true;
  } else {
    // console.log("isLesserThanOtherDate false")
    return false;
  }

}



const isGreaterThanOtherDate = (dateOne, dateTwo) => {
  if (dateTwo === "" || dateTwo === undefined) {
    return true
  }

  let dateFrom = moment(dateOne, "DD/MM/YYYY").format("YYYY-MM-DD")
  let dateTo = moment(dateTwo, "DD/MM/YYYY").format("YYYY-MM-DD")

  dateFrom = moment(dateFrom)
  dateTo = moment(dateTo)
  if (dateFrom.diff(dateTo, 'days') >= 0) {
    // console.log("isLesserThanOtherDate true")
    return true;
  } else {
    // console.log("isLesserThanOtherDate false")
    return false;
  }
}


const minMaxDateValidator = (minDate, maxDate, format, value) => {

  console.log('minMaxDateValidator Params..', minDate, maxDate, format, value)

  if (format) {




    if (value && minDate) {
      let tempMinDate = moment(minDate, format).format('YYYY-MM-DD')
      let tempValue = moment(value, format).format('YYYY-MM-DD')
      console.log('minMaxDateValidator MinValidation..', (moment(tempValue).isBefore(tempMinDate)))
      if (moment(tempValue).isBefore(tempMinDate)) {
        return false
      }
    }

    if (value && maxDate) {
      let tempMaxDate = moment(maxDate, format).format('YYYY-MM-DD')
      let tempValue = moment(value, format).format('YYYY-MM-DD')
      console.log('minMaxDateValidator MaxValidation..', (moment(tempValue).isAfter(tempMaxDate)))

      if (moment(tempValue).isAfter(tempMaxDate)) {
        return false
      }
    }

  }



  return true
}


const monthEndValidator = (format, value) => {

  // console.log('minMaxDateValidator Params..', minDate, maxDate, format, value)

  if (format && value) {



    const endOfMonth = moment(value,format).clone().endOf('month').format('DD/MM/YYYY');

    if(endOfMonth == value){
      return true
    }else{
      return false
    }



  }



  return true
}

export default Validate;
