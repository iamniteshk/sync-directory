import React from 'react';
import {
    Toast, 
    Toaster,
    ProgressBar,
    Intent
  } from '@blueprintjs/core';

  import ErrorBoundary from './ErrorBoundary';

const CopyStatusToast = (props) =>
    <Toast
        icon="cloud-upload"
        message={<ProgressBar
            intent={props.copiedSoFar < props.totalFilesToCopy ? Intent.PRIMARY : Intent.SUCCESS}
            value={props.copiedSoFar}
        />}
    />

const StatusToast = (props) =>
    <Toast
        icon="tick-circle"
        intent={Intent.SUCCESS}
        message={`Moved ${props.totalFilesToCopy} files`}
        timeout={5000}
        onDismiss={props.onDismissToast}
    />

const ErrorToast = (props) =>
    <Toast
        icon="warning-sign"
        intent={Intent.DANGER}
        message={props.errorMsg}
        timeout={2000}
        onDismiss={props.onDismissErrorToast}
    />

export const TOAST_TYPE_MAP = Object.freeze({
    COPY_STATUS_TOAST: CopyStatusToast,
    STATUS_TOAST: StatusToast,
    ERROR_TOAST: ErrorToast
});

export const CustomToaster = (props) =>
    <ErrorBoundary>
        <Toaster
            position={props.position}
        >
            {props.toastType(props)}
        </Toaster>
    </ErrorBoundary>