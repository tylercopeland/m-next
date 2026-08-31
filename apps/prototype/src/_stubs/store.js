// Minimal Redux store for the kit prototype.
//
// MethodUI's TopNav and LeftNav use react-redux's useSelector / useDispatch
// hooks. These throw if no <Provider> is mounted above them, even if the
// selectors don't read anything substantial.
//
// We provide the smallest store shape the components touch, with a no-op
// reducer that ignores all actions. The data is static — kit's demo doesn't
// dispatch anything that should change state.

import { createStore } from 'redux';

const initialState = {
  contextReducer: {
    featureFlags: {},
  },
  router: {
    pageHeader: '',
    name: '',
    appId: null,
    screenId: null,
    versionId: null,
    isV4Screen: false,
  },
  user: {
    profilePhoto: '',
    homePageV2Enabled: false,
    signupDate: null,
    fullname: 'Demo User',
    company: 'Method',
  },
  panels: {
    Main: { current: null, screens: {} },
  },
  screenReducer: {},
  shell: {
    overlayPanel: { isOpen: false },
  },
  config: {
    isLeftNavOpen: true,
    ddSessionReplay: { enabled: false },
  },
  apppermissions: {},
  runtime: {
    appType: 'Standard',
  },
};

const reducer = (state = initialState, _action) => state;

export const kitStore = createStore(reducer);
