import React, { Component } from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import TreeView from './components/TreeView';

import {
  Button,
  Classes,
  H5,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  InputGroup, 
  Position, 
  Popover,
  Toast, 
  Toaster,
  ProgressBar,
  Intent
} from '@blueprintjs/core';


import "rc-tree/assets/index.css";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { NavigationBar } from './components/NavigationBar';
import { InputGroups } from './components/InputGroups';
import { CustomPane } from './components/CustomPaneTreeViewHOC';
import { TOAST_TYPE, CustomToaster } from './components/ToastManager'

const { dialog } = window.require('electron').remote
const dirTree = window.require("directory-tree");

const app = window.require('electron').remote.app;

const path = window.require('path');
const fs = window.require('fs');
const fse = window.require('fs-extra');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filePath1: "",
      filePath2: "",
      directoryTree1: {},
      directoryTree2: {},
      oldDirTree1: {},
      oldDirTree2: {},
      showLoading1: false,
      inputDisable1: false,
      showLoading2: false,
      inputDisable2: false,
      isEnterKey: false,
      selectedKeys: [],
      showToast: false,
      totalFilesToCopy: 0,
      copiedSoFar: 0,
      disableCopyBtn: false,
      disableQuitBtn: false,
      defaultCheckedKeys: [],
      disabledTree:false,
      showErrorToast: false,
      errorMsg:""
    }

    this.textInput1 = React.createRef();
    this.textInput2 = React.createRef();
  }

  onClickHandler = (btnName) => {
    switch (btnName) {
      case 'SelectFileBtn1':
        this.setState({
          showLoading1: true,
          inputDisable1: true,
          isEnterKey: false
        }, () => {
          this.openDialog(btnName);
        })
        break;
      case 'SelectFileBtn2':
        this.setState({
          showLoading2: true,
          inputDisable2: true,
          isEnterKey: false
        }, () => {
          this.openDialog(btnName);
        })
        break;
      default:
    }
  }

  handleInputChange = (id, evt) => {
    console.log(evt.target.value);
    switch (id) {
      case 'pathFrom':
        this.setState({
          filePath1: evt.target.value,
          directoryTree1: {}
        });
        break;
      case 'pathTo':
        this.setState({
          filePath2: evt.target.value,
          directoryTree2: {}
        });
        break;
      default:
    }
  }

  handleEnterPress = (id, event) => {
    if (event.key === 'Enter' || event.key === 'Manual') {
      if(event.key === 'Enter'){
        event.preventDefault();
        event.stopPropagation();
      }

      switch (id) {
        case 'pathFrom':
          this.setState({
            isEnterKey: false,
            directoryTree1: {},
            showLoading1: true,
            inputDisable1: true
          }, () => {
            this.textInput1.current.blur();
            setTimeout(() => {
              this.createDirectoryTreeOnEnterPress(this.state.filePath1, id);
            }, 1000);
          });
          break;
        case 'pathTo':
          this.setState({
            isEnterKey: false,
            directoryTree2: {},
            showLoading2: true,
            inputDisable2: true
          }, () => {
            this.textInput2.current.blur();
            setTimeout(() => {
              this.createDirectoryTreeOnEnterPress(this.state.filePath2, id);
            }, 1000);
          });
          break;
        default:
      }
    }
  }

  createDirectoryTreeOnEnterPress = (filePath, id) => {
    const data = dirTree(filePath, { attributes: ['ctime', 'mtime'] });
    if (id === 'pathFrom') {
      this.setState({
        isEnterKey: true,
        directoryTree1: data,
        showLoading1: false,
        inputDisable1: false
      })
    } else {
      this.setState({
        isEnterKey: true,
        directoryTree2: data,
        showLoading2: false,
        inputDisable2: false
      })
    }
  }

  openDialog = (btnName) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      console.log(result.filePaths);
      console.log(result.canceled);
      if (result.canceled) {
        switch (btnName) {
          case 'SelectFileBtn1':
            this.setState({
              showLoading1: false,
              inputDisable1: false,
              isEnterKey: false
            })
            break;
          case 'SelectFileBtn2':
            this.setState({
              showLoading2: false,
              inputDisable2: false,
              isEnterKey: false
            })
            break;
          default:
        }
      }
      if (result.filePaths && !result.canceled) {
        console.log('inside filePaths');
        const filePath = `${result.filePaths}`
        const data = this.createDirectoryTree(filePath);
        console.log("got data", data);
        switch (btnName) {
          case 'SelectFileBtn1':
            this.setState({
              filePath1: filePath,
              directoryTree1: data,
              showLoading1: false,
              inputDisable1: false,
              isEnterKey: false
            });
            break;
          case 'SelectFileBtn2':
            this.setState({
              filePath2: filePath,
              directoryTree2: data,
              showLoading2: false,
              inputDisable2: false,
              isEnterKey: false
            });
            break;
          default:
        }
      }
    })
  }

  createDirectoryTree = (filePath) => {
    return dirTree(filePath, { attributes: ['ctime', 'mtime'] });
  }

  SelectedFiles = (checkedKeys) => {
    console.log('Callback', checkedKeys);
    this.setState({
      selectedKeys: checkedKeys
    });
  }

  copyFiles = () => {
    if(this.state.filePath2 === "" && this.state.filePath1 !== ""){
      this.setState({
        showErrorToast: true,
        errorMsg:`Please select Path where files need to be copied`
      });
      return;
    }

    if(this.state.selectedKeys.length === 0 && this.state.filePath1 !== "" && this.state.filePath2 !== ""){
      this.setState({
        showErrorToast: true,
        errorMsg:`Please select files which you want to copy`
      });
      return;
    }

    if(this.state.filePath1 !== "" && this.state.filePath2 !== "" && this.state.filePath1 === this.state.filePath2){
      this.setState({
        showErrorToast: true,
        errorMsg:`Source and Destination path cannot be same`
      });
      return;
    }

    this.setState({
      showToast: true,
      disableCopyBtn: true,
      disableQuitBtn: true,
      totalFilesToCopy: this.state.selectedKeys.length
    },() => {
      let filePaths = [...this.state.selectedKeys];
      let options = {
        preserveTimestamps : true
      }
      filePaths.forEach((filePath) => {
        //this.ensureDirectoryExistence(filePath);
        const srcPath = filePath;
        const destPath = filePath.replace(this.state.filePath1, this.state.filePath2);
        let i = 0;
        console.log(srcPath, destPath);
        fse.copy(srcPath, destPath, options)
          .then(() => {
            console.log('success!')
            this.setState({
              copiedSoFar: ++i
            })
          })
          .catch(err => {
            console.error(err)
            this.setState({
              copiedSoFar: ++i
            })
          });
      });
      this.setState({
        showToast: false,
        showFinalToast: true,
        disableCopyBtn: false,
        disableQuitBtn: false
      },() => {
        this.handleEnterPress('pathTo',{key : 'Manual'})
      })
    })
  }

  ensureDirectoryExistence = (filePath) => {
    let dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  onDismissToast = (didTimeoutExpire) => {
    if(didTimeoutExpire){
      this.setState({
        showFinalToast: !this.state.showFinalToast
      })
    }
  }

  onDismissErrorToast = (didTimeoutExpire) => {
    if(didTimeoutExpire){
      this.setState({
        showErrorToast: !this.state.showErrorToast,
        errorMsg: ""
      })
    }
  }

  quitApp = () => {
    app.quit();
  }

  render() {
    return (
      <>
        <NavigationBar 
          disableCopyBtn={this.state.disableCopyBtn}
          disableQuitBtn={this.state.disableQuitBtn}
          copyFiles={this.copyFiles}
          quitApp={this.quitApp}
        />
        <div style={{ width: "100%", display: "flex" }}>
          <InputGroups 
            inputDisable={this.state.inputDisable1}
            textInputRef={this.textInput1}
            filePath={this.state.filePath1}
            id='pathFrom'
            placeholder='Path from copy files'
            showLoading={this.state.showLoading1}
            btnId='SelectFileBtn1'
            handleInputChange={this.handleInputChange}
            handleEnterPress={this.handleEnterPress}
            onClickHandler={this.onClickHandler}
          />
          <InputGroups 
            inputDisable={this.state.inputDisable2}
            textInputRef={this.textInput2}
            filePath={this.state.filePath2}
            id='pathTo'
            placeholder='Path to copy files'
            showLoading={this.state.showLoading2}
            btnId='SelectFileBtn2'
            handleInputChange={this.handleInputChange}
            handleEnterPress={this.handleEnterPress}
            onClickHandler={this.onClickHandler}
          />
        </div>
        <SplitPane split="vertical" defaultSize={"50%"} primary="second"
          pane1Style={{ outline: "auto", overflowY: "scroll" }}
          pane2Style={{ overflowY: "scroll" }}
        >
          <CustomPane 
            initialSize="50%" 
            minSize="25%" 
            maxSize="50%"
            filePath={this.state.filePath1}
            directoryTree={this.state.directoryTree1}
            isEnterKey={this.state.isEnterKey}
            onSelectHandler={this.SelectedFiles}
            disabled={this.state.disabledTree}
          />
          <CustomPane 
            initialSize="50%" 
            minSize="25%" 
            maxSize="50%"
            filePath={this.state.filePath2}
            directoryTree={this.state.directoryTree2}
            isEnterKey={this.state.isEnterKey}
            disabled={true}
            onSelectHandler={this.SelectedFiles}
          />
        </SplitPane>
        {
          this.state.showToast ?
          <Toaster
            position={Position.TOP}
          >
            <Toast
              icon="cloud-upload"
              message={<ProgressBar
              intent={this.state.copiedSoFar < this.state.totalFilesToCopy ? Intent.PRIMARY : Intent.SUCCESS}
              value={this.state.copiedSoFar}
              />}
            />
          </Toaster>
          : ""
        }
        {
          this.state.showFinalToast ?
          <Toaster
            position={Position.TOP}
          >
            <Toast
              icon="tick-circle"
              intent={Intent.SUCCESS}
              message={`Moved ${this.state.totalFilesToCopy} files`}
              timeout={5000}
              onDismiss={this.onDismissToast}
            />
          </Toaster>
          : ""
        }
        {
          this.state.showErrorToast ?
            <CustomToaster
              position={Position.TOP}
              toastType={TOAST_TYPE.ERROR_TOAST}
              errorMsg={this.state.errorMsg}
              onDismissErrorToast={this.onDismissErrorToast}
            />
            : ""
        }
      </>
    );
  }
}

export default App;
