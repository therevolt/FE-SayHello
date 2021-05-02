const initState = {
  chat: null,
  lastMessage: "",
  loading: false,
  error: null,
};

const chatReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_CHAT":
      return {
        ...state,
        chat: action.payload,
      };
    case "SET_LAST_MSG":
      return {
        ...state,
        lastMessage: action.payload,
      };
    case "LOAD_CHAT":
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return state;
  }
};

export default chatReducer;
