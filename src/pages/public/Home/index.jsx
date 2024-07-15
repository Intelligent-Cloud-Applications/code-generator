import Header from '../../../components/Header';
import Hero from './Hero';
import FAQs from './FAQs';
import Footer from '../../../components/Footer';

function Home() {
  return (
    <div>
      <Header />
      <Hero />
      {/*<Perks />*/}
      {/*<Testimonials />*/}
      {/*<Subscriptions />*/}
      <FAQs />
      <Footer />
    </div>
  )
}

export default Home;