import React from 'react';
import {
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    Popover,
    Intent
} from '@blueprintjs/core';

export const NavigationBar = (props) => {
    let popoverContent = (
        <div key="text" style={{ padding: 20 }}>
            <H5>Confirm deletion</H5>
            <p>Are you sure you want to close the app?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS} onClick={props.quitApp}>
                    Delete
                </Button>
            </div>
        </div>
    );

    return (
        <Navbar>
            <NavbarGroup>
                <Button
                    className={Classes.MINIMAL}
                    icon="duplicate"
                    disabled={props.disableCopyBtn}
                    onClick={props.copyFiles}
                >Copy</Button>
                <NavbarDivider />
                <Popover content={popoverContent}>
                    <Button
                        className={Classes.MINIMAL}
                        icon="small-cross"
                        disabled={props.disableQuitBtn}
                    >Quit</Button>
                </Popover>
                <NavbarDivider />
                <Button
                    className={Classes.MINIMAL}
                    icon="timeline-events"
                >Schedule Job</Button>
            </NavbarGroup>
        </Navbar>
    );
}