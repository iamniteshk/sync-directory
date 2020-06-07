import React from 'react';
import { Pane } from 'react-split-pane';
import TreeView from './TreeView';
import ErrorBoundary from './ErrorBoundary';

export const CustomPane = (props) =>
    <ErrorBoundary>
        <Pane
            initialSize={props.initialSize}
            minSize={props.minSize}
            maxSize={props.maxSize}
        >
            {treeView(props)}
        </Pane>
    </ErrorBoundary>


const treeView = (props) => 
    <TreeView
        filePath={props.filePath}
        directoryTree={props.directoryTree}
        isEnterKey={props.isEnterKey}
        disabled={props.disabled}
        onSelectHandler={props.onSelectHandler}
    ></TreeView>

