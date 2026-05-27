const unsubscribeLanguage = {
  subscribed: {
    heading: 'Are you sure you want to go?',
    action: 'unsubscribe',
    paragraph:
      'By selecting unsubscribe, you are choosing to stop receiving all future marketing emails from <b>{companyFriendlyName}</b> at <b>{email}</b>. Would you still like to unsubscribe?',
    button: 'Unsubscribe',
    successMessage: 'You have successfully unsubscribed from marketing emails.',
  },
  unsubscribed: {
    heading: "We're sorry to see you go",
    action: 'resubscribe',
    paragraph:
      'If you accidentally unsubscribed from <b>{companyFriendlyName}</b> marketing emails with <b>{email}</b>, you can subscribe again below.',
    button: 'Subscribe',
    successMessage: 'Great! You have successfully subscribed to marketing emails.',
  },
  resubscribed: {
    heading: 'Welcome back!',
    paragraph:
      "Congratulations! You're now subscribed to marketing emails from <b>{companyFriendlyName}</b> at <b>{email}</b>.",
  },
};

export default unsubscribeLanguage;
