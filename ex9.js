import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import { GET_HTML, UPDATE_HTML, GET_MENU_HTML } from "./actionTypes";
import { htmlSelector } from "./selector";
import HTML from "components/HTML";
import { reduxAction } from "actions";
import { useInjectReducer } from "utils/injectReducer";
import { languagesByTypeSelector } from "containers/withLanguageType/selector";
import { useInjectSaga } from "utils/injectSaga";
import htmlReducer from "./reducer";
import { watchHTMLSaga } from "./saga";
import SelectableMenusList from "components/SelectableMenusList";
import history from "configs/history";
import PageHeader from "components/PageHeader";
import { GET_LANGUAGES_BY_TYPE_LIST } from "containers/withLanguageType/actionTypes";
import reducerTabLanguage from "containers/withLanguageType/reducer"
import { menuSelector } from "./selector";
import { renameKey } from "utils/renameKey";
export const HtmlContainer = props => {

  const path = props.path;
  const HTMLReducerName = "html";
  const keyTabLanguage = "languagesByType";

  useInjectReducer({
    key: HTMLReducerName,
    reducer: htmlReducer
  });
  useInjectReducer({
    key: keyTabLanguage,
    reducer: reducerTabLanguage
  });
  useInjectSaga({
    key: HTMLReducerName,
    saga: watchHTMLSaga("html", path)
  });

  const dispatch = useDispatch();
  const htmlItem = useSelector(htmlSelector);
  const languageByTypeList = useSelector(languagesByTypeSelector);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [keySelected, setKeySelected] = useState();
  //const [menuList, setMenu] = useState();
  const [isAddItem, setAddItem] = useState(false);
  const [isDeleteItem, setDeleteItem] = useState(false);
  const menu = useSelector(menuSelector);
  const menuList = renameKey(menu);

  const handleSubmit = useCallback(
    payload => {
      if (payload.name && payload.displayName) {
        console.log("UPDATE_HTML1");
        dispatch(
          reduxAction(UPDATE_HTML, { ...payload, languageId: selectedLanguageId })
        );
        dispatch(reduxAction(GET_MENU_HTML, { extraUrlSegment: '' }));
        //setKeySelected(payload.name);
        setAddItem(false);
      } else {
        payload.name = get(keySelected, ['key']);
        console.log("UPDATE_HTML2");
        console.log(get(keySelected, ['key']));
        dispatch(
          reduxAction(UPDATE_HTML, { ...payload, languageId: selectedLanguageId })
        );
      }
    },
    [selectedLanguageId]
  );

  const onChangeTab = useCallback(id => {
    if (id) {
      setSelectedLanguageId(id);
    }
  }, []);


  useEffect(() => {
    console.log("GET_LANGUAGES_BY_TYPE_LIST");
    dispatch(reduxAction(GET_LANGUAGES_BY_TYPE_LIST,
      { extraUrlSegment: 'html', queryParams: { name: get(keySelected, ['key']) } }));
  }, [keySelected]);

  useEffect(() => {
    if (selectedLanguageId && get(keySelected, ['key']) !== undefined) {
      console.log("keySelected get html");
      dispatch(
        reduxAction(GET_HTML, {
          queryParams: { languageId: selectedLanguageId, name: get(keySelected, ['key']) }
        })
      );
    }
  }, [selectedLanguageId, keySelected]);

  const handleMenuOnClick = useCallback((e, pathname) => {
    const indexSelected = menuList.findIndex(el => el['key'] === e.key);
    setKeySelected(menuList[indexSelected]);
    setAddItem(false);
    history.push(`${pathname}/${e.key}`)
  }, [menuList]);

  const handleAddDeleteMenuItem = (isAddItem, isDeleteItem, key) => {
    if (isAddItem)
      setAddItem(isAddItem);
    else
      setDeleteItem(isDeleteItem);
  }

  useEffect(() => {
    if (Object.keys(props.menu).length === 0 && keySelected === undefined) {
      setKeySelected(props.menu[0]);
    }

  }, [props.menu])

  return (
    <>
      <PageHeader title={get(keySelected, ['title'])} />
      <div className="homepage-layout__body">
        <SelectableMenusList
          activeKey={get(keySelected, ['key'])}
          width={250}
          handleMenuOnClick={handleMenuOnClick}
          path={path}
          itemsList={props.menu}
          handleAddDeleteMenuItem={handleAddDeleteMenuItem}
          addable={true}
          deletable={true}
        />
        <div className="homepage-layout__body-right">
          <HTML
            addItem={isAddItem}
            data={htmlItem}
            languageByTypeList={languageByTypeList}
            handleSubmit={handleSubmit}
            onChangeTab={onChangeTab}
          />
        </div>
      </div>
    </>
  );
};

export default HtmlContainer;
