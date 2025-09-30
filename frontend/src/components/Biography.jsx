import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
        <p>Biography</p>
<h3>Who We Are</h3>
<p>
  At <strong>LifeBridge</strong>, we are dedicated to connecting people with quality healthcare through innovative solutions. Our mission is to make healthcare accessible, reliable, and patient-friendly for everyone.
</p>
<p>
  Founded in 2024, we combine cutting-edge technology with compassionate care to bridge the gap between patients and medical professionals. Our team works tirelessly to ensure seamless healthcare experiences.
</p>
<p>
  We are building a powerful MERN STACK platform that empowers patients to manage appointments, access medical information, and connect with healthcare providers from anywhere, at any time.
</p>
<p>
  LifeBridge stands for trust, innovation, and care. Our goal is to transform the healthcare journey into a smoother, safer, and more personalized experience for every individual.
</p>
<p>
  Join us as we revolutionize healthcare—because at LifeBridge, your health is our priority.
</p>

        </div>
      </div>
    </>
  );
};

export default Biography;
