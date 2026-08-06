import { useEffect, useRef } from "react";
import ParticleBackground from "../components/ParticleBackground";
import "../styles/living-website.css";

function LivingWebsite() {
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionsRef.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#portfolio", label: "Work" },
    { href: "#contact", label: "Contact" },
  ];

  const stats = [
    { num: "150+", lbl: "Projects Done" },
    { num: "98%", lbl: "Client Satisfaction" },
    { num: "12+", lbl: "Years Experience" },
  ];

  const services = [
    { icon: "🎨", title: "Brand Identity", desc: "Crafting memorable brand identities that tell your story and captivate your audience with precision and creativity." },
    { icon: "⚡", title: "Web Development", desc: "Building fast, responsive, and scalable web applications using cutting-edge technologies and best practices." },
    { icon: "✨", title: "UI/UX Design", desc: "Designing intuitive, beautiful interfaces that deliver seamless user experiences across all devices." },
    { icon: "🚀", title: "Performance Opt", desc: "Optimizing your digital products for speed, accessibility, and maximum performance metrics." },
    { icon: "🔒", title: "Security Audit", desc: "Comprehensive security analysis and hardening to protect your assets and user data from threats." },
    { icon: "📊", title: "Analytics Setup", desc: "Implementing data-driven analytics to track performance, user behavior, and business growth." },
  ];

  const portfolioItems = [
    { title: "E-Commerce Platform", tag: "Web Dev", icon: "🛒" },
    { title: "Mobile App Redesign", tag: "UI/UX", icon: "📱" },
    { title: "Brand Identity", tag: "Design", icon: "🎨" },
    { title: "SaaS Dashboard", tag: "Web Dev", icon: "📊" },
    { title: "Portfolio Site", tag: "Design", icon: "✨" },
    { title: "API Integration", tag: "Backend", icon: "🔌" },
  ];

  return (
    <div className="living-website">
      <ParticleBackground />

      <nav className="lw-nav" id="hero">
        <a href="#hero" className="lw-logo">
          <span>T</span>o<span>D</span>o
        </a>
        <ul className="lw-nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="lw-nav-cta">Get Started</a>
      </nav>

      <section className="lw-hero" ref={(el) => { sectionsRef.current.hero = el; }}>
        <div className="lw-hero-content">
          <div className="lw-hero-badge">
            <span className="dot" />
            Welcome to the future
          </div>
          <h1>
            Build Something<br />
            <span className="gradient-text">Extraordinary</span>
          </h1>
          <p>
            We craft digital experiences that blend stunning design with powerful functionality.
            Every pixel is intentional, every interaction is meaningful, and every project
            pushes the boundaries of what is possible.
          </p>
          <div className="lw-hero-actions">
            <a href="#contact" className="lw-btn lw-btn-primary">
              Start a Project →
            </a>
            <a href="#about" className="lw-btn lw-btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="lw-hero-3d" aria-hidden="true">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </section>

      <section className="lw-section lw-about" ref={(el) => { sectionsRef.current.about = el; }}>
        <div className="lw-section-header reveal">
          <span className="label">✦ About Us</span>
          <h2>We Build Digital Excellence</h2>
          <p>
            A team of passionate creators dedicated to transforming ideas into exceptional
            digital products. We combine technical expertise with artistic vision to deliver
            solutions that stand out.
          </p>
        </div>
        <div className="lw-about-grid">
          <div className="lw-about-visual reveal-left">
            <div className="lw-about-card-3d">
              <div className="stat">47</div>
              <div className="stat-label">Projects Delivered</div>
              <div className="lw-about-stats">
                {stats.map((s, i) => (
                  <div key={i} className="lw-about-stat">
                    <div className="num">{s.num}</div>
                    <div className="lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lw-about-text reveal-right">
            <h3>Where Innovation Meets Craft</h3>
            <p>
              At our core, we believe that great design and technology should work
              hand in hand. Every project we undertake is a fusion of{" "}
              <span className="highlight">strategic thinking</span> and
              meticulous execution.
            </p>
            <p>
              We have spent over a decade perfecting our craft, working with startups,
              enterprises, and visionaries who dare to think differently. Our track
              record speaks for itself —{" "}
              <span className="highlight">150+ successful projects</span> and counting.
            </p>
            <p>
              Our approach is simple: understand deeply, design boldly, build precisely,
              and deliver relentlessly. Every phase of the journey is guided by
              collaboration and a commitment to excellence.
            </p>
            <a href="#contact" className="lw-btn lw-btn-primary" style={{ marginTop: "20px" }}>
              Let's Talk →
            </a>
          </div>
        </div>
      </section>

      <section className="lw-section lw-services" ref={(el) => { sectionsRef.current.services = el; }}>
        <div className="lw-section-header reveal">
          <span className="label">✦ Services</span>
          <h2>What We Do</h2>
          <p>
            From concept to launch, we provide end-to-end services that cover every
            aspect of your digital presence.
          </p>
        </div>
        <div className="lw-services-grid">
          {services.map((s, i) => (
            <div key={i} className="lw-service-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="lw-service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lw-section lw-portfolio" ref={(el) => { sectionsRef.current.portfolio = el; }}>
        <div className="lw-section-header reveal">
          <span className="label">✦ Portfolio</span>
          <h2>Our Recent Work</h2>
          <p>
            Explore a curated selection of projects that showcase our passion for
            design, engineering, and innovation.
          </p>
        </div>
        <div className="lw-portfolio-grid">
          {portfolioItems.map((item, i) => (
            <div key={i} className="lw-portfolio-item reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="pw-image">{item.icon || "◆"}</div>
              <div className="pw-overlay">
                <div className="pw-title">{item.title}</div>
                <div className="pw-tag">{item.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lw-section lw-contact" ref={(el) => { sectionsRef.current.contact = el; }}>
        <div className="lw-section-header reveal">
          <span className="label">✦ Contact</span>
          <h2>Let's Create Together</h2>
          <p>
            Have a project in mind? We would love to hear about it. Reach out and
            let us start something amazing.
          </p>
        </div>
        <div className="lw-contact-wrapper">
          <div className="lw-contact-info reveal-left">
            <h3>Get in Touch</h3>
            <p>
              Whether you have a clear vision or just a spark of an idea, we are here
              to help you bring it to life. Let us have a conversation.
            </p>
            <div className="lw-contact-detail">
              <div className="icon">✉</div>
              <div className="text">
                <strong>Email Us</strong>
                hello@todo.com
              </div>
            </div>
            <div className="lw-contact-detail">
              <div className="icon">📍</div>
              <div className="text">
                <strong>Visit Us</strong>
                123 Creative Lane, Design City
              </div>
            </div>
            <div className="lw-contact-detail">
              <div className="icon">📞</div>
              <div className="text">
                <strong>Call Us</strong>
                +1 (555) 123-4567
              </div>
            </div>
          </div>
          <form className="lw-contact-form reveal-right" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you soon."); }}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us about your project..." required />
            </div>
            <button type="submit" className="submit-btn">Send Message →</button>
          </form>
        </div>
      </section>

      <footer className="lw-footer">
        <div className="lw-footer-grid">
          <div className="lw-footer-brand">
            <a href="#hero" className="lw-logo">
              <span>T</span>o<span>D</span>o
            </a>
            <p>
              Crafting exceptional digital experiences with a blend of design, technology,
              and creative vision. Building the future, one pixel at a time.
            </p>
          </div>
          <div>
            <h4>Links</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Brand Identity</a></li>
              <li><a href="#services">Web Development</a></li>
              <li><a href="#services">UI/UX Design</a></li>
              <li><a href="#services">Performance</a></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#contact">Support</a></li>
              <li><a href="#contact">Careers</a></li>
              <li><a href="#contact">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="lw-footer-bottom">
          © 2026 ToDo. All rights reserved. Crafted with passion and precision.
        </div>
      </footer>
    </div>
  );
}

export default LivingWebsite;