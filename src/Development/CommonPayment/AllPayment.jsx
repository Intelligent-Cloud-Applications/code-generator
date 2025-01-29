import React from 'react';
import Card from './FrontpageComponents/Card';

function AllPayment({ setActiveComponent, userType, setIsEditPopupOpen, products, handleSetSelectedProduct }) {
  if (!products || products.length === 0) {
    return <div>Loading products...</div>;
  }

  // Filter visible products based on dev mode
  const searchParams = new URLSearchParams(window.location.search);
  const isDevMode = searchParams.get('dev') === 'true';
  const visibleProducts = products.filter(product => {
    const isDevProduct = product.productId === '1000048';
    return isDevMode ? isDevProduct : !isDevProduct;
  });

  // Determine if we should show the spacing based on number of visible products
  const showSpacing = visibleProducts.length > 1;

  return (
    <div className="relative flex flex-col w-full overflow-hidden">
      <div className="scrollbar-hide w-full h-screen z-1 flex justify-center items-center overflow-auto p-4">
        <div className={`flex flex-wrap ${showSpacing ? 'gap-[5rem]' : 'gap-0'} justify-center items-center relative ${showSpacing ? 'top-[5rem]' : 'top-0'} h-full`}>
          {products.map((product, index) => (
            <div key={index}>
              <Card 
                product={product} 
                setActiveComponent={setActiveComponent}  
                userType={userType} 
                setIsEditPopupOpen={setIsEditPopupOpen}  
                handleSetSelectedProduct={handleSetSelectedProduct}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllPayment;