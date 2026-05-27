import { MapController } from 'react-map-gl';

export default class MyMapController extends MapController {
  constructor() {
    super();
    // subscribe to additional events
    this.events = ['click'];
  }

  _onPan(event) {
    return this.isFunctionKeyPressed(event) || event.rightButton
      ? //  Default implementation in MapController
        //  this._onPanRotate(event) : this._onPanMove(event);
        this._onPanMove(event)
      : this._onPanRotate(event);
  }

  handleEvent(event) {
    if (event.type === 'press' && this.onKeyUp) {
      this.onKeyUp(event);
      return;
    }
    super.handleEvent(event);
  }

  // _onClick(event) {
  //     console.log("map new clicked", event)
  //     super._onClick();
  // }

  // _onWheel(event) {
  //     console.log("on wheel", event)
  //     if (event.srcEvent.ctrlKey || event.srcEvent.metaKey || event.srcEvent.altKey) {
  //             return
  //           }

  //           event.preventDefault();
  //   }
}
