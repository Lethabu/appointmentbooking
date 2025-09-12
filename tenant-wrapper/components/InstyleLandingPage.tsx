import '../styles/instyle.css';

export default function InstyleLandingPage() {
  return (
    <>
      {/* Header & Navigation */}
      <header>
        <div className="container header-container">
          <div className="logo">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOEI1Q0Y2Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwzNSBMMjUgMzVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Instyle Hair Boutique" />
            Instyle Hair Boutique
          </div>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="/book" className="nav-cta">Book Now</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <h1>Transform Your Look With Premium Hair Services</h1>
          <p>Experience the finest hair treatments, extensions, and styling from South Africa's leading hair boutique</p>
          <div className="hero-buttons">
            <a href="/book" className="btn btn-primary">Book Appointment</a>
            <a href="#products" className="btn btn-secondary">Shop Products</a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-title">
            <h2>Our Premium Services</h2>
            <p>Professional hair treatments and styling services tailored to your unique needs</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Extensions" className="service-img" />
              <div className="service-content">
                <h3>Premium Hair Extensions</h3>
                <p>High-quality human hair extensions for length and volume.</p>
                <div className="service-price">From R1,200</div>
                <a href="/book" className="add-to-cart">Book Now</a>
              </div>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Coloring" className="service-img" />
              <div className="service-content">
                <h3>Professional Coloring</h3>
                <p>Balayage, highlights, ombre and full color services.</p>
                <div className="service-price">From R850</div>
                <a href="/book" className="add-to-cart">Book Now</a>
              </div>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Treatment" className="service-img" />
              <div className="service-content">
                <h3>Hair Treatments</h3>
                <p>Restorative treatments for damaged and dry hair.</p>
                <div className="service-price">From R600</div>
                <a href="/book" className="add-to-cart">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="products">
        <div className="container">
          <div className="section-title">
            <h2>Premium Hair Products</h2>
            <p>Shop our selection of professional hair care products and accessories</p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1595342108313-5b2c4a4b7c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Product" className="product-img" />
              <div className="product-content">
                <h3>Luxury Hair Serum</h3>
                <div className="product-price">R350</div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1595425970377-2f8ded7c7b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Product" className="product-img" />
              <div className="product-content">
                <h3>Hydrating Shampoo</h3>
                <div className="product-price">R280</div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Product" className="product-img" />
              <div className="product-content">
                <h3>Repair Conditioner</h3>
                <div className="product-price">R300</div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1634302237642-9c0e1cf175e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Hair Product" className="product-img" />
              <div className="product-content">
                <h3>Heat Protectant Spray</h3>
                <div className="product-price">R250</div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="social-proof" id="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>What Our Clients Say</h2>
            <p>Don't just take our word for it - hear from our satisfied customers</p>
          </div>
          <div className="testimonials">
            <div className="testimonial">
              <p className="testimonial-text">"The best hair salon experience I've ever had! My extensions look so natural and the service was exceptional."</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Client" className="author-img" />
                <div className="author-info">
                  <h4>Sarah M.</h4>
                  <p>Regular Client</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"I've been coming to Instyle for over a year now and I'm always impressed with their attention to detail and professionalism."</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Client" className="author-img" />
                <div className="author-info">
                  <h4>Zoe K.</h4>
                  <p>Regular Client</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"The coloring service is exceptional! They really understand how to create the perfect shade for my skin tone."</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client" className="author-img" />
                <div className="author-info">
                  <h4>Amanda T.</h4>
                  <p>New Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="social-media" id="gallery">
        <div className="container">
          <div className="section-title">
            <h2>Follow Us on Social Media</h2>
            <p>Check out our latest work and stay updated with promotions and tips</p>
          </div>
          <div className="social-feed">
            <div className="social-post">
              <img src="https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Social Post" />
              <div className="social-overlay">
                <p>New hairstyle inspiration</p>
              </div>
            </div>
            <div className="social-post">
              <img src="https://images.unsplash.com/photo-1559599076-9c61cc8a2be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Social Post" />
              <div className="social-overlay">
                <p>Client transformation</p>
              </div>
            </div>
            <div className="social-post">
              <img src="https://images.unsplash.com/photo-1598703104882-3850f6cffff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Social Post" />
              <div className="social-overlay">
                <p>New product arrival</p>
              </div>
            </div>
            <div className="social-post">
              <img src="https://images.unsplash.com/photo-1597241728400-294ec0c8b83a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Social Post" />
              <div className="social-overlay">
                <p>Behind the scenes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking" id="booking">
        <div className="container">
          <div className="section-title">
            <h2>Book Your Appointment</h2>
            <p>Fill out the form below to schedule your hair service with us</p>
          </div>
          <div className="booking-container">
            <div className="booking-form">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" required />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Select Service</label>
                  <select id="service" required>
                    <option value="">Choose a service</option>
                    <option value="extensions">Hair Extensions</option>
                    <option value="coloring">Hair Coloring</option>
                    <option value="treatment">Hair Treatment</option>
                    <option value="cut">Hair Cut & Styling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input type="date" id="date" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Additional Notes</label>
                  <textarea id="message"></textarea>
                </div>
                <button type="submit" className="submit-btn">Book Appointment</button>
              </form>
            </div>
            <div>
              <h3>Why Choose Instyle?</h3>
              <p>Our team of experienced stylists is dedicated to providing you with the highest quality service and results that exceed your expectations.</p>
              <ul>
                <li>Premium quality products</li>
                <li>Expert stylists with years of experience</li>
                <li>Personalized consultations</li>
                <li>Comfortable and welcoming environment</li>
                <li>Flexible scheduling options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Instyle Hair Boutique</h3>
              <p>Premium hair services and products in South Africa.</p>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-tiktok"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Services</h3>
              <ul>
                <li><a href="#">Hair Extensions</a></li>
                <li><a href="#">Hair Coloring</a></li>
                <li><a href="#">Hair Treatments</a></li>
                <li><a href="#">Hair Cutting</a></li>
                <li><a href="#">Styling</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Contact Us</h3>
              <ul>
                <li><i className="fas fa-map-marker-alt"></i> 123 Beauty Street, Johannesburg</li>
                <li><i className="fas fa-phone"></i> +27 11 123 4567</li>
                <li><i className="fas fa-envelope"></i> info@instylehairboutique.co.za</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2023 Instyle Hair Boutique. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
