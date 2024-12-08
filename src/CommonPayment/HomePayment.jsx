import React, { useEffect, useState,useRef,useContext } from 'react';
import { useParams } from 'react-router-dom';
import AllPayment from './AllPayment';
import Cart from './Cart';
import Nav from './FrontpageComponents/Nav';
import Query from '../pages/public/Query';
import PaymentHistory from './PaymentHistory';
import { API } from "aws-amplify";
import CreateSubscriptionPopup from './CreateSubscriptionPopup';
import UpdateSubscriptionPopup from './UpdateSubscriptionPopup';
import Context from '../Context/Context';
import { User } from 'lucide-react';

function HomePayment() {
  const { institution, cognitoId } = useParams();
  const [activeComponent, setActiveComponent] = useState('AllPayment');
  const [userType, setUserType] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const providesContainerRef = useRef(null);
  const util = useContext(Context).util;
  const UserCtx = useContext(Context)?.userData;

  const Userlocation = UserCtx?.location?.countryCode;

  console.log(error);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await API.get("awsaiapp", `/any/userdetailget/${institution}/${cognitoId}`);
        setUserType(response.userType);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError(error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await API.get('main', `/any/products/${institution}`);
        console.log(data);
        localStorage.getItem("userLocation") === 'IN' ? setProducts(data.filter(product=> product.india === true)) : setProducts(data.filter(product => product.india === false));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUserDetails();
    fetchProducts();
  }, [institution, cognitoId]);

  const handleCloseEditPopup = () => {
  setIsEditPopupOpen(false);
    setSelectedProduct(null);
  };
  
  const handleSetSelectedProduct = (product) => {
    setSelectedProduct(product);
    setIsEditPopupOpen(true);
  };
  

  const handleCloseCreatePopup = () => {
    setIsPopupOpen(false);
  };

  const [formData, setFormData] = useState({
    heading: '',
    amount: '',
    durationText: 'Monthly',
    provides: [''],
  });

  useEffect(() => {
    if (!isPopupOpen) {
      setFormData({
        heading: '',
        amount: '',
        durationText: 'Monthly',
        provides: [''],
      });
    }
    if (selectedProduct) {
      setFormData({
        heading: selectedProduct.heading,
        amount: selectedProduct.amount / 100,
        durationText: selectedProduct.durationText,
        provides: selectedProduct.provides,
      });
    }
  }, [selectedProduct,isPopupOpen]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleProvideChange = (index, value) => {
    const newProvides = [...formData.provides];
    newProvides[index] = value;
    setFormData({
      ...formData,
      provides: newProvides,
    });
  };
  const scrollContainer = (index) => {
    if (providesContainerRef.current) {
      const itemHeight = 40; 
      providesContainerRef.current.scrollTop = index * itemHeight;
    }
  };
  const scrollLatestInputIntoView = () => {
    if (providesContainerRef.current) {
      providesContainerRef.current.scrollTop = providesContainerRef.current.scrollHeight;
    }
  };
  const handleAddProvide = () => {
    setFormData({
      ...formData,
      provides: [...formData.provides, ''],
    });
    scrollLatestInputIntoView();
  };

  const handleRemoveProvide = (index) => {
    const newProvides = [...formData.provides];
    newProvides.splice(index, 1);
    setFormData({
      ...formData,
      provides: newProvides,
    });
  };
  const handleMoveDown = (index) => {
    if (index < formData.provides.length - 1) {
     
      scrollContainer(index + 1);
    }
  };
  const handleMoveUp = (index) => {
    if (index > 0) {
    
      scrollContainer(index - 1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      util.setLoader(true); 
      const { heading, amount, durationText, provides } = formData;
      if (!heading || !amount) {
        alert('Heading and Amount cannot be empty');
        setIsPopupOpen(true); 
        util.setLoader(false); 
        return;
      }
      // setIsPopupOpen(false);
    
    
    const amountInPaisa = parseInt(amount, 10) * 100;

    
    const filteredProvides = provides.filter(provide => provide.trim() !== '');

   console.log(filteredProvides);
    const subscriptionType = durationText.toLowerCase();

  
    const calculatedurationInMilliseconds = (duration) => {
      const now = new Date();
      switch (duration) {
        case 'weekly':
          return 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return 30 * 24 * 60 * 60 * 1000; 
        case 'quarterly':
          return 3 * 30 * 24 * 60 * 60 * 1000;
        case 'yearly':
          return 365 * 24 * 60 * 60 * 1000;
        default:
          return now.getTime();
      }
    };

    const durationInMilliseconds = calculatedurationInMilliseconds(subscriptionType);

    const confirmation = window.confirm('Do you want to proceed with this submission? Click "OK" to submit or "Cancel" to edit.');
    if (!confirmation) {
      setIsPopupOpen(true); 
      util.setLoader(false);
      return;
    }
    setIsPopupOpen(false);
      await API.put("awsaiapp", "/user/development-form/subscriptions",
        {
          body: {
            institution,
            cognitoId,
            heading,
            amount: amountInPaisa, 
            duration:durationInMilliseconds,
            country:"india",
            currency:"INR",
            india:true,
            durationText:subscriptionType,
            subscriptionType:subscriptionType, 
            provides
        
          },
        }
      );

      setIsPopupOpen(false);
      const data = await API.get('main', `/any/products/${institution}`);
      setProducts(data);
      console.log('Form Data:', formData);
      setFormData({
        heading: '',
        amount: '',
        durationText: 'Monthly',
        provides: [''],
      });
      alert('Subscription created successfully');
      util.setLoader(false); 
    } catch (error) {
      alert('Error creating subscription:', error);
      util.setLoader(false); 
    }
    util.setLoader(false); 
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      util.setLoader(true); 
      const { heading, amount, durationText, provides } = formData;
      if (!heading || !amount) {
        alert('Heading and Amount cannot be empty');
        setIsEditPopupOpen(true); 
        util.setLoader(false); 
        return;
      }
      const confirmation = window.confirm('Do you want to proceed with this submission? Click "OK" to submit or "Cancel" to edit.');
      if (!confirmation) {
        setIsEditPopupOpen(true); 
        util.setLoader(false);
        return;
      }
      setIsEditPopupOpen(false);
    
    
    const amountInPaisa = parseInt(amount, 10) * 100;

    
    const filteredProvides = provides.filter(provide => provide.trim() !== '');

   console.log(filteredProvides);
    const subscriptionType = durationText.toLowerCase();

  
    const calculatedurationInMilliseconds = (duration) => {
      const now = new Date();
      switch (duration) {
        case 'weekly':
          return 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return 30 * 24 * 60 * 60 * 1000; 
        case 'quarterly':
          return 3 * 30 * 24 * 60 * 60 * 1000;
        case 'yearly':
          return 365 * 24 * 60 * 60 * 1000;
        default:
          return now.getTime();
      }
    };

    const durationInMilliseconds = calculatedurationInMilliseconds(subscriptionType);


      await API.put("awsaiapp", "/user/development-form/update-subscription",
        {
          body: {
            institution,
            cognitoId,
            heading,
            amount: amountInPaisa, 
            duration:durationInMilliseconds,
            country:"india",
            currency:"INR",
            india:true,
            durationText:subscriptionType,
            subscriptionType:subscriptionType, 
            provides,
            productId:selectedProduct.productId
        
          },
        }
      );

      setIsEditPopupOpen(false);
      const data = await API.get('main', `/any/products/${institution}`);
      setProducts(data);
      console.log('Form Data:', formData);
      setFormData({
        heading: '',
        amount: '',
        durationText: 'Monthly',
        provides: [''],
      });
      alert('Subscription created successfully');
      util.setLoader(false); 
    } catch (error) {
      alert('Error creating subscription:', error);
      util.setLoader(false); 
    }
  };
  const handleDeleteSubscription = async () => {
    const confirmation = window.confirm('Do you want to proceed with this submission? Click "OK" to submit or "Cancel" to edit.');
    if (!confirmation) {
      setIsEditPopupOpen(true); 
      util.setLoader(false);
      return;
    }
    setIsEditPopupOpen(false);
    util.setLoader(true); 
    try {
    console.log(selectedProduct.productId)
     
      await API.del(
       "awsaiapp", 
        `/user/development-form/delete-subscription/${institution}`, {
          body: {
          cognitoId,
          productId:selectedProduct.productId },
        } );
        handleCloseEditPopup();
      alert('Subscription deleted successfully');
      const data = await API.get('main', `/any/products/${institution}`);

      setProducts(data);
      util.setLoader(false); 
    } catch (error) {
     alert('Error deleting subscription:', error);
     util.setLoader(false); 
     handleCloseEditPopup();
    }
  };
  return (
    <div className='z-1000'>
      <Nav 
        institution={institution} 
        setActiveComponent={setActiveComponent} 
        activeComponent={activeComponent} 
        userType={userType} 
        setIsPopupOpen={setIsPopupOpen}
      />

      <div style={{ display: activeComponent === 'AllPayment' ? 'block' : 'none' }}>
        <AllPayment 
          institution={institution} 
          setActiveComponent={setActiveComponent}
          userType={userType} 
          products={products} 
          handleSetSelectedProduct={handleSetSelectedProduct} 
        />
      </div>
      
      <div style={{ display: activeComponent === 'Cart' ? 'block' : 'none' }}>
        <Cart institution={institution} />
      </div>
            
      <div style={{ display: activeComponent === 'contact' ? 'block' : 'none' }}>
        <Query activeComponent={activeComponent}/>
      </div>

      <div style={{ display: activeComponent === 'history' ? 'block' : 'none' }}>
        <PaymentHistory institution={institution}  activeComponent={activeComponent}/>
      </div>
       <CreateSubscriptionPopup
       isPopupOpen={isPopupOpen}
       onClose={handleCloseCreatePopup}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleProvideChange={handleProvideChange}
        handleAddProvide={handleAddProvide}
        handleRemoveProvide={handleRemoveProvide}
        formData={formData}
        institution={institution}
        providesContainerRef={providesContainerRef}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
      />

      <UpdateSubscriptionPopup
       isEditPopupOpen={isEditPopupOpen}
       onClose={handleCloseEditPopup}
        handleSubmit={handleEditSubmit}
        handleInputChange={handleInputChange}
        handleProvideChange={handleProvideChange}
        handleAddProvide={handleAddProvide}
        handleRemoveProvide={handleRemoveProvide}
        formData={formData}
        institution={institution}
        providesContainerRef={providesContainerRef}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleDeleteSubscription={handleDeleteSubscription}
        
      />
    </div>
  );
}

export default HomePayment;
