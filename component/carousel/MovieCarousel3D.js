"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const TRANSITION_MS = 500;
const AUTOPLAY_MS = 4000;
const DRAG_THRESHOLD_RATIO = 0.2;
const CLICK_GUARD_PX = 8;

const PLATFORM_STYLES = {
  DESIGN: { label: "Astra", className: "movie-3d-card__platform--astra" },
  MARKETING: { label: "Prime", className: "movie-3d-card__platform--prime" },
  SAP: { label: "Learn+", className: "movie-3d-card__platform--learn" },
  MULTIMEDIA: { label: "Studio", className: "movie-3d-card__platform--studio" },
  food: { label: "Live", className: "movie-3d-card__platform--live" },
};

const RATINGS = [9.1, 8.7, 8.9, 9.0, 8.5];

const circularOffset = (index, active, length) => {
  let diff = index - active;
  while (diff > length / 2) diff -= length;
  while (diff < -length / 2) diff += length;
  return diff;
};

const getCardMetrics = (viewportWidth) => {
  if (viewportWidth <= 480) {
    return { cardWidth: 220, gap: 12 };
  }
  if (viewportWidth <= 768) {
    return { cardWidth: 240, gap: 14 };
  }
  if (viewportWidth <= 1200) {
    return { cardWidth: 255, gap: 16 };
  }
  return { cardWidth: 268, gap: 18 };
};

const MovieCard = ({ item, offset, isActive, onSelect, suppressClick }) => {
  const platform =
    PLATFORM_STYLES[item.category] || PLATFORM_STYLES.DESIGN;
  const rating = RATINGS[item.id % RATINGS.length];

  const handleClick = () => {
    if (suppressClick || offset === 0) return;
    onSelect?.();
  };

  return (
    <div className="movie-3d-carousel__slot">
      <article
        className={`movie-3d-card${isActive ? " movie-3d-card--active" : ""}`}
        data-offset={offset}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && offset !== 0 && !suppressClick) {
            e.preventDefault();
            onSelect?.();
          }
        }}
        role="button"
        tabIndex={offset === 0 ? 0 : -1}
        aria-hidden={Math.abs(offset) > 2}
      >
        <Link
          href={`/events/${item.slug}`}
          className="movie-3d-card__link"
          tabIndex={-1}
          aria-label={item.title}
          draggable={false}
        >
          <div className="movie-3d-card__poster">
            <img src={item.imgSrc} alt="" loading="lazy" draggable={false} />
            <div className="movie-3d-card__dim" aria-hidden />
            <span className={`movie-3d-card__platform ${platform.className}`}>
              {platform.label}
            </span>
            <span className="movie-3d-card__rating" aria-label={`Rating ${rating}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                />
              </svg>
              {rating.toFixed(1)}
            </span>
            <h3 className="movie-3d-card__title">{item.title}</h3>
          </div>
        </Link>
      </article>
    </div>
  );
};

const MovieCarousel3D = ({ items, autoplay = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [suppressClick, setSuppressClick] = useState(false);

  const viewportRef = useRef(null);
  const activeIndexRef = useRef(0);
  const dragStartRef = useRef({ x: 0, moved: false });
  const transitionRef = useRef(null);

  const count = items.length;
  const { cardWidth, gap } = getCardMetrics(viewportWidth || 1200);
  const stride = cardWidth + gap;

  activeIndexRef.current = activeIndex;

  const measure = useCallback(() => {
    if (viewportRef.current) {
      setViewportWidth(viewportRef.current.offsetWidth);
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const goTo = useCallback(
    (index) => {
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      if (next === activeIndexRef.current) return;

      setActiveIndex(next);
      if (transitionRef.current) clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {}, TRANSITION_MS);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(activeIndexRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(activeIndexRef.current - 1), [goTo]);

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!autoplay || count <= 1) return undefined;

    const timer = setInterval(() => {
      if (!isDraggingRef.current) {
        goNextRef.current();
      }
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [autoplay, count]);

  useEffect(
    () => () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    },
    []
  );

  const handlePointerDown = (e) => {
    if (count <= 1) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isDraggingRef.current = true;
    setIsDragging(true);
    setSuppressClick(false);
    dragStartRef.current = { x: e.clientX, moved: false };

    viewportRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const delta = e.clientX - dragStartRef.current.x;
    if (Math.abs(delta) > CLICK_GUARD_PX) {
      dragStartRef.current.moved = true;
    }
    setDragOffset(delta);
  };

  const finishDrag = (e) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    if (viewportRef.current?.hasPointerCapture(e.pointerId)) {
      viewportRef.current.releasePointerCapture(e.pointerId);
    }

    const delta = e.clientX - dragStartRef.current.x;
    const threshold = stride * DRAG_THRESHOLD_RATIO;

    if (dragStartRef.current.moved) {
      setSuppressClick(true);
      if (delta < -threshold) goNext();
      else if (delta > threshold) goPrev();
      setTimeout(() => setSuppressClick(false), 50);
    }

    setDragOffset(0);
  };

  const handlePointerUp = (e) => finishDrag(e);
  const handlePointerCancel = (e) => finishDrag(e);

  if (count === 0) return null;

  const baseTranslateX =
    viewportWidth > 0
      ? viewportWidth / 2 - cardWidth / 2 - activeIndex * stride
      : 0;

  const trackTranslateX = baseTranslateX + dragOffset;

  return (
    <div className="movie-3d-carousel">
      <div className="movie-3d-carousel__glow" aria-hidden />

      <div
        className={`movie-3d-carousel__viewport${isDragging ? " movie-3d-carousel__viewport--dragging" : ""}`}
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={(e) => {
          if (isDraggingRef.current && e.buttons === 0) finishDrag(e);
        }}
        style={{
          "--movie-card-width": `${cardWidth}px`,
          "--movie-card-gap": `${gap}px`,
          touchAction: "pan-y",
        }}
      >
        <div
          className="movie-3d-carousel__perspective"
          style={{ perspective: "1400px" }}
        >
          <div
            className="movie-3d-carousel__track"
            style={{
              transform: `translateX(${trackTranslateX}px)`,
              transition: isDragging
                ? "none"
                : `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {items.map((item, index) => {
              const offset = circularOffset(index, activeIndex, count);
              return (
                <MovieCard
                  key={item.id}
                  item={item}
                  offset={offset}
                  isActive={offset === 0}
                  onSelect={() => goTo(index)}
                  suppressClick={suppressClick || isDragging}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="movie-3d-carousel__dots" role="tablist" aria-label="Workshops">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${item.title}`}
            className={`movie-3d-carousel__dot${
              index === activeIndex ? " movie-3d-carousel__dot--active" : ""
            }`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel3D;
