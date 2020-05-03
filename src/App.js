import React, { Component } from 'react';
import values from 'lodash/values';
import Tree, { TreeNode } from "rc-tree";
import SplitPane, { Pane } from 'react-split-pane';

import {
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  Popover,
  Menu,
  MenuItem,
  InputGroup
} from '@blueprintjs/core';

import "rc-tree/assets/index.css";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const {dialog} = window.require('electron').remote
const dirTree = window.require("directory-tree");

const showMessageBox = window.require('electron').remote.dialog.showMessageBox;
const app = window.require('electron').remote.app;

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      filePath1 : "",
      filePath2 : ""
    }
  }

  onClickHandler = (btnName) => {
    this.openDialog(btnName);
  }

  handleInputChange = (id, evt) => {
    console.log(evt.target.value);
    switch(id){
      case 'pathFrom':
        this.setState({
          filePath1: evt.target.value
        });
        break;
      case 'pathTo':
        this.setState({
          filePath2: evt.target.value
        });
        break;
      default:
    }
  }

  handleEnterPress = (id, event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      switch(id){
        case 'pathFrom':
          this.renderDirectories(this.state.filePath1);
          break;
        case 'pathTo':
          this.renderDirectories(this.state.filePath2);
          break;
        default:
      }
    }
  }

  openDialog = (btnName) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      console.log(result.filePaths);
      if (result.filePaths) {
        switch (btnName) {
          case 'SelectFileBtn1':
            this.setState({
              filePath1: `${result.filePaths}`
            }, () => {
              console.log(dirTree(this.state.filePath1, { attributes: ['ctime', 'mtime'] }))
              //this.renderDirectories(this.state.filePath1);
            });
            break;
          case 'SelectFileBtn2':
            this.setState({
              filePath2: `${result.filePaths}`
            }, () => {
              console.log(dirTree(this.state.filePath2, { attributes: ['ctime', 'mtime'] }))
              //this.renderDirectories(this.state.filePath1);
            });
            break;
          default:
        }
      }
    })
  }

  renderDirectories = (filePath) => {
    if(!filePath) return;
    const data =  values(dirTree(filePath, {attributes:['ctime', 'mtime']}));
    console.log(data);
    return (
      <div style={{marginLeft:"5px"}}>
        <Tree
        defaultExpandAll = {true}
        checkable = {true}
        showLine = {true}
        showIcon = {true}>
        {this.buildTreeNodes(data[4])}    
        </Tree>
      </div>
    );
  }

  buildTreeNodes = (data) => {
    console.log('inside',data);
    if(!data) return;
    return data.map((each, index) => {
      return (
        <TreeNode
          icon = ""
          key = {`${each.path}-${index}`}
          title = {each.name}
          value = {each.path}>
            {this.buildTreeNodes(each.children)}
          </TreeNode>
      );
    })
  }

  render(){
    return (
      <>
        <Navbar>
          <NavbarGroup>
            <Button className={Classes.MINIMAL} icon="folder-open" />
            <Popover content={
              <Menu>
                <MenuItem
                  text="File 1"
                  onClick={() => showMessageBox({
                    type: 'info',
                    message: 'You activated action: "file1"',
                    buttons: ['Close'],
                  })}
                />
              </Menu>}
            >
              <Button className={Classes.MINIMAL} icon="chevron-down" />
            </Popover>
            <Button
              className={Classes.MINIMAL}
              icon="small-cross"
              onClick={() => app.quit()}
            />
            <NavbarDivider />
            <Button
              className={Classes.MINIMAL}
              icon="properties"
              onClick={() => showMessageBox({
                type: 'info',
                message: 'You activated action: "logo"',
                buttons: ['Close'],
              })}
            />
          </NavbarGroup>
        </Navbar>
      <SplitPane split="vertical" defaultSize={"50%"} primary="second">
        <Pane initialSize="50%" minSize="25%" maxSize="50%">
          <InputGroup
            type="text"
            disabled={false}
            large={true}
            leftIcon={this.state.filePath1.length > 0 ? "folder-open" : "folder-close"}
            onChange={e => this.handleInputChange('pathFrom',e)}
            onKeyDown={e => this.handleEnterPress('pathFrom', e)}
            placeholder="Path from copy files"
            fill={true}
            value={this.state.filePath1}
            style={{width:"80%",marginLeft:"5px"}}
            rightElement={
            <Button 
              icon="select"
              className={Classes.BUTTON}
              onClick={() => this.onClickHandler('SelectFileBtn1')}
              style={{marginRight:"25px"}}
              >Select</Button>
            }
            />
          {this.renderDirectories(this.state.filePath1)}
        </Pane>
        <Pane initialSize="50%" minSize="25%" maxSize="50%">
        <InputGroup
            type="text"
            disabled={false}
            large={true}
            leftIcon={this.state.filePath2.length > 0 ? "folder-open" : "folder-close"}
            onChange={e => this.handleInputChange('pathTo',e)}
            placeholder="Path to copy files"
            fill={true}
            value={this.state.filePath2}
            style={{width:"80%",marginLeft:"5px"}}
            rightElement={
            <Button 
              icon="select"
              className={Classes.BUTTON}
              onClick={() => this.onClickHandler('SelectFileBtn2')}
              style={{marginRight:"25px"}}
              >Select</Button>
            }
            />
          {this.renderDirectories(this.state.filePath2)}
        </Pane>
        </SplitPane>
      </>
    );
  }
}

export default App;
