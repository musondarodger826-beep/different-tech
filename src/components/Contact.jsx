import { useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

export default function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_abc123",
         "template_d3xlfxs",
        form.current,
        { publicKey: "zKNQbVR23KB7l3DYy" }
      )
      .then(() => {
        alert("Message sent successfully!");
        form.current.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert(`Failed to send: ${error.text || error.message || "Unknown EmailJS error"}`);
      });
  };

  return (
    <section id="contact" className="bg-gray-950 text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-5xl font-bold text-center mb-6">
          Contact <span className="text-yellow-400">Us</span>
        </h2>

        <p className="text-center text-gray-400 mb-16">
          We'd love to hear about your next project.
        </p>

        <div className="grid md:grid-cols-2 gap-12">

        {/* Contact Form */}
          {/* Left Side */}
<div>

<h3 className="text-3xl font-bold text-yellow-400 mb-6">
  Get in Touch
</h3>

<p className="text-gray-400 mb-8">
  We are ready to help you build modern technology solutions
  for your business.
</p>


<div className="space-y-6">


<div className="bg-black border border-yellow-500 rounded-xl p-5">

<div className="flex items-center gap-3 mb-3">
<FaMapMarkerAlt className="text-yellow-400 text-xl"/>
<h4 className="text-xl font-bold">
Locations
</h4>
</div>

<p>
🇿🇲 Zambia (Lusaka & Chingola)
</p>

<p>
🇿🇦 South Africa (Cape Town)
</p>

</div>



<div className="bg-black border border-yellow-500 rounded-xl p-5">

<h4 className="text-xl font-bold text-yellow-400">
Rodgers Musonda
</h4>

<p className="flex gap-3 mt-3">
<FaPhone/>
+260 967 622 382
</p>

<p className="flex gap-3">
<FaEnvelope/>
musondagrant@outlook.com
</p>

</div>



<div className="bg-black border border-yellow-500 rounded-xl p-5">

<h4 className="text-xl font-bold text-yellow-400">
Dirk Van Deventer
</h4>

<p className="flex gap-3 mt-3">
<FaPhone/>
+27 66 203 5369
</p>

<p className="flex gap-3">
<FaEnvelope/>
dirk@digiwize.tech
</p>

</div>



<div className="flex gap-5 text-2xl">

<a href="#" className="text-yellow-400">
<FaFacebook/>
</a>

<a href="#" className="text-yellow-400">
<FaLinkedin/>
</a>

<a href="#" className="text-yellow-400">
<FaGithub/>
</a>

<a 
href="https://wa.me/260967622382"
className="text-yellow-400"
>
<FaWhatsapp/>
</a>

</div>


</div>

</div>
          {/* Contact Form */}
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-4 rounded-lg bg-black border border-gray-700"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full p-4 rounded-lg bg-black border border-gray-700"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              className="w-full p-4 rounded-lg bg-black border border-gray-700"
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Your Message"
              required
              className="w-full p-4 rounded-lg bg-black border border-gray-700"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold hover:bg-yellow-300"
            >
              Send Message
            </button>
          </form>

        </div>
          </div>


        {/* Google Maps */}
<div className="mt-16">

  <h3 className="text-3xl font-bold text-center mb-6">
    Find <span className="text-yellow-400">Us</span>
  </h3>

  <div className="mt-10 rounded-xl overflow-hidden border border-yellow-500">

  <iframe
    src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d129341.55269158533!2d27.734634660454653!3d-12.580758049557165!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2szm!4v1785771498863!5m2!1sen!2szm"
    width="100%"
    height="350"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
  ></iframe>

</div>
</div>
    </section>
  );
}