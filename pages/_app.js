import Layout from '../components/Layout';
import '../styles/globals.css'; // Assuming you have a global stylesheet

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
import './styles/global.css';
