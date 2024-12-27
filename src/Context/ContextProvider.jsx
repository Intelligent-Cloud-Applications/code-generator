import { API } from "aws-amplify";
import React, { useState, useMemo, useEffect, useCallback} from "react";
import Context from "./Context";
import web from "../utils/data.json";
import apiPaths from "../utils/api-paths";

const ContextProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({});
  const [loader, setLoader] = useState(false);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [previousClasses, setPreviousClasses] = useState([]);
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [instructorList, setInstructorList] = useState([]);
  const [streakData, setStreakData] = useState({});
  const [ratings, setRatings] = useState([]);
  const [userAttendance, setUserAttendance] = useState({});

  const onAuthLoad = async (auth, id) => {
    if (auth) {
      // try {
      //   const statusResponse = await API.put("main", `/user/status/${userData.InstitutionId}`);
      //   if (statusResponse && statusResponse.status) {
      //     setUserData((prevData) => ({
      //       ...prevData,
      //       status: statusResponse.status, // Assuming the API returns the status
      //     }));
      //   }
      // } catch (e) {
      //   console.log("Error fetching user status:", e);
      // }
      API.get("main", apiPaths.getProducts, {})
        .then((list) => {
          let newList = [];
          let tempProduct;
          list.forEach((element) => {
            if (element.subscriptionType !== "Hybrid") {
              newList.push(element);
            } else {
              tempProduct = element;
            }
          });
          newList = tempProduct ? [tempProduct].concat(newList) : newList;
          setProductList(newList);
        })
        .catch((e) => {
          console.log(e);
          setUserList([]);
        });

      API.get("main", apiPaths.getInstructors, {})
        .then((data) => {
          setInstructorList(data);
        })
        .catch((e) => {
          console.log(e);
        });

      try {
        const classes = await API.get("main", apiPaths.getUpcomingSchedule, {});
        setUpcomingClasses(classes);
      } catch (e) {
        setUpcomingClasses([]);
        console.log(e);
      }

      try {
        const classes = await API.get("main", apiPaths.getPreviousScedule, {});
        setPreviousClasses(classes);
      } catch (e) {
        setPreviousClasses([]);
        console.log(e);
      }
      getUserList();
      try {
        // Add the API call for fetching streak data
        const streakResponse = await API.get("main", apiPaths.getStreak);
        setStreakData(streakResponse);
      } catch (e) {
        console.log(e);
        setStreakData({});
      }

      try {
        const response = await API.put("main", apiPaths.getRating, {
          body: {},
        });
        console.log(response);
        setRatings(response);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }

      try {
        const response = await API.get("main", apiPaths.listAttendance, {});
        console.log(response);
        setUserAttendance(response.attendanceByUser);
      } catch (e) {
        console.log(e);
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
  };
  const getUserList = async () => {
    try {
      const list = await API.get("main", apiPaths.getMembers);
      setUserList(list);
    } catch (e) {
      console.log(e);
      setUserList([]);
    }
  };
  const onUnauthLoad = async (id) => {
    API.get("main", apiPaths.getProducts)
      .then((list) => {
        setProductList(list);
      })
      .catch((e) => {
        console.log(e);
        setUserList([]);
      });
  };

  const setIsAuthFn = (data) => {
    setIsAuth(data);
  };

  const setUserDataFn = (data) => {
    setUserData(data);
  };

  const setLoaderFn = (data) => {
    setLoader(data);
  };

  const setUpcomingClassesFn = (classes) => {
    setUpcomingClasses(classes);
  };

  const setPreviousClassesFn = (classes) => {
    setPreviousClasses(classes);
  };

  const setUserListFn = (list) => {
    setUserList(list);
  };

  const setStreakDataFn = (streakResponse) => {
    setStreakData(streakResponse);
  };

  const checkSubscriptionStatus = useMemo(() => {
    if (userData && userData.userType) {
      const subscriptionType = userData.userType;
      const subscriptionStatus = userData.status;
      if (subscriptionType === "admin") {
        return { borderColor: "green" };
      } else if (subscriptionType === "instructor") {
        return { borderColor: "blue" };
      } else if (
        subscriptionType === "member" &&
        subscriptionStatus === "Active"
      ) {
        return { borderColor: "#1b7571" };
      }
    }
    // Return the default style for non-admin and non-active accounts
    return { borderColor: "red" };
  }, [userData]);

  const [imageUrls, setImageUrls] = useState([]);
  const [tempImgSrc, setTempImgSrc] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const getImagesFromAPI = async (imageUrl) => {
    try {
      const response = await API.get(
        "main",
        `/user/get-imageUrl/${web.InstitutionId}`
      );
      setImageUrls(response.GalleryImagesLinks || []);
      if (imageUrl) {
        const filename = imageUrl.split("/").pop();
        if (response.gallery && response.gallery[filename]) {
          setDescription(response.gallery[filename].description);
          setTitle(response.gallery[filename].title);
        }
      }
    } catch (error) {
      console.error("Error getting images from API: ", error);
    }
  };
  useEffect(() => {
    getImagesFromAPI();
    // eslint-disable-next-line
  }, []);

  const [revenue, setRevenue] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const paymentDetailsAdmin = async () => {
      try {
        const response = await API.get(
          "main",
          `/payment-history/${userData.institution}`
        );
        const payments = response?.payments || [];
        setRevenue(Array.isArray(payments) ? payments : []); // Ensure revenue is an array
      } catch (error) {
        console.error("Error getting payment history from API: ", error);
      }
    };

    // Only run the function if userData.institution is available
    if (userData.institution) {
      paymentDetailsAdmin();
    }
  }, [userData.institution]); // Dependency on userData.institution

  const updateUserStatus = async (userId, institution) => {
    const currentEpochTime = Math.floor(new Date().getTime() / 1000);

    // Assuming userData contains the trialEndDate
    if (userData && userData.trialEndDate && userData.status === "Trial") {
      const trialEndEpoch = userData.trialEndDate;

      if (currentEpochTime > trialEndEpoch) {
        try {
          // Call the user update API to set the status to 'Inactive'
          const response = await API.put(
            "main",
            `/user/profile-update/${institution}`,
            {
              body: {
                status: "InActive", // Set status to Inactive
              },
            }
          );
          console.log("User status updated to Inactive:", response);
          setUserData((prevData) => ({
            ...prevData,
            status: "InActive", // Update the context state
          }));
        } catch (error) {
          console.error("Error updating user status to Inactive:", error);
        }
      }
    }
  };

  //update user status after renew date finished
  const updateUserStatusRenew = async (institution) => {
    try {
      // API call to fetch the user status based on institution
      const statusResponse = await API.put(
        "main",
        `/user/status/${institution}`, // Using only institution as identifier
        {
          body: {}, // Empty body as we don't need userId
        }
      );
  
      if (statusResponse && statusResponse.status) {
        // Update the user status in the context
        setUserData((prevData) => ({
          ...prevData,
          status: statusResponse.status, // Assuming the API returns the status
        }));
        console.log("User status updated:", statusResponse.status);
      }
    } catch (e) {
      console.log("Error fetching or updating user status:", e);
    }
  };
  
  useEffect(() => {
    if (userData && userData.status) {
      // Check if user status requires renewal update
        updateUserStatusRenew(userData.institution); // Just pass the institution to update status
    }
  }, [userData]); // Trigger the effect whenever userData changes
  

  // Call this function periodically or after certain actions
  useEffect(() => {
    if (userData.institution && userData.cognitoId) {
      updateUserStatus(userData.cognitoId, userData.institution);
    }
  }, [userData]); // Run whenever userData changes

  // Cart System
  const [itemCount, setItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [cartState, setCartState] = useState({
    subtotal: 0,
    productItems: [],
    quantities: [],
    currencySymbol: "$",
  });

  const getCartItems = async (institution, cognitoId) => {
    try {
      const response = await API.get(
        "awsaiapp",
        `/any/getcartitems/${institution}/${cognitoId}`
      );
      setCartItems(response);
      setItemCount(response.length);
      getPaymentHistory(institution, cognitoId);
      if (Array.isArray(response) && response.length > 0) {
        const quantities = response.map(() => 1);
        const subtotal = response.reduce(
          (total, item, index) =>
            total + (item.amount / 100) * quantities[index],
          0
        );
        const currencySymbol = response[0].currency === "INR" ? "₹" : "$";
        setCartState({
          productItems: response,
          quantities,
          subtotal,
          currencySymbol,
        });
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const removeCartItem = async (productId, institution, cognitoId) => {
    try {
      await API.del(
        "awsaiapp",
        `/any/deleteCartItem/${institution}/${cognitoId}`,
        {
          body: { productId },
        }
      );
      getCartItems(institution, cognitoId);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const addCartItem = async (item, institution, cognitoId) => {
    try {
      await API.post("awsaiapp", "/any/addtocart", {
        body: { institution, cognitoId, cart: [item] },
      });
      getCartItems(institution, cognitoId);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const getPaymentHistory = async (institution, cognitoId) => {
    try {
      const paymentHistory = await API.get(
        "awsaiapp",
        `/getReciept/${institution}/${cognitoId}`
      );
      setPaymentHistory(paymentHistory);
    } catch (error) {
      console.log(error);
    }
  };

  // New function to check if a product is in the cart
  const isProductInCart = useCallback(
    (productId) => {
      return (
        Array.isArray(cartItems) &&
        cartItems.some((item) => item.planId === productId)
      );
    },
    [cartItems]
  );

  const ContextData = {
    onAuthLoad: onAuthLoad,
    onUnauthLoad: onUnauthLoad,
    isAuth: isAuth,
    setIsAuth: setIsAuthFn,
    userData: userData,
    setUserData: setUserDataFn,
    util: {
      loader: loader,
      setLoader: setLoaderFn,
    },
    upcomingClasses: upcomingClasses,
    setUpcomingClasses: setUpcomingClassesFn,
    previousClasses: previousClasses,
    setPreviousClasses: setPreviousClassesFn,
    userList: userList,
    setUserList: setUserListFn,
    getUserList: getUserList,
    productList: productList,
    instructorList: instructorList,
    setInstructorList: () => { },
    setProductList: () => { },
    checkSubscriptionStatus: checkSubscriptionStatus,
    streakData: streakData,
    setStreakData: setStreakDataFn,
    ratings: ratings,
    setRatings: () => { },
    getImagesFromAPI: getImagesFromAPI,
    setTempImgSrc: setTempImgSrc,
    tempImgSrc: tempImgSrc,
    imageUrls: imageUrls,
    setImageUrls: setImageUrls,
    title: title,
    setTitle: setTitle,
    description: description,
    setDescription: setDescription,
    revenue,
    getCartItems,
    getPaymentHistory,
    cartState,
    setCartState,
    removeCartItem,
    addCartItem,
    setCartItems,
    paymentHistory,
    cartItems,
    itemCount,
    isProductInCart,
    userAttendance,
    setUserAttendance
  };

  return (
    <Context.Provider value={ContextData}>{props.children}</Context.Provider>
  );
};

export { ContextProvider };
