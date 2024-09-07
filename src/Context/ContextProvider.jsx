import { API } from 'aws-amplify'
import React, { useState, useMemo, useEffect } from 'react'
import Context from './Context';
import web from '../utils/data.json';
import apiPaths from '../utils/api-paths';

const ContextProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false)
  const [userData, setUserData] = useState({})
  const [loader, setLoader] = useState(false)
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [previousClasses, setPreviousClasses] = useState([])
  const [userList, setUserList] = useState([])
  const [productList, setProductList] = useState([])
  const [instructorList, setInstructorList] = useState([])
  const [streakData, setStreakData] = useState({})
  const [ratings, setRatings] = useState([])

  const onAuthLoad = async (auth, id) => {
    if (auth) {
      API.get('main', apiPaths.getProducts, {})
        .then((list) => {
          let newList = []
          let tempProduct
          list.forEach((element) => {
            if (element.subscriptionType !== 'Hybrid') {
              newList.push(element)
            } else {
              tempProduct = element
            }
          })
          newList = tempProduct ? [tempProduct].concat(newList) : newList
          setProductList(newList)
        })
        .catch((e) => {
          console.log(e)
          setUserList([])
        })

      API.get('main', apiPaths.getInstructors, {})
        .then((data) => {
          setInstructorList(data)
        })
        .catch((e) => {
          console.log(e)
        })

      try {
        const classes = await API.get('main',  apiPaths.getUpcomingSchedule, {})
        setUpcomingClasses(classes)
      } catch (e) {
        setUpcomingClasses([])
        console.log(e)
      }

      try {
        const classes = await API.get('main', apiPaths.getPreviousScedule, {})
        setPreviousClasses(classes)
      } catch (e) {
        setPreviousClasses([])
        console.log(e)
      }

      try {
        const list = await API.get('main', apiPaths.getMembers)
        setUserList(list)
      } catch (e) {
        console.log(e)
        setUserList([])
      }

      try {
        // Add the API call for fetching streak data
        const streakResponse = await API.get('main', apiPaths.getStreak)
        setStreakData(streakResponse)
      } catch (e) {
        console.log(e)
        setStreakData({})
      }

      try {
        const response = await API.put('main', apiPaths.getRating, {
          body: {}
        })
        console.log(response)
        setRatings(response)
      } catch (error) {
        console.error('Error fetching ratings:', error)
      }

      // try {
      //   setLoader(true);
      //   const res = await Promise.all([
      //     API.get("user", `/any/products/${id}`),
      //     API.get("user", `/any/instructor-list/${id}`),
      //     API.get("user", `/user/upcoming-schedule/${id}`),
      //     API.get("user", `/user/previous-schedule/${id}`),
      //     API.get("user", `/admin/profile-list/${id}`),
      //     // API.get("user", `/user/streak-get/${id}`),
      //     API.put("user", `/admin/rating-fetch/${id}`, {
      //       body: {},
      //     }),
      //   ]);

      //   let newList = [];
      //   let tempProduct;
      //   res[0].forEach((element) => {
      //     if (element.subscriptionType !== "Hybrid") {
      //       newList.push(element);
      //     } else {
      //       tempProduct = element;
      //     }
      //   });
      //   newList = tempProduct ? [tempProduct].concat(newList) : newList;
      //   setProductList(newList);

      //   setInstructorList(res[1]);
      //   setUpcomingClasses(res[2]);
      //   setPreviousClasses(res[3]);
      //   setUserList(res[4]);
      //   // setStreakData(res[5]);
      //   setRatings(res[5]);
      // } catch (e) {
      //   setProductList([]);

      //   setInstructorList([]);
      //   setUpcomingClasses([]);
      //   setPreviousClasses([]);
      //   setUserList([]);
      //   // setStreakData([]);
      //   setRatings([]);
      // } finally {
      //   setLoader(false);
      // }
    }
  }

  const onUnauthLoad = async (id) => {
    API.get('main', apiPaths.getProducts)
      .then((list) => {
        setProductList(list)
      })
      .catch((e) => {
        console.log(e)
        setUserList([])
      })
  }

  const setIsAuthFn = (data) => {
    setIsAuth(data)
  }

  const setUserDataFn = (data) => {
    setUserData(data)
  }

  const setLoaderFn = (data) => {
    setLoader(data)
  }

  const setUpcomingClassesFn = (classes) => {
    setUpcomingClasses(classes)
  }

  const setPreviousClassesFn = (classes) => {
    setPreviousClasses(classes)
  }

  const setUserListFn = (list) => {
    setUserList(list)
  }

  const setStreakDataFn = (streakResponse) => {
    setStreakData(streakResponse)
  }

  const checkSubscriptionStatus = useMemo(() => {
    if (userData && userData.userType) {
      const subscriptionType = userData.userType
      const subscriptionStatus = userData.status
      if (subscriptionType === 'admin') {
        return { borderColor: 'green' }
      } else if (subscriptionType === 'instructor') {
        return { borderColor: 'blue' }
      } else if (
        subscriptionType === 'member' &&
        subscriptionStatus === 'Active'
      ) {
        return { borderColor: '#1b7571' }
      }
    }
    // Return the default style for non-admin and non-active accounts
    return { borderColor: 'red' }
  }, [userData])

  const [imageUrls, setImageUrls] = useState([]);
  const [tempImgSrc, setTempImgSrc] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getImagesFromAPI = async (imageUrl) => {
    try {
      const response = await API.get('main', `/user/get-imageUrl/${web.InstitutionId}`);
      console.log(response);
      setImageUrls(response.GalleryImagesLinks || []);
      if (imageUrl) {
        const filename = imageUrl.split('/').pop();
        console.log(filename)
        if (response.gallery && response.gallery[filename]) {
          setDescription(response.gallery[filename].description);
          setTitle(response.gallery[filename].title);
        }
      }
    } catch (error) {
      console.error('Error getting images from API: ', error);
    }
  };
  useEffect(() => {
    getImagesFromAPI()
// eslint-disable-next-line 
  }, [])
  
  const [revenue, setRevenue] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const paymentDetailsAdmin = async () => {
      try {
        const response = await API.get('main', `/payment-history/${userData.institution}`);
        const payments = response?.payments || [];
        console.log(response);
        setRevenue(Array.isArray(payments) ? payments : []); // Ensure revenue is an array
      } catch (error) {
        console.error('Error getting payment history from API: ', error);
      }
    };

    // Only run the function if userData.institution is available
    if (userData.institution) {
      paymentDetailsAdmin();
    }
  }, [userData.institution]); // Dependency on userData.institution

  console.log(revenue);

  const ContextData = {
    onAuthLoad: onAuthLoad,
    onUnauthLoad: onUnauthLoad,
    isAuth: isAuth,
    setIsAuth: setIsAuthFn,
    userData: userData,
    setUserData: setUserDataFn,
    util: {
      loader: loader,
      setLoader: setLoaderFn
    },
    upcomingClasses: upcomingClasses,
    setUpcomingClasses: setUpcomingClassesFn,
    previousClasses: previousClasses,
    setPreviousClasses: setPreviousClassesFn,
    userList: userList,
    setUserList: setUserListFn,
    productList: productList,
    instructorList: instructorList,
    setInstructorList: () => {},
    setProductList: () => {},
    checkSubscriptionStatus: checkSubscriptionStatus,
    streakData: streakData,
    setStreakData: setStreakDataFn,
    ratings: ratings,
    setRatings: () => { },
    getImagesFromAPI: getImagesFromAPI,
    setTempImgSrc: setTempImgSrc,
    tempImgSrc:tempImgSrc,
    imageUrls: imageUrls,
    setImageUrls: setImageUrls,
    title: title,
    setTitle: setTitle,
    description: description,
    setDescription: setDescription,
    revenue
  }

  return (
    <Context.Provider value={ContextData}>{props.children}</Context.Provider>
  )
}

export { ContextProvider }
