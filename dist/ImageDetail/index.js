var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Animated, PanResponder, Modal, SafeAreaView, StatusBar, Easing, Platform, } from 'react-native';
import FastImage from 'react-native-fast-image';
var LONG_PRESS_TIME = 800;
var DOUBLE_CLICK_INTERVAL = 250;
var MAX_OVERFLOW = 100;
var MIN_SCALE = 0.6;
var MAX_SCALE = 10;
var CLICK_DISTANCE = 10;
var DRAG_DISMISS_THRESHOLD = 150;
var Styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'transparent',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'transparent',
    },
    closeButton: {
        fontSize: 35,
        color: 'white',
        lineHeight: 40,
        width: 40,
        textAlign: 'center',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 1.5,
        shadowColor: 'black',
        shadowOpacity: 0.8,
    },
});
var ImageDetail = (function (_super) {
    __extends(ImageDetail, _super);
    function ImageDetail(props) {
        var _this = _super.call(this, props) || this;
        _this._animatedScale = new Animated.Value(1);
        _this._animatedPositionX = new Animated.Value(0);
        _this._animatedPositionY = new Animated.Value(0);
        _this._animatedFrame = new Animated.Value(0);
        _this._animatedOpacity = new Animated.Value(Dimensions.get('window').height);
        _this._imagePanResponder = undefined;
        _this._lastPositionX = null;
        _this._lastPositionY = null;
        _this._zoomLastDistance = null;
        _this._horizontalWholeCounter = 0;
        _this._verticalWholeCounter = 0;
        _this._isDoubleClick = false;
        _this._isLongPress = false;
        _this._centerDiffX = 0;
        _this._centerDiffY = 0;
        _this._singleClickTimeout = undefined;
        _this._longPressTimeout = undefined;
        _this._lastClickTime = 0;
        _this._doubleClickX = 0;
        _this._doubleClickY = 0;
        _this._scale = 1;
        _this._positionX = 0;
        _this._positionY = 0;
        _this._zoomCurrentDistance = 0;
        _this._swipeDownOffset = 0;
        _this._horizontalWholeOuterCounter = 0;
        _this._isAnimated = false;
        _this._imageDidMove = function (type) {
            var onMove = _this.props.onMove;
            if (typeof onMove === 'function') {
                onMove({
                    type: type,
                    positionX: _this._positionX,
                    positionY: _this._positionY,
                    scale: _this._scale,
                    zoomCurrentDistance: _this._zoomCurrentDistance,
                });
            }
        };
        _this._panResponderReleaseResolve = function (changedTouchesCount) {
            var swipeToDismiss = _this.props.swipeToDismiss;
            var windowWidth = Dimensions.get('window').width;
            var windowHeight = Dimensions.get('window').height;
            if (_this._scale < 1) {
                _this._scale = 1;
                Animated.timing(_this._animatedScale, {
                    toValue: _this._scale,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
            }
            if (windowWidth * _this._scale <= windowWidth) {
                _this._positionX = 0;
                Animated.timing(_this._animatedPositionX, {
                    toValue: _this._positionX,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
            }
            if (windowHeight * _this._scale < windowHeight) {
                _this._positionY = 0;
                Animated.timing(_this._animatedPositionY, {
                    toValue: _this._positionY,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
            }
            else if (swipeToDismiss &&
                _this._scale === 1 &&
                changedTouchesCount === 1 &&
                Math.abs(_this._positionY) > DRAG_DISMISS_THRESHOLD) {
                _this.close();
                return;
            }
            if (windowHeight * _this._scale > windowHeight) {
                var verticalMax = (windowHeight * _this._scale - windowHeight) / 2 / _this._scale;
                if (_this._positionY < -verticalMax) {
                    _this._positionY = -verticalMax;
                }
                else if (_this._positionY > verticalMax) {
                    _this._positionY = verticalMax;
                }
                Animated.timing(_this._animatedPositionY, {
                    toValue: _this._positionY,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
            }
            if (windowWidth * _this._scale > windowWidth) {
                var horizontalMax = (windowWidth * _this._scale - windowWidth) / 2 / _this._scale;
                if (_this._positionX < -horizontalMax) {
                    _this._positionX = -horizontalMax;
                }
                else if (_this._positionX > horizontalMax) {
                    _this._positionX = horizontalMax;
                }
                Animated.timing(_this._animatedPositionX, {
                    toValue: _this._positionX,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
            }
            if (_this._scale === 1) {
                _this._positionX = 0;
                _this._positionY = 0;
                Animated.timing(_this._animatedPositionX, {
                    toValue: _this._positionX,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
                Animated.timing(_this._animatedPositionY, {
                    toValue: _this._positionY,
                    duration: 100,
                    useNativeDriver: false,
                }).start();
            }
            Animated.timing(_this._animatedOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start();
            _this._horizontalWholeOuterCounter = 0;
            _this._swipeDownOffset = 0;
            _this._imageDidMove('onPanResponderRelease');
        };
        _this.close = function () {
            var _a = _this.props, isTranslucent = _a.isTranslucent, willClose = _a.willClose, onClose = _a.onClose;
            var windowHeight = Dimensions.get('window').height;
            if (isTranslucent) {
                StatusBar.setHidden(false);
            }
            setTimeout(function () {
                _this._isAnimated = true;
                if (typeof willClose === 'function') {
                    willClose();
                }
                Animated.parallel([
                    Animated.timing(_this._animatedScale, { toValue: 1, duration: 250, useNativeDriver: false }),
                    Animated.timing(_this._animatedPositionX, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: false,
                    }),
                    Animated.timing(_this._animatedPositionY, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(_this._animatedOpacity, {
                        toValue: windowHeight,
                        duration: 250,
                        useNativeDriver: false,
                    }),
                    Animated.timing(_this._animatedFrame, {
                        toValue: 0,
                        duration: 250,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: false,
                    }),
                ]).start(function () {
                    onClose();
                    _this._isAnimated = false;
                });
            });
        };
        var onLongPress = props.onLongPress, onDoubleTap = props.onDoubleTap, swipeToDismiss = props.swipeToDismiss, onTap = props.onTap, responderRelease = props.responderRelease;
        _this._imagePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: function () { return true; },
            onPanResponderTerminationRequest: function () { return false; },
            onPanResponderGrant: function (evt) {
                if (_this._isAnimated) {
                    return;
                }
                var windowWidth = Dimensions.get('window').width;
                var windowHeight = Dimensions.get('window').height;
                _this._lastPositionX = null;
                _this._lastPositionY = null;
                _this._zoomLastDistance = null;
                _this._horizontalWholeCounter = 0;
                _this._verticalWholeCounter = 0;
                _this._isDoubleClick = false;
                _this._isLongPress = false;
                if (_this._singleClickTimeout) {
                    clearTimeout(_this._singleClickTimeout);
                }
                if (evt.nativeEvent.changedTouches.length > 1) {
                    var centerX = (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2;
                    _this._centerDiffX = centerX - windowWidth / 2;
                    var centerY = (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2;
                    _this._centerDiffY = centerY - windowHeight / 2;
                }
                if (_this._longPressTimeout) {
                    clearTimeout(_this._longPressTimeout);
                }
                _this._longPressTimeout = setTimeout(function () {
                    _this._isLongPress = true;
                    if (typeof onLongPress === 'function') {
                        onLongPress();
                    }
                }, LONG_PRESS_TIME);
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    if (new Date().getTime() - _this._lastClickTime < (DOUBLE_CLICK_INTERVAL || 0)) {
                        _this._lastClickTime = 0;
                        if (typeof onDoubleTap === 'function') {
                            onDoubleTap();
                        }
                        clearTimeout(_this._longPressTimeout);
                        _this._doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
                        _this._doubleClickY = evt.nativeEvent.changedTouches[0].pageY;
                        _this._isDoubleClick = true;
                        if (_this._scale > 1 || _this._scale < 1) {
                            _this._scale = 1;
                            _this._positionX = 0;
                            _this._positionY = 0;
                        }
                        else {
                            var beforeScale = _this._scale;
                            _this._scale = 2;
                            var diffScale = _this._scale - beforeScale;
                            _this._positionX = ((windowWidth / 2 - _this._doubleClickX) * diffScale) / _this._scale;
                            _this._positionY = ((windowHeight / 2 - _this._doubleClickY) * diffScale) / _this._scale;
                        }
                        _this._imageDidMove('centerOn');
                        Animated.parallel([
                            Animated.timing(_this._animatedScale, {
                                toValue: _this._scale,
                                duration: 100,
                                useNativeDriver: false,
                            }),
                            Animated.timing(_this._animatedPositionX, {
                                toValue: _this._positionX,
                                duration: 100,
                                useNativeDriver: false,
                            }),
                            Animated.timing(_this._animatedPositionY, {
                                toValue: _this._positionY,
                                duration: 100,
                                useNativeDriver: false,
                            }),
                        ]).start();
                    }
                    else {
                        _this._lastClickTime = new Date().getTime();
                    }
                }
            },
            onPanResponderMove: function (evt, gestureState) {
                if (_this._isDoubleClick || _this._isAnimated) {
                    return;
                }
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    var diffX = gestureState.dx - (_this._lastPositionX || 0);
                    if (_this._lastPositionX === null) {
                        diffX = 0;
                    }
                    var diffY = gestureState.dy - (_this._lastPositionY || 0);
                    if (_this._lastPositionY === null) {
                        diffY = 0;
                    }
                    var windowWidth = Dimensions.get('window').width;
                    _this._lastPositionX = gestureState.dx;
                    _this._lastPositionY = gestureState.dy;
                    _this._horizontalWholeCounter += diffX;
                    _this._verticalWholeCounter += diffY;
                    if ((Math.abs(_this._horizontalWholeCounter) > 5 ||
                        Math.abs(_this._verticalWholeCounter) > 5) &&
                        _this._longPressTimeout) {
                        clearTimeout(_this._longPressTimeout);
                    }
                    if (_this._swipeDownOffset === 0) {
                        if (windowWidth * _this._scale > windowWidth) {
                            if (_this._horizontalWholeOuterCounter > 0) {
                                if (diffX < 0) {
                                    if (_this._horizontalWholeOuterCounter > Math.abs(diffX)) {
                                        _this._horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    }
                                    else {
                                        diffX += _this._horizontalWholeOuterCounter;
                                        _this._horizontalWholeOuterCounter = 0;
                                    }
                                }
                                else {
                                    _this._horizontalWholeOuterCounter += diffX;
                                }
                            }
                            else if (_this._horizontalWholeOuterCounter < 0) {
                                if (diffX > 0) {
                                    if (Math.abs(_this._horizontalWholeOuterCounter) > diffX) {
                                        _this._horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    }
                                    else {
                                        diffX += _this._horizontalWholeOuterCounter;
                                        _this._horizontalWholeOuterCounter = 0;
                                    }
                                }
                                else {
                                    _this._horizontalWholeOuterCounter += diffX;
                                }
                            }
                            _this._positionX += diffX / _this._scale;
                            var horizontalMax = (windowWidth * _this._scale - windowWidth) / 2 / _this._scale;
                            if (_this._positionX < -horizontalMax) {
                                _this._positionX = -horizontalMax;
                                _this._horizontalWholeOuterCounter += -1 / 1e10;
                            }
                            else if (_this._positionX > horizontalMax) {
                                _this._positionX = horizontalMax;
                                _this._horizontalWholeOuterCounter += 1 / 1e10;
                            }
                            _this._animatedPositionX.setValue(_this._positionX);
                        }
                        else {
                            _this._horizontalWholeOuterCounter += diffX;
                        }
                        if (_this._horizontalWholeOuterCounter > (MAX_OVERFLOW || 0)) {
                            _this._horizontalWholeOuterCounter = MAX_OVERFLOW || 0;
                        }
                        else if (_this._horizontalWholeOuterCounter < -(MAX_OVERFLOW || 0)) {
                            _this._horizontalWholeOuterCounter = -(MAX_OVERFLOW || 0);
                        }
                    }
                    _this._positionY += diffY / _this._scale;
                    _this._animatedPositionY.setValue(_this._positionY);
                    if (swipeToDismiss && _this._scale === 1) {
                        _this._animatedOpacity.setValue(Math.abs(gestureState.dy));
                    }
                }
                else {
                    if (_this._longPressTimeout) {
                        clearTimeout(_this._longPressTimeout);
                    }
                    var minX = void 0;
                    var maxX = void 0;
                    if (evt.nativeEvent.changedTouches[0].locationX >
                        evt.nativeEvent.changedTouches[1].locationX) {
                        minX = evt.nativeEvent.changedTouches[1].pageX;
                        maxX = evt.nativeEvent.changedTouches[0].pageX;
                    }
                    else {
                        minX = evt.nativeEvent.changedTouches[0].pageX;
                        maxX = evt.nativeEvent.changedTouches[1].pageX;
                    }
                    var minY = void 0;
                    var maxY = void 0;
                    if (evt.nativeEvent.changedTouches[0].locationY >
                        evt.nativeEvent.changedTouches[1].locationY) {
                        minY = evt.nativeEvent.changedTouches[1].pageY;
                        maxY = evt.nativeEvent.changedTouches[0].pageY;
                    }
                    else {
                        minY = evt.nativeEvent.changedTouches[0].pageY;
                        maxY = evt.nativeEvent.changedTouches[1].pageY;
                    }
                    var widthDistance = maxX - minX;
                    var heightDistance = maxY - minY;
                    var diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance);
                    _this._zoomCurrentDistance = Number(diagonalDistance.toFixed(1));
                    if (_this._zoomLastDistance !== null) {
                        var distanceDiff = (_this._zoomCurrentDistance - _this._zoomLastDistance) / 200;
                        var zoom = _this._scale + distanceDiff;
                        if (zoom < MIN_SCALE) {
                            zoom = MIN_SCALE;
                        }
                        if (zoom > MAX_SCALE) {
                            zoom = MAX_SCALE;
                        }
                        var beforeScale = _this._scale;
                        _this._scale = zoom;
                        _this._animatedScale.setValue(_this._scale);
                        var diffScale = _this._scale - beforeScale;
                        _this._positionX -= (_this._centerDiffX * diffScale) / _this._scale;
                        _this._positionY -= (_this._centerDiffY * diffScale) / _this._scale;
                        _this._animatedPositionX.setValue(_this._positionX);
                        _this._animatedPositionY.setValue(_this._positionY);
                    }
                    _this._zoomLastDistance = _this._zoomCurrentDistance;
                }
                _this._imageDidMove('onPanResponderMove');
            },
            onPanResponderRelease: function (evt, gestureState) {
                if (_this._longPressTimeout) {
                    clearTimeout(_this._longPressTimeout);
                }
                if (_this._isDoubleClick || _this._isLongPress || _this._isAnimated) {
                    return;
                }
                var moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
                var _a = evt.nativeEvent, locationX = _a.locationX, locationY = _a.locationY, pageX = _a.pageX, pageY = _a.pageY;
                if (evt.nativeEvent.changedTouches.length === 1 && moveDistance < CLICK_DISTANCE) {
                    _this._singleClickTimeout = setTimeout(function () {
                        if (typeof onTap === 'function') {
                            onTap({ locationX: locationX, locationY: locationY, pageX: pageX, pageY: pageY });
                        }
                    }, DOUBLE_CLICK_INTERVAL);
                }
                else {
                    if (typeof responderRelease === 'function') {
                        responderRelease(gestureState.vx, _this._scale);
                    }
                    _this._panResponderReleaseResolve(evt.nativeEvent.changedTouches.length);
                }
            },
        });
        return _this;
    }
    ImageDetail.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.isOpen !== this.props.isOpen ||
            nextProps.origin.x !== this.props.origin.x ||
            nextProps.origin.y !== this.props.origin.y) {
            return true;
        }
        return false;
    };
    ImageDetail.prototype.componentDidUpdate = function () {
        var _this = this;
        var _a = this.props, isOpen = _a.isOpen, didOpen = _a.didOpen;
        if (isOpen) {
            this._lastPositionX = null;
            this._lastPositionY = null;
            this._zoomLastDistance = null;
            this._horizontalWholeCounter = 0;
            this._verticalWholeCounter = 0;
            this._isDoubleClick = false;
            this._isLongPress = false;
            this._centerDiffX = 0;
            this._centerDiffY = 0;
            this._singleClickTimeout = undefined;
            this._longPressTimeout = undefined;
            this._lastClickTime = 0;
            this._doubleClickX = 0;
            this._doubleClickY = 0;
            this._scale = 1;
            this._positionX = 0;
            this._positionY = 0;
            this._zoomCurrentDistance = 0;
            this._swipeDownOffset = 0;
            this._horizontalWholeOuterCounter = 0;
            this._isAnimated = true;
            Animated.parallel([
                Animated.timing(this._animatedOpacity, { toValue: 0, useNativeDriver: false }),
                Animated.spring(this._animatedFrame, { toValue: 1, useNativeDriver: false }),
            ]).start(function () {
                _this._isAnimated = false;
                if (typeof didOpen === 'function') {
                    didOpen();
                }
            });
        }
    };
    ImageDetail.prototype.render = function () {
        var _this = this;
        var windowWidth = Dimensions.get('window').width;
        var windowHeight = Dimensions.get('window').height;
        var _a = this.props, renderToHardwareTextureAndroid = _a.renderToHardwareTextureAndroid, isOpen = _a.isOpen, origin = _a.origin, source = _a.source, thumbnailSource = _a.thumbnailSource, resizeMode = _a.resizeMode, _b = _a.backgroundColor, backgroundColor = _b === void 0 ? '#000000' : _b, hideCloseButton = _a.hideCloseButton, imageStyle = _a.imageStyle, renderHeader = _a.renderHeader, renderFooter = _a.renderFooter;
        var animateConf = {
            transform: [
                {
                    scale: this._animatedScale,
                },
                {
                    translateX: this._animatedPositionX,
                },
                {
                    translateY: this._animatedPositionY,
                },
            ],
            left: this._animatedFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.x, 0],
            }),
            top: this._animatedFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.y, 0],
            }),
            width: this._animatedFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.width, windowWidth],
            }),
            height: this._animatedFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.height, windowHeight],
            }),
        };
        var background = (<Animated.View renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true} style={[
                Styles.background,
                { backgroundColor: backgroundColor },
                {
                    opacity: this._animatedOpacity.interpolate({
                        inputRange: [0, windowHeight],
                        outputRange: [1, 0],
                    }),
                },
            ]}></Animated.View>);
        var header = (<Animated.View renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true} style={[
                Styles.header,
                {
                    opacity: this._animatedOpacity.interpolate({
                        inputRange: [0, windowHeight],
                        outputRange: [1, 0],
                    }),
                },
            ]}>
        {typeof renderHeader === 'function' ? (renderHeader(this.close)) : !hideCloseButton ? (<SafeAreaView>
            <TouchableOpacity onPress={this.close}>
              <Text style={Styles.closeButton}>×</Text>
            </TouchableOpacity>
          </SafeAreaView>) : undefined}
      </Animated.View>);
        var footer = renderFooter && (<Animated.View renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true} style={[
                Styles.footer,
                {
                    opacity: this._animatedOpacity.interpolate({
                        inputRange: [0, windowHeight],
                        outputRange: [1, 0],
                    }),
                },
            ]}>
        {renderFooter(this.close)}
      </Animated.View>);
        var content = (<View style={{
                overflow: 'hidden',
                width: windowWidth,
                height: windowHeight,
            }} {...(this._imagePanResponder ? this._imagePanResponder.panHandlers : undefined)}>
        {background}
        <Animated.View style={animateConf} renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true}>
          <FastImage resizeMode={resizeMode} style={[
                imageStyle,
                {
                    width: Platform.OS === 'ios' ? '100%' : windowWidth,
                    height: Platform.OS === 'ios' ? '100%' : windowHeight,
                },
            ]} source={thumbnailSource || source}/>
        </Animated.View>
        {header}
        {typeof renderFooter === 'function' && footer}
      </View>);
        return (<Modal hardwareAccelerated={true} visible={isOpen} transparent={true} onRequestClose={function () { return _this.close(); }} supportedOrientations={[
                'portrait',
                'portrait-upside-down',
                'landscape',
                'landscape-left',
                'landscape-right',
            ]}>
        {content}
      </Modal>);
    };
    return ImageDetail;
}(React.Component));
export default ImageDetail;
//# sourceMappingURL=index.js.map