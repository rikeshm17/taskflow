interface HeroProps {
  userEmail: string;
}

function Hero({ userEmail }: HeroProps) {
  return (
    <section className="hero">
      <h1>Welcome Back 👋</h1>

      <p className="user-email">
        {userEmail}
      </p>

      <p className="today">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <p>
        Organize your work and stay productive.
      </p>
    </section>
  );
}

export default Hero;
