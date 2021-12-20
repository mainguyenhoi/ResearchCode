import React, {
    memo,
    useEffect,
    useContext,
    useCallback,
    useImperativeHandle,
    forwardRef,
    useMemo
  } from 'react';
  import classnames from 'classnames';
  import { useIntl } from 'react-intl';
  import { useFormik } from 'formik';
  import { useDispatch, useSelector } from 'react-redux';
  import { Grid } from '@material-ui/core';
  import get from 'lodash/get';
  
  import { provinceService } from 'services';
  import { ensureArray } from 'utils/helpers';
  import { stateName } from 'store/Types';
  import { Adult } from 'models/passenger';
  import { IUser } from 'models/user';
  import Checking from 'components/Checking';
  import Translate from 'components/Translate';
  import CustomSelect from 'components/CustomSelect';
  import DialCodeSelect from 'components/DialCodeSelect';
  import CustomTextField from 'components/CustomTextField';
  import CustomDatePicker from 'containers/DatePickerPassengerInfoContainer';
  import useNameTranslation from 'hooks/useNameTranslation';
  import CustomAutocomplete from 'components/CustomAutocomplete';
  import { ProfileContext } from 'containers/PassengerInfoContainer';
  import {
    PassengerTitle,
    PassengerGender,
    NATION_VNM
  } from '_constants/passenger';
  import { fetchProvinceAction, FETCH_SUCCESS } from 'store/Province';
  import { PassengerAdultSchema, FirstAdultSchema } from 'services/Passenger';
  import { languageLocaleIdSelector } from 'containers/LanguageProvider/selectors';
  import {
    nonAccentVietnamese,
    nonAccentVietnameseNoToLowerCase
  } from 'utils/string';
  import {
    LastNameTooltip,
    FirstNameTooltip,
    PhoneTooltip
  } from 'pages/PassengerInfo';
  import useStyle from './style';
  
  let timer;
  
  type FormPropsType = {
    name: string;
    index?: number;
    passenger: Adult;
    onSetPassengerInfo: Function;
    onSetFormValid: Function;
  };
  
  interface ISelectOption {
    label: string;
    value: string;
    areaCode?: number;
  }
  
  const gender = {
    Mr: PassengerGender.MALE,
    Mrs: PassengerGender.FEMALE,
    Ms: PassengerGender.YOUNG_FEMALE
  };
  
  const PassengerAdultForm = (
    { onSetPassengerInfo, onSetFormValid, passenger, name, index }: FormPropsType,
    ref
  ) => {
    const classes = useStyle();
    const intl = useIntl();
    const profile: IUser = useContext(ProfileContext);
  
    const {
      values,
      errors,
      touched,
      isValid,
      setValues,
      handleChange,
      setFieldTouched
    } = useFormik({
      initialValues: passenger || new Adult(name),
      enableReinitialize: true,
      validationSchema: index === 0 ? FirstAdultSchema : PassengerAdultSchema,
      validateOnMount: true,
      onSubmit: () => { }
    });
  
    const dispatch = useDispatch();
    const languageId = useSelector(languageLocaleIdSelector);
    const nameTranslator = useNameTranslation();
  
    const countries = useSelector(
      (state) => get(state, 'country.country.response') || {}
    );
  
    // const provinces = useSelector(
    //   (state) => get(state, 'province.province.response') || {}
    // );
  
    useEffect(() => {
      index === 0 && setValues({ ...values, isRepresentative: true });
    }, []);
  
    useEffect(() => {
      if (touched.isReceivePromoInfo) {
        onSetPassengerInfo(values);
      }
    }, [values.isReceivePromoInfo]);
  
    useEffect(() => {
      onSetFormValid(name, isValid);
    }, [isValid]);
  
    const fetchProvince = async (countryCode) => {
      if (countryCode) {
        dispatch(
          fetchProvinceAction({
            id: stateName.PROVINCE,
            data: { languageId, countryCode }
          })
        );
      }
    };
  
    const formatMessage = (id, defaultMessage) =>
      intl.formatMessage({ id, defaultMessage });
  
    const getName = (data) => {
      return nameTranslator.getNameByLanguage(data);
    };
  
    useEffect(() => {
      timer && clearTimeout(timer);
      setTimeout(() => {
        if (isValid) {
          onSetPassengerInfo(values);
        }
        // if (index === 0) {
        //   localStorage.setItem('tmpP', JSON.stringify(values));
        // }
      }, 400);
    }, [values, isValid]);
  
    // eslint-disable-next-line no-shadow
    const countryOpts = useMemo<ISelectOption[]>(() => {
      return ensureArray(countries).map((e) => ({
        label: getName(e.languages),
        value: e.countryCode,
        areaCode: e.areaCode
      }));
    }, [countries]);
  
    // const provinceOpts = useMemo<ISelectOption[]>(() => {
    //   return ensureArray(provinces).map((e) => ({
    //     label: getName(e.languages),
    //     value: e.provinceCode
    //   }));
    // }, [provinces]);
  
    //check if user has logged in and have profile, fill the form
    useEffect(() => {
      (async () => {
        if (profile && index === 0 && !passenger) {
          const countryCode = profile.country?.countryCode || '';
          const provinceCode = profile.province?.provinceCode || '';
          let isProvince;
  
          if (countryCode) {
            try {
              const provinceData = await provinceService.fetchProvince({
                languageId,
                countryCode
              });
  
              dispatch(
                FETCH_SUCCESS({
                  id: stateName.PROVINCE,
                  data: provinceData
                })
              );
              isProvince = ensureArray(provinceData).some(
                (province) => province.provinceCode === provinceCode
              );
            } catch (err) {
              console.log(err);
            }
          }
  
          const isCountry = ensureArray(countries).some(
            (countryItem) => countryItem.countryCode === countryCode
          );
  
          const cloneValues = {
            ...values,
            firstName: profile.skyClubMiddleGivenName || '',
            lastName: profile.skyClubFamilyName || '',
            nation: isCountry ? countryCode : '',
            address: profile.address || '',
            province: isProvince ? provinceCode : '',
            nationality: isCountry ? profile.nationality?.nationalityCode : '',
            email: profile.email || '',
            phoneNumber: profile.skyClubPhone || '',
            gender: gender[profile.title] || PassengerGender.MALE,
            skyclubCode: profile.skyclubId
          };
  
          if (profile.birthday) {
            cloneValues.dob = new Date(profile.birthday);
          }
  
          setValues({ ...cloneValues, isRepresentative: true });
        }
      })();
    }, [profile]);
  
    useEffect(() => {
      if (values.nation === '') {
        Object.values(countries).forEach((el) => {
          if (
            get(el, '[countryCode]') &&
            get(el, '[countryCode]') === NATION_VNM
          ) {
            setValues({
              ...values,
              nation: NATION_VNM
            });
          }
        });
      }
    }, [countries]);
  
    const convertText = (value, fieldName) => {
      const changedName = nonAccentVietnamese(value)
        .toUpperCase()
        .trim()
        .replace(/  +/g, ' ');
  
      const changedAddress = nonAccentVietnameseNoToLowerCase(value);
      setValues({
        ...values,
        [fieldName]: fieldName !== 'address' ? changedName : changedAddress
      });
    };
  
    const _handleBlur = useCallback(
      (fieldName) => (e) => {
        setFieldTouched(fieldName, true);
        if (['lastName', 'firstName', 'address'].includes(fieldName)) {
          convertText(e.target.value, fieldName);
        }
  
        Reflect.ownKeys(values).every((key: any) => {
          // if (key === fieldName) return false;
          setFieldTouched(key, true);
          return true;
        });
      },
      [values]
    );
  
    const _handleDateChange = useCallback(
      (val: Date) => {
        if(val !== null){
          console.log(Object.values(val) , "value123");
        } 
       
        setValues({ ...values, dob: val });
      },
      [values]
    );
  
    const _handleChangeNation = (e, val) => {
      // eslint-disable-next-line no-shadow
      const name = 'nation';
      //   fetch province list when select nation
      val && fetchProvince(val.value);
      setValues({
        ...values,
        [name]: val ? val.value : '',
        phoneCode: val?.areaCode ? val.areaCode : '84',
        backupPhoneCode: val?.areaCode ? val.areaCode : '84',
        province: ''
      });
  
      onSetPassengerInfo({
        ...values,
        [name]: val ? val.value : '',
        phoneCode: val?.areaCode ? val.areaCode : '84',
        backupPhoneCode: val?.areaCode ? val.areaCode : '84',
        province: ''
      });
  
      // setIsChange(true);
    };
  
    // const _handleChangeProvince = (e, val) => {
    //   // eslint-disable-next-line no-shadow
    //   const name = 'province';
    //   setValues({
    //     ...values,
    //     [name]: val ? val.value : ''
    //   });
  
    //   onSetPassengerInfo({
    //     ...values,
    //     [name]: val ? val.value : ''
    //   });
    // };
  
    // const _handleChangeNationality = (e, val) => {
    //   // eslint-disable-next-line no-shadow
    //   const name = 'nationality';
    //   setValues({
    //     ...values,
    //     [name]: val ? val.value : ''
    //   });
  
    //   onSetPassengerInfo({
    //     ...values,
    //     [name]: val ? val.value : ''
    //   });
    // };
  
    const _handleChangePhoneCode = useCallback(
      (val) => {
        setValues({
          ...values,
          phoneCode: val || ''
        });
  
        onSetPassengerInfo({
          ...values,
          phoneCode: val || ''
        });
      },
      [values]
    );
  
    // const _handleChangeBackupPhoneCode = useCallback(
    //   (val) => {
    //     setValues({
    //       ...values,
    //       backupPhoneCode: val || ''
    //     });
  
    //     onSetPassengerInfo({
    //       ...values,
    //       backupPhoneCode: val || ''
    //     });
    //   },
    //   [values]
    // );
  
    useImperativeHandle(ref, () => ({
      blur: () => {
        Reflect.ownKeys(values).every((key: any) => {
          setFieldTouched(key, true);
          return true;
        });
      }
    }));
  
    const checkReceivePromo = () => {
      touched.isReceivePromoInfo = true;
      setValues({
        ...values,
        isReceivePromoInfo: !values.isReceivePromoInfo
      });
    };
    return (
      <form className={classes.form}>
        <Grid container spacing={1}>
          <Grid item xs={12} className={classes.formGroup}>
            <CustomSelect
              onBlur={_handleBlur('gender')}
              width="49%"
              value={values.gender}
              name="gender"
              onChange={handleChange}
              options={[
                {
                  label: formatMessage('String.PassengerTitle.male', 'Ông'),
                  value: PassengerTitle.MALE
                },
                {
                  label: formatMessage('String.PassengerTitle.female', 'Bà'),
                  value: PassengerTitle.FEMALE
                },
                {
                  label: formatMessage('String.PassengerTitle.youngFemale', 'Cô'),
                  value: PassengerTitle.YOUNG_FEMALE
                }
              ]}
            />
          </Grid>
  
          <Grid item xs={6} className={classes.formGroup}>
            <CustomTextField
              touched={touched.lastName}
              errorMessage={errors.lastName}
              onBlur={_handleBlur('lastName')}
              name="lastName"
              onChange={handleChange}
              tooltip={LastNameTooltip}
              position="left"
              value={values.lastName}
              fullWidth
              placeholder={formatMessage('String.lastName', 'Họ')}
              required
            />
          </Grid>
          <Grid item xs={6} className={classes.formGroup}>
            <CustomTextField
              touched={touched.firstName}
              errorMessage={errors.firstName}
              onBlur={_handleBlur('firstName')}
              name="firstName"
              tooltip={FirstNameTooltip}
              position="right"
              onChange={handleChange}
              value={values.firstName}
              fullWidth
              placeholder={formatMessage('String.firstName', 'Tên đệm và tên')}
              required
            />
          </Grid>
          <Grid item xs={6} className={classes.formGroup}>
            <CustomDatePicker
              onBlur={_handleBlur('dob')}
              touched={touched.dob}
              errorMessage={errors.dob}
              placeholder={formatMessage('String.dob', 'Ngày sinh')}
              mask="(DD/MM/YYYY)"
              value={values.dob}
              name="dob"
              onChange={_handleDateChange}
              required
              type={values.type}
              keyboardDatePicker={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.formGroup}>
            <CustomDatePicker
              onBlur={_handleBlur('dob')}
              touched={touched.dob}
              errorMessage={errors.dob}
              placeholder={formatMessage('String.dob', 'Ngày sinh')}
              mask="(DD/MM/YYYY)"
              value={values.dob}
              name="dob"
              onChange={_handleDateChange}
              required
              type={values.type}
             
            />
          </Grid>
          <Grid item xs={6} className={classes.formGroup}>
            <CustomAutocomplete
              onBlur={_handleBlur('nation')}
              placeholder={formatMessage('String.country', 'Quốc gia')}
              fullWidth
              value={values.nation}
              // defaultValue={values.nation}
              name="nation"
              onChange={_handleChangeNation}
              options={countryOpts}
              required={index === 0}
              touched={touched.nation}
              errorMessage={errors.nation}
            />
          </Grid>
          <Grid
            item
            xs={6}
            className={classnames(
              classes.phoneNumberContainer,
              classes.phoneNumberContainerLeft,
              classes.formGroup
            )}
          >
            <DialCodeSelect
              name="phoneCode"
              value={values.phoneCode}
              // errorStatus={!!errors.phoneNumber}
              searchPlaceholder={formatMessage('Button.search', 'Tìm kiếm')}
              searchNotFound={formatMessage('String.notFound', 'Không tìm thấy')}
              onBlur={_handleBlur('phoneCode')}
              onChange={_handleChangePhoneCode}
            />
  
            <CustomTextField
              onBlur={_handleBlur('phoneNumber')}
              errorMessage={errors.phoneNumber}
              touched={touched.phoneNumber}
              value={values.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
              tooltip={PhoneTooltip}
              placeholder={formatMessage('String.phoneNumber', 'Số điện thoại')}
              required={index === 0}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} className={classes.formGroup}>
            <CustomTextField
              touched={touched.email}
              errorMessage={errors.email}
              onBlur={_handleBlur('email')}
              value={values.email}
              name="email"
              onChange={handleChange}
              fullWidth
              placeholder={formatMessage('String.emailAddress', 'Email')}
              required={index === 0}
            />
          </Grid>
          <Grid item xs={12} className={classes.formGroup}>
            <CustomTextField
              touched={touched.address}
              errorMessage={errors.address}
              onBlur={_handleBlur('address')}
              value={values.address}
              name="address"
              onChange={handleChange}
              fullWidth
              placeholder={formatMessage('String.address', 'Địa chỉ')}
            />
          </Grid>
          <Grid item xs={12} className={classes.formGroup}>
            <CustomTextField
              onBlur={_handleBlur('skyclubCode')}
              value={values.skyclubCode}
              name="skyclubCode"
              onChange={handleChange}
              fullWidth
              placeholder={formatMessage(
                'String.Placeholder.vietjetSkyclub',
                'Nhập mã thành viên Vietjet Skyclub'
              )}
            />
          </Grid>
  
          {index === 0 && (
            <>
              <Grid item xs={12} className={classes.infoContainer}>
                <Checking
                  onChange={checkReceivePromo}
                  name="isReceivePromoInfo"
                  isChecked={values.isReceivePromoInfo}
                  width={18}
                  borderRadius="0px"
                />
                <Translate
                  defaultMessage="Chúng tôi muốn nhận thông tin khuyến mãi từ Vietjet và các đối tác"
                  id="String.PassengerForm.promotionmb"
                  onClick={checkReceivePromo}
                  variant="h6"
                  variantlg="h3"
                  component="p"
                  customcolor="lightGrey"
                  weight="Medium"
                  className="pointer"
                />
              </Grid>
            </>
          )}
        </Grid>
      </form>
    );
  };
  
  export default memo(forwardRef(PassengerAdultForm));
  