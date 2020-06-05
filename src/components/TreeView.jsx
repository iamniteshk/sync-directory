import React, { Component } from 'react';
import Tree, { TreeNode } from "rc-tree";
import values from 'lodash/values';

class TreeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedKeys: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('inside component', nextProps, this.props.filePath, this.props.directoryTree);
        if (!nextProps.isEnterKey && this.props.filePath === nextProps.filePath) {
            return false;
        }
        return true;
    }

    onCheckHandler = (keys) => {
        console.log(keys);
        let finalKeys = keys.filter(each => !each.includes(":directory")).map(element => {
            let a = element.replace(/:file$/,'');
            return a;
        });
        console.log('finalKeys', finalKeys);
        this.props.onSelectHandler(finalKeys)
    }

    renderDirectories = (dirTree) => {
        if (!dirTree || Object.keys(dirTree).length === 0) return;
        // const data =  values(dirTree(filePath, {attributes:['ctime', 'mtime']}));
        // console.log(data);
        //if(JSON.stringify())
        console.log('dirTree', dirTree);
        const data = values(dirTree);
        console.log('data as an array');
        const html = (
            <div style={{ marginLeft: "5px" }}>
                <Tree
                    defaultExpandAll={true}
                    checkable={true}
                    showLine={true}
                    showIcon={true}
                    disabled={this.props.disabled}
                    onCheck={this.onCheckHandler}
                    >
                    {this.buildTreeNodes(data[4])}
                </Tree>
            </div>
        )
        return html;
    }

    buildTreeNodes = (data) => {
        console.log('inside', data);
        if (!data) return;
        return data.map((each, index) => {
            return (
                <TreeNode
                    icon=""
                    key={`${each.path}:${each.type}`}
                    title={each.name}
                    value={each}
                    >
                    {this.buildTreeNodes(each.children)}
                </TreeNode>
            );
        })
    }

    render() {
        return (
            <>{this.renderDirectories(this.props.directoryTree)}</>
        );
    }
}

export default TreeView;