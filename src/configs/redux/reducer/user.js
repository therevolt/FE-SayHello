const initState = {
  user: null,
  loading: false,
  error: null,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOAD_USER":
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return state;
  }
};

export default userReducer;
