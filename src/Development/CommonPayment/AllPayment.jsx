import React from 'react';
import Card from './FrontpageComponents/Card';

function AllPayment({ setActiveComponent,userType,setIsEditPopupOpen,products, handleSetSelectedProduct }) {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await API.get('user', `/any/products/${institution}`);
  //       setProducts(data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   if (institution) {
  //     fetchData();
  //   }
    
  // }, [institution]);

  if (!products || products.length === 0) {
    return <div>Loading products...</div>;
  }

console.log(products)

  return (
    <div className="relative flex flex-col w-full overflow-hidden">
      <div className="scrollbar-hide w-full h-screen z-1 flex justify-center items-center overflow-auto p-4">
        <div className="flex flex-wrap gap-[5rem] justify-center items-center relative top-[5rem] h-full">
          {products.map((product, index) => (
            <div key={index}>
              <Card product={product} setActiveComponent={setActiveComponent}  userType={userType} 
         setIsEditPopupOpen={setIsEditPopupOpen}  handleSetSelectedProduct={handleSetSelectedProduct}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllPayment;