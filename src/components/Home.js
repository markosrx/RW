import React, { Component } from 'react';
import { View } from 'react-native';
import HBF from './HBF';

export default class Home extends Component {

  state = {
    menu: {},
    filtered: [],
    lang: this.props.lang + 1 || Number(global.projectJson.project.defaultLanguageId) || 0
  };

  componentWillMount() {
    //let a = this.props.startPage ? this.findStartPage(this.props.startPage) : this.findStartPage(global.globalJson.startPages[0].pageId);
    let a;
    if(this.props.lang) {
      let b = global.globalJson.startPages.findIndex(e => e.languageId == this.state.lang);
      a = this.findStartPage(global.globalJson.startPages[b].pageId);
    } else if(!this.props.startPage) {
      a = this.findStartPage(global.globalJson.startPages[this.state.lang].pageId);
    } else if (this.props.startPage.language) {
      let c = global.globalJson.pages.find(p => p.languageId == this.props.startPage.languageId);
      a = this.findStartPage(c.pageId);
    } else {
      a = this.findStartPage(this.props.startPage)
    }

    global.language = Number(a[0].languageId)-1;
    let b = this.findMenu(a[0].menuId);
    this.setState({ menu: b, filtered: a });
  }

  render() {

    return (
      <View>
        <HBF visibleVideoTour={true} from={this.state.menu} filtered={this.state.filtered} />
      </View>
    );
  }


  findStartPage(b) {
    let a = [];
    for (let i = 0; i < global.globalJson.pages.length; i++) {
      if (global.globalJson.pages[i].pageId == b) {
        a.push(global.globalJson.pages[i]);
      }
    }
    return a;
  }

  findMenu(menuIdS) {
    let menus = global.globalJson.menuTrees[global.language].menuTree;
    let found = {};

    for (let i = 0; i < menus.length; i++) {
      if (menus[i].menuId == menuIdS) { found = menus[i]; break; }
      else {
        if (menus[i].children)
          for (let j = 0; j < menus[i].children.length; j++) {
            if (menus[i].children[j].menuId == menuIdS) { found = menus[i].children[j]; break; }
            else {
              if (menus[i].children[j].children) {
                for (let k = 0; k < menus[i].children[j].children.length; k++) {
                  if (menus[i].children[j].children[k].menuId == menuIdS) { found = menus[i].children[j].children[k]; break; }
                }
              }
            }
          }
      }
    }
    return found;
  }

}

