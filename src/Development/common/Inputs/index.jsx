// Packages
import { Select, TextInput } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";

// Local
import {LuHash, LuLock, LuMail, LuPhone, LuText} from "react-icons/lu";
import Context from "../../Context/Context";
import institutionContext from "../../Context/InstitutionContext";
import countries from "./countries.json";
//import {useSelector} from "react-redux";

export const CountrySelect = (props) => {
  const { userData } = useContext(Context);
  const [country, setCountry] = useState(userData?.location?.countryValue);

  useEffect(() => {
    setCountry(userData?.location?.countryValue);
  }, [userData?.location?.countryValue]);
  const handleChange = (event) => {
    setCountry(event.target.value);
  };
  return (
    <Select value={country} onChange={handleChange} {...props}>
      {countries.map((item, index) => (
        <option key={index} value={item.value}>
          {item.name}
        </option>
      ))}
    </Select>
  );
};

export const PhoneInput = (props) => {
  const [value, setValue] = useState("");
  return (
    <TextInput
      type="tel"
      placeholder="Phone Number"
      icon={LuPhone}
      required
      pattern="[0-9]{9,10}"
      title="Phone Numbers are 9 or 10 digits"
      value={value}
      onChange={(event) => {
        if (/^\d{0,10}$/.test(event.target.value))
          setValue(event.target.value);
      }}
      {...props}
    />
  );
};

export const EmailInput = (props) => {
  return (
    <TextInput
      type="email"
      placeholder="Email Address"
      icon={LuMail}
      required
      {...props}
    />
  );
};


export const PasswordInput = (props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (value) => {
    if (value.length < 8) return "Must be at least 8 characters.";
    if (!/\d/.test(value)) return "Must contain a number.";
    if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Must contain a special character.";
    return "";
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError(validatePassword(newPassword));
  };

  return (
    <div className="flex flex-col gap-1 items-center w-full">
      <TextInput
        type="password"
        placeholder="Password"
        icon={LuLock}
        value={password}
        onChange={handleChange}
        required
        className={`border ${error ? "border-red-500" : "border-gray-300"} focus:border-red-500`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};


export const OtpInput = (props) => {
  return (
    <TextInput
      type="text"
      placeholder="OTP"
      icon={LuHash}
      required
      pattern="[0-9]{6}"
      title="OTP is 6 digits"
      {...props}
    />
  );
};

export const BaseTextInput = (props) => {
  return (
    <TextInput
      type="text"
      placeholder="Enter text here..."
      icon={LuText}
      required
      {...props}
    />
  );
};

export const BaseTextInputWithValue = (props) => {
  return (
    <TextInput
      type="text"
      placeholder="Enter text here..."
      icon={LuText}
      value={props?.value || ""}
      required
      {...props}
    />
  );
};

export const PrimaryButton = ({ children, ...props }) => {
  const { PrimaryColor } = useContext(institutionContext).institutionData;
  //  const { PrimaryColor } = useSelector((state) => state.institutionData.data);

  return (
    <button
      style={{
        backgroundColor: PrimaryColor,
        width: "100%",
        height: "40px",
        color: "white",
        borderRadius: "10px",
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Components used in old components

export const Button1 = ({ data, fn, w = "auto", h = "auto" }) => {
  return (
    <button
      className={`sans-serif tracking-wider bg-[#2f2f2f] text-[#e1e1e1] h-[${h}] rounded-lg py-2 px-2 w-[${w}]`}
      onClick={fn}
    >
      {data}
    </button>
  );
};

export const Button2 = ({
  data,
  fn,
  w = "auto",
  h = "auto",
  className = "",
}) => {
  const InstitutionData = useContext(institutionContext).institutionData;
  return (
    <button
      className={`sans-serif tracking-wider font-semibold rounded-lg py-2 px-2 text-white h-[${h}] w-[${w}] ${className}`}
      style={{
        backgroundColor: InstitutionData.PrimaryColor,
      }}
      onClick={fn}
    >
      {data}
    </button>
  );
};
