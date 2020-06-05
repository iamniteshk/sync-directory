import React from 'react';

import {
    Button,
    Classes,
    InputGroup
} from '@blueprintjs/core';

export const InputGroups = (props) => {
    return (
        <div style={{ width: "50%" }}>
            <InputGroup
                type="text"
                disabled={props.inputDisable}
                inputRef={props.textInputRef}
                large={true}
                leftIcon={props.filePath.length > 0 ? "folder-open" : "folder-close"}
                onChange={e => props.handleInputChange(props.id, e)}
                onKeyDown={e => props.handleEnterPress(props.id, e)}
                placeholder={props.placeholder}
                fill={true}
                value={props.filePath}
                rightElement={
                    <Button
                        icon="select"
                        className={Classes.BUTTON}
                        loading={props.showLoading}
                        onClick={() => props.onClickHandler(props.btnId)}
                    >Select</Button>
                }
            />
        </div>
    );
}