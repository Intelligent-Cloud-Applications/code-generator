// import { useSelector } from "react-redux";
import {useContext} from "react";
import { Card } from "flowbite-react";
import { PrimaryButton } from "../../../common/Inputs";
import Context from "../../../Context/Context";

const Subscriptions = () => {
  // const { list } = useSelector((state) => state.products);
  // const { isAuth, data } = useSelector((state) => state.userData);
  const { isAuth, userData, productList } = useContext(Context);
  
  console.log(productList);
  return (
    <div className="h-auto flex flex-col justify-center items-center gap-16 mt-20">
      <div className="flex flex-col gap-4 justify-center items-center">
        <h2 className="text-3xl font-bold text-center text-[2.5rem]">
          Monthly Membership Subscription
        </h2>
        <p className="font-semibold">See the pricing details below</p>
      </div>
      <div className="flex flex-row justify-evenly gap-8 flex-wrap w-[80vw]">
        {productList.map((item, index) => {
          return (
            <Card key={index} className="max-w-sm w-[21rem] mb-8 px-4 shadow-xl shadow-stone-500">
              <div className="h-[22rem]">
                <h5 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  {item.heading}
                </h5>
                <ul className={` text-[1rem] h-auto flex flex-col gap-3`}>
                  {item.provides.map((provide) => {
                    return (
                      <li>
                        <p>{provide}</p>
                      </li>
                    );
                  })}
                </ul>
                <h1 className="text-3xl font-bold text-center mt-10">
                  {(item.currency === "INR" ? "₹ " : "$ ") +
                    parseInt(item.amount) / 100 +
                    "/" +
                    item.durationText}
                </h1>
              </div>
              <PrimaryButton className="w-full h-[40px]">{isAuth ? (userData.status === 'Active' ? <p>Already Subscribed</p> : <p>Subscribe</p>) : <p>SignUp</p>}</PrimaryButton>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Subscriptions;
