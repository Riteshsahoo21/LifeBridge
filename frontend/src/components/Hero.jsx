import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
           <p>
  <strong>LifeBridge Medical Institute</strong> is a state-of-the-art healthcare facility committed to providing comprehensive medical services with care and expertise.
</p>
<p>
  Our team of dedicated professionals ensures personalized attention, tailoring treatments to each patient’s unique needs.
</p>
<p>
  At <strong>LifeBridge</strong>, your well-being is our priority, guiding you on a seamless journey toward optimal health and wellness.
</p>
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
