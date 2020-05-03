import React, { Component } from 'react';
import values from 'lodash/values';
import Tree, { TreeNode } from "rc-tree";
import "rc-tree/assets/index.css";


const {dialog} = window.require('electron').remote
const dirTree = window.require("directory-tree");

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      filePath1 : "",
      filePath2 : ""
    }
  }

  onClickHandler = (event) => {
    console.log(event.target.name);
    this.openDialog(event.target.name);
  }

  openDialog = (targetName) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    }).then(result => {
        console.log(result.filePaths);
        if(result.filePaths){
            switch(targetName){
                case 'SelectFIleBtn1':
                  this.setState({
                    filePath1 : `${result.filePaths}`
                  },() => {
                    console.log(dirTree(this.state.filePath1, {attributes:['ctime', 'mtime']}))
                    //this.renderDirectories(this.state.filePath1);
                  });
                    break;
                case 'SelectFIleBtn2':
                  this.setState({
                    filePath2 : `${result.filePaths}`
                  },() => {
                    console.log(dirTree(this.state.filePath2, {attributes:['ctime', 'mtime']}))
                    //this.renderDirectories(this.state.filePath2);
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
          key = {index}
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
        <div style={{height:"100%", width:"50%", position:"fixed", zIndex:1, top:0, left:0, borderRight:"1px solid red", marginLeft:"5px"}}>
          <label>Path 1: </label>
          <input type="text"
            style={{width:"75%", borderColor:"black"}}
            value={this.state.filePath1}
          />
          <button name="SelectFIleBtn1" style={{borderColor:"black", marginLeft:"5px"}} onClick={this.onClickHandler}>Select Files</button>
          {this.renderDirectories(this.state.filePath1)}
        </div>
        <div style={{height:"100%", width:"50%", position:"fixed", zIndex:1, top:0, right:0, borderRight:"1px solid red"}}>
          <label style={{marginLeft:"15px"}}>Path 2: </label>
          <input type="text"
            style={{width:"75%", borderColor:"black"}}
            value={this.state.filePath2}
          />
          <button name="SelectFIleBtn2" style={{borderColor:"black", marginLeft:"5px"}} onClick={this.onClickHandler}>Select Files</button>
          {this.renderDirectories(this.state.filePath2)}
        </div>
      </>
    );
  }
}

export default App;
