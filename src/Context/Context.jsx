import { createContext } from 'react'

const Context = createContext({
  onAuthLoad: () => {},
  onUnauthLoad: () => {},
  isAuth: '',
  setIsAuth: () => {},
  userData: '',
  setUserData: () => {},
  isUserDataLoaded: false,
  setIsUserDataLoaded: () => {},
  util: {
    loader: false,
    setLoader: () => {}
  },
  upcomingClasses: [],
  setUpcomingClasses: () => {},
  previousClasses: [],
  setPreviousClasses: () => {},
  userList: [],
  setUserList: () => {},
  productList: [],
  setProductList: () => {},
  instructorList: [],
  setInstructorList: () => {},
  reloadClasses: () => {},
  checkSubscriptionStatus: () => {},
  Streak: [],
  setStreakData: () => {},
  ratings: [],
  setRatings: () => {}
})

export default Context
