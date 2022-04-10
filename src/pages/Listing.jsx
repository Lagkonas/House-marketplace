import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId, navigate]);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GEOCODE_API_KEY,
  });

  // eslint-disable-next-line
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(async function callback(map) {
    const bounds = await new window.google.maps.LatLngBounds();
    await map.fitBounds(bounds);
    setMap(map);
  }, []);

  // console.log(map)


  const onUnmount = React.useCallback(async function callback(map) {
    await setMap(null);
  }, []);

  if (loading) return <Spinner />;
  

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className='swiperSlideDiv'
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='' />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {listing.offer
            ? listing.discountPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            $ {listing.regularPrice - listing.discountPrice} discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        {isLoaded ? (
        <div className='leafletContainer'>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: listing.geolocation.lat,
              lng: listing.geolocation.lng,
            }}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker position={{ lat: listing.geolocation.lat,
              lng: listing.geolocation.lng,}}/>
          </GoogleMap>
        </div>
        ) : <></>}

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
