import Header from "../../../components/Header";
import Hero from "./Hero";
import Perks from "./Perks";
import Testimonials from "./Testimonials";
import Subscriptions from "./Subscriptions";
import FAQs from "./FAQs";
import Footer from "../../../components/Footer";

function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Perks />
      <Testimonials />
      <Subscriptions />
      <FAQs />
      <Footer />
    </div>
  );
}

export default Home;
