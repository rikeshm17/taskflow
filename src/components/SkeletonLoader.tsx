interface SkeletonLoaderProps {
  count?: number;
  variant?: "card" | "text" | "avatar" | "button" | "image" | "table-row";
  className?: string;
}

function SkeletonLoader({
  count = 1,
  variant = "text",
  className = "",
}: SkeletonLoaderProps) {
  const getWidth = () => {
    switch (variant) {
      case "card":
        return "100%";
      case "text":
        return `${60 + Math.random() * 40}%`;
      case "avatar":
        return "48px";
      case "button":
        return "120px";
      case "image":
        return "100%";
      case "table-row":
        return "100%";
      default:
        return "80%";
    }
  };

  const getHeight = () => {
    switch (variant) {
      case "card":
        return "180px";
      case "text":
        return "14px";
      case "avatar":
        return "48px";
      case "button":
        return "44px";
      case "image":
        return "260px";
      case "table-row":
        return "56px";
      default:
        return "14px";
    }
  };

  const getBorderRadius = () => {
    switch (variant) {
      case "card":
        return "16px";
      case "avatar":
        return "50%";
      case "button":
        return "10px";
      case "image":
        return "12px";
      case "table-row":
        return "8px";
      default:
        return "8px";
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${variant} ${className}`}
          style={{
            width: getWidth(),
            height: getHeight(),
            borderRadius: getBorderRadius(),
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <SkeletonLoader variant="image" />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" className="short" />
        <SkeletonLoader variant="button" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          <SkeletonLoader variant="table-row" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
