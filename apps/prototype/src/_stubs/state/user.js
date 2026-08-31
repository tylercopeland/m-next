// Stub for MethodUI's state/user selectors.
// In the live app these read from a Redux slice. In kit we provide a minimal
// store shape so useSelector(selector) works; the selectors themselves can
// be naive readers.

export const getUserProfilePhoto = (state) => state?.user?.profilePhoto ?? '';
export const getHomePageV2Enabled = (state) => state?.user?.homePageV2Enabled ?? false;
export const getSignupDate = (state) => state?.user?.signupDate ?? null;
