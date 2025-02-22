import React from 'react';
import type { Source, ResizeMode, ImageStyle } from 'react-native-fast-image';
import { OnTap, OnMove } from '../types';
interface Props {
    renderToHardwareTextureAndroid?: boolean;
    isTranslucent?: boolean;
    isOpen: boolean;
    origin: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    source: Source | number;
    thumbnailSource?: Source | number;
    resizeMode?: ResizeMode;
    backgroundColor?: string;
    swipeToDismiss?: boolean;
    hideCloseButton?: boolean;
    imageStyle?: ImageStyle;
    renderHeader?: (close: () => void) => JSX.Element | Array<JSX.Element>;
    renderFooter?: (close: () => void) => JSX.Element | Array<JSX.Element>;
    onTap?: (eventParams: OnTap) => void;
    onDoubleTap?: () => void;
    onLongPress?: () => void;
    didOpen?: () => void;
    onMove?: (position: OnMove) => void;
    responderRelease?: (vx?: number, scale?: number) => void;
    willClose?: () => void;
    onClose: () => void;
}
export default class ImageDetail extends React.Component<Props> {
    private _animatedScale;
    private _animatedPositionX;
    private _animatedPositionY;
    private _animatedFrame;
    private _animatedOpacity;
    private _imagePanResponder?;
    private _lastPositionX;
    private _lastPositionY;
    private _zoomLastDistance;
    private _horizontalWholeCounter;
    private _verticalWholeCounter;
    private _isDoubleClick;
    private _isLongPress;
    private _centerDiffX;
    private _centerDiffY;
    private _singleClickTimeout;
    private _longPressTimeout;
    private _lastClickTime;
    private _doubleClickX;
    private _doubleClickY;
    private _scale;
    private _positionX;
    private _positionY;
    private _zoomCurrentDistance;
    private _swipeDownOffset;
    private _horizontalWholeOuterCounter;
    private _isAnimated;
    constructor(props: Props);
    private _imageDidMove;
    private _panResponderReleaseResolve;
    close: () => void;
    shouldComponentUpdate(nextProps: Props): boolean;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map