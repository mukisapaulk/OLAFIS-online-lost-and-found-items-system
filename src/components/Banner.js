import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: './slider3.jpg', alt: 'Image 1', title: 'Lost & Found', description: 'Find lost items or reunite with your missing belongings. Our system connects people who have lost something with those who have found it.' },
    { src: './slider1.jpg', alt: 'Image 2', title: 'Easy to Use', description: 'Our platform is simple and intuitive, making it easy to report lost items or search for found items.' },
    { src: './slider2.jpg', alt: 'Image 3', title: 'Secure and Reliable', description: 'We prioritize the security of your information and ensure a reliable platform for reuniting lost items.' },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div className="relative w-full max-w-screen-xl h-96 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 bg-black opacity-30 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30"></div> 
          <div className="text-center text-white z-10 relative">
            <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
            <p className="text-lg mb-6">{image.description}</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out">
                View Safety Tips
              </button>
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out">
                Learn More
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`bg-gray-300 rounded-full w-4 h-4 focus:outline-none transition-all duration-300 ease-in-out ${index === currentImageIndex ? 'bg-red-500' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
